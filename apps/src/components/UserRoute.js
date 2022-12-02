import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { Store } from "../Store";

export default function UserRoute({ children }) {
  const { state } = useContext(Store);
  const { userInfo } = state;
  return !userInfo ? <Navigate to="/" /> : children;
}
