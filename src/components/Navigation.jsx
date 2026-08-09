import { NavLink } from "react-router";

function Navigation() {
  return (
    <header className="header">
      <div className="brand">
        <span className="logo">S</span>
        <h1>StreamList</h1>
      </div>

      <nav className="navigation">
        <NavLink to="/" end>
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
    </header>
  );
}

export default Navigation;