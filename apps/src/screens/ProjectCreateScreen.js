import axios from "axios";
import { useLocation, useNavigate, Link } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Helmet } from "react-helmet-async";
import React, { useState, useEffect, useContext, useReducer } from "react";
import { toast } from "react-toastify";
import { getError } from "../utils";
import { Store } from "../Store";
import reducer from "../components/Reducer";

export default function ProjectCreateScreen() {
  const navigate = useNavigate();
  const [{ loading, error, users, loadingDelete, successDelete }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: "",
    });

  const { state } = useContext(Store);
  const { userInfo } = state;

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_USER_REQUEST" });
        const { data } = await axios.get(`/api/users`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: "FETCH_USER_SUCCESS", payload: data });
      } catch (err) {
        dispatch({
          type: "FETCH_FAIL",
          payload: getError(err),
        });
      }
    };
    if (successDelete) {
      dispatch({ type: "DELETE_RESET" });
    } else {
      fetchData();
    }
  }, [userInfo, successDelete]);

  const { search } = useLocation();

  const [name, setName] = useState("");
  const [pm, setPM] = useState("");
  const [pmID, setPMID] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        "/api/projects/create",
        {
          name,
          pm,
          pmID,
          description,
          deadline,
        },
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
      navigate("/homepage");
    } catch (err) {
      toast.error(getError(err));
    }
  };
  return (
    <Container className="small-container">
      <Helmet>
        <title>Create Project</title>
      </Helmet>
      <h1 className="my-3">Create Project</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group className="mb-3" controlId="name">
          <Form.Label>Project Name</Form.Label>
          <Form.Control onChange={(e) => setName(e.target.value)} required />
        </Form.Group>
        <Form.Group className="mb-3" controlId="role">
          <Form.Select
            onChange={(e) =>
              setPM(
                e.target.value.slice(
                  e.target.value.indexOf(",") + 1,
                  e.target.value.indexOf("-") - 1
                )
              )
            }
            onClick={(e) =>
              setPMID(e.target.value.slice(0, e.target.value.indexOf(",")))
            }
          >
            <option>Choose...</option>
            {loadingDelete && <div>Loading</div>}
            {loading ? (
              <>Loading</>
            ) : error ? (
              { error }
            ) : (
              <>
                {users?.map(
                  (user) =>
                    user.role !== "Admin" && (
                      <option key={user._id} value={[user._id, user.name, "-"]}>
                        {user.name}
                      </option>
                    )
                )}
              </>
            )}
          </Form.Select>
        </Form.Group>
        <Form.Group className="mb-3" controlId="description">
          <Form.Label>Description</Form.Label>
          <Form.Control
            type="text"
            required
            onChange={(e) => setDescription(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="deadline">
          <Form.Label>Deadline</Form.Label>
          <Form.Control
            type="Date"
            required
            onChange={(e) => setDeadline(e.target.value)}
          />
        </Form.Group>
        <div style={{ display: "flex", justifyContent: "flex-start" }}>
          <Link to="/homepage">
            <Button>Back</Button>
          </Link>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginLeft: "445px",
            }}
          >
            <Button type="submit">Create</Button>
          </div>
        </div>
      </Form>
    </Container>
  );
}
