import { describe, expect, it } from "vitest";
import { mapTransferPreflightReason } from "./mapTransferPreflightReason";

describe("mapTransferPreflightReason", () => {
  it("maps known API codes to i18n keys", () => {
    expect(mapTransferPreflightReason("RECIPIENT_NOT_COMPLIANT")).toBe(
      "errors.recipientNotCompliant"
    );
    expect(mapTransferPreflightReason("TOKEN_PAUSED")).toBe("errors.tokenPaused");
    expect(mapTransferPreflightReason("WRONG_NETWORK")).toBe("errors.wrongNetwork");
    expect(mapTransferPreflightReason("CHAIN_NOT_READY")).toBe("errors.chainNotReady");
    expect(mapTransferPreflightReason("SENDER_NOT_COMPLIANT")).toBe("errors.senderNotCompliant");
    expect(mapTransferPreflightReason("INSUFFICIENT_BALANCE")).toBe("errors.insufficientBalance");
  });
});
