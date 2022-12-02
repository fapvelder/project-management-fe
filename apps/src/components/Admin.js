import React, {
  useContext,
  useEffect,
  useReducer,
  useState,
  Fragment,
} from "react";
import {
  MDBBtn,
  MDBTable,
  MDBTableHead,
  MDBTableBody,
  MDBInput,
} from "mdb-react-ui-kit";
import moment from "moment";
import { useNavigate, Link } from "react-router-dom";
import "mdb-react-ui-kit/dist/css/mdb.min.css";
import sortTable from "./sortTable";
import { toast } from "react-toastify";
import { Store } from "../Store";
import { getError } from "../utils";
import axios from "axios";
import reducer from "../components/Reducer";
import Chart from "react-apexcharts";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Search from "./Search";
export default function Admin() {
  const navigate = useNavigate();
  const [{ projects, successDelete }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
  });

  const { state } = useContext(Store);
  const { userInfo } = state;
  let i = 1;
  let index = 1;
  let countNew = 0;
  let countIP = 0;
  let countDone = 0;
  let countApp = 0;
  let projectNew, projectIP, projectDone, projectApp;
  let classname = {
    New: "New badge bg-info",
    "In Progress": "IP badge bg-warning",
    Done: "Done badge bg-success",
    Approved: "Approved badge bg-primary",
  };
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [data, setData] = useState({});
  const [active, setActive] = useState(0);

  const pagination2 = (e) => {
    setActive(e);
    setPage(e + 1);
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_PROJECT_REQUEST" });
        const { data } = await axios.get(`/api/projects/admin?page=${page}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        if (data) {
          setPageCount(data.pagination.pageCount);
        }
        dispatch({ type: "FETCH_PROJECT_SUCCESS", payload: data });
        setData(data);
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
  }, [userInfo, successDelete, navigate, page]);
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
      <MDBBtn style={{ marginRight: "975px" }} type="button" variant="primary">
        <Link style={{ color: "white" }} to="/project/create/">
          Create Project
        </Link>
      </MDBBtn>
      <MDBBtn variant="primary" onClick={handleShow}>
        Projects Report
      </MDBBtn>
      <Form.Group className="mb-3" style={{ marginTop: "10px" }}>
        <MDBInput
          onKeyUp={() => Search("myTable", 2)}
          type="text"
          id="myInput"
          label="Search for project manager..."
        />
      </Form.Group>
      <MDBTable id="myTable" style={{ marginTop: "10px" }}>
        <MDBTableHead className="table-dark">
          <tr>
            <th onClick={() => sortTable("myTable", 0)}>ID</th>
            <th onClick={() => sortTable("myTable", 1)}>Name of project</th>
            <th onClick={() => sortTable("myTable", 2)}>Project Manager</th>
            <th onClick={() => sortTable("myTable", 3)}>Description</th>
            <th onClick={() => sortTable("myTable", 4)}>Created At</th>
            <th onClick={() => sortTable("myTable", 5)}>Updated At</th>
            <th onClick={() => sortTable("myTable", 6)}>Deadline</th>
            <th onClick={() => sortTable("myTable", 7)}>Status</th>
            <th>Actions</th>
          </tr>
        </MDBTableHead>
        <MDBTableBody>
          {data.projects?.map((project) => (
            <tr key={project._id}>
              <td>{i++}</td>
              <td>{project.name}</td>
              <td>{project.pm}</td>
              <td>{project.description}</td>
              <td>{moment(project.createdAt).format("DD/MM/YYYY")}</td>
              <td>{moment(project.updatedAt).format("DD/MM/YYYY")}</td>
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
                {userInfo && userInfo.role === "Admin" && (
                  <MDBBtn
                    color="link"
                    type="button"
                    variant="light"
                    onClick={() => deleteHandler(project)}
                  >
                    Delete
                  </MDBBtn>
                )}
              </td>
            </tr>
          ))}
        </MDBTableBody>
      </MDBTable>
      <div>
        {data.projects?.map((project) =>
          project.status === "New" ? (
            <var key={index++}>
              {console.debug(countNew++)}
              {console.debug(
                (projectNew = Math.round((countNew / (i - 1)) * 10000) / 100)
              )}
              {console.debug(projectNew)}
            </var>
          ) : project.status === "In Progress" ? (
            <var key={index++}>
              {console.debug(countIP++)}
              {console.debug(
                (projectIP = Math.round((countIP / (i - 1)) * 10000) / 100)
              )}
              {console.debug(countIP)}
            </var>
          ) : project.status === "Done" ? (
            <var key={index++}>
              {console.debug(countDone++)}
              {console.debug(
                (projectDone = Math.round((countDone / (i - 1)) * 10000) / 100)
              )}
              {console.debug(projectDone)}
            </var>
          ) : (
            project.status === "Approved" && (
              <var key={index++}>
                {console.debug(countApp++)}
                {console.debug(
                  (projectApp = Math.round((countApp / (i - 1)) * 10000) / 100)
                )}
                {console.debug(projectApp)}
              </var>
            )
          )
        )}
      </div>

      <Modal show={show} onHide={handleClose} className="container-fluid">
        <Modal.Header closeButton>
          <Modal.Title>Projects report for Admin</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Chart
            type="donut"
            width={500}
            height={500}
            series={[countNew, countIP, countDone, countApp]}
            options={{
              labels: ["New", "In Progress", "Done", "Approved"],
            }}
          ></Chart>
          <div>There are {projectNew || 0}% projects New</div>
          <div>There are {projectIP || 0}% projects In Progress</div>
          <div>There are {projectDone || 0}% projects Done</div>
          <div>There are {projectApp || 0}% projects Approved</div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      <div>
        <ul
          className="pagination"
          id="pagination"
          style={{ width: "55px", height: "36px", marginLeft: "550px" }}
        >
          {Array(pageCount)
            .fill(null)
            .map((_, index) => {
              return (
                <li
                  key={index}
                  className={`page-item ${active === index && "active"}`}
                  onClick={() => pagination2(index)}
                >
                  {index + 1}
                </li>
              );
            })}
        </ul>
      </div>
    </div>
  );
}
