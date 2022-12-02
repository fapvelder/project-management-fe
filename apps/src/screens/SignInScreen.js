import { useLocation, useNavigate } from "react-router-dom";
import { Container, Form, Button } from "react-bootstrap";
import React, { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useState, useContext } from "react";
import axios from "axios";
import { Store } from "../Store";
import { toast } from "react-toastify";
import { getError } from "../utils";
export default function SignInScreen() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get("redirect");
  const redirect = redirectInUrl ? redirectInUrl : "/homepage";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { state } = useContext(Store);
  const { userInfo } = state;
  const { dispatch: ctxDispatch } = useContext(Store);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("/api/users/signin", {
        email,
        password,
      });
      ctxDispatch({ type: "USER_SIGNIN", payload: data });
      localStorage.setItem("userInfo", JSON.stringify(data));
      navigate(redirect || "/homepage");
    } catch (err) {
      toast.error(getError(err));
    }
  };
  useEffect(() => {
    if (userInfo) {
      navigate("/homepage");
    }
  });
  return (
    <Container className="small-container">
      <Helmet>
        <title>Sign In</title>
      </Helmet>
      <Form
        onSubmit={submitHandler}
        style={{ width: "30%", marginLeft: "35%" }}
      >
        <h1 style={{ marginLeft: "35%" }}>Sign In</h1>
        <Form.Group className="mb-3" controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            required
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            required
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
        <div className="mb-3">
          <Button type="submit">Sign In</Button>
        </div>
      </Form>
    </Container>
  );
}
