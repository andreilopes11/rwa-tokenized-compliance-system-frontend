/** Maps frontend/backend error keys to localized copy; passes through unknown messages as-is. */
export function resolveClientError(
  message: string,
  t: (path: string, values?: Record<string, string | number>) => string
): string {
  if (message.startsWith("errors.")) {
    const translated = t(message);
    return translated !== message ? translated : message;
  }
  if (message === "error.rateLimit" || message === "Try again in 60 seconds.") {
    const translated = t("errors.rateLimit");
    return translated !== "errors.rateLimit" ? translated : message;
  }
  return message;
}
