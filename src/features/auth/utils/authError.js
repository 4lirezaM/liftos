const AUTH_ERROR_MESSAGES = {
  invalid_credentials: "Invalid email or password.",

  email_exists: "An account with this email already exists.",

  email_provider_disabled: "Email authentication is currently unavailable.",

  provider_disabled: "This sign-in provider is currently unavailable.",
  email_not_confirmed: "Please verify your email address before logging in.",
};

export const getAuthErrorMessage = (error) => {
  if (!error) return "";

  if (AUTH_ERROR_MESSAGES[error.code]) {
    return AUTH_ERROR_MESSAGES[error.code];
  }

  if (error.name === "AuthRetryableFetchError") {
    return "Unable to connect to the authentication service. Please check your connection and try again.";
  }

  return "Something went wrong. Please try again.";
};
