import React, { useState } from "react";
import {
  CssBaseline,
  Box,
  FormLabel,
  FormControl,
  Typography,
  Stack,
  Card as MuiCard,
} from "@mui/material";

import { styled } from "@mui/material/styles";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import TextfieldWrapper from "../components/Textfield";
import ButtonWrapper from "../components/Button";
import axios from "../api/axios";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const PWD_RULES = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{5,12}$/;

const REGISTER_URL = "/users";

const Card = styled(MuiCard)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  width: "100%",
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: "auto",
  [theme.breakpoints.up("sm")]: {
    maxWidth: "450px",
  },
}));

const SignInContainer = styled(Stack)(({ theme }) => ({
  padding: 20,
  marginTop: "10vh",
  "&::before": {
    content: '""',
    display: "block",
    position: "absolute",
    zIndex: -1,
    inset: 0,
    backgroundImage:
      "radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))",
    backgroundRepeat: "no-repeat",
  },
}));

const initialFormState = {
  name: "",
  email: "",
  password: "",
};

const formValidation = Yup.object().shape({
  name: Yup.string().required("Please enter your name"),
  email: Yup.string()
    .email("Please enter a valid email")
    .required("Please enter your email"),
  password: Yup.string()
    .matches(PWD_RULES, {
      message:
        "Password must contain minimum 5 characters with atleast 1 uppercase letter, 1 lowercase letter, and 1 number",
    })
    .required("Please enter your password"),
});

const Register = () => {
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    try {
      const response = await axios.post(
        REGISTER_URL,
        JSON.stringify({
          name: values.name,
          email: values.email,
          password: values.password,
        }),
        {
          headers: { "Content-Type": "application/json" },
          // withCredentials: true,
        }
      );
      console.log(JSON.stringify(response?.data));
      navigate("/");
      toast.success(
        "You are registered. Please login with your new credentials."
      );
    } catch (err) {
      if (!err?.response) {
        console.log(err);
        toast.error(`${err}`);
      } else if (err.response?.status === 409) {
        toast.error("Username Taken");
      } else {
        toast.error("Registration Failed");
      }
    }
  };

  return (
    <>
      <CssBaseline />
      <SignInContainer direction="column" justifyContent="space-between">
        <Card variant="outlined">
          <Typography
            component="h1"
            variant="h4"
            sx={{
              width: "100%",
              fontSize: "clamp(1rem, 10vw, 1rem)",
              fontWeight: "bold",
            }}
          >
            Sign up
          </Typography>

          {/* formik form */}
          <Formik
            initialValues={{
              ...initialFormState,
            }}
            validationSchema={formValidation}
            onSubmit={handleSubmit}
          >
            <Form>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  width: "100%",
                  gap: 3,
                }}
              >
                <FormControl>
                  <FormLabel htmlFor="name" sx={{ marginTop: 0 }}>
                    Name
                  </FormLabel>
                  <TextfieldWrapper
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Emily"
                    required
                  />
                </FormControl>
                <FormControl>
                  <FormLabel htmlFor="email" sx={{ marginTop: 0 }}>
                    Email
                  </FormLabel>
                  <TextfieldWrapper
                    type="email"
                    id="email"
                    name="email"
                    placeholder="john@gmail.com"
                    required
                  />
                </FormControl>
                <FormControl>
                  <FormLabel htmlFor="password" sx={{ marginTop: 0 }}>
                    Password
                  </FormLabel>
                  <TextfieldWrapper
                    type="password"
                    id="password"
                    name="password"
                    placeholder="••••••"
                    required
                  />
                </FormControl>

                <ButtonWrapper type="submit">Sign up</ButtonWrapper>

                <Typography sx={{ textAlign: "center" }}>
                  Don&apos;t have an account?{" "}
                  <span>
                    <Link style={{ color: "inherit" }} to={"/"}>
                      Login
                    </Link>
                  </span>
                </Typography>
              </Box>
            </Form>
          </Formik>
        </Card>
      </SignInContainer>
    </>
  );
};

export default Register;
