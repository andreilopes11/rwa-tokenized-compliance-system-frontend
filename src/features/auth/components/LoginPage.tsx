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
import { PasswordInput } from "@/features/auth/components/PasswordInput";
import { isValidEmail } from "@/features/auth/lib/validators";
import type { AuthRole } from "@/features/auth/lib/useAuthRole";
import { useAuthRoleParam } from "@/features/auth/lib/useAuthRoleParam";
import { useLocale, useMessages } from "@/shared/i18n/LocaleProvider";
import { resolveClientError } from "@/shared/i18n/resolveClientError";
import { Alert } from "@/shared/ui/Alert";
import { AuthShell } from "@/shared/ui/AuthShell";
import { Button, buttonClassName } from "@/shared/ui/Button";

type TouchedState = {
  subject: boolean;
};

export function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roleParam = searchParams.get("role");
  const initialRole: AuthRole =
    roleParam === "governance" || roleParam === "admin" || roleParam === "compliance" || roleParam === "audit"
      ? "governance"
      : "investor";
  const { role, setRole } = useAuthRoleParam(initialRole);
  const next = searchParams.get("next") ?? (role === "investor" ? "/dashboard" : "/governance");
  const registered = searchParams.get("registered") === "1";
  const prefilledEmail = searchParams.get("email")?.trim() ?? "";
  const defaultEmail = prefilledEmail || (role === "investor" ? "investor@company.com" : "admin@compliance.local");

  const [email, setEmail] = useState(defaultEmail);
  const [password, setPassword] = useState("");
  const [touched, setTouched] = useState<TouchedState>({
    subject: false
  });
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const m = useMessages();
  const { t } = useLocale();
  const loginCopy = m.login;
  const common = m.common;

  const normalizedEmail = email.trim();
  const emailError = !isValidEmail(normalizedEmail) ? loginCopy.invalidEmail : "";
  const passwordError = password.length < 8 ? "Enter your account password." : "";
  const showEmailError = (touched.subject || submitAttempted) && Boolean(emailError);
  const showPasswordError = submitAttempted && Boolean(passwordError);
  const canSubmit = !loading && !emailError && !passwordError;

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitAttempted(true);
    setError("");

    if (emailError || passwordError) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        body: JSON.stringify({
          email: normalizedEmail,
          password,
          role
        }),
        headers: { "Content-Type": "application/json" },
        method: "POST"
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        throw new Error(
          resolveClientError(
            (payload as { message?: string } | null)?.message ?? loginCopy.genericError,
            t
          )
        );
      }

      router.push(next);
    } catch (err) {
      setError(
        resolveClientError(err instanceof Error ? err.message : loginCopy.genericError, t)
      );
    } finally {
      setLoading(false);
    }
  }


  return (
    <AuthShell
      backLabel={common.backHome}
      eyebrow={loginCopy.highlightsTitle}
      // footerStatus={common.footerStatusAuth}
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
              {([
                { id: "investor", label: loginCopy.investor },
                { id: "governance", label: "Governance" }
              ] as Array<{ id: AuthRole; label: string }>).map((roleOption) => (
                <button
                  key={roleOption.id}
                  aria-pressed={role === roleOption.id}
                  className={role === roleOption.id ? "selected" : ""}
                  onClick={() => setRole(roleOption.id)}
                  type="button"
                >
                  {roleOption.label}
                </button>
              ))}
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

          <PasswordInput
            autoComplete="current-password"
            error={passwordError}
            id="login-password"
            invalid={showPasswordError}
            label="Password"
            onChange={setPassword}
            placeholder="••••••••"
            value={password}
          />

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
