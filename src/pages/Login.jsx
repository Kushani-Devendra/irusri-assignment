import React, { useContext, useState } from "react";
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
import AuthContext from "../context/AuthProvider";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const LOGIN_URL = "/login";

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
  email: "",
  password: "",
};

const formValidation = Yup.object().shape({
  email: Yup.string()
    .email("Please enter a valid email")
    .required("Please enter your email"),
  password: Yup.string().required("Please enter your password"),
});

const Login = () => {
  const { setAuth } = useContext(AuthContext);

  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    try {
      const response = await axios.post(
        LOGIN_URL,
        JSON.stringify({ email: values.email, password: values.password }),
        {
          headers: { "Content-Type": "application/json" },
          // withCredentials: true,
        }
      );
      console.log(JSON.stringify(response?.data));
      const accessToken = response?.data?.token;
      setAuth({ email: values.email, password: values.password, accessToken });

      setSuccess(true);
      navigate("/home");
      toast.success("Login Successful");
    } catch (err) {
      if (!err?.response) {
        console.log(err);
        toast.error(err + "No Server Response");
      } else if (err.response?.status === 400) {
        toast.error("Missing Email or Password");
      } else if (err.response?.status === 401) {
        toast.error("Unauthorized");
      } else {
        toast.error("Login Failed");
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
            Sign in
          </Typography>

          {/* formik form */}
          <Formik
            initialValues={{
              ...initialFormState,
            }}
            validationSchema={formValidation}
            onSubmit={handleSubmit}
          >
            {({ values }) => (
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
                    <FormLabel htmlFor="email" sx={{ marginTop: 0 }}>
                      Email
                    </FormLabel>
                    <TextfieldWrapper
                      type="email"
                      id="email"
                      name="email"
                      placeholder="john@gmail.com"
                      // autoComplete="off"
                      // onChange={(e) => setEmail(e.target.value)}
                      // value={email}
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
                      // onChange={(e) => setPwd(e.target.value)}
                      // value={pwd}
                      required
                    />
                  </FormControl>

                  <ButtonWrapper type="submit">Sign in</ButtonWrapper>

                  <Typography sx={{ textAlign: "center" }}>
                    Don&apos;t have an account?{" "}
                    <span>
                      <Link style={{ color: "inherit" }} to={"/register"}>
                        Register
                      </Link>
                    </span>
                  </Typography>
                </Box>
              </Form>
            )}
          </Formik>
        </Card>
      </SignInContainer>
    </>
  );
};

export default Login;
