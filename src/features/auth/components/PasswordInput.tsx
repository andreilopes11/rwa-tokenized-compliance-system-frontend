"use client";

import { Eye, EyeOff } from "lucide-react";
import type { ReactNode } from "react";
import { useId, useState } from "react";

type PasswordInputProps = {
  autoComplete?: string;
  describedBy?: string;
  error?: string;
  footer?: ReactNode;
  id?: string;
  invalid?: boolean;
  label: string;
  onBlur?: () => void;
  onChange: (value: string) => void;
  placeholder?: string;
  value: string;
};

export function PasswordInput({
  autoComplete = "current-password",
  describedBy,
  error,
  footer,
  id: idProp,
  invalid = false,
  label,
  onBlur,
  onChange,
  placeholder,
  value
}: PasswordInputProps) {
  const generatedId = useId();
  const inputId = idProp ?? generatedId;
  const errorId = `${inputId}-error`;
  const [visible, setVisible] = useState(false);

  return (
    <div className="field">
      <label htmlFor={inputId}>{label}</label>
      <div className="field-input-row">
        <input
          aria-describedby={invalid && error ? errorId : describedBy}
          aria-invalid={invalid}
          autoComplete={visible ? "off" : autoComplete}
          className={visible ? "password-visible" : undefined}
          data-password-visible={visible ? "true" : "false"}
          id={inputId}
          key={visible ? `${inputId}-text` : `${inputId}-password`}
          onBlur={onBlur}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          spellCheck={false}
          type={visible ? "text" : "password"}
          value={value}
        />
        <button
          aria-label={visible ? "Hide password" : "Show password"}
          aria-pressed={visible}
          className="icon-toggle field-inline-action"
          onClick={(event) => {
            event.preventDefault();
            setVisible((current) => !current);
          }}
          type="button"
        >
          {visible ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
      {footer}
      {invalid && error ? (
        <p className="field-error" id={errorId}>
          {error}
        </p>
      ) : null}
    </div>
  );
}
