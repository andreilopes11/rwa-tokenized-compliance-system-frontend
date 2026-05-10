"use client";

import { Copy, Eye, EyeOff, ShieldAlert } from "lucide-react";
import { useState } from "react";

export function TwoFactorSetup({ walletAddress, onSetupComplete }: {
  walletAddress: string;
  onSetupComplete: (verified: boolean) => void;
}) {
  const [step, setStep] = useState<"generate" | "verify" | "backup" | "complete">("generate");
  const [qrCode, setQrCode] = useState<string>("");
  const [secret, setSecret] = useState<string>("");
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [verificationCode, setVerificationCode] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [showSecret, setShowSecret] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const generateSecret = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/auth/2fa/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ walletAddress })
      });

      if (response.ok) {
        const data = await response.json();
        setQrCode(data.qrCodeUrl);
        setSecret(data.secret);
        setStep("verify");
      } else {
        setError("Failed to generate 2FA secret");
      }
    } catch (err) {
      setError("Error generating 2FA setup");
    } finally {
      setLoading(false);
    }
  };

  const verifyCode = async () => {
    if (verificationCode.length !== 6) {
      setError("Please enter a 6-digit code");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/auth/2fa/enable", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ walletAddress, code: verificationCode })
      });

      if (response.ok) {
        setStep("backup");
      } else {
        setError("Invalid verification code. Please try again.");
      }
    } catch (err) {
      setError("Error verifying code");
    } finally {
      setLoading(false);
    }
  };

  const getBackupCodes = async () => {
    try {
      const response = await fetch(`/api/auth/2fa/setup?walletAddress=${walletAddress}`, {
        method: "POST"
      });

      if (response.ok) {
        const data = await response.json();
        setBackupCodes(data.backupCodes);
        setStep("complete");
      }
    } catch (err) {
      setError("Error retrieving backup codes");
    }
  };

  const copyToClipboard = (text: string, code: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="2fa-setup-container">
      <h2>Set Up Two-Factor Authentication</h2>

      {step === "generate" && (
        <div className="setup-step">
          <p>Two-factor authentication adds an extra layer of security to your account.</p>
          <button
            onClick={generateSecret}
            disabled={loading}
            className="primary-button"
          >
            {loading ? "Generating..." : "Start Setup"}
          </button>
        </div>
      )}

      {step === "verify" && (
        <div className="setup-step">
          <h3>Step 1: Scan QR Code</h3>
          <p>Scan this QR code with your authenticator app (Google Authenticator, Authy, Microsoft Authenticator):</p>

          <div className="qr-code-container">
            {qrCode && (
              <img src={qrCode} alt="2FA QR Code" className="qr-code-image" />
            )}
          </div>

          <div className="manual-entry">
            <label>Can't scan? Enter manually:</label>
            <div className="secret-display">
              <code>{showSecret ? secret : "•".repeat(secret.length)}</code>
              <button
                onClick={() => setShowSecret(!showSecret)}
                className="icon-button"
                title={showSecret ? "Hide" : "Show"}
              >
                {showSecret ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
              <button
                onClick={() => copyToClipboard(secret, "secret")}
                className="icon-button"
                title="Copy"
              >
                <Copy size={18} />
              </button>
            </div>
          </div>

          <div className="verification-code">
            <label>Enter 6-digit code from your app:</label>
            <input
              type="text"
              maxLength={6}
              placeholder="000000"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value.replace(/[^\d]/g, ""))}
              className="code-input"
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button
            onClick={verifyCode}
            disabled={loading || verificationCode.length !== 6}
            className="primary-button"
          >
            {loading ? "Verifying..." : "Verify & Continue"}
          </button>
        </div>
      )}

      {step === "backup" && (
        <div className="setup-step">
          <h3>Step 2: Save Backup Codes</h3>
          <div className="warning-box">
            <ShieldAlert size={20} />
            <p>Save these backup codes in a safe place. You can use them to regain access if you lose your authenticator.</p>
          </div>

          <div className="backup-codes-display">
            {backupCodes.length > 0 ? (
              backupCodes.map((code, idx) => (
                <div key={idx} className="backup-code-item">
                  <code>{code}</code>
                  <button
                    onClick={() => copyToClipboard(code, `code-${idx}`)}
                    className="icon-button"
                    title="Copy"
                  >
                    <Copy size={16} />
                  </button>
                  {copiedCode === `code-${idx}` && <span className="copied-indicator">Copied!</span>}
                </div>
              ))
            ) : (
              <button onClick={getBackupCodes} className="primary-button">
                Get Backup Codes
              </button>
            )}
          </div>

          <button
            onClick={() => {
              setStep("complete");
              onSetupComplete(true);
            }}
            className="primary-button"
          >
            I've Saved My Codes
          </button>
        </div>
      )}

      {step === "complete" && (
        <div className="setup-step success">
          <h3>✓ 2FA Setup Complete</h3>
          <p>Your account is now protected with two-factor authentication.</p>
          <button
            onClick={() => onSetupComplete(true)}
            className="primary-button"
          >
            Close
          </button>
        </div>
      )}

      <style jsx>{`
        .2fa-setup-container {
          max-width: 500px;
          margin: 2rem auto;
          padding: 2rem;
          border: 1px solid var(--panel-border);
          border-radius: 12px;
          background: var(--panel);
        }

        .setup-step {
          display: grid;
          gap: 1.5rem;
        }

        .setup-step h3 {
          margin: 0;
          font-size: 1.1rem;
        }

        .qr-code-container {
          display: flex;
          justify-content: center;
          padding: 1rem;
          background: #f5f5f5;
          border-radius: 8px;
        }

        .qr-code-image {
          max-width: 250px;
          height: auto;
        }

        .manual-entry {
          display: grid;
          gap: 0.75rem;
        }

        .secret-display {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: #f9f9f9;
          border: 1px solid var(--panel-border);
          border-radius: 6px;
          padding: 0.75rem;
          font-family: monospace;
          font-size: 0.9rem;
          overflow-x: auto;
        }

        .secret-display code {
          flex: 1;
          overflow-x: auto;
        }

        .icon-button {
          background: transparent;
          border: none;
          cursor: pointer;
          color: var(--primary);
          display: flex;
          align-items: center;
          padding: 0.25rem;
          min-height: auto;
        }

        .verification-code {
          display: grid;
          gap: 0.5rem;
        }

        .code-input {
          font-size: 1.5rem;
          letter-spacing: 0.5rem;
          text-align: center;
          font-family: monospace;
          padding: 0.75rem;
          border: 2px solid var(--panel-border);
          border-radius: 6px;
          width: 100%;
        }

        .warning-box {
          display: flex;
          gap: 1rem;
          background: #fef3c7;
          border: 1px solid #fcd34d;
          border-radius: 8px;
          padding: 1rem;
          color: #92400e;
        }

        .warning-box svg {
          flex-shrink: 0;
          color: #d97706;
        }

        .backup-codes-display {
          display: grid;
          gap: 0.75rem;
          max-height: 300px;
          overflow-y: auto;
          padding: 1rem;
          background: #f9f9f9;
          border-radius: 6px;
        }

        .backup-code-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.5rem;
          padding: 0.5rem;
          background: white;
          border: 1px solid var(--panel-border);
          border-radius: 4px;
          font-family: monospace;
        }

        .copied-indicator {
          color: var(--success);
          font-size: 0.8rem;
        }

        .error-message {
          color: var(--danger);
          font-size: 0.9rem;
          background: #fee2e2;
          padding: 0.75rem;
          border-radius: 4px;
        }

        .success {
          text-align: center;
          color: var(--success);
        }

        .primary-button {
          width: 100%;
        }
      `}</style>
    </div>
  );
}
