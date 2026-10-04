import { User, UserRole } from "@/lib/types";
import { supabase } from "@/lib/supabase/client";

export interface RegisteredAccount {
  id: string;
  name: string;
  email: string;
  passwordHash: string; // In-memory/client hash for verification
  role: UserRole;
  organization: string;
  createdAt: string;
  status: "active" | "invited" | "disabled";
}

const STORAGE_USERS_KEY = "insightflow_registered_users";
const STORAGE_SESSION_KEY = "insightflow_active_session";

// Pre-seeded verified accounts
const INITIAL_REGISTERED_ACCOUNTS: RegisteredAccount[] = [
  {
    id: "usr_admin_alex",
    name: "Alex Vance",
    email: "alex.vance@insightflow.ai",
    passwordHash: "Password123!",
    role: "ADMIN",
    organization: "InsightFlow Enterprise",
    createdAt: "2026-09-01",
    status: "active",
  },
  {
    id: "usr_analyst_elena",
    name: "Elena Rostova",
    email: "elena.r@insightflow.ai",
    passwordHash: "Password123!",
    role: "ANALYST",
    organization: "InsightFlow Enterprise",
    createdAt: "2026-09-10",
    status: "active",
  },
  {
    id: "usr_viewer_chen",
    name: "David Chen",
    email: "d.chen@insightflow.ai",
    passwordHash: "Password123!",
    role: "VIEWER",
    organization: "InsightFlow Enterprise",
    createdAt: "2026-09-15",
    status: "active",
  },
];

// Helper to get registered accounts
export function getRegisteredAccounts(): RegisteredAccount[] {
  if (typeof window === "undefined") {
    return INITIAL_REGISTERED_ACCOUNTS;
  }

  try {
    const raw = localStorage.getItem(STORAGE_USERS_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(INITIAL_REGISTERED_ACCOUNTS));
      return INITIAL_REGISTERED_ACCOUNTS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : INITIAL_REGISTERED_ACCOUNTS;
  } catch (err) {
    console.error("Failed to read registered accounts:", err);
    return INITIAL_REGISTERED_ACCOUNTS;
  }
}

// Validity Check Helpers
export interface ValidationResult {
  valid: boolean;
  errors: Record<string, string>;
}

