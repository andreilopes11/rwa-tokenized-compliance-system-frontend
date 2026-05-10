"use client";

import { BadgeCheck, Mail, Wallet } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function OAuthLogin() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const handleOAuthLogin = async (provider: "google" | "github" | "metamask") => {
    setLoading(true);
    setError("");

    try {
      // Get OAuth authorization URL
      const response = await fetch(`/api/auth/oauth/${provider}`, {
        method: "GET"
      });

      if (response.ok) {
        const data = await response.json();
        
        // Store state for verification
        sessionStorage.setItem("oauth_state", data.state);
        
        // Redirect to OAuth provider
        if (provider === "google") {
          window.location.href = data.authorizationUrl;
        } else if (provider === "github") {
          window.location.href = data.authorizationUrl;
        } else if (provider === "metamask") {
          // MetaMask uses different flow
          window.location.href = "/login?oauth=metamask";
        }
      } else {
        setError(`Failed to initiate ${provider} login`);
      }
    } catch (err) {
      setError("Error initiating OAuth login");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="oauth-login-container">
      <div className="oauth-header">
        <h3>Sign In with</h3>
        <p>Connect using your preferred account</p>
      </div>

      {error && <div className="oauth-error">{error}</div>}

      <div className="oauth-providers">
        <button
          onClick={() => handleOAuthLogin("google")}
          disabled={loading}
          className="oauth-button google"
          title="Sign in with Google"
        >
          <Mail size={20} />
          <span>Google</span>
        </button>

        <button
          onClick={() => handleOAuthLogin("github")}
          disabled={loading}
          className="oauth-button github"
          title="Sign in with GitHub"
        >
          <BadgeCheck size={20} />
          <span>GitHub</span>
        </button>

        <button
          onClick={() => handleOAuthLogin("metamask")}
          disabled={loading}
          className="oauth-button metamask"
          title="Sign in with MetaMask"
        >
          <Wallet size={20} />
          <span>MetaMask</span>
        </button>
      </div>

      <div className="oauth-divider">
        <span>or</span>
      </div>

      <style jsx>{`
        .oauth-login-container {
          display: grid;
          gap: 1.5rem;
          padding: 1.5rem;
          border: 1px solid var(--panel-border);
          border-radius: 12px;
          background: var(--panel);
        }

        .oauth-header {
          text-align: center;
        }

        .oauth-header h3 {
          margin: 0;
          font-size: 1.1rem;
          color: var(--foreground);
        }

        .oauth-header p {
          margin: 0.5rem 0 0;
          font-size: 0.9rem;
          color: var(--muted);
        }

        .oauth-error {
          background: #fee2e2;
          color: var(--danger);
          padding: 0.75rem;
          border-radius: 6px;
          font-size: 0.9rem;
        }

        .oauth-providers {
          display: grid;
          gap: 0.75rem;
        }

        .oauth-button {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          padding: 0.9rem 1.2rem;
          border: 2px solid transparent;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          font-size: 0.95rem;
          transition: all 0.2s;
          background: white;
          color: #333;
          border: 1px solid #e5e7eb;
        }

        .oauth-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .oauth-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .oauth-button.google {
          background: white;
          color: #1f2937;
          border: 1px solid #e5e7eb;
        }

        .oauth-button.google:hover:not(:disabled) {
          background: #f9fafb;
          border-color: #db4437;
        }

        .oauth-button.github {
          background: #24292e;
          color: white;
          border: 1px solid #24292e;
        }

        .oauth-button.github:hover:not(:disabled) {
          background: #1a1e22;
        }

        .oauth-button.metamask {
          background: #f6851b;
          color: white;
          border: 1px solid #f6851b;
        }

        .oauth-button.metamask:hover:not(:disabled) {
          background: #e07014;
        }

        .oauth-divider {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin: 0.5rem 0;
          color: var(--muted);
          font-size: 0.9rem;
        }

        .oauth-divider::before,
        .oauth-divider::after {
          content: "";
          flex: 1;
          height: 1px;
          background: var(--panel-border);
        }
      `}</style>
    </div>
  );
}
