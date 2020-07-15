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

const useStyles = makeStyles((theme) => ({
  root: {
    width: 1000,
    marginLeft: "70px",
    marginTop: "100px",
  },
}));

export default withRouter(
  ({
    name,
    urlKey,
    moduleName,
    columnOrder,
    enableEdit,
    enableCreate,
    defaultSortParameter,
    history,
    filterBy: { key, value } = {},
    backendUrl,
    exportData,
    reportingURL,
  }) => {
    const [documents, setDocuments] = useState([]);
    const [limit, setLimit] = useState(5);
    const [areMoreData, setAreMoreData] = useState(true);
    const classes = useStyles();
    const { loggedInUser } = useContext(AuthContext);

    const getNewItems = () => {
      if (backendUrl) {
        axios.get(backendUrl).then(({ data }) => {
          setDocuments(() => data);
        });
        return;
      }
      const hydrationManager = startHydration();
      let query = firestore
        .collection(moduleName)
        .orderBy(defaultSortParameter, "asc")
        .limitToLast(limit);
      if (key && value) {
        query = query.where(key, "==", value);
      }
      query = query.get();
      query.then(async (querySnapshot) => {
        if (limit > querySnapshot.docs.length) {
          setAreMoreData(false);
        }
        setLimit(limit + 5);
        let newDocuments = [];
        newDocuments = querySnapshot.docs
          .map(function (doc) {
            const document = doc.data();
            const id = doc.id;
            hydrationManager.hydrateAllRefs(document, id);
            return { id, ...document };
          })
          .sort((a, b) => {
            if (a.coming_soon) {
              return 1;
            }
            return -1;
          });
        hydrationManager
          .getAllHydratedRefs(newDocuments)
          .then((updatedDocs) => setDocuments(() => updatedDocs));
      });
    };

    useEffect(() => {
      getNewItems();
    }, []);

    const getNextPageData = () => {
      getNewItems();
    };

    const handleCSV = async (assessmentId) => {
      const userProfileDoc = await firestore
        .collection("user-profiles")
        .doc(loggedInUser.uid)
        .get();

      if (
        !userProfileDoc.data().email ||
        !userProfileDoc.data().email.length === 0
      ) {
        alert("Please save a valid email address on the HOME tab");
        return;
      }

      fetch(reportingURL + assessmentId + `/${userProfileDoc.data().email}`, {
        method: "GET",
      }).then((res) =>
        alert(
          `An email will be sent to ${
            userProfileDoc.data().email
          } shortly. This may take a while if the dataset is large.`
        )
      );
    };

    return (
      <div>
        <Card variant="outlined" className={classes.root}>
          <CardContent>
            <Grid
              container
              direction="row"
              justify="space-between"
              alignItems="center"
            >
              <h1>Collection: {name}</h1>
              {enableCreate && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={(e) => history.push(`/${moduleName}/create/`)}
                >
                  Add new
                </Button>
              )}
            </Grid>
            <TableContainer>
              <Table aria-label="simple table" className={classes.Table}>
                <TableHead>
                  <TableRow>
                    {columnOrder.map(({ columnName }) => (
                      <StyledTableCell>{columnName}</StyledTableCell>
                    ))}
                    {enableEdit && <StyledTableCell>Edit</StyledTableCell>}
                    {exportData && <StyledTableCell>Export</StyledTableCell>}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {documents.map((row) => {
                    const keys = Object.keys(row);
                    return (
                      <StyledTableRow key={row.name}>
                        {columnOrder.map(
                          ({ keyName, type, display, nestedKey }) => {
                            let visibleElement;
                            if (row[keyName] == null) {
                              visibleElement = "";
                            }
                            switch (type) {
                              case "Image":
                                if (row[keyName] == null) {
                                  break;
                                }
                                visibleElement = (
                                  <img
                                    src={row[keyName]}
                                    height="100"
                                    width="100"
                                  />
                                );
                                break;
                              case "Child":
                                visibleElement = row[keyName]
                                  ? row[keyName][display]
                                  : "";
                                break;
                              case "Boolean":
                                visibleElement = row[keyName] ? "Yes" : "No";
                                break;
                              case "Nested":
                                visibleElement =
                                  row[keyName] && row[keyName][nestedKey]
                                    ? row[keyName][nestedKey]
                                    : "";
                                break;
                              default:
                                visibleElement = row[keyName];
                                break;
                            }
                            return (
                              <StyledTableCell className="col-size">
                                {visibleElement}
                              </StyledTableCell>
                            );
                          }
                        )}
                        {enableEdit && (
                          <StyledTableCell>
                            <Link to={`/${urlKey}/edit/${row.id}/`}>
                              <EditSharpIcon color="primary" />
                            </Link>
                          </StyledTableCell>
                        )}
                        {exportData && (
                          <StyledTableCell>
                            <Button
                              variant="contained"
                              color="primary"
                              disableRipple
                              onClick={() => handleCSV(row.id)}
                            >
                              Export CSV
                            </Button>
                          </StyledTableCell>
                        )}
                      </StyledTableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
            <br />
            {areMoreData && (
              <Button
                color="primary"
                variant="contained"
                onClick={getNextPageData}
              >
                LOAD MORE
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }
);
