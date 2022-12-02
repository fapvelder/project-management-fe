import "../App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useContext, useEffect, useReducer, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import Container from "react-bootstrap/Container";
import { GoSignOut } from "react-icons/go";
import { BsFillFilePersonFill } from "react-icons/bs";
import { Store } from "../Store";
import reducer from "../components/Reducer";
import axios from "axios";
import { getError } from "../utils";

export default function NavigationBar() {
  const [{ loading, error, loadingUpdate }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
  });
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;
  const params = useParams();
  const { id: userId } = params;
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  let profile;
  const signoutHandler = () => {
    ctxDispatch({ type: "USER_SIGNOUT" });
    localStorage.removeItem("userInfo");
    window.location.href = "/";
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_USER_REQUEST" });
        const { data } = await axios.get(`/api/users/${userInfo._id}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        setName(data.name);
        setRole(data.role);
        // setEmail(data.email);
        // setAvatar(data.avatar);
        dispatch({ type: "FETCH_USER_SUCCESS" });
      } catch (err) {
        dispatch({
          type: "FETCH_FAIL",
          payload: getError(err),
        });
      }
    };
    fetchData();
  }, [userId, userInfo]);

  return (
    <Navbar bg="primary" variant="outline-dark" expand="lg">
      <Container>
        <Navbar.Collapse id="basic-navbar-nav">
          {userInfo ? (
            <Link to="/homepage">
              <Navbar.Brand className="t-dark">Project Management</Navbar.Brand>
            </Link>
          ) : (
            <Link to="/">
              <Navbar.Brand className="t-dark">Project Management</Navbar.Brand>
            </Link>
          )}
          {userInfo && role === "Admin" && (
            <div className="manage-user">
              <Link className="t-dark" to="/admin/userlist">
                Manage Users
              </Link>
            </div>
          )}
          <Nav className="me-auto w-100 justify-content-end">
            {userInfo && (
              <NavDropdown title={name} id="basic-nav-dropdown">
                {console.debug((profile = `/user/${userInfo._id}`))}
                <Link className="dropdown-item text-dark" to={profile}>
                  <BsFillFilePersonFill />
                  User Profile
                </Link>

                <NavDropdown.Divider />
                <Link
                  className="dropdown-item text-dark"
                  to="#signout"
                  onClick={signoutHandler}
                >
                  <GoSignOut />
                  Sign Out
                </Link>
              </NavDropdown>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
