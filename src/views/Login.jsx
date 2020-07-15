import React, { useContext } from "react";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import { Redirect } from "react-router-dom";
import { firebaseApp, uiConfig } from "../firebase";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
  const { loggedInUser } = useContext(AuthContext);

  if (loggedInUser) return <Redirect to="/" />;

  return (
    <div>
      <StyledFirebaseAuth
        uiConfig={uiConfig}
        firebaseAuth={firebaseApp.auth()}
      />
    </div>
  );
};

export default Login;
