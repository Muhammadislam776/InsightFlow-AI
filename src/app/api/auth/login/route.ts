import { NextResponse } from "next/server";
import { validateLoginInput } from "@/lib/auth/authService";
import { supabase } from "@/lib/supabase/client";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // 1. Run Validity Checks
    const validation = validateLoginInput({
      email: email || "",
      password: password || "",
    });

    if (!validation.valid) {
      return NextResponse.json(
        {
          success: false,
          error: Object.values(validation.errors)[0],
          errors: validation.errors,
        },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    // 2. Authenticate with Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password,
    });

    if (error) {
      // Check if user doesn't exist
      const isUnregistered =
        error.message.includes("Invalid login credentials") ||
        error.message.includes("not found");

      return NextResponse.json(
        {
          success: false,
          error: isUnregistered
            ? "No registered account found with this email. You must Sign Up first before logging in!"
            : error.message,
          isNotRegistered: isUnregistered,
        },
        { status: 401 }
      );
    }

    const meta = data.user?.user_metadata || {};
    return NextResponse.json({
      success: true,
      user: {
        id: data.user.id,
        email: data.user.email,
        name: meta.name || cleanEmail.split("@")[0],
        role: meta.role || "ANALYST",
        organization: meta.organization || "Acme Enterprises",
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Authentication error." },
      { status: 500 }
    );
  }
}
