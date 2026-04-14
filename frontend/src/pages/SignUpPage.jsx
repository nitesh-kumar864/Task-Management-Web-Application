import { motion } from "framer-motion";
import Input from "../components/Input";
import toast from "react-hot-toast";
import { Loader, Lock, Mail, User, Eye,EyeOff } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PasswordStrengthMeter from "../components/PasswordStrengthMeter";
import { useAuthStore } from "../store/authStore";

const SignUpPage = () => {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);

	const { signup, isLoading } = useAuthStore();
	const navigate = useNavigate();

	const [formErr, setFormErr] = useState({
		name: "",
		email: "",
		password: "",
	});

	const strongPasswordRegex =
		/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()[\]{}\-_=+|;:'",.<>/\\]).{8,}$/;

	const validateForm = () => {
		const errs = {};

		if (!name.trim()) {
			errs.name = "Full name is required";
		} else if (name.trim().length < 3) {
			errs.name = "Name must be at least 3 characters";
		}

		if (!email.trim()) {
			errs.email = "Email is required";
		} else if (!/\S+@\S+\.\S+/.test(email)) {
			errs.email = "Enter a valid email address";
		}

		if (!password.trim()) {
			errs.password = "Password is required";
		} else if (!strongPasswordRegex.test(password)) {
			errs.password =
				"Password must be 8+ chars with uppercase, lowercase, number & special character";
		}

		setFormErr(errs);
		return Object.keys(errs).length === 0;
	};

	const handleSignUp = async (e) => {
		e.preventDefault();
		if (!validateForm()) return;

		try {
			await signup(email, password, name);
			toast.success("OTP sent to your email");
			navigate("/verify-email");
		} catch (err) {
			toast.error(
				err?.response?.data?.message || "Signup failed. Try again."
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
					Create Account
				</h2>

				<form onSubmit={handleSignUp}>
					{/* Name */}
					<Input
						icon={User}
						type="text"
						placeholder="Full Name"
						value={name}
						error={!!formErr.name}
						onChange={(e) => {
							setName(e.target.value);
							setFormErr({ ...formErr, name: "" });
						}}
					/>

					{formErr.name && (
						<p className="text-red-400 text-xs mt-1">
							{formErr.name}
						</p>
					)}

					{/* Email */}
					<Input
						icon={Mail}
						type="email"
						placeholder="Email Address"
						value={email}
						error={!!formErr.email}
						onChange={(e) => {
							setEmail(e.target.value);
							setFormErr({ ...formErr, email: "" });
						}}
					/>

					{formErr.email && (
						<p className="text-red-400 text-xs mt-1">
							{formErr.email}
						</p>
					)}

					{/* Password */}
					<div className="relative">
						<Input
							icon={Lock}
							type={showPassword ? "text" : "password"}
							placeholder="Password"
							value={password}
							error={!!formErr.password}
							onChange={(e) => {
								setPassword(e.target.value);
								setFormErr({ ...formErr, password: "" });
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

					{formErr.password && (
						<p className="text-red-400 text-xs mt-1">
							{formErr.password}
						</p>
					)}

					{/* Strength meter */}
					<PasswordStrengthMeter password={password} />

					<motion.button
						className="mt-5 w-full py-3 px-4 bg-gradient-to-r 
						from-green-500 to-emerald-600 text-white font-bold rounded-lg 
						shadow-lg hover:from-green-600 hover:to-emerald-700 transition"
						whileHover={{ scale: 1.02 }}
						whileTap={{ scale: 0.98 }}
						type="submit"
						disabled={isLoading}
					>
						{isLoading ? (
							<Loader className="animate-spin mx-auto" size={24} />
						) : (
							"Sign Up"
						)}
					</motion.button>
				</form>
			</div>

			<div className="px-8 py-4 bg-gray-900 bg-opacity-50 flex justify-center">
				<p className="text-sm text-gray-400">
					Already have an account?{" "}
					<Link to="/login" className="text-green-400 hover:underline">
						Login
					</Link>
				</p>
			</div>
		</motion.div>
	);
};

export default SignUpPage;
