import {
  useState,
} from "react";

import {
  useNavigate,
} from "react-router";

import {
  GoogleLogin,
} from "@react-oauth/google";

import {
  jwtDecode,
} from "jwt-decode";

function Login({ onLogin }) {
  const navigate = useNavigate();

  const [error, setError] =
    useState("");

  const handleSuccess = (
    credentialResponse
  ) => {
    try {
      if (
        !credentialResponse.credential
      ) {
        throw new Error(
          "Google did not return a credential."
        );
      }

      const profile = jwtDecode(
        credentialResponse.credential
      );

      const user = {
        id: profile.sub,
        name:
          profile.name ||
          "Google User",
        email:
          profile.email || "",
        picture:
          profile.picture || "",
      };

      onLogin(user);

      navigate("/");
    } catch (loginError) {
      console.error(loginError);

      setError(
        "Google sign in could not be completed."
      );
    }
  };

  const handleError = () => {
    setError(
      "Google sign in failed. Please try again."
    );
  };

  return (
    <main className="page login-page">
      <section className="login-panel">
        <div className="login-logo">
          S
        </div>

        <p className="eyebrow">
          EZTECHMOVIE
        </p>

        <h1>StreamList</h1>

        <p className="login-intro">
          Sign in with your Google
          account to access the
          StreamList application.
        </p>

        <div className="google-login">
          <GoogleLogin
            onSuccess={
              handleSuccess
            }
            onError={
              handleError
            }
            theme="filled_black"
            size="large"
            text="signin_with"
            shape="rectangular"
          />
        </div>

        {error && (
          <p
            className="status-message"
            role="alert"
          >
            {error}
          </p>
        )}
      </section>
    </main>
  );
}

export default Login;