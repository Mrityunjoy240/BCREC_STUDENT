export type UnauthorizedCode =
  "no_session" | "invalid_session" | "missing_profile" | "disabled_account" | "not_authorized";

export class UnauthorizedError extends Error {
  readonly code: UnauthorizedCode;

  constructor(code: UnauthorizedCode, message?: string) {
    super(message ?? code);
    this.name = "UnauthorizedError";
    this.code = code;
  }
}
