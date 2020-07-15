import React from "react";
import { firebaseApp } from "../firebase";
import { Redirect } from "react-router-dom";
import Button from "@material-ui/core/Button";

const Logout = () => {
  const handleLogout = () => {
    firebaseApp
      .auth()
      .signOut()
      .then(() => {
        return <Redirect to="/login" />;
      })
      .catch((error) => {
        alert("Logout unsuccessful");
      });
  };

  return (
    <Button color="inherit" variant="outlined" onClick={handleLogout}>
      LOGOUT
    </Button>
  );
};

export default Logout;
