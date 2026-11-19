
import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");

  const origin =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  url.origin;
  if (!code) {
    return NextResponse.redirect(
      new URL("/login?error=missing_code", origin)
    );
  }

  const response = NextResponse.redirect(new URL("/", origin));

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const { error } =
    await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error("Erro na autenticação:", error.message);

    return NextResponse.redirect(
      new URL("/login?error=authentication_failed", origin)
    );
  }

  return response;
}
