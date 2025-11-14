import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";

import { mountBSportWidget } from "../../utils/mountWidget";

const Navbar: React.FC = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navRef = useRef<HTMLUListElement>(null);
  const burgerRef = useRef<HTMLButtonElement>(null);
  const widgetMountedRef = useRef(false);

  const isActive = (path: string) => {
    return location.pathname === path ? "active" : "";
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        navRef.current &&
        burgerRef.current &&
        !navRef.current.contains(event.target as Node) &&
        !burgerRef.current.contains(event.target as Node)
      ) {
        closeMenu();
      }
    };

    if (isMenuOpen) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isMenuOpen]);

  useEffect(() => {
    // We don't use the hook useBsportWidget because we want the login button being rendered only once
    if (!widgetMountedRef.current) {
      widgetMountedRef.current = true;
      mountBSportWidget({
        parentElement: "bsport-widget-navbar-login",
        companyId: 2,
        franchiseId: null,
        dialogMode: 1,
        widgetType: "loginButton",
        showFab: false,
        fullScreenPopup: false,
        styles: undefined,
        config: {
          loginButton: { openMemberProfile: true },
        },
      });
    }
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <Link to="/" className="navbar-brand">
          Widget Debugger (SPA)
        </Link>
        <button
          ref={burgerRef}
          className={`burger-menu ${isMenuOpen ? "active" : ""}`}
          onClick={toggleMenu}
          aria-label="Toggle navigation menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
        <ul ref={navRef} className={`navbar-nav ${isMenuOpen ? "active" : ""}`}>
          <li>
            <Link
              to="/"
              className={`nav-link ${isActive("/")}`}
              onClick={closeMenu}
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/passes"
              className={`nav-link ${isActive("/passes")}`}
              onClick={closeMenu}
            >
              Passes
            </Link>
          </li>
          <li>
            <Link
              to="/member-area"
              className={`nav-link ${isActive("/member-area")}`}
              onClick={closeMenu}
            >
              Member Area
            </Link>
          </li>
        </ul>
        <div id="bsport-widget-navbar-login"></div>
      </div>
    </nav>
  );
};

export default Navbar;
