import { Link } from "react-router-dom";
import { guestNav, userNav } from "../config/navConfig";
import { useAuth } from "../auth/AuthContext";
import { Button } from "../components/ui/button";
import Shuffle from "./ui/Shuffle";

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const navLinks = currentUser ? userNav : guestNav;

  return (
        <nav className="fixed top-0 left-0 w-full z-40">
      <div className=" mx-auto px-6 lg:px-12 flex justify-between ">
        <div className="logo flex items-center justify-between h-16">
          
          {/* Logo */}
                                                                                                            
          <a
            href="/"
            className="text-xl w-2.5 font-bold text-amber-50 hover:text-blue-300 transition-colors pt-5 "
          >
            Logo
          </a>

        </div>
          {/* Desktop Links */}
          <div className="hidden pl-15 md:flex items-center justify-evenly">
            <ul className="flex gap-4">
        {navLinks.map((item) => (
          <li key={item.path}>
            <Button asChild variant="outline">
              <Link to={item.path}>
                {item.label}
              </Link>
            </Button>
          </li>
        ))}
      </ul>
        <Shuffle
  text="Hello World"
  shuffleDirection="right"
  duration={0.35}
  animationMode="evenodd"
  shuffleTimes={1}
  ease="power3.out"
  stagger={0.03}
  threshold={0.1}
  triggerOnce={true}
  triggerOnHover={true}
  respectReducedMotion={true}
/>

      {currentUser && (
        <Button variant="destructive" onClick={logout}>
          Logout
        </Button>
      )}

          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-emerald-950 font-semibold">
            Menu
          </button>

      </div>
    </nav>
  );
};

export default Navbar;
