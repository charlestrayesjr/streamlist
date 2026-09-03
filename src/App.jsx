import {
  useState,
} from "react";

import {
  Routes,
  Route,
  Navigate,
} from "react-router";

import Navigation from "./components/Navigation";
import StreamList from "./pages/StreamList";
import Movies from "./pages/Movies";
import Cart from "./pages/Cart";
import About from "./pages/About";
import Login from "./pages/Login";
import CreditCard from "./pages/CreditCard";

function getStoredUser() {
  try {
    const storedUser =
      sessionStorage.getItem(
        "streamlistUser"
      );

    return storedUser
      ? JSON.parse(storedUser)
      : null;
  } catch {
    return null;
  }
}

function ProtectedRoute({
  user,
  children,
}) {
  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  return children;
}

function App() {
  const [user, setUser] =
    useState(getStoredUser);

  const handleLogin = (
    userProfile
  ) => {
    sessionStorage.setItem(
      "streamlistUser",
      JSON.stringify(
        userProfile
      )
    );

    setUser(userProfile);
  };

  const handleLogout = () => {
    sessionStorage.removeItem(
      "streamlistUser"
    );

    setUser(null);

    if (
      window.google
        ?.accounts
        ?.id
    ) {
      window.google.accounts.id
        .disableAutoSelect();
    }
  };

  return (
    <div className="app">
      {user && (
        <Navigation
          user={user}
          onLogout={
            handleLogout
          }
        />
      )}

      <Routes>
        <Route
          path="/login"
          element={
            user ? (
              <Navigate
                to="/"
                replace
              />
            ) : (
              <Login
                onLogin={
                  handleLogin
                }
              />
            )
          }
        />

        <Route
          path="/"
          element={
            <ProtectedRoute
              user={user}
            >
              <StreamList />
            </ProtectedRoute>
          }
        />

        <Route
          path="/movies"
          element={
            <ProtectedRoute
              user={user}
            >
              <Movies />
            </ProtectedRoute>
          }
        />

        <Route
          path="/cart"
          element={
            <ProtectedRoute
              user={user}
            >
              <Cart />
            </ProtectedRoute>
          }
        />

        <Route
          path="/payment"
          element={
            <ProtectedRoute
              user={user}
            >
              <CreditCard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/about"
          element={
            <ProtectedRoute
              user={user}
            >
              <About />
            </ProtectedRoute>
          }
        />

        <Route
          path="*"
          element={
            <Navigate
              to="/"
              replace
            />
          }
        />
      </Routes>
    </div>
  );
}

export default App;