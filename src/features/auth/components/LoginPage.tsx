"use client";

import {
  BriefcaseBusiness,
  KeyRound,
  ShieldCheck,
  Sparkles,
  Wallet
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { useAccount, useConnect } from "wagmi";
import { isValidEmail, isValidWalletAddress } from "@/features/auth/lib/validators";
import { copy } from "@/shared/lib/copy";
import { shortenAddress } from "@/shared/lib/formatters";
import { activeChain } from "@/shared/lib/web3";
import { Alert } from "@/shared/ui/Alert";
import { AuthShell } from "@/shared/ui/AuthShell";
import { Button, buttonClassName } from "@/shared/ui/Button";

type LoginProvider = "email" | "google" | "wallet";
type LoginRole = "investor" | "admin";

type TouchedState = {
  mfa: boolean;
  subject: boolean;
};

export function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestedRole = searchParams.get("role") === "admin" ? "admin" : "investor";
  const next = searchParams.get("next") ?? (requestedRole === "admin" ? "/admin" : "/dashboard");
  const registered = searchParams.get("registered") === "1";
  const prefilledEmail = searchParams.get("email")?.trim() ?? "";
  const defaultEmail = prefilledEmail || "investor@company.com";

  const [role, setRole] = useState<LoginRole>(requestedRole);
  const [provider, setProvider] = useState<LoginProvider>("email");
  const [subject, setSubject] = useState(defaultEmail);
  const [mfaCode, setMfaCode] = useState("123456");
  const [availableProviders, setAvailableProviders] = useState({
    email: true,
    google: false,
    wallet: true
  });
  const [touched, setTouched] = useState<TouchedState>({
    mfa: false,
    subject: false
  });
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const account = useAccount();
  const { connectors, connectAsync, isPending } = useConnect();
  const loginCopy = copy.login;
  const common = copy.common;

  useEffect(() => {
    setRole(requestedRole);
  }, [requestedRole]);

  useEffect(() => {
    if (account.address && provider === "wallet") {
      setSubject(account.address);
    }
  }, [account.address, provider]);

  useEffect(() => {
    let cancelled = false;

    async function loadProviders() {
      try {
        const response = await fetch("/api/auth/session", { cache: "no-store" });
        if (!response.ok) {
          return;
        }
        const payload = await response.json();
        if (!cancelled && payload.providers) {
          setAvailableProviders({
            email: Boolean(payload.providers.email),
            google: Boolean(payload.providers.google),
            wallet: Boolean(payload.providers.wallet)
          });
          if (!payload.providers.google && provider === "google") {
            setProvider("email");
          }
        }
      } catch {
        // Keep local defaults if provider discovery is unavailable.
      }
    }

    void loadProviders();

    return () => {
      cancelled = true;
    };
  }, [provider]);

  const normalizedSubject = subject.trim();
  const normalizedMfa = mfaCode.trim();
  const subjectError =
    provider === "wallet"
      ? !isValidWalletAddress(normalizedSubject)
        ? loginCopy.invalidWallet
        : ""
      : !isValidEmail(normalizedSubject)
        ? loginCopy.invalidEmail
        : "";
  const mfaError = /^\d{6}$/.test(normalizedMfa) ? "" : loginCopy.invalidMfa;
  const showSubjectError = (touched.subject || submitAttempted) && Boolean(subjectError);
  const showMfaError = (touched.mfa || submitAttempted) && Boolean(mfaError);
  const canSubmit = !loading && !subjectError && !mfaError;

  function updateProvider(nextProvider: LoginProvider) {
    setProvider(nextProvider);
    setError("");
    setSubmitAttempted(false);
    setTouched({ mfa: false, subject: false });

    if (nextProvider === "wallet") {
      setSubject(account.address ?? "");
      return;
    }

    setSubject((current) => {
      if (current && !current.startsWith("0x")) {
        return current;
      }
      return defaultEmail;
    });
  }

  async function connectWallet() {
    setError("");
    const connector = connectors[0];
    if (!connector) {
      setError(loginCopy.walletUnavailable);
      return;
    }

    try {
      const result = await connectAsync({ connector, chainId: activeChain.id });
      const walletAddress = result.accounts[0] ?? "";
      setProvider("wallet");
      setSubject(walletAddress);
    } catch (err) {
      setError(err instanceof Error ? err.message : loginCopy.walletUnavailable);
    }
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitAttempted(true);
    setError("");

    if (subjectError || mfaError) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        body: JSON.stringify({
          provider,
          role,
          subject: normalizedSubject,
          walletAddress: provider === "wallet" ? normalizedSubject : undefined,
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

  const providerOptions = [
    {
      id: "email" as const,
      description: loginCopy.providerEmailDescription,
      label: loginCopy.providerEmailTitle,
      visible: availableProviders.email
    },
    {
      id: "google" as const,
      description: loginCopy.providerGoogleDescription,
      label: loginCopy.providerGoogleTitle,
      visible: availableProviders.google
    },
    {
      id: "wallet" as const,
      description: loginCopy.providerWalletDescription,
      label: loginCopy.providerWalletTitle,
      visible: availableProviders.wallet
    }
  ].filter((option) => option.visible);

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
            <div className="field-header">
              <label>{loginCopy.provider}</label>
              <span className="helper-text">{loginCopy.providerHelp}</span>
            </div>
            <div className="option-card-grid">
              {providerOptions.map((option) => (
                <button
                  className={`option-card ${provider === option.id ? "selected" : ""}`}
                  key={option.id}
                  onClick={() => updateProvider(option.id)}
                  type="button"
                >
                  <span className="option-card-icon" aria-hidden>
                    {option.id === "wallet" ? (
                      <Wallet size={18} />
                    ) : option.id === "google" ? (
                      <ShieldCheck size={18} />
                    ) : (
                      <Sparkles size={18} />
                    )}
                  </span>
                  <span className="option-card-copy">
                    <strong>{option.label}</strong>
                    <small>{option.description}</small>
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="field">
            <label htmlFor="login-subject">
              {provider === "wallet" ? loginCopy.subjectWalletLabel : loginCopy.subjectEmailLabel}
            </label>
            <div className="field-input-row">
              <input
                aria-describedby={showSubjectError ? "login-subject-error" : "login-subject-help"}
                aria-invalid={showSubjectError}
                className={provider === "wallet" ? "mono" : undefined}
                id="login-subject"
                inputMode={provider === "wallet" ? "text" : "email"}
                onBlur={() => setTouched((current) => ({ ...current, subject: true }))}
                onChange={(event) => setSubject(event.target.value)}
                placeholder={
                  provider === "wallet"
                    ? loginCopy.subjectWalletPlaceholder
                    : loginCopy.subjectEmailPlaceholder
                }
                type={provider === "wallet" ? "text" : "email"}
                value={subject}
              />
              {provider === "wallet" ? (
                <Button
                  className="field-inline-action"
                  leadingIcon={<Wallet size={16} />}
                  loading={isPending}
                  loadingLabel={loginCopy.connectingWallet}
                  onClick={connectWallet}
                  size="sm"
                  type="button"
                  variant="secondary"
                >
                  {loginCopy.connectWallet}
                </Button>
              ) : null}
            </div>
            <p className="helper-text" id="login-subject-help">
              {provider === "wallet" ? loginCopy.subjectWalletHelp : loginCopy.subjectEmailHelp}
              {provider === "wallet" && account.address ? ` ${shortenAddress(account.address)}` : ""}
            </p>
            {showSubjectError ? (
              <p className="field-error" id="login-subject-error">
                {subjectError}
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
