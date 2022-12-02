import axios from "axios";
import React, { useContext, useEffect, useReducer, useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import { Helmet } from "react-helmet-async";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Store } from "../Store";
import { getError } from "../utils";
import reducer from "../components/Reducer";

export default function UserScreen() {
  const [{ loading, error, loadingUpdate }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
  });

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;
  const params = useParams();
  const { id: userId } = params;
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState("");
  const [publicID, setPublicID] = useState("");

  const [fileInputState, setFileInputState] = useState("");
  const [previewSource, setPreviewSource] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_USER_REQUEST" });
        const { data } = await axios.get(`/api/users/${userId}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        setName(data.name);
        setEmail(data.email);
        setAvatar(data.avatar);
        setPublicID(data.publicID);
        dispatch({ type: "FETCH_USER_SUCCESS" });
      } catch (err) {
        dispatch({
          type: "FETCH_FAIL",
          payload: getError(err),
        });
      }
    };
    fetchData();
  }, [userId, userInfo, navigate]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      dispatch({ type: "UPDATE_REQUEST" });
      await axios.put(
        `/api/users/${userId}`,
        {
          _id: userId,
          name,
          email,
          avatar,
          publicID,
        },
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({ type: "UPDATE_SUCCESS" });
      toast.success("User updated successfully");
    } catch (err) {
      dispatch({ type: "UPDATE_FAIL" });
      toast.error(getError(err));
    }
    if (!previewSource) return;
    uploadImage(previewSource);
  };
  const deleteAvatarHandler = async (e) => {
    e.preventDefault();
    try {
      dispatch({ type: "UPDATE_REQUEST" });
      await axios.put(
        `/api/users/deleteImage/${userId}`,
        {
          _id: userId,
          avatar,
          publicID,
        },
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({ type: "UPDATE_SUCCESS" });
      toast.success("User updated successfully");
    } catch (err) {
      dispatch({ type: "UPDATE_FAIL" });
      toast.error(getError(err));
    }
  };
  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    previewFile(file);
  };
  const previewFile = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setPreviewSource(reader.result);
    };
  };

  const uploadImage = async (base64EncodedImage) => {
    try {
      await fetch(`/api/users/${userId}`, {
        method: "PUT",
        body: JSON.stringify({ data: base64EncodedImage }),
        headers: {
          authorization: `Bearer ${userInfo.token}`,
          "Content-Type": "application/json",
        },
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Container className="small-container">
      <Helmet>
        <title>User Profile</title>
      </Helmet>
      {loading ? (
        <div>Loading</div>
      ) : error ? (
        { error }
      ) : (
        <div>
          <h1 className="my-3">User Profile</h1>
          <form onSubmit={submitHandler}>
            <Form.Group className="mb-3" controlId="name">
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                value={name}
                required
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                value={email}
                required
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>

            <input
              type={"file"}
              id="image"
              name="image"
              onChange={handleFileInputChange}
              value={fileInputState}
              className="form-input"
              style={{ display: "none" }}
            />

            <label htmlFor="image">
              {previewSource ? (
                <img
                  src={previewSource}
                  alt="chosen"
                  style={{ height: "200px", width: "200px" }}
                />
              ) : (
                <img alt="" src={avatar} style={{ height: "200px" }} />
              )}
            </label>
            <br />

            <div className="mt-2 ">
              <Button
                style={{ marginTop: "10px" }}
                onClick={deleteAvatarHandler}
              >
                Delete Image
              </Button>

              <Button style={{ marginLeft: "1030px" }} type="submit">
                Update
              </Button>
            </div>
          </form>
        </div>
      )}
    </Container>
  );
}
