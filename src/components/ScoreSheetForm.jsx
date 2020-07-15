import React, { useState, useEffect } from "react";
import {
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  TextField,
  FormControlLabel,
  Button,
} from "@material-ui/core";
import DocumentPicker from "../components/DocumentPicker";
import { ExpandMore } from "@material-ui/icons";
import { firestore } from "../firebase";
import ScoreBucket from "./ScoreBucket";

const ScoreSheetForm = ({ scoreSheet = null, updateParentScoreSheet }) => {
  const [categories, setCategories] = useState({});
  const [sheetState, setSheetState] = useState(scoreSheet);

  useEffect(() => {
    if (scoreSheet !== null)
      Object.keys(scoreSheet).map((categoryID) => {
        firestore
          .collection("categories")
          .doc(categoryID)
          .get()
          .then((categoryDoc) => {
            setCategories((currentCategories) => ({
              ...currentCategories,
              [categoryID]: categoryDoc.data().name,
            }));
          });
      });
    setSheetState(scoreSheet);
  }, [scoreSheet]);

  const updateBucket = (categoryID, index, bucket) => {
    let newSheet = sheetState;
    newSheet[categoryID].score_buckets[index] = bucket;
    setSheetState(newSheet);
  };

  const deleteBucket = (categoryID, index) => {
    let newSheet = sheetState;
    newSheet[categoryID].score_buckets.splice(index, 1);
    console.log("INDEX: ", index);
    console.log("NEW SHEET: ", newSheet[categoryID]);
    setSheetState({ ...newSheet });
  };

  const onCategoryChange = (categoryID, newValue) => {
    setSheetState({ ...sheetState, categoryID: newValue });
  };

  return (
    <div>
      {scoreSheet !== null &&
        Object.keys(sheetState).map((categoryID) => {
          return (
            <ExpansionPanel
              style={{
                margin: "20px 0px",
              }}
            >
              <ExpansionPanelSummary
                expandIcon={<ExpandMore />}
                aria-controls="panel1a-content"
                id="panel1a-header"
                style={{
                  backgroundColor: "rgba(0, 0, 0, 0.09)",
                  paddingTop: 10,
                  paddingBottom: 10,
                  paddingLeft: 54,
                }}
              >
                <p>{categories[categoryID]}</p>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                <div style={{ width: "100%" }}>
                  <TextField
                    label="Expected Score"
                    defaultValue={sheetState[categoryID].expected_score}
                    variant="outlined"
                    onChange={(event) =>
                      setSheetState({
                        ...sheetState,
                        [categoryID]: {
                          ...sheetState[categoryID],
                          expected_score:
                            event.target.value === ""
                              ? null
                              : parseInt(event.target.value),
                        },
                      })
                    }
                    style={{ margin: "20px 0px" }}
                  />
                  <h3>Score Buckets: </h3>
                  {sheetState[categoryID].score_buckets.map((bucket, index) => (
                    <ScoreBucket
                      bucket={bucket}
                      index={index}
                      key={bucket.label}
                      categoryID={categoryID}
                      updateBucket={updateBucket}
                      deleteBucket={deleteBucket}
                    />
                  ))}
                  <Button
                    variant="contained"
                    color="primary"
                    style={{ marginTop: 20 }}
                    onClick={() =>
                      setSheetState({
                        ...sheetState,
                        [categoryID]: {
                          ...sheetState[categoryID],
                          score_buckets: [
                            ...sheetState[categoryID].score_buckets,
                            {
                              label: null,
                              lower_limit: null,
                              upper_limit: null,
                            },
                          ],
                        },
                      })
                    }
                  >
                    Add New Bucket
                  </Button>
                </div>
              </ExpansionPanelDetails>
            </ExpansionPanel>
          );
        })}
      <Button
        variant="contained"
        color="primary"
        onClick={() => updateParentScoreSheet(sheetState)}
      >
        SAVE SCORE SHEET
      </Button>
    </div>
  );
};

export default ScoreSheetForm;
