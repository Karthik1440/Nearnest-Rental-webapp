import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { GoogleLogin } from "@react-oauth/google";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const access = Cookies.get("access");
    const redirectPath = Cookies.get("redirectAfterLogin");

    if (access) {
      if (redirectPath) {
        navigate(redirectPath);
        Cookies.remove("redirectAfterLogin"); // Clean up after redirect
      } else {
        navigate("/profile");
      }
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("http://localhost:8000/api/token/", {
        email,
        password,
      });

      Cookies.set("access", data.access, { expires: 1 });
      Cookies.set("refresh", data.refresh, { expires: 7 });

      const userRes = await axios.get("http://localhost:8000/api/user/profile/", {
        headers: { Authorization: `Bearer ${data.access}` },
      });
      Cookies.set("user", JSON.stringify(userRes.data), { expires: 7 });

      const redirectPath = Cookies.get("redirectAfterLogin");
      navigate(redirectPath || "/profile");
      Cookies.remove("redirectAfterLogin");
    } catch {
      alert("Invalid credentials. Try again.");
    }
  };

  const handleGoogleLoginSuccess = async (response) => {
    try {
      const { data } = await axios.post("http://localhost:8000/api/google-login/", {
        credential: response.credential,
      });

      Cookies.set("access", data.access, { expires: 1 });
      Cookies.set("refresh", data.refresh, { expires: 7 });
      Cookies.set("user", JSON.stringify(data.user), { expires: 7 });

      const redirectPath = Cookies.get("redirectAfterLogin");
      navigate(redirectPath || "/profile");
      Cookies.remove("redirectAfterLogin");
    } catch {
      alert("Google Login failed");
    }
  };

  return (
    <div className="p-6 max-w-sm mx-auto">
      <h2 className="text-xl font-bold mb-4">Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="block w-full mb-3 p-2 border rounded"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="block w-full mb-3 p-2 border rounded"
          required
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded w-full">
          Login
        </button>
      </form>
      <p className="text-center mt-4">
        Don’t have an account?{" "}
        <Link to="/signup" className="text-blue-600 hover:underline">
          Sign up
        </Link>
      </p>
      <div className="mt-6 text-center">
        <GoogleLogin
          onSuccess={handleGoogleLoginSuccess}
          onError={() => alert("Google Login Failed")}
        />
      </div>
    </div>
  );
}
