import {
  createContext,
  useContext,
  useState,
} from "react";

const AuthContext = createContext(null);

const AUTH_KEY = "eztechmovie-auth-user";

function decodeJwtPayload(token) {
  try {
    const payload = token.split(".")[1];

    const base64 = payload
      .replace(/-/g, "+")
      .replace(/_/g, "/");

    const padded = base64.padEnd(
      base64.length + ((4 - (base64.length % 4)) % 4),
      "="
    );

    const binary = atob(padded);

    const bytes = Uint8Array.from(
      binary,
      (character) => character.charCodeAt(0)
    );

    const decoded = new TextDecoder().decode(bytes);

    return JSON.parse(decoded);
  } catch (error) {
    console.error(
      "Unable to read Google credential:",
      error
    );

    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = sessionStorage.getItem(
        AUTH_KEY
      );

      return savedUser
        ? JSON.parse(savedUser)
        : null;
    } catch {
      return null;
    }
  });

  const loginWithGoogle = (credential) => {
    const profile = decodeJwtPayload(
      credential
    );

    if (!profile) {
      return false;
    }

    const authenticatedUser = {
      id: profile.sub,
      name: profile.name || "Google User",
      email: profile.email || "",
      picture: profile.picture || "",
    };

    sessionStorage.setItem(
      AUTH_KEY,
      JSON.stringify(authenticatedUser)
    );

    setUser(authenticatedUser);

    return true;
  };

  const logout = () => {
    sessionStorage.removeItem(AUTH_KEY);

    setUser(null);

    if (window.google?.accounts?.id) {
      window.google.accounts.id.disableAutoSelect();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loginWithGoogle,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}