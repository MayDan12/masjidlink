import {
  useState,
  useEffect,
  createContext,
  useContext,
  ReactNode,
} from "react";

import {
  User,
  UserCredential,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  GoogleAuthProvider,
  signInWithPopup,
  getIdToken,
  getIdTokenResult,
  ParsedToken,
} from "firebase/auth";
import { auth } from "@/firebase/client"; // Import from your firebase.ts file
// import { removeToken, setToken } from "./action";

// Extended user interface with tokens
interface AuthUser extends User {
  accessToken?: string;
  refreshToken: string;
  tokenClaims?: ParsedToken | null;
}

// Define context types
interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  error: Error | null;
  signIn: (email: string, password: string) => Promise<UserCredential>;
  signInWithGoogle: () => Promise<UserCredential>;
  signUp: (
    email: string,
    password: string,
    role: string
  ) => Promise<UserCredential>;
  signOut: () => Promise<void>;
  getAccessToken: () => Promise<string | null>;
  refreshUser: () => Promise<void>;
}

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  error: null,
  signIn: async () => {
    throw new Error("AuthContext not yet initialized");
  },
  signInWithGoogle: async () => {
    throw new Error("AuthContext not yet initialized");
  },
  signUp: async () => {
    throw new Error("AuthContext not yet initialized");
  },
  signOut: async () => {
    throw new Error("AuthContext not yet initialized");
  },
  getAccessToken: async () => null,
  refreshUser: async () => {
    throw new Error("AuthContext not yet initialized");
  },
});

// Auth provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const processAndSetUser = async (firebaseUser: User | null) => {
    try {
      if (firebaseUser) {
        const accessToken = await getIdToken(firebaseUser, true); // Force refresh token
        const tokenResult = await getIdTokenResult(firebaseUser);
        const refreshToken = firebaseUser.refreshToken;

        const authUser: AuthUser = {
          ...firebaseUser,
          accessToken,
          refreshToken,
          tokenClaims: tokenResult.claims,
        };

        // Call API to set cookies
        await fetch("/api/auth/set-cookies", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            accessToken,
            refreshToken: firebaseUser.refreshToken,
            userId: firebaseUser.uid,
          }),
        });

        setUser(authUser);
      } else {
        // User is signed out
        await fetch("/api/auth/clear-cookies", { method: "POST" });
        setUser(null);
      }
    } catch (err) {
      console.error("Error processing user data:", err);
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      // Don't set loading to false here, let onAuthStateChanged handle it for initial load
      // For refreshUser, we will manage loading separately
    }
  };

  // Set up auth state listener for initial load and Firebase-triggered changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true); // Ensure loading is true while checking auth state
      await processAndSetUser(firebaseUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);
  // Set up auth state listener
  // useEffect(() => {
  //   const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
  //     try {
  //       if (firebaseUser) {
  //         // Get the ID token
  //         const accessToken = await getIdToken(firebaseUser, true);
  //         const tokenResult = await getIdTokenResult(firebaseUser);
  //         const refreshToken = firebaseUser.refreshToken;
  //         // Create extended user object with tokens
  //         const authUser: AuthUser = {
  //           ...firebaseUser,
  //           accessToken,
  //           refreshToken,
  //           tokenClaims: tokenResult.claims,
  //         };

  //         await fetch("/api/auth/set-cookies", {
  //           method: "POST",
  //           headers: {
  //             "Content-Type": "application/json",
  //           },
  //           body: JSON.stringify({
  //             accessToken,
  //             refreshToken: firebaseUser.refreshToken,
  //             userId: firebaseUser.uid,
  //           }),
  //         });

  //         // if (accessToken && refreshToken) {
  //         //   await setToken({ accessToken, refreshToken });
  //         // }

  //         setUser(authUser);
  //       } else {
  //         // User is signed out
  //         // Clear cookies via API route
  //         await fetch("/api/auth/clear-cookies", { method: "POST" });
  //         setUser(null);
  //         // await removeToken();
  //         // setUser(null);
  //       }
  //     } catch (error) {
  //       console.error("Auth state change error:", error);
  //       setError(error instanceof Error ? error : new Error(String(error)));
  //     } finally {
  //       setLoading(false);
  //     }
  //   });

  //   // Clean up subscription
  //   return () => unsubscribe();
  // }, []);

  // Sign in with email/password
  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      return await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error("Sign in error:", error);
      setError(error instanceof Error ? error : new Error(String(error)));
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Sign in with Google
  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      setError(null);
      const provider = new GoogleAuthProvider();
      return await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Google sign in error:", error);
      setError(error instanceof Error ? error : new Error(String(error)));
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Sign up with email/password
  const signUp = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      return await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error("Sign up error:", error);
      setError(error instanceof Error ? error : new Error(String(error)));
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      setLoading(true);
      await firebaseSignOut(auth);
    } catch (error) {
      console.error("Sign out error:", error);
      setError(error instanceof Error ? error : new Error(String(error)));
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Get fresh access token
  const getAccessToken = async () => {
    if (!auth.currentUser) return null;
    try {
      return await getIdToken(auth.currentUser, true);
    } catch (error) {
      console.error("Token refresh error:", error);
      setError(error instanceof Error ? error : new Error(String(error)));
      return null;
    }
  };

  const refreshUser = async () => {
    if (!auth.currentUser) {
      console.log("No current user to refresh.");
      return;
    }

    setLoading(true); // Indicate loading state
    setError(null); // Clear previous errors

    try {
      // 1. Force reload the Firebase Authentication user object
      await auth.currentUser.reload();

      // 2. Re-process and set the user based on the reloaded auth.currentUser
      // The onAuthStateChanged listener might re-fire, but this ensures explicit update
      await processAndSetUser(auth.currentUser);

      console.log("AuthContext: Firebase user data refreshed.");
    } catch (err) {
      console.error("Error refreshing user data in AuthContext:", err);
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false); // End loading state
    }
  };

  // Provide context values
  const contextValue: AuthContextType = {
    user,
    loading,
    error,
    signIn,
    signInWithGoogle,
    signUp,
    signOut,
    getAccessToken,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

// Custom hook to use auth
export const useAuth = () => useContext(AuthContext);
