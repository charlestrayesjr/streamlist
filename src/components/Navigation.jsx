import {
  NavLink,
} from "react-router-dom"

import {
  useAuth,
} from "../context/AuthContext"

function Navigation() {
  const {
    user,
    logout,
  } = useAuth()

  const linkClass = ({
    isActive,
  }) =>
    isActive
      ? "nav-link active"
      : "nav-link"

  return (
    <header className="header">
      <div className="brand">
        <div className="logo">
          EZ
        </div>

        <div>
          <h1>
            EZTechMovie
          </h1>

          <p>
            StreamList
          </p>
        </div>
      </div>

      <nav className="navigation">
        <NavLink
          to="/"
          className={
            linkClass
          }
        >
          StreamList
        </NavLink>

        <NavLink
          to="/movies"
          className={
            linkClass
          }
        >
          Movies
        </NavLink>

        <NavLink
          to="/cart"
          className={
            linkClass
          }
        >
          Cart
        </NavLink>
      </nav>

      <div className="auth-user">
        {user?.picture && (
          <img
            src={
              user.picture
            }
            alt={
              user.name
            }
          />
        )}

        <div className="auth-details">
          <strong>
            {user?.name}
          </strong>

          <span>
            {user?.email}
          </span>
        </div>

        <button
          className="logout-button"
          onClick={logout}
        >
          Log Out
        </button>
      </div>
    </header>
  )
}

export default Navigation