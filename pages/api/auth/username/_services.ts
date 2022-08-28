import { ValidationModel } from "@interfaces";
import {
  INVALID_USERNAME,
  INVALID_PASSWORD,
  INVALID_CONFIRM_PASSWORD,
} from "./_constants";

function signInValidation(username: string, password: string): ValidationModel {
  if (!username || username.length > 16) {
    return { success: false, errorKey: INVALID_USERNAME };
  } else if (!password || password.length < 6 || password.length > 16) {
    return { success: false, errorKey: INVALID_PASSWORD };
  }
  return { success: true };
}

function signupValidation(
  username: string,
  password: string,
  confirmPassword: string
): ValidationModel {
  if (!username || username.length > 16) {
    return { success: false, errorKey: INVALID_USERNAME };
  } else if (!password || password.length < 6 || password.length > 16) {
    return { success: false, errorKey: INVALID_PASSWORD };
  } else if (
    !confirmPassword ||
    confirmPassword.length < 6 ||
    confirmPassword.length > 16 ||
    password !== confirmPassword
  ) {
    return { success: false, errorKey: INVALID_CONFIRM_PASSWORD };
  }

  return { success: true };
}

export { signInValidation, signupValidation };
