import React, { useState } from "react";
import axios from "axios";

import "../style/register.scss";
import { toast } from "react-toastify";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Container,
  IconButton,
  InputAdornment,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

interface State {
  email: string;
  name: string;
  password: string;
  phone: string;
  loading: boolean;
  error: string;
  emailError: string;
  phoneError: string;
  passwordError: string;
  showPassword: boolean;
}

const Register = () => {
  const [state, setState] = useState<State>({
    email: "",
    name: "",
    password: "",
    phone: "",
    loading: false,
    error: "",
    emailError: "",
    phoneError: "",
    passwordError: "",
    showPassword: false, // Password hidden by default
  });

  const validateEmail = (email: string) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email) ? "" : "Invalid email format.";
  };

  const validatePhoneNo = (phoneNo: string) => {
    const phoneNoPattern =
      /^(?:\+?\d{1,3})?[ -.]?\(?\d{1,4}\)?[ -.]?\d{1,4}[ -.]?\d{1,4}[ -.]?\d{1,9}$/;
    return phoneNoPattern.test(phoneNo)
      ? ""
      : "The phone number must be in a valid format, including optional international and area codes, with 10 to 15 digits in total. Use separators like dashes, periods, or spaces as needed. Please avoid invalid characters.";
  };

  const validatePassword = (password: string) => {
    const passwordPattern =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%?&])[A-Za-z\d@$!%?&]{8,10}$/;
    return passwordPattern.test(password)
      ? ""
      : "Password must be between 8 and 10 characters long and include at least one special character, one uppercase letter, and one number.";
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const email = event.target.value;
    setState((prevState) => ({
      ...prevState,
      email,
      emailError: validateEmail(email),
    }));
  };

  const handlePhoneNoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const phone = event.target.value;
    setState((prevState) => ({
      ...prevState,
      phone,
      phoneError: validatePhoneNo(phone),
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

  const handleShowPasswordClick = () => {
    setState((prevState) => ({
      ...prevState,
      showPassword: !prevState.showPassword,
    }));
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();

    // Perform final validation before submission
    const emailError = validateEmail(state.email);
    const phoneError = validatePhoneNo(state.phone);
    const passwordError = validatePassword(state.password);

    if (emailError || phoneError || passwordError) {
      setState((prevState) => ({
        ...prevState,
        emailError,
        phoneError,
        passwordError,
      }));
      return;
    }

    const url = "http://localhost:5114/user";
    setState((prevState) => ({ ...prevState, loading: true }));

    try {
      const result = await axios.post(url, {
        email: state.email,
        phone: state.phone,
        password: state.password,
      });

      if (result.data) {
        setState({
          email: "",
          name: "",
          password: "",
          phone: "",
          loading: false,
          error: "",
          emailError: "",
          phoneError: "",
          passwordError: "",
          showPassword: false,
        });
        toast.success("Registration successful!");
      } else {
        toast.error("Invalid email, phone number, or password.");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again later.");
    } finally {
      setState((prevState) => ({ ...prevState, loading: false }));
    }
  };

  return (
    <Container
      maxWidth="sm"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
      }}
    >
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
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              margin="normal"
              id="email"
              label="Email"
              type="email"
              value={state.email}
              onChange={handleEmailChange}
              error={Boolean(state.emailError)}
              helperText={state.emailError}
            />
            <TextField
              fullWidth
              margin="normal"
              id="password"
              label="Password"
              type={state.showPassword ? "text" : "password"} // Toggle password visibility
              value={state.password}
              onChange={handlePasswordChange}
              error={Boolean(state.passwordError)}
              helperText={state.passwordError}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleShowPasswordClick}
                      edge="end"
                    >
                      {state.showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              margin="normal"
              id="phoneNo"
              label="Phone No"
              type="text"
              value={state.phone}
              onChange={handlePhoneNoChange}
              error={Boolean(state.phoneError)}
              helperText={state.phoneError}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              style={{ marginTop: "16px" }}
              disabled={state.loading}
            >
              {state.loading ? (
                <CircularProgress size={24} />
              ) : (
                "Create Account"
              )}
            </Button>
            {state.error && (
              <Typography color="error" style={{ marginTop: "16px" }}>
                {state.error}
              </Typography>
            )}
          </form>
          <Typography style={{ marginTop: "16px" }}>
            Already have an account?{" "}
            <Link href="/" color="primary">
              Sign In
            </Link>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default Register;
