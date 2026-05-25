import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import { Eye, EyeOff, Heart, Mail, Lock, User, Phone, Calendar, MapPin, Briefcase, GraduationCap } from "lucide-react";
import emailjs from "@emailjs/browser";

// Interfaces for form data, user data, and errors
interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  city: string;
  occupation: string;
  education: string;
  religion: string;
  motherTongue: string;
}

interface FormErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: string;
  city?: string;
  occupation?: string;
  education?: string;
  religion?: string;
  motherTongue?: string;
  otp?: string;
}

const LoginSignupPage: React.FC = () => {
  // States
  const [mode, setMode] = useState<"login" | "signup" | "forgot">("login");
  const [forgotPasswordStep, setForgotPasswordStep] = useState<"email" | "otp" | "reset">("email");
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    city: "",
    occupation: "",
    education: "",
    religion: "",
    motherTongue: "",
  });
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState<string>("");
  const [otpInput, setOtpInput] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmNewPassword, setConfirmNewPassword] = useState<string>("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [loggedInUser, setLoggedInUser] = useState<{ firstName: string; lastName: string }>({ firstName: "", lastName: "" });

  // Regex patterns for validation
  const regexPatterns = {
    email: /^[a-zA-Z]@g\.com$/, // e.g., a@g.com
    password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    name: /^[A-Za-z\s]{2,50}$/,
    phone: /^\+91\d{10}$/, // e.g., +919876543210
    text: /^[A-Za-z\s]{2,100}$/,
    otp: /^\d{6}$/, // 6-digit OTP
  };

  // Validate form inputs
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (mode === "login") {
      if (!formData.email) newErrors.email = "Email is required";
      else if (!regexPatterns.email.test(formData.email)) newErrors.email = "Email must be in the format h@g.com (e.g., a@g.com)";
      if (!formData.password) newErrors.password = "Password is required";
      else if (!regexPatterns.password.test(formData.password))
        newErrors.password = "Password must be at least 8 characters, including one uppercase, one lowercase, one number, and one special character";
    } else if (mode === "signup") {
      if (!formData.firstName) newErrors.firstName = "First name is required";
      else if (!regexPatterns.name.test(formData.firstName)) newErrors.firstName = "First name must be 2-50 characters, letters and spaces only";
      if (!formData.lastName) newErrors.lastName = "Last name is required";
      else if (!regexPatterns.name.test(formData.lastName)) newErrors.lastName = "Last name must be 2-50 characters, letters and spaces only";
      if (!formData.phone) newErrors.phone = "Phone number is required";
      else if (!regexPatterns.phone.test(formData.phone)) newErrors.phone = "Phone number must be 10 digits with +91 prefix (e.g., +919876543210)";
      if (!formData.dateOfBirth) newErrors.dateOfBirth = "Date of birth is required";
      if (!formData.gender) newErrors.gender = "Gender is required";
      if (!formData.city) newErrors.city = "City is required";
      else if (!regexPatterns.text.test(formData.city)) newErrors.city = "City must be 2-100 characters, letters and spaces only";
      if (!formData.occupation) newErrors.occupation = "Occupation is required";
      else if (!regexPatterns.text.test(formData.occupation)) newErrors.occupation = "Occupation must be 2-100 characters, letters and spaces only";
      if (!formData.education) newErrors.education = "Education is required";
      else if (!regexPatterns.text.test(formData.education)) newErrors.education = "Education must be 2-100 characters, letters and spaces only";
      if (!formData.religion) newErrors.religion = "Religion is required";
      if (!formData.motherTongue) newErrors.motherTongue = "Mother tongue is required";
      else if (!regexPatterns.text.test(formData.motherTongue)) newErrors.motherTongue = "Mother tongue must be 2-100 characters, letters and spaces only";
      if (!formData.email) newErrors.email = "Email is required";
      else if (!regexPatterns.email.test(formData.email)) newErrors.email = "Email must be in the format h@g.com (e.g., a@g.com)";
      if (!formData.password) newErrors.password = "Password is required";
      else if (!regexPatterns.password.test(formData.password))
        newErrors.password = "Password must be at least 8 characters, including one uppercase, one lowercase, one number, and one special character";
      if (!formData.confirmPassword) newErrors.confirmPassword = "Confirm password is required";
      else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      alert("Please fill all required fields correctly.");
      return false;
    }
    return true;
  };

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors((prev) => ({ ...prev, [e.target.name]: undefined }));
  };

  // Handle login/signup submission
  const handleSubmit = () => {
    if (!validateForm()) return;
    setIsLoading(true);
    setTimeout(() => {
      if (mode === "login") {
        // Check for admin credentials
        if (formData.email === "admin@g.com" && formData.password === "Admin@123") {
          window.location.href = "/admin";
          return;
        }
        
        const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
        if (storedUser && storedUser.email === formData.email && storedUser.password === formData.password) {
          setLoggedInUser({ firstName: storedUser.firstName, lastName: storedUser.lastName });
          setIsLoggedIn(true);
          console.log("Login successful:", { email: formData.email });
        } else {
          alert("Invalid email or password");
          console.log("Login failed: Invalid credentials");
        }
      } else {
        const userData = { ...formData };
        localStorage.setItem("user", JSON.stringify(userData));
        alert("Signup successful! Please log in.");
        console.log("Signup successful:", formData);
        setMode("login");
        resetForm();
      }
      setIsLoading(false);
    }, 1000);
  };

  // Handle logout
  const handleLogout = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoggedIn(false);
      setLoggedInUser({ firstName: "", lastName: "" });
      resetForm();
      setMode("login");
      setIsLoading(false);
    }, 500);
  };

  // Reset form data
  const resetForm = () => {
    setFormData({
      email: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
      phone: "",
      dateOfBirth: "",
      gender: "",
      city: "",
      occupation: "",
      education: "",
      religion: "",
      motherTongue: "",
    });
    setErrors({});
    setForgotPasswordEmail("");
    setOtpInput("");
    setNewPassword("");
    setConfirmNewPassword("");
    setForgotPasswordStep("email");
  };

  // Generate OTP
  const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  // Handle forgot password email submission
  const handleForgotPasswordEmail = () => {
    if (!forgotPasswordEmail) {
      setErrors({ email: "Email is required" });
      alert("Email is required");
      return;
    }
    if (!regexPatterns.email.test(forgotPasswordEmail)) {
      setErrors({ email: "Email must be in the format h@g.com (e.g., a@g.com)" });
      alert("Email must be in the format h@g.com (e.g., a@g.com)");
      return;
    }

    setIsLoading(true);
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    if (storedUser && storedUser.email === forgotPasswordEmail) {
      const otp = generateOtp();
      localStorage.setItem("otpData", JSON.stringify({ email: forgotPasswordEmail, otp }));
      emailjs
        .send(
          "service_84tlz45", // Replace with your EmailJS Service ID
          "templete_79jsuul", // Replace with your EmailJS Template ID
          { to_email: forgotPasswordEmail, otp_code: otp },
          "IxOEsFVvtMZiXxQrM" // Replace with your EmailJS Public Key
        )
        .then(
          () => {
            alert("OTP sent to your email! Check your inbox.");
            console.log(`OTP sent to ${forgotPasswordEmail}: ${otp}`);
            setForgotPasswordStep("otp");
            setIsLoading(false);
          },
          (error) => {
            alert("Failed to send OTP. Please try again.");
            console.error("Failed to send OTP:", error);
            setIsLoading(false);
          }
        );
    } else {
      alert("No user found with this email");
      console.log("No user found with email:", forgotPasswordEmail);
      setIsLoading(false);
    }
  };

  // Handle OTP verification
  const handleOtpVerification = () => {
    const newErrors: FormErrors = {};
    if (!otpInput) newErrors.otp = "OTP is required";
    else if (!regexPatterns.otp.test(otpInput)) newErrors.otp = "OTP must be a 6-digit number";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      alert("Please enter a valid OTP");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const storedOtpData = JSON.parse(localStorage.getItem("otpData") || "{}");
      if (storedOtpData && storedOtpData.email === forgotPasswordEmail && storedOtpData.otp === otpInput) {
        console.log("OTP verified for:", forgotPasswordEmail);
        setForgotPasswordStep("reset");
      } else {
        alert("Invalid OTP");
        console.log("Invalid OTP for:", forgotPasswordEmail);
      }
      setIsLoading(false);
    }, 500);
  };

  // Handle password reset
  const handlePasswordReset = () => {
    const newErrors: FormErrors = {};
    if (!newPassword) newErrors.password = "New password is required";
    else if (!regexPatterns.password.test(newPassword))
      newErrors.password = "Password must be at least 8 characters, including one uppercase, one lowercase, one number, and one special character";
    if (!confirmNewPassword) newErrors.confirmPassword = "Confirm password is required";
    else if (newPassword !== confirmNewPassword) newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      alert("Please fill all required fields correctly.");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
      if (storedUser && storedUser.email === forgotPasswordEmail) {
        alert(`Your old password was: ${storedUser.password}`);
        storedUser.password = newPassword;
        localStorage.setItem("user", JSON.stringify(storedUser));
        localStorage.removeItem("otpData");
        alert("Password reset successful! Please log in.");
        console.log("Password reset successful for:", forgotPasswordEmail);
        setMode("login");
        resetForm();
      } else {
        alert("User not found");
        console.log("User not found for:", forgotPasswordEmail);
      }
      setIsLoading(false);
    }, 1000);
  };

  // Render input field with icon
  const renderInput = (name: keyof FormData, placeholder: string, type: string, icon: React.ReactNode, showToggle?: boolean, value?: string, onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void) => (
    <div className="relative">
      {icon}
      <input
        type={showToggle && (showPassword || showConfirmPassword || showNewPassword || showConfirmNewPassword) ? "text" : type}
        name={name}
        placeholder={placeholder}
        value={value !== undefined ? value : formData[name]}
        onChange={onChange || handleInputChange}
        className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent bg-white/80 transition-all duration-300"
        required
      />
      {showToggle && (
        <button
          type="button"
          onClick={() => {
            if (name === "password") setShowPassword(!showPassword);
            else if (name === "confirmPassword") setShowConfirmPassword(!showConfirmPassword);
            // Handle password visibility toggles for forgot password flow
          }}
          className="absolute right-2 top-2 text-gray-400 hover:text-gray-600"
        >
          {(name === "password" && showPassword) ||
          (name === "confirmPassword" && showConfirmPassword) ? (
            <EyeOff className="h-5 w-5" />
          ) : (
            <Eye className="h-5 w-5" />
          )}
        </button>
      )}
      {errors[name] && <p className="text-red-500 text-xs mt-1">{errors[name]}</p>}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white/90 rounded-2xl shadow-lg p-6">
        <div className="text-center mb-6">
          <div className="flex justify-center items-center mb-2">
            <Heart className="h-8 w-8 text-rose-600 animate-pulse" />
            <h1 className="text-2xl font-bold text-rose-700 ml-2">Shaadi Match</h1>
          </div>
          <p className="text-gray-600 text-sm">Find Your Perfect Partner</p>
        </div>

        {isLoggedIn ? (
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Welcome, {loggedInUser.firstName || "User"} {loggedInUser.lastName}!
            </h2>
            <button
              onClick={handleLogout}
              disabled={isLoading}
              className={`w-full bg-rose-600 text-white py-2 rounded-lg hover:bg-rose-700 transition-all duration-300 flex items-center justify-center ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {isLoading && <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>}
              Logout
            </button>
          </div>
        ) : (
          <>
            {mode !== "forgot" && (
              <div className="flex mb-6">
                <button
                  onClick={() => setMode("login")}
                  className={`flex-1 py-2 text-center font-medium ${mode === "login" ? "text-rose-600 border-b-2 border-rose-600" : "text-gray-600 hover:text-rose-600"}`}
                >
                  Login
                </button>
                <button
                  onClick={() => setMode("signup")}
                  className={`flex-1 py-2 text-center font-medium ${mode === "signup" ? "text-rose-600 border-b-2 border-rose-600" : "text-gray-600 hover:text-rose-600"}`}
                >
                  Sign Up
                </button>
              </div>
            )}

            {mode === "forgot" ? (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  {forgotPasswordStep === "email" ? "Forgot Password" : forgotPasswordStep === "otp" ? "Verify OTP" : "Reset Password"}
                </h2>
                {forgotPasswordStep === "email" && (
                  <>
                    {renderInput(
                      "email" as keyof FormData,
                      "Enter your email (e.g., a@g.com)",
                      "email",
                      <Mail className="absolute left-2 top-2 h-5 w-5 text-gray-400" />,
                      false,
                      forgotPasswordEmail,
                      (e) => {
                        setForgotPasswordEmail(e.target.value);
                        setErrors((prev) => ({ ...prev, email: undefined }));
                      }
                    )}
                    <button
                      onClick={handleForgotPasswordEmail}
                      disabled={isLoading}
                      className={`w-full bg-rose-600 text-white py-2 rounded-lg hover:bg-rose-700 transition-all duration-300 flex items-center justify-center ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      {isLoading && <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>}
                      Send OTP
                    </button>
                  </>
                )}
                {forgotPasswordStep === "otp" && (
                  <>
                    {renderInput(
                      "otp" as keyof FormData,
                      "Enter 6-digit OTP",
                      "text",
                      null,
                      false,
                      otpInput,
                      (e) => {
                        setOtpInput(e.target.value);
                        setErrors((prev) => ({ ...prev, otp: undefined }));
                      }
                    )}
                    <button
                      onClick={handleOtpVerification}
                      disabled={isLoading}
                      className={`w-full bg-rose-600 text-white py-2 rounded-lg hover:bg-rose-700 transition-all duration-300 flex items-center justify-center ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      {isLoading && <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>}
                      Verify OTP
                    </button>
                  </>
                )}
                {forgotPasswordStep === "reset" && (
                  <>
                    {renderInput(
                      "newPassword" as keyof FormData,
                      "New Password",
                      "password",
                      <Lock className="absolute left-2 top-2 h-5 w-5 text-gray-400" />,
                      true,
                      newPassword,
                      (e) => {
                        setNewPassword(e.target.value);
                        setErrors((prev) => ({ ...prev, password: undefined }));
                      }
                    )}
                    {renderInput(
                      "confirmNewPassword" as keyof FormData,
                      "Confirm New Password",
                      "password",
                      <Lock className="absolute left-2 top-2 h-5 w-5 text-gray-400" />,
                      true,
                      confirmNewPassword,
                      (e) => {
                        setConfirmNewPassword(e.target.value);
                        setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
                      }
                    )}
                    <button
                      onClick={handlePasswordReset}
                      disabled={isLoading}
                      className={`w-full bg-rose-600 text-white py-2 rounded-lg hover:bg-rose-700 transition-all duration-300 flex items-center justify-center ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      {isLoading && <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>}
                      Reset Password
                    </button>
                  </>
                )}
                <button
                  onClick={() => setMode("login")}
                  className="w-full text-rose-600 hover:text-rose-700 text-sm font-medium mt-2"
                >
                  Back to Login
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {mode === "signup" && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      {renderInput("firstName", "First Name *", "text", <User className="absolute left-2 top-2 h-5 w-5 text-gray-400" />)}
                      {renderInput("lastName", "Last Name *", "text", <User className="absolute left-2 top-2 h-5 w-5 text-gray-400" />)}
                    </div>
                    {renderInput("phone", "Phone Number (e.g., +919876543210) *", "tel", <Phone className="absolute left-2 top-2 h-5 w-5 text-gray-400" />)}
                    <div className="grid grid-cols-2 gap-4">
                      {renderInput("dateOfBirth", "Date of Birth *", "date", <Calendar className="absolute left-2 top-2 h-5 w-5 text-gray-400" />)}
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent bg-white/80 transition-all duration-300"
                        required
                      >
                        <option value="">Select Gender *</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </select>
                      {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender}</p>}
                    </div>
                    {renderInput("city", "City *", "text", <MapPin className="absolute left-2 top-2 h-5 w-5 text-gray-400" />)}
                    <div className="grid grid-cols-2 gap-4">
                      {renderInput("occupation", "Occupation *", "text", <Briefcase className="absolute left-2 top-2 h-5 w-5 text-gray-400" />)}
                      {renderInput("education", "Education *", "text", <GraduationCap className="absolute left-2 top-2 h-5 w-5 text-gray-400" />)}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <select
                        name="religion"
                        value={formData.religion}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent bg-white/80 transition-all duration-300"
                        required
                      >
                        <option value="">Select Religion *</option>
                        <option value="hindu">Hindu</option>
                        <option value="muslim">Muslim</option>
                        <option value="christian">Christian</option>
                        <option value="sikh">Sikh</option>
                        <option value="buddhist">Buddhist</option>
                        <option value="jain">Jain</option>
                        <option value="other">Other</option>
                      </select>
                      {errors.religion && <p className="text-red-500 text-xs mt-1">{errors.religion}</p>}
                      {renderInput("motherTongue", "Mother Tongue *", "text", null)}
                    </div>
                  </>
                )}
                {renderInput("email", "Email Address (e.g., a@g.com) *", "email", <Mail className="absolute left-2 top-2 h-5 w-5 text-gray-400" />)}
                {renderInput("password", "Password *", "password", <Lock className="absolute left-2 top-2 h-5 w-5 text-gray-400" />, true)}
                {mode === "signup" && renderInput("confirmPassword", "Confirm Password *", "password", <Lock className="absolute left-2 top-2 h-5 w-5 text-gray-400" />, true)}
                <button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className={`w-full bg-rose-600 text-white py-2 rounded-lg hover:bg-rose-700 transition-all duration-300 flex items-center justify-center ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {isLoading && <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>}
                  {mode === "login" ? "Login" : "Create Account"}
                </button>
                {mode === "login" && (
                  <button
                    onClick={() => setMode("forgot")}
                    className="w-full text-rose-600 hover:text-rose-700 text-sm font-medium mt-2"
                  >
                    Forgot your password?
                  </button>
                )}
                <p className="text-center text-gray-600 text-sm mt-2">
                  {mode === "login" ? "Don't have an account?" : "Already have an account?"}
                  <button
                    onClick={() => setMode(mode === "login" ? "signup" : "login")}
                    className="text-rose-600 hover:text-rose-700 font-medium ml-1"
                  >
                    {mode === "login" ? "Sign up" : "Login"}
                  </button>
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

// Initialize EmailJS
emailjs.init("IxOEsFVvtMZiXxQrM"); // Replace with your EmailJS Public Key

const root = createRoot(document.getElementById("root")!);
root.render(<LoginSignupPage />);

// Add Tailwind animations
const style = document.createElement("style");
style.innerHTML = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fade-in {
    animation: fadeIn 0.5s ease-out;
  }
`;
document.head.appendChild(style);