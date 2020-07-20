import React, { useState, useEffect } from "react";
import { firestore, realtime } from "./../firebase";
import Table from "@material-ui/core/Table";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import Button from "@material-ui/core/Button";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";

const AddOperator = () => {
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

  const useStyles = withStyles((theme) => ({
    root: {
      width: 1000,
      marginLeft: "70px",
      marginTop: "100px",
    },
  }));

  const handleAddClick = async (identity)=>{
    alert(identity);
  }
  const getNewItems = () => {
    firestore
      .collection("admin-profiles")
      .get()
      .then((querySnapshot) => {
        let docs = [];
        querySnapshot.forEach((doc) => {
          docs.push({ id: doc.id, maindata: doc.data() });
        });
        setDocuments(docs);
      })
      .catch((error) => {
        console.log("Error: ", error);
      });
  }
  useEffect(() => {
    getNewItems();
  }, []);

  const generateRows = () => {
    return documents.map(docsnap => {
      return <StyledTableRow>
        <StyledTableCell>{docsnap.id}</StyledTableCell>
        <StyledTableCell>{docsnap.maindata.name}</StyledTableCell>
        <StyledTableCell>{docsnap.maindata.phoneNumber}</StyledTableCell>
        <StyledTableCell>
                            <Button
                              variant="contained"
                              color="primary"
                              disableRipple
                              onClick={() => handleAddClick(docsnap.id)}
                            >
                              Remove User
                            </Button>
                          </StyledTableCell>
      </StyledTableRow>
    })
  };

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
                  {<StyledTableCell>Id</StyledTableCell>}
                  {<StyledTableCell>Name</StyledTableCell>}
                  {<StyledTableCell>Mobile</StyledTableCell>}
                  {<StyledTableCell>Remove User</StyledTableCell>}
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

export default AddOperator;