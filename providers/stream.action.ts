export const tokenProvider = async () => {
  const res = await fetch("/api/stream-token", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${await getIdTokenFromFirebase()}`,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch Stream token");

  const data = await res.json();
  return data.token;
};

// You could import Firebase here or pass the token in from the caller
const getIdTokenFromFirebase = async () => {
  const { auth } = await import("@/firebase/client");
  const user = auth.currentUser;
  if (!user) throw new Error("Not signed in");
  return await user.getIdToken();
};

// This function is used to fetch the Stream token from your backend API.
