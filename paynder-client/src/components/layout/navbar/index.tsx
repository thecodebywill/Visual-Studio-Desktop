import { Link, useLocation } from "@tanstack/react-router";
import styles from "./navbar.module.css";

const NavLink = ({ href, text }: { href: string; text: string }) => {
  const isHomePage = useLocation().pathname === "/";

  return (
    <li>
      {isHomePage ? (
        <a href={`${href}`}>{text}</a>
      ) : (
        <Link to={`${href}`}>{text}</Link>
      )}
    </li>
  );
};

const Navbar = () => {
  return (
    <nav>
      <Link to="/" className={styles.logo}>
        Paynder
      </Link>
      <ul>
        <NavLink href="/#product" text="Product" />
        <NavLink href="/#about" text="About" />
        <NavLink href="/#contact" text="Contact us" />
        <li>
          <Link to="/dashboard">Launch Beta</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
