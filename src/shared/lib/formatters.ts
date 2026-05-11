export function isWalletAddress(value: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(value);
}

export function shortenAddress(value: string | null | undefined): string {
  if (!value) {
    return "Not connected";
  }
  if (!isWalletAddress(value)) {
    return value;
  }
  return `${value.slice(0, 6)}...${value.slice(-4)}`;
}

export function statusLabel(status: string | null | undefined): string {
  if (!status) {
    return "PENDING";
  }
  return status.replaceAll("_", " ");
}

export function statusClass(status: string | null | undefined): string {
  switch (status) {
    case "APPROVED":
      return "approved";
    case "REJECTED":
      return "rejected";
    case "REVOKED":
      return "revoked";
    case "FAILED_ON_CHAIN":
      return "failed";
    default:
      return "pending";
  }
}
