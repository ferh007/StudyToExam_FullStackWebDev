import { Link } from "react-router-dom";

const NavBar = () => {
  return (
    <nav className="navbar navbar-light bg-light">
      <Link className="navbar-brand" to="/">
        Top Events
      </Link>
      <Link className="navbar-brand" to="/search">
        Search Events
      </Link>
    </nav>
  );
};

export default NavBar;
