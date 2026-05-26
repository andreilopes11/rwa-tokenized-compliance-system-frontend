"use client";

import {
  BriefcaseBusiness,
  KeyRound,
  ShieldCheck,
  Sparkles
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";
import { isValidEmail } from "@/features/auth/lib/validators";
import { useAuthRoleParam } from "@/features/auth/lib/useAuthRoleParam";
import { copy } from "@/shared/lib/copy";
import { Alert } from "@/shared/ui/Alert";
import { AuthShell } from "@/shared/ui/AuthShell";
import { Button, buttonClassName } from "@/shared/ui/Button";

type TouchedState = {
  mfa: boolean;
  subject: boolean;
};

export function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { role, setRole } = useAuthRoleParam(searchParams.get("role") === "admin" ? "admin" : "investor");
  const next = searchParams.get("next") ?? (role === "admin" ? "/admin" : "/dashboard");
  const registered = searchParams.get("registered") === "1";
  const prefilledEmail = searchParams.get("email")?.trim() ?? "";
  const defaultEmail = prefilledEmail || (role === "admin" ? "admin@compliance.local" : "investor@company.com");

  const [email, setEmail] = useState(defaultEmail);
  const [password, setPassword] = useState("");
  const [mfaCode, setMfaCode] = useState("123456");
  const [touched, setTouched] = useState<TouchedState>({
    mfa: false,
    subject: false
  });
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const loginCopy = copy.login;
  const common = copy.common;

  const normalizedEmail = email.trim();
  const normalizedMfa = mfaCode.trim();
  const emailError = !isValidEmail(normalizedEmail) ? loginCopy.invalidEmail : "";
  const passwordError = password.length < 8 ? "Enter your account password." : "";
  const mfaError = /^\d{6}$/.test(normalizedMfa) ? "" : loginCopy.invalidMfa;
  const showEmailError = (touched.subject || submitAttempted) && Boolean(emailError);
  const showPasswordError = submitAttempted && Boolean(passwordError);
  const showMfaError = (touched.mfa || submitAttempted) && Boolean(mfaError);
  const canSubmit = !loading && !emailError && !passwordError && !mfaError;

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitAttempted(true);
    setError("");

    if (emailError || passwordError || mfaError) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        body: JSON.stringify({
          email: normalizedEmail,
          password,
          role,
          mfaCode: normalizedMfa
        }),
        headers: { "Content-Type": "application/json" },
        method: "POST"
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        throw new Error(payload?.message ?? loginCopy.genericError);
      }

      router.push(next);
    } catch (err) {
      setError(err instanceof Error ? err.message : loginCopy.genericError);
    } finally {
      setLoading(false);
    }
  }


  return (
    <AuthShell
      backLabel={common.backHome}
      eyebrow={loginCopy.provider}
      footerStatus={common.footerStatusAuth}
      highlights={loginCopy.highlights.map((item, index) => ({
        ...item,
        icon:
          index === 0 ? (
            <BriefcaseBusiness aria-hidden size={18} />
          ) : index === 1 ? (
            <Sparkles aria-hidden size={18} />
          ) : (
            <ShieldCheck aria-hidden size={18} />
          )
      }))}
      highlightsTitle={loginCopy.highlightsTitle}
      subtitle={loginCopy.subtitle}
      title={loginCopy.title}
    >
      <div className="stack-md">
        {registered ? (
          <Alert title={loginCopy.registeredTitle} tone="success">
            {loginCopy.registeredBody}
          </Alert>
        ) : null}

        {error ? <Alert tone="error">{error}</Alert> : null}

        <form className="auth-form" onSubmit={submit} noValidate>
          <div className="field">
            <div className="field-header">
              <label>{loginCopy.role}</label>
              <span className="helper-text">{loginCopy.roleHelp}</span>
            </div>
            <div className="segmented-control" role="group" aria-label={loginCopy.role}>
              <button
                aria-pressed={role === "investor"}
                className={role === "investor" ? "selected" : ""}
                onClick={() => setRole("investor")}
                type="button"
              >
                {loginCopy.investor}
              </button>
              <button
                aria-pressed={role === "admin"}
                className={role === "admin" ? "selected" : ""}
                onClick={() => setRole("admin")}
                type="button"
              >
                {loginCopy.admin}
              </button>
            </div>
          </div>

          <div className="field">
            <label htmlFor="login-email">{loginCopy.subjectEmailLabel}</label>
            <input
              aria-describedby={showEmailError ? "login-email-error" : "login-email-help"}
              aria-invalid={showEmailError}
              autoComplete="email"
              id="login-email"
              inputMode="email"
              onBlur={() => setTouched((current) => ({ ...current, subject: true }))}
              onChange={(event) => setEmail(event.target.value)}
              placeholder={loginCopy.subjectEmailPlaceholder}
              type="email"
              value={email}
            />
            <p className="helper-text" id="login-email-help">
              {loginCopy.subjectEmailHelp}
            </p>
            {showEmailError ? (
              <p className="field-error" id="login-email-error">
                {emailError}
              </p>
            ) : null}
          </div>

          <div className="field">
            <label htmlFor="login-password">Password</label>
            <input
              aria-describedby={showPasswordError ? "login-password-error" : undefined}
              aria-invalid={showPasswordError}
              autoComplete="current-password"
              id="login-password"
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
              type="password"
              value={password}
            />
            {showPasswordError ? (
              <p className="field-error" id="login-password-error">
                {passwordError}
              </p>
            ) : null}
          </div>

          <div className="field">
            <label htmlFor="login-mfa">{loginCopy.mfa}</label>
            <input
              aria-describedby={showMfaError ? "login-mfa-error" : "login-mfa-help"}
              aria-invalid={showMfaError}
              id="login-mfa"
              inputMode="numeric"
              maxLength={6}
              onBlur={() => setTouched((current) => ({ ...current, mfa: true }))}
              onChange={(event) => setMfaCode(event.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder={loginCopy.mfaPlaceholder}
              value={mfaCode}
            />
            <p className="helper-text" id="login-mfa-help">
              {loginCopy.mfaHelp}
            </p>
            {showMfaError ? (
              <p className="field-error" id="login-mfa-error">
                {mfaError}
              </p>
            ) : null}
          </div>

          <div className="auth-actions">
            <Button
              block
              disabled={!canSubmit}
              leadingIcon={<KeyRound size={18} />}
              loading={loading}
              loadingLabel={loginCopy.submitting}
              type="submit"
            >
              {loginCopy.submit}
            </Button>
            <Link
              className={buttonClassName({ block: true, variant: "ghost" })}
              href={`/register?role=${role}`}
            >
              {loginCopy.registerHint} {loginCopy.registerLink}
            </Link>
          </div>
        </form>
      </div>
    </AuthShell>
  );
}
