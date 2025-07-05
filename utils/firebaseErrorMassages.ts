// utils/firebaseErrorMessages.ts
export const getFirebaseAuthErrorMessage = (code: string): string => {
  const errorMap: Record<string, string> = {
    "auth/invalid-email": "The email address is badly formatted.",
    "auth/user-disabled": "This user account has been disabled.",
    "auth/user-not-found": "No account found with this email.",
    "auth/wrong-password": "Incorrect password.",
    "auth/network-request-failed":
      "Network error. Please check your internet connection.",
    "auth/too-many-requests": "Too many failed attempts. Try again later.",
    "auth/internal-error": "An internal error occurred. Please try again.",
    "auth/email-already-in-use": "This email is already in use.",
    "auth/weak-password": "The password is too weak.",
    "auth/missing-password": "Please enter your password.",
    "auth/invalid-credential": "Incorrect email or password.",
    // Add more mappings as needed
  };

  return errorMap[code] ?? "An unexpected error occurred. Please try again.";
};
