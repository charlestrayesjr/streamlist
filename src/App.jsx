import {
  Outlet,
  Route,
  Routes,
} from "react-router-dom"

import Navigation from "./components/Navigation"
import InstallPWA from "./components/InstallPWA"
import ProtectedRoute from "./components/ProtectedRoute"

import Login from "./pages/Login"
import StreamList from "./pages/StreamList"
import Movies from "./pages/Movies"
import Cart from "./pages/Cart"
import CreditCard from "./pages/CreditCard"

function ProtectedLayout() {
  return (
    <div className="app">
      <Navigation />

      <main className="main-content">
        <Outlet />
      </main>

      <InstallPWA />

      <footer className="footer">
        <p>
          EZTechMovie
          StreamList
        </p>

        <p>
          Secure Progressive Web
          Application
        </p>
      </footer>
    </div>
  )
}

function App() {
  return (
    <Routes>
      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        element={
          <ProtectedRoute />
        }
      >
        <Route
          element={
            <ProtectedLayout />
          }
        >
          <Route
            path="/"
            element={
              <StreamList />
            }
          />

          <Route
            path="/movies"
            element={
              <Movies />
            }
          />

          <Route
            path="/cart"
            element={
              <Cart />
            }
          />

          <Route
            path="/credit-card"
            element={
              <CreditCard />
            }
          />
        </Route>
      </Route>
    </Routes>
  )
}

export default App