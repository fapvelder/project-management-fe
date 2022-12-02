import axios from "axios";
import React, { useContext, useEffect, useReducer, useState } from "react";
import Container from "react-bootstrap/Container";
import { Helmet } from "react-helmet-async";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Store } from "../Store";
import { getError } from "../utils";
import "mdb-react-ui-kit/dist/css/mdb.min.css";
import reducer from "../components/Reducer";
import {
  MDBBtn,
  MDBTable,
  MDBTableHead,
  MDBTableBody,
  MDBInput,
  MDBTextArea,
} from "mdb-react-ui-kit";
import { Row, Col, ListGroup, Form, Modal } from "react-bootstrap";
import moment from "moment";
export default function TaskDetailsScreen() {
  const [{ loading, error, users }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
  });

  const { state } = useContext(Store);
  const { userInfo } = state;
  const params = useParams();
  const { id: taskId } = params;
  const navigate = useNavigate();

  const [taskName, setTaskName] = useState("");
  const [taskPMID, setTaskPMID] = useState("");
  const [assignee, setAssignee] = useState("");
  const [assigneeID, setAssigneeID] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskDeadline, setTaskDeadline] = useState("");
  const [createdAt, setCreatedAt] = useState("");
  const [updatedAt, setUpdatedAt] = useState("");
  const [taskStatus, setTaskStatus] = useState("");
  let classname = {
    New: "New badge bg-info",
    "In Progress": "IP badge bg-warning",
    Done: "Done badge bg-success",
  };
  const [showUpdate, setUpdateShow] = useState(false);

  const handleUpdateClose = () => setUpdateShow(false);
  const handleUpdateShow = () => setUpdateShow(true);
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
        const { data } = await axios.get(`/api/tasks/${taskId}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        setTaskName(data.taskName);
        setTaskPMID(data.taskPMID);
        setAssignee(data.assignee);
        setAssigneeID(data.assigneeID);
        setTaskDescription(data.taskDescription);
        setCreatedAt(data.createdAt);
        setUpdatedAt(data.updatedAt);
        setTaskDeadline(data.taskDeadline);
        setTaskStatus(data.taskStatus);
        dispatch({ type: "FETCH_TASK_SUCCESS" });
      } catch (err) {
        dispatch({
          type: "FETCH_FAIL",
          payload: getError(err),
        });
      }
    };
    fetchData();
  }, [taskId, userInfo, navigate]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      dispatch({ type: "UPDATE_REQUEST" });
      await axios.put(
        `/api/tasks/${taskId}`,
        {
          _id: taskId,
          taskName,
          taskDescription,
          assignee,
          assigneeID,
          taskDeadline,
          taskStatus,
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({
        type: "UPDATE_SUCCESS",
      });
      handleUpdateClose();
      toast.success("Task Updated");
    } catch (error) {
      toast.error(getError(error));
      dispatch({ type: "UPDATE_FAIL" });
    }
  };
  return (
    <Container className="small-container">
      <Helmet>
        <title>{taskName}</title>
      </Helmet>

      <Form onSubmit={submitHandler}>
        <Row>
          <Col md={12}>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h1>{taskName}</h1>
              </ListGroup.Item>
              <MDBTable>
                <MDBTableHead className="table-dark">
                  <tr>
                    <th>Assignee</th>
                    <th>Task Description</th>
                    <th>Created At</th>
                    <th>Updated At</th>
                    <th>Task Deadline</th>
                    <th>Task Status</th>
                    <th>Action</th>
                  </tr>
                </MDBTableHead>
                <MDBTableBody>
                  <tr key={taskId}>
                    <td>{assignee}</td>
                    <td>{taskDescription}</td>
                    <td>{moment(createdAt).format("DD/MM/YYYY")}</td>
                    <td>{moment(updatedAt).format("DD/MM/YYYY")}</td>
                    <td>{moment(taskDeadline).format("DD/MM/YYYY")}</td>
                    <td>
                      <span className={classname[taskStatus]}>
                        {taskStatus}
                      </span>
                    </td>
                    <td>
                      <MDBBtn color="primary" onClick={handleUpdateShow}>
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
                label="Project Name"
                disabled={userInfo._id !== taskPMID}
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="assignee">
              <Form.Select
                disabled={userInfo._id !== taskPMID}
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
                    user._id !== taskPMID && (
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
                disabled={userInfo._id !== taskPMID}
                type="text"
                label="Description"
                value={taskDescription}
                rows={4}
                className="t-dark"
                onChange={(e) => setTaskDescription(e.target.value)}
              ></MDBTextArea>
            </Form.Group>
            <Form.Group>
              <Form.Select
                disabled={userInfo._id !== assigneeID}
                onChange={(e) => setTaskStatus(e.target.value)}
              >
                <option value="New">New</option>
                <option value="In Progress">In Progress</option>
                <option value="Done">Done</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3" controlId="taskDeadline">
              <Form.Label>Deadline</Form.Label>
              <Form.Control
                disabled={userInfo._id !== taskPMID}
                type="Date"
                value={taskDeadline}
                onChange={(e) => setTaskDeadline(e.target.value)}
              />
            </Form.Group>
          </Modal.Body>

          <Modal.Footer>
            <MDBBtn
              disabled={
                userInfo._id !== taskPMID && userInfo._id !== assigneeID
              }
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
