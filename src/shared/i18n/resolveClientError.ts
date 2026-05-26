/** Maps frontend error keys (errors.*) to localized copy; passes through backend messages as-is. */
export function resolveClientError(
  message: string,
  t: (path: string, values?: Record<string, string | number>) => string
): string {
  if (message.startsWith("errors.")) {
    const translated = t(message);
    return translated !== message ? translated : message;
  }
  return message;
}
