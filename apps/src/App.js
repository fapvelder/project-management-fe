import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Container from "react-bootstrap/Container";
import HomeScreen from "./screens/HomeScreen";
import SignInScreen from "./screens/SignInScreen";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UsersListScreen from "./screens/UsersListScreen";
import UserEditScreen from "./screens/UserEditScreen";
import UserCreateScreen from "./screens/UserCreateScreen";
import ProjectCreateScreen from "./screens/ProjectCreateScreen";
import ProjectViewScreen from "./screens/ProjectViewScreen";
import TaskDetailsScreen from "./screens/TaskDetailsScreen";
import UserScreen from "./screens/UserScreen";
import NavigationBar from "./components/Navbar";
import AdminRoute from "./components/AdminRoute";
import UserRoute from "./components/UserRoute";
function App() {
  let i = 1;

  return (
    <BrowserRouter className="w-100">
      <ToastContainer position="bottom-center" limit={5} />
      <header>
        <NavigationBar />
      </header>
      <main>
        <Container className="mt-3">
          <Routes>
            <Route path="/" element={<SignInScreen />} />

            <Route
              path="/homepage"
              element={
                <UserRoute key={i}>
                  <HomeScreen />
                </UserRoute>
              }
            />
            <Route
              path="/project/:id"
              element={
                <UserRoute key={i}>
                  <ProjectViewScreen />
                </UserRoute>
              }
            />
            <Route
              path="/project/task/:id"
              element={
                <UserRoute key={i}>
                  <TaskDetailsScreen />
                </UserRoute>
              }
            />
            <Route
              path="/user/:id"
              element={
                <UserRoute key={i}>
                  <UserScreen />
                </UserRoute>
              }
            />
            <Route
              path="/admin/userlist"
              element={
                <AdminRoute key={i}>
                  <UsersListScreen />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/create"
              element={
                <AdminRoute key={i}>
                  <UserCreateScreen />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/user/:id"
              element={
                <AdminRoute key={i}>
                  <UserEditScreen />
                </AdminRoute>
              }
            />
            <Route
              path="/project/create/"
              element={
                <AdminRoute key={i}>
                  <ProjectCreateScreen />
                </AdminRoute>
              }
            />
          </Routes>
        </Container>
      </main>
    </BrowserRouter>
  );
}

export default App;
