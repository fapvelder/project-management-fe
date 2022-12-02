import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import { Helmet } from "react-helmet-async";
import React, { useState, useContext } from "react";
import { toast } from "react-toastify";
import { getError } from "../utils";
import { Store } from "../Store";
import { MDBBtn } from "mdb-react-ui-kit";
import "mdb-react-ui-kit/dist/css/mdb.min.css";

export default function SignupScreen() {
  const { state } = useContext(Store);
  const { userInfo } = state;
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        "/api/users/create",
        {
          name,
          email,
          password,
        },
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
      navigate("/admin/userlist");
    } catch (err) {
      toast.error(getError(err));
    }
  };

  return (
    <Container className="small-container">
      <Helmet>
        <title>Create User</title>
      </Helmet>
      <h1 className="my-3">Create User</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group className="mb-3" controlId="name">
          <Form.Label>Name</Form.Label>
          <Form.Control onChange={(e) => setName(e.target.value)} required />
        </Form.Group>
        <Form.Group className="mb-3" controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control required onChange={(e) => setEmail(e.target.value)} />
        </Form.Group>
        <Form.Group className="mb-3" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            required
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
        <div style={{ display: "flex", justifyContent: "flex-start" }}>
          <Link to="/admin/userlist">
            <MDBBtn>Back</MDBBtn>
          </Link>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginLeft: "445px",
            }}
          >
            <MDBBtn type="submit">Create</MDBBtn>
          </div>
        </div>
      </Form>
    </Container>
  );
}
