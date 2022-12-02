import React, { useContext, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { Store } from "../Store";
import "mdb-react-ui-kit/dist/css/mdb.min.css";
import Admin from "../components/Admin";
import Staff from "../components/Staff";
import ProjectManager from "../components/ProjectManager";
export default function HomeScreen() {
  const { state } = useContext(Store);
  const { userInfo } = state;

  return (
    <div>
      <Helmet>
        <title>Manage Project</title>
      </Helmet>
      {userInfo.role === "Admin" ? (
        <>
          <Admin />
        </>
      ) : (
        <div>
          <center>Staff Table</center>
          <Staff />

          <center>Project Manager Table</center>
          <ProjectManager />
        </div>
      )}
    </div>
  );
}
