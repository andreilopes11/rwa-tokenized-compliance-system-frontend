"use client";

import { XCircle } from "lucide-react";
import { Button } from "@/shared/ui/Button";
import { copy } from "@/shared/lib/copy";

type WorkspaceNavProps = {
  onSignOut: () => void;
  signingOut: boolean;
};

export function WorkspaceNav({ onSignOut, signingOut }: WorkspaceNavProps) {
  return (
    <nav className="nav-actions workspace-nav" aria-label="Workspace actions">
      <Button
        leadingIcon={<XCircle size={16} />}
        loading={signingOut}
        onClick={onSignOut}
        size="sm"
        variant="ghost"
      >
        {copy.common.signOut}
      </Button>
    </nav>
  );
}
