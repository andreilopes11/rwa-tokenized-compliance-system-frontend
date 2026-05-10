import { LoaderCircle } from "lucide-react";
import type { ButtonHTMLAttributes, ReactNode } from "react";

export type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

type ButtonClassOptions = {
  block?: boolean;
  className?: string;
  size?: ButtonSize;
  variant?: ButtonVariant;
};

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  ButtonClassOptions & {
    leadingIcon?: ReactNode;
    loading?: boolean;
    loadingLabel?: string;
  };

function cx(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

export function buttonClassName({
  block = false,
  className,
  size = "md",
  variant = "primary"
}: ButtonClassOptions = {}) {
  return cx(
    "ui-button",
    `ui-button-${variant}`,
    `ui-button-${size}`,
    block && "ui-button-block",
    className
  );
}

export function Button({
  block = false,
  children,
  className,
  disabled,
  leadingIcon,
  loading = false,
  loadingLabel,
  size = "md",
  type = "button",
  variant = "primary",
  ...props
}: ButtonProps) {
  const content = loadingLabel && loading ? loadingLabel : children;

  return (
    <button
      {...props}
      aria-busy={loading}
      className={buttonClassName({ block, className, size, variant })}
      disabled={disabled || loading}
      type={type}
    >
      <span className="ui-button-icon" aria-hidden>
        {loading ? <LoaderCircle className="ui-spinner" size={18} /> : leadingIcon}
      </span>
      <span className="ui-button-label">{content}</span>
    </button>
  );
}
