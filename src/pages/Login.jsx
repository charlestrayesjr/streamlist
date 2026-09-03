import {
  useEffect,
  useRef,
  useState,
} from "react"

import {
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom"

import {
  useAuth,
} from "../context/AuthContext"

function Login() {
  const googleButtonRef =
    useRef(null)

  const [error, setError] =
    useState("")

  const {
    user,
    loginWithGoogle,
  } = useAuth()

  const navigate =
    useNavigate()

  const location =
    useLocation()

  const clientId =
    import.meta.env
      .VITE_GOOGLE_CLIENT_ID

  const destination =
    location.state?.from || "/"

  useEffect(() => {
    if (user) {
      return
    }

    if (
      !clientId ||
      clientId.includes(
        "YOUR_GOOGLE"
      )
    ) {
      setError(
        "Google Client ID is missing. Add VITE_GOOGLE_CLIENT_ID to your .env file."
      )

      return
    }

    let intervalId

    const setupGoogleLogin =
      () => {
        if (
          !window.google
            ?.accounts?.id ||
          !googleButtonRef.current
        ) {
          return false
        }

        window.google.accounts.id
          .initialize({
            client_id:
              clientId,

            callback:
              (
                response
              ) => {
                if (
                  !response
                    .credential
                ) {
                  setError(
                    "Google sign in did not return a credential."
                  )

                  return
                }

                const success =
                  loginWithGoogle(
                    response
                      .credential
                  )

                if (
                  success
                ) {
                  navigate(
                    destination,
                    {
                      replace:
                        true,
                    }
                  )
                } else {
                  setError(
                    "Google authentication failed."
                  )
                }
              },
          })

        googleButtonRef.current
          .replaceChildren()

        window.google.accounts.id
          .renderButton(
            googleButtonRef.current,
            {
              type:
                "standard",
              theme:
                "filled_black",
              size:
                "large",
              text:
                "signin_with",
              shape:
                "rectangular",
              logo_alignment:
                "left",
              width: 280,
            }
          )

        return true
      }

    if (!setupGoogleLogin()) {
      intervalId =
        window.setInterval(
          () => {
            if (
              setupGoogleLogin()
            ) {
              window.clearInterval(
                intervalId
              )
            }
          },
          200
        )
    }

    return () => {
      if (intervalId) {
        window.clearInterval(
          intervalId
        )
      }
    }
  }, [
    clientId,
    destination,
    loginWithGoogle,
    navigate,
    user,
  ])

  if (user) {
    return (
      <Navigate
        to="/"
        replace
      />
    )
  }

  return (
    <main className="login-page">
      <section className="login-card">
        <div className="login-logo">
          EZ
        </div>

        <p className="eyebrow">
          EZTechMovie
        </p>

        <h1>
          Welcome to StreamList
        </h1>

        <p className="login-description">
          Sign in with your
          Google account to
          access your StreamList,
          movie search, shopping
          cart, and checkout.
        </p>

        <div
          className="google-button"
          ref={
            googleButtonRef
          }
        />

        {error && (
          <p className="error-message">
            {error}
          </p>
        )}

        <p className="login-security">
          Authentication is
          required before the
          application can be
          accessed.
        </p>
      </section>
    </main>
  )
}

export default Login