import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import type { Variants } from "framer-motion";
const navItems = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Projects", href: "/projects" },
  { label: "Contact", href: "/contact" },
];
const Navbar = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const lastScrollY = useRef(0);
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY.current && currentScrollY > 50) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      lastScrollY.current = currentScrollY;
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return (
    <div
      className={`fixed top-8 left-1/2 -translate-x-1/2 z-50 transition-transform duration-300 ${
        isVisible ? "translate-y-0" : "-translate-y-32"
      }`}
    >
      <div className="relative p-[2px] rounded-full overflow-hidden">
        {/* Rotating Gradient Border */}
        <div className="absolute inset-[-100%] animate-[spin_5s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#FACC15_0%,#EC4899_33%,#DC2626_66%,#FACC15_100%)] opacity-100" />
        {/* Inner Content */}
        <div className="relative z-10 bg-black rounded-full px-20 py-4 flex items-center justify-center gap-8">
          {navItems.map((item, index) => (
            <Link
              key={index}
              to={item.href}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="relative text-white/80 hover-text-gradient transition-all duration-300 text-sm tracking-wide font-bold hover:scale-105"
            >
              {item.label}
              {/* Sliding Underline Logic */}
              <AnimatePresence>
                {hoveredIndex === index && (
                  <motion.div
                    layoutId="navbar-underline"
                    className="absolute -bottom-1 left-0 right-0 h-[1px] bg-gradient-to-r from-[#facc15] via-[#ec4899] to-[#dc2626]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 40,
                    }}
                  />
                )}
              </AnimatePresence>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
export default Navbar;
