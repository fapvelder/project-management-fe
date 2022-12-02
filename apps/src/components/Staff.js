import React, { useContext, useEffect, useReducer } from "react";
import {
  MDBBtn,
  MDBTable,
  MDBTableHead,
  MDBTableBody,
  MDBInput,
} from "mdb-react-ui-kit";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import "mdb-react-ui-kit/dist/css/mdb.min.css";
import sortTable from "./sortTable";
import { toast } from "react-toastify";
import { Store } from "../Store";
import { getError } from "../utils";
import axios from "axios";
import reducer from "../components/Reducer";
import Search from "./Search";
import Form from "react-bootstrap/Form";

export default function Staff() {
  let i = 1;
  const navigate = useNavigate();
  const [{ projects, tasks, successDelete }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
  });
  let classname = {
    New: "New badge bg-info",
    "In Progress": "IP badge bg-warning",
    Done: "Done badge bg-success",
    Approved: "Approved badge bg-primary",
  };
  const { state } = useContext(Store);
  const { userInfo } = state;
  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_PROJECT_REQUEST" });
        const { data } = await axios.get(`/api/projects`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: "FETCH_PROJECT_SUCCESS", payload: data });
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
    if (!userInfo) {
      navigate("/");
    }
  }, [userInfo, successDelete, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_TASK_REQUEST" });
        const { data } = await axios.get(`/api/tasks`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: "FETCH_TASK_SUCCESS", payload: data });
      } catch (err) {
        dispatch({
          type: "FETCH_FAIL",
          payload: getError(err),
        });
      }
    };
    fetchData();
  }, [userInfo]);

  const deleteHandler = async (project) => {
    if (window.confirm("Are you sure to delete?")) {
      try {
        dispatch({ type: "DELETE_REQUEST" });
        await axios.delete(`/api/projects/${project._id}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        toast.success("Project deleted successfully");
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
      <Form.Group className="mb-3" style={{ marginTop: "10px" }}>
        <MDBInput
          onKeyUp={() => Search("myStaffTable", 2)}
          type="text"
          id="myInput"
          label="Search for project manager..."
        />
      </Form.Group>
      <MDBTable id="myStaffTable">
        <MDBTableHead className="table-dark">
          <tr>
            <th onClick={() => sortTable("myStaffTable", 0)}>ID</th>
            <th onClick={() => sortTable("myStaffTable", 1)}>
              Name of project
            </th>
            <th onClick={() => sortTable("myStaffTable", 2)}>
              Project Manager
            </th>
            <th onClick={() => sortTable("myStaffTable", 3)}>Description</th>
            <th onClick={() => sortTable("myStaffTable", 4)}>Created At</th>
            <th onClick={() => sortTable("myStaffTable", 5)}>Updated At</th>
            <th onClick={() => sortTable("myStaffTable", 6)}>Deadline</th>
            <th onClick={() => sortTable("myStaffTable", 7)}>Status</th>
            <th>Actions</th>
          </tr>
        </MDBTableHead>
        <MDBTableBody>
          <>
            {tasks !== undefined &&
              tasks?.map((task) =>
                projects?.map(
                  (project) =>
                    userInfo &&
                    userInfo._id === task.assigneeID &&
                    task.pID === project._id && (
                      <tr key={project._id}>
                        <td>{i++}</td>
                        <td>{project.name}</td>
                        <td>{project.pm}</td>
                        <td>{project.description}</td>
                        <td>
                          {moment(project.createdAt).format("DD/MM/YYYY")}
                        </td>
                        <td>
                          {moment(project.updatedAt).format("DD/MM/YYYY")}
                        </td>
                        <td>{moment(project.deadline).format("DD/MM/YYYY")}</td>
                        <td>
                          <span className={classname[project.status]}>
                            {project.status}
                          </span>
                        </td>
                        <td>
                          <MDBBtn
                            color="link"
                            type="button"
                            variant="light"
                            onClick={() => navigate(`/project/${project._id}`)}
                          >
                            View
                          </MDBBtn>
                        </td>
                        {userInfo && userInfo.role === "Admin" && (
                          <td>
                            <MDBBtn
                              color="link"
                              type="button"
                              variant="light"
                              onClick={() => deleteHandler(project)}
                            >
                              Delete
                            </MDBBtn>
                          </td>
                        )}
                      </tr>
                    )
                )
              )}
          </>
        </MDBTableBody>
      </MDBTable>
    </div>
  );
}
