"use client";

import { XCircle } from "lucide-react";
import { useMessages } from "@/shared/i18n/LocaleProvider";
import { Button } from "@/shared/ui/Button";

type WorkspaceNavProps = {
  onSignOut: () => void;
  signingOut: boolean;
};

export function WorkspaceNav({ onSignOut, signingOut }: WorkspaceNavProps) {
  const m = useMessages();

  return (
    <nav className="nav-actions workspace-nav" aria-label="Workspace actions">
      <Button
        leadingIcon={<XCircle size={16} />}
        loading={signingOut}
        onClick={onSignOut}
        size="sm"
        variant="ghost"
      >
        {m.common.signOut}
      </Button>
    </nav>
  );
}
