import LogoutButton from '../components/LogoutButton'
import React, { useState, useEffect } from "react";
import { firestore } from "./../firebase";

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

  const useStyles = withStyles((theme) => ({
    root: {
      width: 1000,
      marginLeft: "70px",
      marginTop: "100px",
    },
  }));

const addOperator = () => {
    // const classes = useStyles();
    return (
        <div>
            <Card variant="outlined" width="1000" marginLeft="70px" marginTop="100px" className="root">
                <CardContent>
                    <Grid
                        container
                        direction="row"
                        justify="space-between"
                        alignItems="center"
                    >
                        <h1>Collection: Operators</h1>
                        </Grid>
                        <TableContainer>
                            <Table aria-label="simple table" className="class">
                                <TableHead>
                                    <TableRow>
                                        { <StyledTableCell>Name</StyledTableCell>}
                                        {<StyledTableCell>Mobile</StyledTableCell>}
                                        {<StyledTableCell>Next</StyledTableCell>}
                                    </TableRow>
                                </TableHead>
                                <TableBody>

                                </TableBody>
                            </Table>
                        </TableContainer>
                </CardContent>
            </Card>
        </div>
    );
    
}

export default addOperator;