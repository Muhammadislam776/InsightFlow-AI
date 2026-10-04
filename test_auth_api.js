// Automated Authentication & Authorization Verification Script
const http = require("http");

function postJson(urlPath, data) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify(data);
    const req = http.request(
      {
        hostname: "localhost",
        port: 3000,
        path: urlPath,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(payload),
        },
      },
      (res) => {
        let body = "";
        res.on("data", (chunk) => (body += chunk));
        res.on("end", () => {
          try {
            resolve({ status: res.statusCode, data: JSON.parse(body) });
          } catch (e) {
            resolve({ status: res.statusCode, raw: body });
          }
        });
      }
    );
    req.on("error", reject);
    req.write(payload);
    req.end();
  });
}

async function runTests() {
  console.log("=== Testing Authentication & Authorization Validity Checks ===\n");
  let passed = 0;
  let failed = 0;

  // Test 1: Signup with invalid email
  const res1 = await postJson("/api/auth/register", {
    name: "John Doe",
    email: "notanemail",
    organization: "Acme",
    role: "ANALYST",
    password: "Password123!",
  });
  if (res1.status === 400 && res1.data.errors && res1.data.errors.email) {
    console.log("✓ Test 1 Passed: Invalid email rejected on signup.");
    passed++;
  } else {
    console.error("✗ Test 1 Failed:", res1);
    failed++;
  }

  // Test 2: Signup with weak password (missing special char or too short)
  const res2 = await postJson("/api/auth/register", {
    name: "John Doe",
    email: "john@acme.com",
    organization: "Acme",
    role: "ANALYST",
    password: "weak",
  });
  if (res2.status === 400 && res2.data.errors && res2.data.errors.password) {
    console.log("✓ Test 2 Passed: Weak password rejected on signup.");
    passed++;
  } else {
    console.error("✗ Test 2 Failed:", res2);
    failed++;
  }

  // Test 3: Signup with mismatched passwords
  const res3 = await postJson("/api/auth/register", {
    name: "John Doe",
    email: "john@acme.com",
    organization: "Acme",
    role: "ANALYST",
    password: "Password123!",
    confirmPassword: "DifferentPassword123!",
  });
  if (res3.status === 400 && res3.data.errors && res3.data.errors.confirmPassword) {
    console.log("✓ Test 3 Passed: Password mismatch rejected on signup.");
    passed++;
  } else {
    console.error("✗ Test 3 Failed:", res3);
    failed++;
  }

  // Test 4: Login without registering (unregistered email)
  const res4 = await postJson("/api/auth/login", {
    email: "completely_fake_unregistered_9999@testcorp.com",
    password: "Password123!",
  });
  if (
    res4.status === 401 &&
    res4.data.error.includes("No registered account found")
  ) {
    console.log("✓ Test 4 Passed: Unregistered user rejected with 'No registered account found. Sign Up first'.");
    passed++;
  } else {
    console.error("✗ Test 4 Failed:", res4);
    failed++;
  }

  // Test 5: Login with empty password
  const res5 = await postJson("/api/auth/login", {
    email: "alex.vance@insightflow.ai",
    password: "",
  });
  if (res5.status === 400) {
    console.log("✓ Test 5 Passed: Empty password rejected on login.");
    passed++;
  } else {
    console.error("✗ Test 5 Failed:", res5);
    failed++;
  }

  console.log(`\nResults: ${passed} passed, ${failed} failed.`);
}

runTests().catch(console.error);
