"use client";

import { Eye, EyeOff, KeyRound, ShieldCheck, Sparkles, UserPlus } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  buildPasswordChecks,
  isValidEmail,
  isValidWalletAddress,
  meetsPasswordPolicy,
  passwordStrengthScore
} from "@/features/auth/lib/validators";
import { copy } from "@/shared/lib/copy";
import { Alert } from "@/shared/ui/Alert";
import { AuthShell } from "@/shared/ui/AuthShell";
import { Button, buttonClassName } from "@/shared/ui/Button";

type RegisterRole = "investor" | "admin";

type TouchedState = {
  confirmPassword: boolean;
  email: boolean;
  password: boolean;
  walletAddress: boolean;
};

type RegisterSuccess = {
  nextLogin: string;
  redirectTo: string;
};

export function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestedRole = searchParams.get("role") === "admin" ? "admin" : "investor";
  const [role, setRole] = useState<RegisterRole>(requestedRole);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [touched, setTouched] = useState<TouchedState>({
    confirmPassword: false,
    email: false,
    password: false,
    walletAddress: false
  });
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState<RegisterSuccess | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setRole(requestedRole);
  }, [requestedRole]);

  const registerCopy = copy.register;
  const common = copy.common;
  const passwordChecks = useMemo(() => buildPasswordChecks(password), [password]);
  const strengthScore = passwordStrengthScore(passwordChecks);
  const strengthLabel =
    strengthScore <= 1
      ? registerCopy.strengthWeak
      : strengthScore === 2
        ? registerCopy.strengthFair
        : strengthScore === 3
          ? registerCopy.strengthGood
          : registerCopy.strengthStrong;
  const passwordPolicyMet = meetsPasswordPolicy(passwordChecks);

  const fieldErrors = {
    confirmPassword: password !== confirmPassword ? registerCopy.passwordMismatch : "",
    email: !isValidEmail(email) ? registerCopy.invalidEmail : "",
    password: !passwordPolicyMet ? registerCopy.passwordHelp : "",
    walletAddress: walletAddress && !isValidWalletAddress(walletAddress) ? registerCopy.walletInvalid : ""
  };

  const showFieldError = (field: keyof TouchedState) =>
    Boolean((touched[field] || submitAttempted) && fieldErrors[field]);
  const formValid =
    !fieldErrors.email &&
    !fieldErrors.password &&
    !fieldErrors.confirmPassword &&
    !fieldErrors.walletAddress;

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitAttempted(true);
    setError("");
    setSuccess(null);

    if (!formValid) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role,
          email: email.trim(),
          password,
          walletAddress: walletAddress.trim() || undefined
        })
      });

      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        setError(payload?.message ?? registerCopy.submitError);
        return;
      }

      if (payload?.autoLogin && payload?.redirectTo) {
        router.push(payload.redirectTo);
        router.refresh();
        return;
      }

      setSuccess({
        nextLogin:
          payload?.nextLogin ??
          `/login?registered=1&email=${encodeURIComponent(email.trim())}&role=${role}`,
        redirectTo: payload?.redirectTo ?? `/login?role=${role}`
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : registerCopy.submitError);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      backLabel={common.backHome}
      eyebrow={registerCopy.role}
      footerStatus={common.footerStatusAuth}
      highlights={registerCopy.highlights.map((item, index) => ({
        ...item,
        icon:
          index === 0 ? (
            <Sparkles aria-hidden size={18} />
          ) : index === 1 ? (
            <ShieldCheck aria-hidden size={18} />
          ) : (
            <UserPlus aria-hidden size={18} />
          )
      }))}
      highlightsTitle={registerCopy.highlightsTitle}
      subtitle={registerCopy.subtitle}
      title={registerCopy.title}
    >
      <div className="stack-md">
        {error ? <Alert tone="error">{error}</Alert> : null}

        {success ? (
          <div className="stack-md">
            <Alert title={registerCopy.successTitle} tone="success">
              {registerCopy.successBody}
            </Alert>
            <div className="auth-actions">
              <Link className={buttonClassName({ block: true })} href={success.redirectTo}>
                {registerCopy.successAction}
              </Link>
              <Link
                className={buttonClassName({ block: true, variant: "ghost" })}
                href={`/login?role=${role}`}
              >
                {registerCopy.alreadyHaveAccount}
              </Link>
            </div>
          </div>
        ) : (
          <form className="auth-form" onSubmit={submit} noValidate>
            <div className="field">
              <div className="field-header">
                <label>{registerCopy.role}</label>
                <span className="helper-text">{registerCopy.roleHelp}</span>
              </div>
              <div className="segmented-control" role="group" aria-label={registerCopy.role}>
                <button
                  aria-pressed={role === "investor"}
                  className={role === "investor" ? "selected" : ""}
                  onClick={() => setRole("investor")}
                  type="button"
                >
                  {registerCopy.investor}
                </button>
                <button
                  aria-pressed={role === "admin"}
                  className={role === "admin" ? "selected" : ""}
                  onClick={() => setRole("admin")}
                  type="button"
                >
                  {registerCopy.admin}
                </button>
              </div>
            </div>

            <div className="field">
              <label htmlFor="register-email">{registerCopy.email}</label>
              <input
                aria-describedby={showFieldError("email") ? "register-email-error" : undefined}
                aria-invalid={showFieldError("email")}
                autoComplete="email"
                id="register-email"
                onBlur={() => setTouched((current) => ({ ...current, email: true }))}
                onChange={(event) => setEmail(event.target.value)}
                placeholder={registerCopy.emailPlaceholder}
                type="email"
                value={email}
              />
              {showFieldError("email") ? (
                <p className="field-error" id="register-email-error">
                  {fieldErrors.email}
                </p>
              ) : null}
            </div>

            <div className="field">
              <label htmlFor="register-password">{registerCopy.password}</label>
              <div className="field-input-row">
                <input
                  aria-describedby={showFieldError("password") ? "register-password-error" : "password-strength"}
                  aria-invalid={showFieldError("password")}
                  autoComplete="new-password"
                  id="register-password"
                  onBlur={() => setTouched((current) => ({ ...current, password: true }))}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder={registerCopy.passwordPlaceholder}
                  type={showPassword ? "text" : "password"}
                  value={password}
                />
                <button
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="icon-toggle"
                  onClick={() => setShowPassword((current) => !current)}
                  type="button"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <div className="password-meter" id="password-strength">
                <div className="password-meter-track">
                  <span
                    className={`password-meter-fill strength-${strengthScore}`}
                    style={{ width: `${Math.max(strengthScore, 1) * 25}%` }}
                  />
                </div>
                <span className="helper-text">
                  {registerCopy.passwordStrength}: {strengthLabel}
                </span>
              </div>
              <ul className="requirement-list">
                <li className={passwordChecks.minLength ? "met" : ""}>{registerCopy.passwordCheckLength}</li>
                <li className={passwordChecks.uppercase ? "met" : ""}>{registerCopy.passwordCheckUppercase}</li>
                <li className={passwordChecks.number ? "met" : ""}>{registerCopy.passwordCheckNumber}</li>
                <li className={passwordChecks.special ? "met" : ""}>{registerCopy.passwordCheckSpecial}</li>
              </ul>
              {showFieldError("password") ? (
                <p className="field-error" id="register-password-error">
                  {fieldErrors.password}
                </p>
              ) : null}
            </div>

            <div className="field">
              <label htmlFor="register-confirm-password">{registerCopy.confirmPassword}</label>
              <div className="field-input-row">
                <input
                  aria-describedby={showFieldError("confirmPassword") ? "register-confirm-password-error" : undefined}
                  aria-invalid={showFieldError("confirmPassword")}
                  autoComplete="new-password"
                  id="register-confirm-password"
                  onBlur={() =>
                    setTouched((current) => ({
                      ...current,
                      confirmPassword: true
                    }))
                  }
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  placeholder={registerCopy.confirmPasswordPlaceholder}
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                />
                <button
                  aria-label={showConfirmPassword ? "Hide password confirmation" : "Show password confirmation"}
                  className="icon-toggle"
                  onClick={() => setShowConfirmPassword((current) => !current)}
                  type="button"
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {showFieldError("confirmPassword") ? (
                <p className="field-error" id="register-confirm-password-error">
                  {fieldErrors.confirmPassword}
                </p>
              ) : null}
            </div>

            <div className="field">
              <label htmlFor="register-wallet">{registerCopy.walletAddress}</label>
              <input
                aria-describedby={showFieldError("walletAddress") ? "register-wallet-error" : "register-wallet-help"}
                aria-invalid={showFieldError("walletAddress")}
                className="mono"
                id="register-wallet"
                onBlur={() => setTouched((current) => ({ ...current, walletAddress: true }))}
                onChange={(event) => setWalletAddress(event.target.value)}
                placeholder={registerCopy.walletPlaceholder}
                value={walletAddress}
              />
              <p className="helper-text" id="register-wallet-help">
                {registerCopy.walletHelp}
              </p>
              {showFieldError("walletAddress") ? (
                <p className="field-error" id="register-wallet-error">
                  {fieldErrors.walletAddress}
                </p>
              ) : null}
            </div>

            <Alert tone="info">{registerCopy.noteText}</Alert>

            <div className="auth-actions">
              <Button
                block
                disabled={!formValid}
                leadingIcon={<UserPlus size={18} />}
                loading={loading}
                loadingLabel={registerCopy.submitting}
                type="submit"
              >
                {registerCopy.submit}
              </Button>
              <Link
                className={buttonClassName({ block: true, variant: "ghost" })}
                href={`/login?role=${role}`}
              >
                <span className="inline-with-icon">
                  <KeyRound aria-hidden size={16} />
                  {registerCopy.alreadyHaveAccount}
                </span>
              </Link>
            </div>
          </form>
        )}
      </div>
    </AuthShell>
  );
}
