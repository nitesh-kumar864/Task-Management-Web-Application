import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  return (
  <div className="fixed top-0 left-0 w-full z-50 px-6 py-4 bg-gray-900 border-b border-gray-800 flex justify-between items-center">

      {/* LEFT */}
      <h1
        onClick={() => navigate("/")}
        className="text-xl font-bold text-white cursor-pointer"
      >
        Task Manager
      </h1>

      {/* RIGHT */}
      <div className="flex items-center gap-4">

        <span
          className="text-sm text-gray-300 hidden sm:block cursor-pointer hover:text-white"
        >
          {user?.name}
        </span>

        <button
          onClick={() => navigate("/profile")}
          className="px-4 py-1.5 text-sm rounded-lg bg-green-500/20 text-green-400 
          hover:bg-green-500 hover:text-white transition"
        >
          Profile
        </button>

      </div>
    </div>
  );
};

export default Navbar;