import { useState } from "react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { Mail, Lock, Eye,EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../components/Input";
import { useAuthStore } from "../store/authStore";

const LoginPage = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);

	const [errors, setErrors] = useState({
		email: "",
		password: "",
	});

	const { login, isLoading } = useAuthStore();
	const navigate = useNavigate();

	const validateForm = () => {
		const errs = {};

		if (!email.trim()) {
			errs.email = "Email is required";
		} else if (!/\S+@\S+\.\S+/.test(email)) {
			errs.email = "Enter a valid email address";
		}

		if (!password.trim()) {
			errs.password = "Password is required";
		}
		setErrors(errs);
		return Object.keys(errs).length === 0;
	};

	const handleLogin = async (e) => {
		e.preventDefault();
		if (!validateForm()) return;

		try {
			await login(email, password);
			toast.success("Login successful");
			navigate("/");
		} catch (err) {
			toast.error(
				err?.response?.data?.message || "Invalid email or password"
			);
		}
	};

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
			className="max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-blur-xl 
			rounded-2xl shadow-xl overflow-hidden"
		>
			<div className="p-8">
				<h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r 
				from-green-400 to-emerald-500 text-transparent bg-clip-text">
					Welcome Back
				</h2>

				<form onSubmit={handleLogin}>
					{/* Email */}
					<Input
						icon={Mail}
						type="email"
						placeholder="Email Address"
						value={email}
						error={!!errors.email}
						onChange={(e) => {
							setEmail(e.target.value);
							setErrors({ ...errors, email: "" });
						}}
					/>

					{errors.email && (
						<p className="text-red-400 text-xs mt-1">
							{errors.email}
						</p>
					)}

					{/* Password */}
					<div className="relative mt-4">
						<Input
							icon={Lock}
							type={showPassword ? "text" : "password"}
							placeholder="Password"
							value={password}
							error={!!errors.password}
							onChange={(e) => {
								setPassword(e.target.value);
								setErrors({ ...errors, password: "" });
							}}
						/>
						
						<span
							onClick={() => setShowPassword(!showPassword)}
							className="absolute right-4 top-1/2 -translate-y-1/2 
							text-sm text-emerald-400 cursor-pointer select-none"
						>
							  {showPassword ? <EyeOff size={20 } /> : < Eye size={20} />}
						</span>
					</div>

					{errors.password && (
						<p className="text-red-400 text-xs mt-1">
							{errors.password}
						</p>
					)}

					<div className="flex justify-end mb-6 mt-2">
						<Link
							to="/forgot-password"
							className="text-sm text-green-400 hover:underline"
						>
							Forgot password?
						</Link>
					</div>

					<motion.button
						whileHover={{ scale: 1.02 }}
						whileTap={{ scale: 0.98 }}
						className="w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 
						text-white font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700 
						transition duration-200"
						type="submit"
						disabled={isLoading}
					>
						{isLoading ? "Logging in..." : "Login"}
					</motion.button>
				</form>
			</div>

			<div className="px-8 py-4 bg-gray-900 bg-opacity-50 flex justify-center">
				<p className="text-sm text-gray-400">
					Don't have an account?{" "}
					<Link to="/signup" className="text-green-400 hover:underline">
						Sign up
					</Link>
				</p>
			</div>
		</motion.div>
	);
};

export default LoginPage;
