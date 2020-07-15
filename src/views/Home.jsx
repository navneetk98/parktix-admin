import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import LogoutButton from "../components/LogoutButton";
import { firestore } from "./../firebase";
import Button from "@material-ui/core/Button";



const Home = () => {
  const [emailFieldValue, setEmailFieldValue] = useState();
  const { loggedInUser, loggedInUserProfileDoc } = useContext(AuthContext);
  console.log(loggedInUserProfileDoc);

  useEffect(() => {
    const unsubscribe = firestore
      .collection("admin-profiles")
      .doc(loggedInUser.uid)
      .onSnapshot((snapshot) => {
        setEmailFieldValue(snapshot.data().email);
      });
    return () => unsubscribe();
  }, []);

  const submitEmail = async () => {
    await firestore
      .collection("admin-profiles")
      .doc(loggedInUser.uid)
      .update({ email: emailFieldValue });
  };

  return (
    <div style={{ paddingTop: "100px", paddingLeft: "30px" }}>
      <div>
        <text>
          Welcome {loggedInUserProfileDoc.name}
        </text>
      </div>
      <input
        type="text"
        placeholder="Write your email here.."
        value={emailFieldValue}
        onChange={(e) => setEmailFieldValue(e.target.value)}
      />
      <button onClick={() => submitEmail()}>SAVE EMAIL</button>

    </div>

  );
};

export default Home;
