import axios from "axios";
import React, { useContext, useEffect, useReducer, useState } from "react";
import Container from "react-bootstrap/Container";
import { Helmet } from "react-helmet-async";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Store } from "../Store";
import { getError } from "../utils";
import { Row, Col, ListGroup, Form, Modal } from "react-bootstrap";
import {
  MDBBtn,
  MDBTable,
  MDBTableHead,
  MDBTableBody,
  MDBTextArea,
  MDBInput,
} from "mdb-react-ui-kit";
import "mdb-react-ui-kit/dist/css/mdb.min.css";
import reducer from "../components/Reducer";
import Chart from "react-apexcharts";
import Button from "react-bootstrap/Button";
import Search from "../components/Search";
import sortTable from "../components/sortTable";
import moment from "moment";
export default function ProjectViewScreen() {
  const [{ users, tasks, successDelete }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
  });

  const { state } = useContext(Store);
  const { userInfo } = state;
  const params = useParams();
  const { id: projectId } = params;
  const navigate = useNavigate();
  let taskPMID;
  const [name, setName] = useState("");
  const [pm, setPM] = useState("");
  const [pmID, setPMID] = useState("");
  const [description, setDescription] = useState("");
  const [createdAt, setCreatedAt] = useState("");
  const [updatedAt, setUpdatedAt] = useState("");
  const [deadline, setDeadline] = useState("");
  const [status, setStatus] = useState("");

  const [pID, setPID] = useState(projectId);
  const [taskName, setTaskName] = useState("");
  const [assignee, setAssignee] = useState("");
  const [assigneeID, setAssigneeID] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskDeadline, setTaskDeadline] = useState("");
  const [showReport, setReportShow] = useState(false);
  console.debug((taskPMID = pmID));
  const handleReportClose = () => setReportShow(false);
  const handleReportShow = () => setReportShow(true);

  const [showCreate, setCreateShow] = useState(false);

  const handleCreateClose = () => setCreateShow(false);
  const handleCreateShow = () => setCreateShow(true);

  const [showUpdate, setUpdateShow] = useState(false);

  const handleUpdateClose = () => setUpdateShow(false);
  const handleUpdateShow = () => setUpdateShow(true);

  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [data, setData] = useState({});
  const [active, setActive] = useState(0);

  const pagination2 = (e) => {
    setActive(e);
    setPage(e + 1);
  };
  let countNew = 0;
  let countIP = 0;
  let countDone = 0;
  let taskNew, taskIP, taskDone;

  let classname = {
    New: "New badge bg-info",
    "In Progress": "IP badge bg-warning",
    Done: "Done badge bg-success",
    Approved: "Approved badge bg-primary",
  };

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
    fetchData();
  }, [userInfo]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_TASK_REQUEST" });
        const { data } = await axios.get(`/api/tasks/pagination?page=${page}`, {
          headers: { Authorization: `Bearer ${userInfo.token}`, id: projectId },
        });
        if (data) {
          setPageCount(data.pagination.pageCount);
        }
        dispatch({ type: "FETCH_TASK_SUCCESS", payload: data });
        setData(data);
      } catch (err) {
        dispatch({
          type: "FETCH_FAIL",
          payload: getError(err),
        });
      }
    };
    fetchData();
  }, [userInfo, page]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_PROJECT_REQUEST" });
        const { data } = await axios.get(`/api/projects/${projectId}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        setName(data.name);
        setPM(data.pm);
        setPMID(data.pmID);
        setDescription(data.description);
        setCreatedAt(data.createdAt);
        setUpdatedAt(data.updatedAt);
        setDeadline(data.deadline);
        setStatus(data.status);
        dispatch({ type: "FETCH_PROJECT_SUCCESS" });
      } catch (err) {
        dispatch({
          type: "FETCH_FAIL",
          payload: getError(err),
        });
      }
    };
    fetchData();
  }, [projectId, userInfo, navigate]);

  const submitTaskHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        "/api/tasks/create",
        {
          pID,
          taskPMID,
          taskName,
          assignee,
          assigneeID,
          taskDescription,
          taskDeadline,
        },
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
      handleCreateClose();
      toast.success("Task created successfully");
    } catch (err) {
      toast.error(getError(err));
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      dispatch({ type: "UPDATE_REQUEST" });
      await axios.put(
        `/api/projects/${projectId}`,
        { _id: projectId, name, pm, pmID, description, deadline, status },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({
        type: "UPDATE_SUCCESS",
      });
      handleUpdateClose();
      toast.success("Project updated successfully");
    } catch (error) {
      toast.error(getError(error));
      dispatch({ type: "UPDATE_FAIL" });
    }
  };

  const deleteHandler = async (task) => {
    if (window.confirm("Are you sure to delete?")) {
      try {
        dispatch({ type: "DELETE_REQUEST" });
        await axios.delete(`/api/tasks/${task._id}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        toast.success("Task deleted successfully");
        dispatch({ type: "DELETE_SUCCESS" });
      } catch (error) {
        toast.error(getError(error));
        dispatch({
          type: "DELETE_FAIL",
        });
      }
    }
  };
  let i = 1;
  let index = 1;
  return (
    <Container className="small-container">
      <Helmet>
        <title>{name}</title>
      </Helmet>

      <Form onSubmit={submitHandler}>
        <Row>
          <Col md={12}>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h1>{name}</h1>
              </ListGroup.Item>
              <MDBTable>
                <MDBTableHead className="table-dark">
                  <tr>
                    <th>Project Manager</th>
                    <th>Description</th>
                    <th>Created At</th>
                    <th>Updated At</th>
                    <th>Deadline</th>
                    <th>Status</th>

                    <th>Action</th>
                  </tr>
                </MDBTableHead>
                <MDBTableBody>
                  <tr key={projectId}>
                    <td>{pm}</td>
                    <td>{description}</td>
                    <td>{moment(createdAt).format("DD/MM/YYYY")}</td>
                    <td>{moment(updatedAt).format("DD/MM/YYYY")}</td>
                    <td>{moment(deadline).format("DD/MM/YYYY")}</td>
                    <td>
                      <span className={classname[status]}>{status}</span>
                    </td>

                    <td>
                      <MDBBtn
                        disabled={
                          userInfo.role !== "Admin" && userInfo._id !== pmID
                        }
                        color="primary"
                        onClick={handleUpdateShow}
                      >
                        Update
                      </MDBBtn>
                    </td>
                  </tr>
                </MDBTableBody>
              </MDBTable>
              <br />
            </ListGroup>
          </Col>
        </Row>
      </Form>
      {/* Create Task */}

      <Modal
        id="modalCreate"
        show={showCreate}
        onHide={handleCreateClose}
        backdrop="static"
        keyboard={false}
      >
        <Form onSubmit={submitTaskHandler}>
          <Modal.Header closeButton>
            <Modal.Title>Create task</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3" controlId="taskName">
              <MDBInput
                label="Task Name"
                onChange={(e) => setTaskName(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="assignee">
              <Form.Select
                onChange={(e) => {
                  setAssignee(
                    e.target.value.slice(
                      e.target.value.indexOf(",") + 1,
                      e.target.value.indexOf("-")
                    )
                  );
                  setAssigneeID(
                    e.target.value.slice(0, e.target.value.indexOf(","))
                  );
                }}
              >
                <option value="No">Choose...</option>
                {users?.map(
                  (user) =>
                    user.role !== "Admin" &&
                    user._id !== pmID && (
                      <option
                        key={user._id}
                        value={[user._id, user.name + "-"]}
                      >
                        {user.name}
                      </option>
                    )
                )}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3" controlId="taskDescription">
              <MDBTextArea
                type="text"
                label="Description"
                rows={4}
                className="t-dark"
                onChange={(e) => setTaskDescription(e.target.value)}
              ></MDBTextArea>
            </Form.Group>
            <Form.Group className="mb-3" controlId="taskDeadline">
              <Form.Label>Deadline</Form.Label>
              <Form.Control
                type="Date"
                required
                onChange={(e) => setTaskDeadline(e.target.value)}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <MDBBtn color="primary" type="submit">
              Create
            </MDBBtn>
          </Modal.Footer>
        </Form>
      </Modal>
      {userInfo && userInfo._id === pmID && (
        <>
          {status !== "New" && status !== "In Progress" ? (
            <MDBBtn
              style={{ marginRight: "970px" }}
              variant="primary"
              data-bs-target="#modalCreate"
              disabled
              onClick={handleCreateShow}
            >
              Create new task
            </MDBBtn>
          ) : (
            <MDBBtn
              style={{ marginRight: "970px" }}
              variant="primary"
              data-bs-target="#modalCreate"
              onClick={handleCreateShow}
            >
              Create new task
            </MDBBtn>
          )}

          <MDBBtn variant="primary" onClick={handleReportShow}>
            Tasks Report
          </MDBBtn>
        </>
      )}

      <Form.Group
        className="mb-3"
        controlId="taskName"
        style={{ marginTop: "10px" }}
      >
        <MDBInput
          onKeyUp={() => Search("myTask", 1)}
          type="text"
          id="myInput"
          label="Search for assignee..."
        />
      </Form.Group>
      <MDBTable id="myTask" style={{ marginTop: "10px" }}>
        <MDBTableHead className="table-dark">
          <tr>
            <th onClick={() => sortTable("myTask", 0)}>ID</th>
            <th onClick={() => sortTable("myTask", 1)}>Tasks</th>
            <th onClick={() => sortTable("myTask", 2)}>Assignee</th>
            <th onClick={() => sortTable("myTask", 3)}>Created At</th>
            <th onClick={() => sortTable("myTask", 4)}>Updated At</th>
            <th onClick={() => sortTable("myTask", 5)}>Deadline</th>
            <th onClick={() => sortTable("myTask", 6)}>Status</th>
            <th>Action</th>
          </tr>
        </MDBTableHead>
        <MDBTableBody>
          {data.tasks?.map(
            (task) =>
              task.pID === projectId && (
                <tr key={task._id}>
                  <td> {i++}</td>
                  {task.taskName.length > 30 ? (
                    <td>{task.taskName.substring(0, 30)}...</td>
                  ) : (
                    <td>{task.taskName}</td>
                  )}
                  <td>{task.assignee}</td>
                  <td>{moment(task.createdAt).format("DD/MM/YYYY")}</td>
                  <td>{moment(task.updatedAt).format("DD/MM/YYYY")}</td>
                  <td>{moment(task.taskDeadline).format("DD/MM/YYYY")}</td>
                  <td>
                    <span className={classname[task.taskStatus]}>
                      {task.taskStatus}
                    </span>
                  </td>
                  {userInfo._id === task.assigneeID ? (
                    <td>
                      <MDBBtn
                        color="link"
                        type="button"
                        variant="light"
                        onClick={() => navigate(`/project/task/${task._id}`)}
                      >
                        View
                      </MDBBtn>
                    </td>
                  ) : userInfo._id === pmID ? (
                    <td>
                      <MDBBtn
                        color="link"
                        type="button"
                        variant="light"
                        onClick={() => navigate(`/project/task/${task._id}`)}
                      >
                        View
                      </MDBBtn>
                      <MDBBtn
                        color="link"
                        type="button"
                        onClick={() => deleteHandler(task)}
                      >
                        Delete
                      </MDBBtn>
                    </td>
                  ) : (
                    <td>
                      <MDBBtn
                        color="link"
                        type="button"
                        variant="light"
                        onClick={() => navigate(`/project/task/${task._id}`)}
                      >
                        View
                      </MDBBtn>
                    </td>
                  )}
                </tr>
              )
          )}
        </MDBTableBody>
      </MDBTable>
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
      {data.tasks?.map((task) =>
        task.taskStatus === "New" ? (
          <var key={index++}>
            {console.debug(countNew++)}
            {console.debug(
              (taskNew = Math.round((countNew / (i - 1)) * 10000) / 100)
            )}
            {console.debug(taskNew)}
          </var>
        ) : task.taskStatus === "In Progress" ? (
          <var key={index++}>
            {console.debug(countIP++)}
            {console.debug(
              (taskIP = Math.round((countIP / (i - 1)) * 10000) / 100)
            )}
            {console.debug(countIP)}
          </var>
        ) : (
          task.taskStatus === "Done" && (
            <var key={index++}>
              {console.debug(countDone++)}
              {console.debug(
                (taskDone = Math.round((countDone / (i - 1)) * 10000) / 100)
              )}
              {console.debug("Done", taskDone)}
            </var>
          )
        )
      )}
      <Modal
        id="modalReport"
        show={showReport}
        onHide={handleReportClose}
        className="container-fluid"
      >
        <Modal.Header closeButton>
          <Modal.Title>Tasks report for Project Manager</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Chart
            type="donut"
            width={500}
            height={500}
            series={[countNew, countIP, countDone]}
            options={{
              labels: ["New", "In Progress", "Done"],
            }}
          ></Chart>
          <div>There are {taskNew || 0}% project New</div>
          <div>There are {taskIP || 0}% project In Progress</div>
          <div>There are {taskDone || 0}% project Done</div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleReportClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      {/* Update */}
      <Modal
        size="lg"
        id="modalUpdate"
        show={showUpdate}
        onHide={handleUpdateClose}
        backdrop="static"
        keyboard={false}
      >
        <Form onSubmit={submitHandler}>
          <Modal.Header closeButton>
            <Modal.Title>Update Project</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3" controlId="taskName">
              <MDBInput
                disabled={userInfo.role !== "Admin"}
                label="Project Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="pm">
              <Form.Select
                disabled={userInfo.role !== "Admin"}
                onChange={(e) => {
                  setPM(
                    e.target.value.slice(
                      e.target.value.indexOf(",") + 1,
                      e.target.value.indexOf("-")
                    )
                  );
                  setPMID(e.target.value.slice(0, e.target.value.indexOf(",")));
                }}
              >
                <option value="No">Choose...</option>
                {users?.map(
                  (user) =>
                    user.role !== "Admin" && (
                      <option
                        key={user._id}
                        value={[user._id, user.name + "-"]}
                      >
                        {user.name}
                      </option>
                    )
                )}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3" controlId="taskDescription">
              <MDBTextArea
                disabled={userInfo.role !== "Admin"}
                type="text"
                label="Description"
                value={description}
                rows={4}
                className="t-dark"
                onChange={(e) => setDescription(e.target.value)}
              ></MDBTextArea>
            </Form.Group>
            <Form.Group>
              <Form.Select
                disabled={userInfo._id !== pmID}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="New">New</option>
                <option value="In Progress">In Progress</option>
                <option value="Done">Done</option>
                <option value="Approved">Approved</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3" controlId="taskDeadline">
              <Form.Label>Deadline</Form.Label>
              <Form.Control
                disabled={userInfo.role !== "Admin" && userInfo._id !== pmID}
                type="Date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <MDBBtn
              disabled={userInfo.role !== "Admin" && userInfo._id !== pmID}
              color="primary"
              type="submit"
            >
              Update
            </MDBBtn>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
}
