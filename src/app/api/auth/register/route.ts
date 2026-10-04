import { NextResponse } from "next/server";
import { validateSignupInput, EMAIL_REGEX } from "@/lib/auth/authService";
import { supabase } from "@/lib/supabase/client";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, organization, role, password, confirmPassword } = body;

    // 1. Run Validity Checks
    const validation = validateSignupInput({
      name: name || "",
      email: email || "",
      organization: organization || "",
      role: role || "",
      password: password || "",
      confirmPassword,
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

    // 2. Supabase Signup & Public Users Table
    const { data: sbData, error: sbError } = await supabase.auth.signUp({
      email: cleanEmail,
      password,
      options: {
        data: {
          name: name.trim(),
          role,
          organization: organization.trim(),
        },
      },
    });

    if (sbError) {
      return NextResponse.json(
        {
          success: false,
          error: sbError.message,
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "User registered successfully! Please log in.",
      user: {
        id: sbData.user?.id,
        email: cleanEmail,
        name: name.trim(),
        role,
        organization: organization.trim(),
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Registration failed." },
      { status: 500 }
    );
  }
}
