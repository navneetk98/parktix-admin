import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { firebaseApp } from '../firebase';

const PrivateRoute = ({ component, ...rest }) => {
  const { loggedInUser, loggedInUserProfileDoc, firstLoad } = useContext(AuthContext);

  if (firstLoad) return <div>Loading...</div>;

  if (loggedInUserProfileDoc && loggedInUserProfileDoc['is_super_admin'] !== true) {
    firebaseApp
    .auth()
    .signOut()
    .then(() => {
      return <Redirect to="/login" />;
    })
    .catch(error => {
      alert("Logout unsuccessful");
    });
  }

  return (
    <Route
      {...rest}
      component={!loggedInUser ? () => <Redirect to="/login" /> : component}
    />
  );
};

export default PrivateRoute;
