/**
 * Error response parser utility
 * Extracts field-level and general errors from backend API responses
 */

interface ParsedError {
  general: string;
  fields: Record<string, string[]>;
}

/**
 * Field name mapping from API to display names
 */
const FIELD_NAME_MAP: Record<string, string> = {
  userName: 'Username',
  email: 'Email',
  password: 'Password',
  passwordConfirm: 'Confirm Password',
  confirmPassword: 'Confirm Password',
  name: 'Name',
};

/**
 * Maps API field names to display-friendly names
 */
const getDisplayFieldName = (fieldName: string): string => {
  return FIELD_NAME_MAP[fieldName] || fieldName;
};

/**
 * Parses error response from backend API
 * Handles both structured error objects and plain error strings
 *
 * Expected format:
 * { message: "Error message", errors: { fieldName: ["error1", "error2"] } }
 *
 * @param error - Error object from API response
 * @returns Parsed error object with general message and field-level errors
 */
export const parseErrorResponse = (error: any): ParsedError => {
  const result: ParsedError = {
    general: 'An error occurred. Please try again.',
    fields: {},
  };

  if (!error) {
    return result;
  }

  // Extract general error message
  if (typeof error === 'string') {
    result.general = error;
    return result;
  }

  if (error.message && typeof error.message === 'string') {
    result.general = error.message;
  } else if (error.title && typeof error.title === 'string') {
    // Fallback to title if message is missing (e.g. standard ProblemDetails)
    result.general = error.title;
  }

  // Extract field-level errors
  if (error.errors && typeof error.errors === 'object') {
    Object.entries(error.errors).forEach(([fieldName, errorMessages]) => {
      // Handle array of error messages
        if (Array.isArray(errorMessages) && errorMessages.length > 0) {
          const displayName = getDisplayFieldName(fieldName);
          result.fields[displayName] = errorMessages.filter(
            (msg): msg is string => typeof msg === 'string' && msg.length > 0
          );
          
          // Special case: If field is "Unauthorized" (often from 401), promote to general error if general is generic
          if (fieldName === "Unauthorized" && errorMessages.length > 0) {
             result.general = errorMessages[0];
          }
        }
      // Handle single error message as string
      else if (typeof errorMessages === 'string' && errorMessages.length > 0) {
        const displayName = getDisplayFieldName(fieldName);
        result.fields[displayName] = [errorMessages];
      }
    });
  }

  return result;
};

export default parseErrorResponse;
