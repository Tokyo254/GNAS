import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const NotFound: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 px-6">
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <h1 className="text-9xl font-extrabold text-blue-400 drop-shadow-lg">404</h1>
        <p className="mt-4 text-2xl font-semibold text-gray-800">
          Oops! Page not found.
        </p>
        <p className="mt-2 text-gray-500">
          The page you’re looking for doesn’t exist or has been moved.
        </p>

        <div className="mt-6">
          <Link
            to="/"
            className="inline-block px-6 py-3 text-white bg-blue-400 rounded-lg shadow-md hover:bg-blue-500 transition"
          >
            Go Back Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;
