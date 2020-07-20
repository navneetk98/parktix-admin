import LogoutButton from '../components/LogoutButton'
import React, { useState, useEffect } from "react";
import { firestore, realtime } from "./../firebase";

import { Link } from "react-router-dom";
import { withRouter } from "react-router";
import Table from "@material-ui/core/Table";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import EditSharpIcon from "@material-ui/icons/EditSharp";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import axios from "axios";
import { startHydration } from "./../commons/FirebaseRefHydrate";
import {
  SignalCellularNullOutlined,
  AirlineSeatReclineExtra,
} from "@material-ui/icons";
import { queryAllByAltText } from "@testing-library/react";
import { set } from "date-fns";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";





const ViewLogs = () => {
  const [documents, setDocuments] = useState([]);

  const StyledTableCell = withStyles((theme) => ({
    head: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
  }))(TableCell);

  const StyledTableRow = withStyles((theme) => ({
    root: {
      "&:nth-of-type(odd)": {
        backgroundColor: theme.palette.action.hover,
      },
    },
  }))(TableRow);
console.log("hello");
  const useStyles = withStyles((theme) => ({
    root: {
      width: 1000,
      marginLeft: "70px",
      marginTop: "100px",
    },
  }));

  const getNewItems = () => {

    realtime.database().ref('logs').child("-MAiiqWnIcXWGBvQbHXc").on('value', (snap) => {
      setDocuments(() => Object.values(snap.val()));
    });
  }
  //   axios.get(backendUrl).then(({ data }) => {
  //     setDocuments(() => data);
  //   });
  //   return;
  // }
  useEffect(() => {
    getNewItems();
  }, []);

  const generateRows=()=>{
    return documents.map(docsnap => {
      return <StyledTableRow>
                <StyledTableCell>{docsnap["payID"]}</StyledTableCell>
                <StyledTableCell>{docsnap["vregno"]}</StyledTableCell>
                <StyledTableCell>{docsnap["status"]}</StyledTableCell>
            </StyledTableRow>
      })
  };


  // const classes = useStyles();
  return (
    <div marginTop="5000px">
      <Card variant="outlined" width="1000" marginLeft="70px" marginTop="100px" className="root">
        <CardContent>
          <Grid
            container
            direction="row"
            justify="space-between"
            alignItems="center"
            marginTop="100px"
          >
            <h1>Collection: Operators</h1>
          </Grid>
          <TableContainer>
            <Table aria-label="simple table" className="class">
              <TableHead>
                <StyledTableRow>
                  {<StyledTableCell>PayID</StyledTableCell>}
                  {<StyledTableCell>Vehicle RegNo.</StyledTableCell>}
                  {<StyledTableCell>status</StyledTableCell>}
                </StyledTableRow>
              </TableHead>
              <TableBody>
                {
                  generateRows()
                }

              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </div>
  );

}

export default ViewLogs;