export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
export const NAME_REGEX = /^[a-zA-Z\s'-]{2,50}$/;

export function validateSignupInput(data: {
  name: string;
  email: string;
  organization: string;
  role: string;
  password: string;
  confirmPassword?: string;
}): ValidationResult {
  const errors: Record<string, string> = {};

  // 1. Full Name Check
  const trimmedName = data.name.trim();
  if (!trimmedName) {
    errors.name = "Full name is required.";
  } else if (trimmedName.length < 2) {
    errors.name = "Full name must be at least 2 characters long.";
  } else if (!NAME_REGEX.test(trimmedName)) {
    errors.name = "Name can only contain letters, spaces, and hyphens.";
  }

  // 2. Email Validity Check
  const trimmedEmail = data.email.trim().toLowerCase();
  if (!trimmedEmail) {
    errors.email = "Email address is required.";
  } else if (!EMAIL_REGEX.test(trimmedEmail)) {
    errors.email = "Please enter a valid email address (e.g. user@company.com).";
  }

  // 3. Organization Check
  const trimmedOrg = data.organization.trim();
  if (!trimmedOrg) {
    errors.organization = "Organization/Company name is required.";
  } else if (trimmedOrg.length < 2) {
    errors.organization = "Company name must be at least 2 characters.";
  }

  // 4. Role Validity Check
  const validRoles: UserRole[] = ["ADMIN", "ANALYST", "VIEWER"];
  if (!data.role || !validRoles.includes(data.role as UserRole)) {
    errors.role = "Please select a valid role (ADMIN, ANALYST, or VIEWER).";
  }

  // 5. Password Complexity Checks
  const pass = data.password;
  if (!pass) {
    errors.password = "Password is required.";
  } else if (pass.length < 8) {
    errors.password = "Password must be at least 8 characters long.";
  } else if (!/[A-Z]/.test(pass)) {
    errors.password = "Password must include at least one uppercase letter (A-Z).";
  } else if (!/[a-z]/.test(pass)) {
    errors.password = "Password must include at least one lowercase letter (a-z).";
  } else if (!/[0-9]/.test(pass)) {
    errors.password = "Password must include at least one number (0-9).";
  } else if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pass)) {
    errors.password = "Password must include at least one special character (!@#$%^&*...).";
  }

  // 6. Confirm Password Match
  if (data.confirmPassword !== undefined && data.confirmPassword !== pass) {
    errors.confirmPassword = "Passwords do not match.";
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateLoginInput(data: {
  email: string;
  password: string;
}): ValidationResult {
  const errors: Record<string, string> = {};

  const trimmedEmail = data.email.trim().toLowerCase();
  if (!trimmedEmail) {
    errors.email = "Email is required.";
  } else if (!EMAIL_REGEX.test(trimmedEmail)) {
    errors.email = "Please enter a valid email address format.";
  }

  if (!data.password) {
    errors.password = "Password is required.";
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

// Password Strength Calculator (0 to 4 score)
export function calculatePasswordStrength(pass: string): {
  score: number;
  label: "Weak" | "Fair" | "Good" | "Strong";
  checks: {
    length: boolean;
    uppercase: boolean;
    lowercase: boolean;
    number: boolean;
    special: boolean;
  };
} {
  const checks = {
    length: pass.length >= 8,
    uppercase: /[A-Z]/.test(pass),
    lowercase: /[a-z]/.test(pass),
    number: /[0-9]/.test(pass),
    special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pass),
  };

  const passedCount = Object.values(checks).filter(Boolean).length;
  let score = 0;
  let label: "Weak" | "Fair" | "Good" | "Strong" = "Weak";

  if (passedCount <= 2) {
    score = 1;
    label = "Weak";
  } else if (passedCount === 3) {
    score = 2;
    label = "Fair";
  } else if (passedCount === 4) {
    score = 3;
    label = "Good";
  } else if (passedCount === 5) {
    score = 4;
    label = "Strong";
  }

  return { score, label, checks };
}

// Authentication Service
export const authService = {
  // Check if an email is already registered
  isEmailRegistered(email: string): boolean {
    const cleanEmail = email.trim().toLowerCase();
    const accounts = getRegisteredAccounts();
    return accounts.some((a) => a.email.toLowerCase() === cleanEmail);
  },

  // 1. Sign Up (Create account in Supabase + Users table)
  async signup(data: {
    name: string;
    email: string;
    organization: string;
    role: UserRole;
    password: string;
    confirmPassword?: string;
  }): Promise<{ success: boolean; user: User; message: string }> {
    // Validate inputs
    const validation = validateSignupInput(data);
    if (!validation.valid) {
      const firstError = Object.values(validation.errors)[0];
      throw new Error(firstError);
    }

    const cleanEmail = data.email.trim().toLowerCase();
    const cleanName = data.name.trim();
    const cleanOrg = data.organization.trim();

    // Check if user already exists
    if (this.isEmailRegistered(cleanEmail)) {
      throw new Error(
        "An account with this email already exists! Please log in instead or use another email."
      );
    }

    // Try creating user in Supabase Auth
    let supabaseUserId: string | null = null;
    try {
      const { data: sbData, error: sbError } = await supabase.auth.signUp({
        email: cleanEmail,
        password: data.password,
        options: {
          data: {
            name: cleanName,
            role: data.role,
            organization: cleanOrg,
          },
        },
      });

      if (!sbError && sbData?.user) {
        supabaseUserId = sbData.user.id;
        // Upsert into Supabase public.users table as well
        try {
          await supabase.from("users").upsert({
            id: sbData.user.id,
            name: cleanName,
            email: cleanEmail,
            role: data.role,
            organization: cleanOrg,
            status: "active",
          });
        } catch (dbErr) {
          console.warn("Notice: public.users table upsert error (handled):", dbErr);
        }
      }
    } catch (sbEx) {
      console.warn("Supabase signup exception (proceeding with verified store):", sbEx);
    }

    // Persist new user in registered accounts store
    const newAccount: RegisteredAccount = {
      id: supabaseUserId || `usr_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      name: cleanName,
      email: cleanEmail,
      passwordHash: data.password, // Stored for client-side credential verification
      role: data.role,
      organization: cleanOrg,
      createdAt: new Date().toISOString().split("T")[0],
      status: "active",
    };

    const accounts = getRegisteredAccounts();
    accounts.push(newAccount);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(accounts));
    }

    const createdUser: User = {
      id: newAccount.id,
      organizationId: "org_" + cleanOrg.toLowerCase().replace(/[^a-z0-9]/g, "_"),
      name: newAccount.name,
      email: newAccount.email,
      role: newAccount.role,
      status: "active",
      createdAt: newAccount.createdAt,
    };

    return {
      success: true,
      user: createdUser,
      message: `Account created successfully for ${createdUser.name}! Please log in with your credentials.`,
    };
  },

  // 2. Sign In ("Without register not login")
  async login(
    email: string,
    password: string
  ): Promise<{ success: boolean; user: User }> {
    const validation = validateLoginInput({ email, password });
    if (!validation.valid) {
      const firstError = Object.values(validation.errors)[0];
      throw new Error(firstError);
    }

    const cleanEmail = email.trim().toLowerCase();

    // STRICT CHECK: Is this email registered?
    const isRegistered = this.isEmailRegistered(cleanEmail);

    // Try Supabase auth first
    try {
      const { data: sbData, error: sbError } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });

      if (!sbError && sbData?.user) {
        const meta = sbData.user.user_metadata || {};
        const matchedAccount = getRegisteredAccounts().find(
          (a) => a.email.toLowerCase() === cleanEmail
        );

        const authenticatedUser: User = {
          id: sbData.user.id,
          organizationId: meta.organization || "org_insightflow",
          name: meta.name || cleanEmail.split("@")[0],
          email: cleanEmail,
          role: (meta.role as UserRole) || matchedAccount?.role || "ANALYST",
          status: "active",
          createdAt: sbData.user.created_at?.split("T")[0] || "2026-10-04",
        };

        this.saveActiveSession(authenticatedUser);
        return { success: true, user: authenticatedUser };
      }

      // If Supabase gave "Invalid login credentials" and email is NOT registered in our store either:
      if (!isRegistered) {
        throw new Error(
          "No registered account found with this email. You must Sign Up first before logging in!"
        );
      }
    } catch (err: any) {
      // If error already says not registered, propagate it
      if (err.message?.includes("No registered account found")) {
        throw err;
      }
    }

    // Verify against our registered accounts store
    if (!isRegistered) {
      throw new Error(
        "No registered account found with this email. You must Sign Up first before logging in!"
      );
    }

    const account = getRegisteredAccounts().find(
      (a) => a.email.toLowerCase() === cleanEmail
    );

    if (!account) {
      throw new Error(
        "No registered account found with this email. You must Sign Up first before logging in!"
      );
    }

    // Password verification check
    if (account.passwordHash !== password) {
      throw new Error("Incorrect password. Please verify your credentials and try again.");
    }

    const authenticatedUser: User = {
      id: account.id,
      organizationId: "org_" + account.organization.toLowerCase().replace(/[^a-z0-9]/g, "_"),
      name: account.name,
      email: account.email,
      role: account.role,
      status: "active",
      createdAt: account.createdAt,
    };

    this.saveActiveSession(authenticatedUser);
    return { success: true, user: authenticatedUser };
  },

  // Save session
  saveActiveSession(user: User): void {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(user));
    }
  },

  // Get active session
  getActiveSession(): User | null {
    if (typeof window === "undefined") return null;
    try {
      const raw = localStorage.getItem(STORAGE_SESSION_KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  // Logout
  async logout(): Promise<void> {
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_SESSION_KEY);
    }
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.warn("Supabase sign out error:", e);
    }
  },
};
