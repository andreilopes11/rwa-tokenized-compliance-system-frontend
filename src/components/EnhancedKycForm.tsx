"use client";

import { AlertCircle, CheckCircle2, FileCheck2, Loader, Upload } from "lucide-react";
import { useState, useEffect } from "react";

export function EnhancedKycForm({ walletAddress, email }: {
  walletAddress: string;
  email: string;
}) {
  const [step, setStep] = useState<"provider" | "documents" | "status">("provider");
  const [selectedProvider, setSelectedProvider] = useState<string>("MOCK");
  const [verificationId, setVerificationId] = useState<string>("");
  const [documents, setDocuments] = useState<{ type: string; file?: File }[]>([]);
  const [status, setStatus] = useState<string>("PENDING");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [providers, setProviders] = useState<string[]>([]);
  const [documentTypes, setDocumentTypes] = useState<string[]>([]);

  useEffect(() => {
    // Load available providers and document types
    Promise.all([
      fetch("/api/kyc/enhanced/providers").then(r => r.json()),
      fetch("/api/kyc/enhanced/document-types").then(r => r.json())
    ]).then(([prov, docs]) => {
      setProviders(prov.providers || []);
      setDocumentTypes(docs.documentTypes || []);
    });
  }, []);

  const handleInitiateVerification = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/kyc/enhanced/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          walletAddress,
          email,
          provider: selectedProvider
        })
      });

      if (response.ok) {
        const data = await response.json();
        setVerificationId(data.verificationId);
        setStep("documents");
      } else {
        setError("Failed to initiate verification");
      }
    } catch (err) {
      setError("Error initiating KYC verification");
    } finally {
      setLoading(false);
    }
  };

  const handleDocumentSubmit = async (index: number) => {
    const doc = documents[index];
    if (!doc.file) {
      setError("Please select a file");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // In production, upload file to storage service and get URL
      const documentUrl = URL.createObjectURL(doc.file);

      const response = await fetch(`/api/kyc/enhanced/${verificationId}/document`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          documentType: doc.type,
          documentUrl
        })
      });

      if (response.ok) {
        const updatedDocs = [...documents];
        updatedDocs[index].file = undefined;
        setDocuments(updatedDocs);
        
        // Check if we should move to status step
        if (updatedDocs.every(d => !d.file)) {
          checkVerificationStatus();
        }
      } else {
        setError("Failed to submit document");
      }
    } catch (err) {
      setError("Error submitting document");
    } finally {
      setLoading(false);
    }
  };

  const checkVerificationStatus = async () => {
    try {
      const response = await fetch(`/api/kyc/enhanced/${verificationId}/status`);
      if (response.ok) {
        const data = await response.json();
        setStatus(data.status);
        setStep("status");
      }
    } catch (err) {
      console.error("Error checking status:", err);
    }
  };

  const addDocument = () => {
    if (documents.length < documentTypes.length) {
      setDocuments([...documents, { type: documentTypes[0] }]);
    }
  };

  const removeDocument = (index: number) => {
    setDocuments(documents.filter((_, i) => i !== index));
  };

  const handleFileChange = (index: number, file: File | undefined) => {
    const updated = [...documents];
    updated[index].file = file;
    setDocuments(updated);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "VERIFIED":
        return <CheckCircle2 size={24} className="status-icon success" />;
      case "REJECTED":
      case "FAILED":
        return <AlertCircle size={24} className="status-icon error" />;
      case "IN_PROGRESS":
        return <Loader size={24} className="status-icon loading" />;
      default:
        return <FileCheck2 size={24} className="status-icon pending" />;
    }
  };

  return (
    <div className="enhanced-kyc-container">
      <h2>Enhanced KYC Verification</h2>

      {step === "provider" && (
        <div className="kyc-step">
          <h3>Select Verification Provider</h3>
          <p>Choose a KYC provider to verify your identity</p>

          <div className="provider-grid">
            {providers.map(provider => (
              <label key={provider} className={`provider-option ${selectedProvider === provider ? "selected" : ""}`}>
                <input
                  type="radio"
                  value={provider}
                  checked={selectedProvider === provider}
                  onChange={(e) => setSelectedProvider(e.target.value)}
                />
                <span>{provider}</span>
              </label>
            ))}
          </div>

          {error && <div className="error-message">{error}</div>}

          <button
            onClick={handleInitiateVerification}
            disabled={loading}
            className="primary-button"
          >
            {loading ? "Initiating..." : "Start Verification"}
          </button>
        </div>
      )}

      {step === "documents" && (
        <div className="kyc-step">
          <h3>Submit Documents</h3>
          <p>Upload required documents for verification</p>

          <div className="documents-list">
            {documents.map((doc, idx) => (
              <div key={idx} className="document-item">
                <select
                  value={doc.type}
                  onChange={(e) => {
                    const updated = [...documents];
                    updated[idx].type = e.target.value;
                    setDocuments(updated);
                  }}
                  className="document-type-select"
                >
                  {documentTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>

                <div className="file-input-wrapper">
                  <input
                    type="file"
                    id={`file-${idx}`}
                    onChange={(e) => handleFileChange(idx, e.target.files?.[0])}
                    className="file-input"
                  />
                  <label htmlFor={`file-${idx}`} className="file-label">
                    <Upload size={20} />
                    {doc.file ? doc.file.name : "Choose file"}
                  </label>
                </div>

                <button
                  onClick={() => handleDocumentSubmit(idx)}
                  disabled={!doc.file || loading}
                  className="upload-button"
                >
                  {loading ? "Uploading..." : "Upload"}
                </button>

                {documents.length > 1 && (
                  <button
                    onClick={() => removeDocument(idx)}
                    className="remove-button"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>

          {documents.length < documentTypes.length && (
            <button
              onClick={addDocument}
              className="secondary-button"
            >
              + Add Another Document
            </button>
          )}

          {error && <div className="error-message">{error}</div>}
        </div>
      )}

      {step === "status" && (
        <div className="kyc-step">
          <h3>Verification Status</h3>

          <div className="status-display">
            {getStatusIcon(status)}
            <p className={`status-text ${status.toLowerCase()}`}>{status}</p>
          </div>

          <div className="status-details">
            <p><strong>Verification ID:</strong> {verificationId}</p>
            <p><strong>Provider:</strong> {selectedProvider}</p>
            <p className="status-message">
              {status === "VERIFIED" && "Your identity has been verified successfully!"}
              {status === "IN_PROGRESS" && "Your documents are being processed. This usually takes 1-5 business days."}
              {status === "PENDING" && "Waiting for documents to be submitted."}
              {status === "REJECTED" && "Your verification was rejected. Please contact support."}
            </p>
          </div>

          <button
            onClick={() => window.location.reload()}
            className="primary-button"
          >
            Close
          </button>
        </div>
      )}

      <style jsx>{`
        .enhanced-kyc-container {
          max-width: 600px;
          margin: 2rem auto;
          padding: 2rem;
          border: 1px solid var(--panel-border);
          border-radius: 12px;
          background: var(--panel);
        }

        .kyc-step {
          display: grid;
          gap: 1.5rem;
        }

        .provider-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 1rem;
        }

        .provider-option {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem;
          border: 2px solid var(--panel-border);
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .provider-option:hover {
          border-color: var(--primary);
          background: #f0fffe;
        }

        .provider-option.selected {
          border-color: var(--primary);
          background: #e0f7f4;
        }

        .provider-option input {
          cursor: pointer;
        }

        .documents-list {
          display: grid;
          gap: 1rem;
        }

        .document-item {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr 1fr;
          gap: 0.75rem;
          align-items: end;
          padding: 1rem;
          border: 1px solid var(--panel-border);
          border-radius: 8px;
          background: #f9f9f9;
        }

        .document-type-select {
          padding: 0.75rem;
          border: 1px solid var(--panel-border);
          border-radius: 6px;
          font-size: 0.95rem;
        }

        .file-input-wrapper {
          position: relative;
          display: flex;
        }

        .file-input {
          display: none;
        }

        .file-label {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem;
          border: 1px dashed var(--panel-border);
          border-radius: 6px;
          background: white;
          cursor: pointer;
          transition: all 0.2s;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-size: 0.9rem;
        }

        .file-label:hover {
          border-color: var(--primary);
          background: #f0fffe;
        }

        .upload-button,
        .remove-button {
          padding: 0.75rem 1rem;
          font-size: 0.9rem;
        }

        .remove-button {
          background: #fee2e2;
          color: var(--danger);
        }

        .status-display {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1.5rem;
          border-radius: 8px;
          background: #f9f9f9;
        }

        .status-icon {
          flex-shrink: 0;
        }

        .status-icon.success {
          color: var(--success);
        }

        .status-icon.error {
          color: var(--danger);
        }

        .status-icon.loading {
          animation: spin 1s linear infinite;
          color: var(--accent);
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .status-text {
          margin: 0;
          font-weight: 600;
          font-size: 1.1rem;
        }

        .status-text.verified {
          color: var(--success);
        }

        .status-text.rejected,
        .status-text.failed {
          color: var(--danger);
        }

        .status-text.in_progress {
          color: var(--accent);
        }

        .status-details {
          display: grid;
          gap: 0.75rem;
          padding: 1rem;
          background: #f9f9f9;
          border-radius: 8px;
        }

        .status-details p {
          margin: 0;
          font-size: 0.95rem;
        }

        .status-message {
          color: var(--muted);
          font-style: italic;
          margin-top: 0.5rem;
        }

        .error-message {
          color: var(--danger);
          background: #fee2e2;
          padding: 0.75rem;
          border-radius: 6px;
          font-size: 0.9rem;
        }

        .primary-button,
        .secondary-button {
          width: 100%;
        }
      `}</style>
    </div>
  );
}
