/** Maps API preflight reason codes to i18n keys under errors.* */
export function mapTransferPreflightReason(reasonCode: string | null | undefined): string {
  switch ((reasonCode ?? "").toUpperCase()) {
    case "RECIPIENT_NOT_COMPLIANT":
      return "errors.recipientNotCompliant";
    case "TOKEN_PAUSED":
      return "errors.tokenPaused";
    case "WRONG_NETWORK":
      return "errors.wrongNetwork";
    case "CHAIN_NOT_READY":
      return "errors.chainNotReady";
    case "SENDER_NOT_COMPLIANT":
      return "errors.chainNotReady";
    default:
      return "errors.requestFailed";
  }
}
