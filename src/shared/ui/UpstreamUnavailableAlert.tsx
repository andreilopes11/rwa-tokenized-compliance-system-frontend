"use client";

import { RefreshCw } from "lucide-react";
import { useMessages } from "@/shared/i18n/LocaleProvider";
import { Alert } from "@/shared/ui/Alert";
import { Button } from "@/shared/ui/Button";

type UpstreamUnavailableAlertProps = {
  onRetry?: () => void;
  retrying?: boolean;
};

export function UpstreamUnavailableAlert({ onRetry, retrying }: UpstreamUnavailableAlertProps) {
  const m = useMessages();

  return (
    <Alert tone="error" title={m.errors.gatewayUnavailableTitle}>
      <p>{m.errors.upstreamUnavailable}</p>
      {onRetry ? (
        <Button
          leadingIcon={<RefreshCw size={16} />}
          loading={retrying}
          onClick={onRetry}
          size="sm"
          variant="ghost"
        >
          {m.common.retry}
        </Button>
      ) : null}
    </Alert>
  );
}
