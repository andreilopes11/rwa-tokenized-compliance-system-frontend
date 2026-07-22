import type { ReactNode } from "react";

export type EmptyStateProps = {
  /** Optional leading icon (already sized by the caller). */
  icon?: ReactNode;
  /** Short primary message describing the empty result. */
  children: ReactNode;
  className?: string;
};

/**
 * Canonical empty-list placeholder for logged-in workspaces. Standardizes the dashed
 * icon + copy treatment previously duplicated as ad-hoc `<div className="empty-state">`
 * blocks and `<p className="muted">` fallbacks across governance/investor screens.
 */
export function EmptyState({ icon, children, className }: EmptyStateProps) {
  const classes = className ? `empty-state ${className}` : "empty-state";
  return (
    <div className={classes} role="status">
      {icon}
      <span>{children}</span>
    </div>
  );
}
