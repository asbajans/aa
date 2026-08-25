"use client";
import { createAuthClient } from "better-auth/react";

// baseURL verilmezse aynı origin'i kullanır (/api/auth) — hem localhost hem prod'da çalışır
export const authClient = createAuthClient();

export async function signInEmail(email: string, password: string) {
  const res = await authClient.signIn.email({ email, password });
  if (res.error) throw new Error(res.error.message || "Giriş başarısız");
  return res.data;
}

export async function signUpEmail(opts: { name: string; email: string; password: string; role?: string }) {
  // `role` server'da additionalFields ile tanımlı; client tipi bunu bilmediği için spread ile geçiliyor
  const extra = opts.role ? ({ role: opts.role } as Record<string, unknown>) : {};
  const res = await authClient.signUp.email({
    name: opts.name,
    email: opts.email,
    password: opts.password,
    ...extra,
  });
  if (res.error) throw new Error(res.error.message || "Kayıt başarısız");
  return res.data;
}

export async function signOut() {
  await authClient.signOut();
}
