import { ValidationModel } from "@interfaces";
import { INVALID_USERNAME, INVALID_PASSWORD } from "./_constants";

function signInValidation(username: string, password: string): ValidationModel {
  if (!username || username.length > 16) {
    return { success: false, errorKey: INVALID_USERNAME };
  } else if (!password || password.length > 16) {
    return { success: false, errorKey: INVALID_PASSWORD };
  }
  return { success: true };
}

export { signInValidation };
