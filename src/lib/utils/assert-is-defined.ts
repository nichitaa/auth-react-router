export function assertIsDefined<T>(
  value: T | null | undefined,
  errorMessage = `Value cannot be null or undefined.`,
): asserts value is T {
  if (value === null || value === undefined) {
    throw new Error(errorMessage);
  }
}
