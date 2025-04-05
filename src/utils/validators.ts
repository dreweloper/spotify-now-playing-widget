/**
 * Checks if the given value is a non-empty string.
 *
 * @param value - The value to check
 * @returns {boolean} - True if the value is a non-empty string, false otherwise
 * @example
 * isNonEmptyString("Hello"); // true
 * isNonEmptyString("  "); // false
 * isNonEmptyString(123); // false
 */
export const isNonEmptyString = (value: unknown): value is string =>
	typeof value === "string" && value.trim().length > 0;
