import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import GoogleIcon from "@mui/icons-material/Google";
import FacebookIcon from "@mui/icons-material/Facebook";
import AppleIcon from "@mui/icons-material/Apple";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import "../style/login.scss";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import {
  Avatar,
  Box,
  Button,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";

// interface User {
//   email: string;
//   password: string;
// }

interface State {
  email: string;
  password: string;
  loading: boolean;
  error: string;
  emailError: string;
  passwordError: string;
  success: string;
  showPassword: boolean;
}

const Login = () => {
  const [state, setState] = useState<State>({
    email: "",
    password: "",
    loading: false,
    error: "",
    emailError: "",
    passwordError: "",
    success: "",
    showPassword: false,
  });

  const { login } = useAuth();
  const navigate = useNavigate();

  const validateEmail = (email: string) => {
    if (!email) {
      return "Email is required.";
    } else if (
      !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)
    ) {
      return "Please enter a valid email address.";
    }
    return "";
  };

  const validatePassword = (password: string) => {
    if (!password) {
      return "Password is required.";
    } else if (password.length <= 8) {
      return "Password must be at least 8 characters.";
    }
    return "";
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const email = event.target.value;
    setState((prevState) => ({
      ...prevState,
      email,
      emailError: validateEmail(email),
    }));
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const password = event.target.value;
    setState((prevState) => ({
      ...prevState,
      password,
      passwordError: validatePassword(password),
    }));
  };

  const handleClickShowPassword = () => {
    setState((prevState) => ({
      ...prevState,
      showPassword: !prevState.showPassword,
    }));
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();
    const { email, password } = state;

    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    if (emailError || passwordError) {
      setState((prevState) => ({
        ...prevState,
        emailError,
        passwordError,
        error: "Please correct the errors above.",
      }));
      return;
    }

    setState((prevState) => ({
      ...prevState,
      loading: true,
      error: "",
      success: "",
    }));

    const url = "http://localhost:5114/user/login";
    setState((prevState) => ({ ...prevState, loading: true }));

    try {
      const result = await axios.post(url, {
        email: state.email,
        password: state.password,
      });

      if (result.data) {
        setState({
          email: "",
          password: "",
          loading: false,
          error: "",
          emailError: "",
          passwordError: "",
          success: "",
          showPassword: false,
        });
        toast.success("Login successful!");
        login();
        navigate("/dashBoard");
      } else {
        toast.error("Invalid email or password.");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again later.");
    } finally {
      setState((prevState) => ({ ...prevState, loading: false }));
    }

    //   const response = await axios.post("http://localhost:5114/user/login");
    //   setState((prevState) => ({ ...prevState, loading: false }));

    //   if (Array.isArray(response.data.data)) {
    //     const users = response.data.data;
    //     const user = users.find(
    //       (user: User) => user.email === email
    //     );

    //     if (user) {
    //       setState((prevState) => ({
    //         ...prevState,
    //         success: "Login successful!",
    //       }));
    //       login();
    //       navigate("/dashBoard");
    //     } else {
    //       toast.error("Invalid email or password.");
    //     }
    //   } else {
    //     toast.error("Unexpected response format from the server.");
    //   }
    // } catch (error) {
    //   toast.error("An error occurred. Please try again later.");
    // } finally {
    //   setState((prevState) => ({ ...prevState, loading: false }));
    // }
  };

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          p: 4,
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "green" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <form onSubmit={handleSubmit} style={{ width: "100%", maxWidth: 400 }}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            id="email"
            value={state.email}
            onChange={handleEmailChange}
            error={!!state.emailError}
            helperText={state.emailError}
            margin="normal"
            autoComplete="email"
          />
          <TextField
            fullWidth
            label="Password"
            type={state.showPassword ? "text" : "password"}
            id="password"
            value={state.password}
            onChange={handlePasswordChange}
            error={!!state.passwordError}
            helperText={state.passwordError}
            margin="normal"
            autoComplete="current-password"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    edge="end"
                  >
                    {state.showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={state.loading}
            sx={{ mt: 2 }}
          >
            {state.loading ? "Logging in..." : "Login"}
          </Button>
        </form>
        {state.error && (
          <Typography color="error" sx={{ mt: 2 }}>
            {state.error}
          </Typography>
        )}
        {state.success && (
          <Typography color="success.main" sx={{ mt: 2 }}>
            {state.success}
          </Typography>
        )}
        <Typography variant="body2" sx={{ mt: 2 }}>
          Don't have an account?{" "}
          <a href="/register" style={{ color: "#1976d2" }}>
            Sign Up
          </a>
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <IconButton href="#" aria-label="Google" sx={{ mr: 1 }}>
            <GoogleIcon />
          </IconButton>
          <IconButton href="#" aria-label="Facebook" sx={{ mr: 1 }}>
            <FacebookIcon />
          </IconButton>
          <IconButton href="#" aria-label="Apple">
            <AppleIcon />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;
