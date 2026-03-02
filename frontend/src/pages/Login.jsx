import { useState } from "react";
import API from "../api/Axios";
import toast from "react-hot-toast";
import { useNavigate, Link } from "react-router";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const {data} = await API.post("/auth/login" , { email, password });

      if(!data.success){
        toast.error(data.message || "login failed");
        return;
      }

      localStorage.setItem("userInfo", JSON.stringify(data.user));
      localStorage.setItem("token" , data.token);

      toast.success("Login Successful 🚀");

      navigate("/");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Login Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-linear-to-br from-[#0f2027] via-[#203a43] to-[#2c5364]">
      <div className="bg-white/10 backdrop-blur-lg shadow-xl rounded-2xl p-8 w-96 border border-white/20">
        <h2 className="text-xl md:text-3xl font-bold text-white text-center mb-6">
          Welcome Back 👋
        </h2>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-cyan-500 hover:bg-cyan-600 text-white py-3 rounded-lg font-semibold transition duration-300"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className=" text-sm md:text-lg text-gray-300 text-center mt-4">
          Don’t have an account?{" "}
          <Link to="/register" className="text-cyan-400 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;