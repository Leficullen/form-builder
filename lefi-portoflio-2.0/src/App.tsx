import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import About from "./pages/About";
import Projects from "./pages/Projects";
import Contact from "./pages/Contact";

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0.5, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -24 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full "
      >
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

function App() {
  return (
    <Router>
      <div className="min-h-screen w-full bg-black relative flex flex-col items-center justify-start pt-28 p-4">
        {/* Scrollable Background - Covers entire content height */}
        <div
          className="absolute inset-0 bg-gradient-to-b from-yellow-400 via-pink-500 via-red-600 to-yellow-400 opacity-15 pointer-events-none animate-gradient-flow"
          style={{
            maskImage: `
              linear-gradient(to right, black 2px, transparent 2px),
              linear-gradient(to bottom, black 2px, transparent 2px)
            `,
            maskSize: "40px 40px",
            WebkitMaskImage: `
              linear-gradient(to right, black 2px, transparent 2px),
              linear-gradient(to bottom, black 2px, transparent 2px)
            `,
            WebkitMaskSize: "40px 40px",
            position: "fixed", // Keep background fixed
            height: "100vh",
            width: "100vw",
          }}
        ></div>

        <Navbar/>

        <AnimatedRoutes />
      </div>
    </Router>
  );
}

export default App;
