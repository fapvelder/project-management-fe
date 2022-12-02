import axios from "axios";
import React, { useContext, useEffect, useReducer } from "react";
import Button from "react-bootstrap/Button";
import { Helmet } from "react-helmet-async";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Store } from "../Store";
import { getError } from "../utils";
import { MDBBtn } from "mdb-react-ui-kit";
import "mdb-react-ui-kit/dist/css/mdb.min.css";
import reducer from "../components/Reducer";

export default function UserListScreen() {
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

  const deleteHandler = async (user) => {
    if (window.confirm("Are you sure to delete?")) {
      try {
        dispatch({ type: "DELETE_REQUEST" });
        await axios.delete(`/api/users/${user._id}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        toast.success("User deleted successfully");
        dispatch({ type: "DELETE_SUCCESS" });
      } catch (error) {
        toast.error(getError(error));
        dispatch({
          type: "DELETE_FAIL",
        });
      }
    }
  };
  return (
    <div>
      <Helmet>
        <title>Manage User</title>
      </Helmet>

      <MDBBtn type="button" variant="primary">
        <Link style={{ color: "white" }} to="/admin/create/">
          Create User
        </Link>
      </MDBBtn>
      {loadingDelete && <div>Loading</div>}
      {loading ? (
        <div>Loading</div>
      ) : error ? (
        { error }
      ) : (
        <table className="table" style={{ marginTop: "10px" }}>
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>NAME</th>
              <th>EMAIL</th>
              <th>Role</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {users.map(
              (user) =>
                user.role !== "Admin" && (
                  <tr key={user._id}>
                    <td>{user._id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td>
                      <Button
                        type="button"
                        variant="light"
                        onClick={() => navigate(`/admin/user/${user._id}`)}
                      >
                        Edit
                      </Button>
                      &nbsp;
                      <Button
                        type="button"
                        variant="light"
                        onClick={() => deleteHandler(user)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                )
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
