import type { ReactNode } from "react";

export type WorkspacePanelProps = {
  screenId: string;
  title: string;
  /** Optional supporting sentence under the title. */
  description?: string;
  /** Right-aligned actions in the panel head (Refresh, etc.). */
  actions?: ReactNode;
  /** Optional back/nav row above the title. */
  lead?: ReactNode;
  id?: string;
  className?: string;
  children: ReactNode;
};

/**
 * Canonical screen panel for logged-in workspaces:
 * panel → panel-head (h1 + actions) → optional description → body.
 */
export function WorkspacePanel({
  screenId,
  title,
  description,
  actions,
  lead,
  id,
  className,
  children
}: WorkspacePanelProps) {
  const classes = className ? `panel ${className}` : "panel";

  return (
    <div className={classes} data-screen-id={screenId} id={id}>
      {lead}
      <div className="panel-head">
        <h1>{title}</h1>
        {actions ? <div className="panel-head-actions">{actions}</div> : null}
      </div>
      {description ? <p className="muted panel-description">{description}</p> : null}
      {children}
    </div>
  );
}
