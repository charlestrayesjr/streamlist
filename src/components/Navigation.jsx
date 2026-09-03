import {
  NavLink,
} from "react-router";

function Navigation({
  user,
  onLogout,
}) {
  return (
    <header className="header">
      <div className="brand">
        <span className="logo">
          S
        </span>

        <h1>StreamList</h1>
      </div>

      <div className="nav-right">
        <nav
          className="navigation"
          aria-label="Main navigation"
        >
          <NavLink
            to="/"
            end
          >
            StreamList
          </NavLink>

          <NavLink to="/movies">
            Movies
          </NavLink>

          <NavLink to="/cart">
            Cart
          </NavLink>

          <NavLink to="/about">
            About
          </NavLink>
        </nav>

        <div className="user-area">
          <span>
            {user?.name}
          </span>

          <button
            type="button"
            className="logout-button"
            onClick={
              onLogout
            }
          >
            Log Out
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navigation;