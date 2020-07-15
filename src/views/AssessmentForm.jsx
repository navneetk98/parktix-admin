import React, { useEffect, useState } from "react";
import { firestore } from "../firebase";
import { useParams, useHistory } from "react-router-dom";
import {
  TextField,
  Grid,
  Switch,
  Paper,
  Button,
  Tabs,
  Tab,
  FormControlLabel,
  Card,
  CardContent,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Question from "../components/Question";
import ScoreSheetForm from "../components/ScoreSheetForm";
import DocumentPicker from "../components/DocumentPicker";
import ScoreBucket from "../components/ScoreBucket";
import { AddCircle } from "@material-ui/icons";

const useStyles = makeStyles({
  root: {
    marginLeft: "60px",
    marginRight: "50px",
    marginTop: "100px",
  },
});

const AssessmentForm = () => {
  const { assessmentID } = useParams();
  let history = useHistory();
  const [assessment, setAssessment] = useState({
    score_sheet: {},
    questions: [],
    coming_soon: true,
    type: "",
    overall_buckets: [],
    overall_expected_score: null,
    name: null,
    "score-label": null,
  });

  // PROPERTIES vs QUESTIONS tab value
  const [value, setValue] = React.useState(0);
  const classes = useStyles();

  useEffect(() => {
    if (assessmentID) {
      console.log("fetching assessment details from firestore");
      firestore
        .collection("assessments")
        .doc(assessmentID)
        .get()
        .then((doc) => {
          if (doc.exists) {
            setAssessment(doc.data());
          } else {
            console.log("Assessment Not Found");
          }
        });
    }
  }, [assessmentID]);

  const tempOnClick = () => {
    setAssessment({
      ...assessment,
      overall_buckets: [
        ...assessment.overall_buckets,
        { label: null, lower_limit: null, upper_limit: null, text: "" },
      ],
    });
  };

  const addQuestionToAssessment = (questionRef, setSaving) => {
    console.log("QUestion ref: ", questionRef);
    let updatedQuestionList = assessment.questions;
    updatedQuestionList[updatedQuestionList.length - 1] = questionRef;
    setAssessment({
      ...assessment,
      questions: updatedQuestionList,
    });
    firestore
      .collection("assessments")
      .doc(assessmentID)
      .update({ questions: assessment.questions })
      .then((docRef) => setSaving(false))
      .catch((error) => console.log("Error: ", error));
  };

  const deleteQuestion = (questionRef, index) => {
    // Delete questionRef from 'questions' array
    let updatedQuestions = assessment.questions;
    updatedQuestions.splice(index, 1);
    setAssessment({ ...assessment, questions: updatedQuestions });

    // Delete actual question form 'assessment-questions' collection
    if (questionRef !== null) {
      firestore
        .collection("assessments")
        .doc(assessmentID)
        .update({ questions: assessment.questions })
        .then((docRef) => console.log("Updated assessment questions"))
        .catch((error) => console.log("Error: ", error));

      questionRef
        .delete()
        .then(function () {
          console.log("Document successfully deleted!");
        })
        .catch(function (error) {
          console.error("Error removing document: ", error);
        });
    }
  };

  // PROPERTIES vs QUESTIONS tab value
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const addNewCategoryToScoreSheet = (categoryRef) => {
    if (categoryRef !== null) {
      console.log(categoryRef.id);
      setAssessment({
        ...assessment,
        score_sheet: {
          ...assessment.score_sheet,
          [categoryRef.id]: { score_buckets: [] },
        },
      });
    } else {
      console.log("categoryRef is null");
    }
  };

  const saveScoreSheet = (scoreSheet) => {
    firestore
      .collection("assessments")
      .doc(assessmentID)
      .update({
        score_sheet: scoreSheet,
      })
      .then()
      .catch((error) => alert("An error occurred: ", error));
  };

  const updateParentScoreSheet = (scoreSheet) => {
    setAssessment({ ...assessment, score_sheet: scoreSheet });
    // TODO: Figure out a way where saveScoreSheet can access assessment.score_sheet without async issues
    saveScoreSheet(scoreSheet);
  };

  const saveOverallBucket = () => {
    firestore
      .collection("assessments")
      .doc(assessmentID)
      .update({
        overall_buckets: assessment.overall_buckets,
        overall_expected_score: assessment.overall_expected_score,
      })
      .then()
      .catch((error) => alert("An error occurred: ", error));
  };

  const deleteOverallBucket = (index) => {
    let newBuckets = assessment.overall_buckets;
    newBuckets.splice(index, 1);
    setAssessment({ ...assessment, overall_buckets: [...newBuckets] });
  };

  const updateOverallBucket = (index, bucket) => {
    let newOverallBuckets = assessment.overall_buckets;
    newOverallBuckets[index] = bucket;
    setAssessment({ ...assessment, overall_buckets: newOverallBuckets });
  };

  const updateAssessmentCategory = (categoryRef) => {
    setAssessment({ ...assessment, category: categoryRef });
  };

  const saveProperties = () => {
    firestore
      .collection("assessments")
      .doc(assessmentID)
      .update({
        name: assessment.name,
        coming_soon: assessment.coming_soon,
        "score-label": assessment["score-label"],
        type: assessment.type,
        category: assessment.category,
      })
      .then()
      .catch((error) => alert("An error occurred: ", error));
  };

  const createAssessment = () => {
    firestore
      .collection("assessments")
      .add({
        name: assessment.name,
        coming_soon: assessment.coming_soon,
        "score-label": assessment["score-label"],
        type: assessment.type,
        score_sheet: {},
        category: assessment.category,
        questions: [],
        overall_buckets: [],
        overall_expected_score: null,
      })
      .then((docRef) => {
        console.log(docRef);
        history.push(`/assessments/edit/${docRef.id}`);
      })
      .catch((error) => console.log(error));
  };

  return (
    <div style={{ padding: 20 }}>
      <Card variant="outlined" className={classes.root}>
        <CardContent>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="simple tabs example"
          >
            <Tab label="Properties" {...a11yProps(0)} />
            <Tab
              label="Questions"
              {...a11yProps(1)}
              // disabled={assessmentID ? "false" : "true"}
            />
            <Tab
              label="Score Sheet"
              {...a11yProps(2)}
              // disabled={assessmentID ? "false" : "true"}
            />
            <Tab
              label="Overall Buckets"
              {...a11yProps(3)}
              // disabled={assessmentID ? "false" : "true"}
            />
          </Tabs>

          <TabPanel value={value} index={0}>
            <Grid container style={{ padding: 20 }}>
              <Grid item xs="12" style={{ paddingBottom: "20px" }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={
                        assessment.type === "GENERAL_ASSESSMENT" ? true : false
                      }
                      onChange={(event, value) => {
                        setAssessment({
                          ...assessment,
                          type: value ? "GENERAL_ASSESSMENT" : "",
                        });
                      }}
                      value="assessment_type"
                    />
                  }
                  label="General Assessment"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={assessment.coming_soon}
                      onChange={(event, value) => {
                        setAssessment({
                          ...assessment,
                          coming_soon: value,
                        });
                      }}
                    />
                  }
                  label="Coming Soon"
                />
              </Grid>

              <Grid item xs="12" style={{ paddingBottom: "20px" }}>
                {assessmentID && <p>ID - {assessmentID}</p>}
                <TextField
                  id="name"
                  label="Name"
                  variant="outlined"
                  fullWidth
                  value={assessment.name}
                  defaultValue=" "
                  onChange={(event) =>
                    setAssessment({ ...assessment, name: event.target.value })
                  }
                />
              </Grid>

              <Grid item xs="12" style={{ paddingBottom: "20px" }}>
                <TextField
                  id="name"
                  label="Score Label"
                  variant="outlined"
                  fullWidth
                  key="assessment-score-label"
                  value={assessment["score-label"]}
                  defaultValue=" "
                  onChange={(event) =>
                    setAssessment({
                      ...assessment,
                      "score-label": event.target.value,
                    })
                  }
                />
              </Grid>
              <Grid item xs="12">
                <DocumentPicker
                  collection="categories"
                  locked={false}
                  initialID={assessment.category && assessment.category.id}
                  handleChange={updateAssessmentCategory}
                />
              </Grid>
            </Grid>
            {assessmentID && (
              <Button
                variant="contained"
                color="primary"
                onClick={() => saveProperties()}
                style={{ marginLeft: "20px" }}
              >
                Save Properties
              </Button>
            )}
            {!assessmentID && (
              <Button
                variant="contained"
                color="primary"
                onClick={() => createAssessment()}
                style={{ marginLeft: "20px" }}
              >
                Create Assessment
              </Button>
            )}
          </TabPanel>
          <TabPanel value={value} index={1}>
            {assessment.questions.map((questionRef, index) => (
              <Question
                questionRef={questionRef}
                updateParentQuestions={addQuestionToAssessment}
                deleteQuestion={deleteQuestion}
                index={index}
              />
            ))}
            <Button
              color="primary"
              variant="contained"
              onClick={() =>
                setAssessment({
                  ...assessment,
                  questions: [...assessment.questions, null],
                })
              }
              style={{ marginLeft: "10px" }}
            >
              Add
            </Button>
          </TabPanel>
          <TabPanel value={value} index={2}>
            <Grid item lg={12}>
              <ScoreSheetForm
                scoreSheet={assessment.score_sheet && assessment.score_sheet}
                updateParentScoreSheet={updateParentScoreSheet}
              />
              <Grid item xs="6">
                <h3>Add a new category to Score Sheet</h3>
                <DocumentPicker
                  collection="categories"
                  locked={false}
                  handleChange={addNewCategoryToScoreSheet}
                />
              </Grid>
            </Grid>
          </TabPanel>
          <TabPanel value={value} index={3}>
            <Grid item lg={12} style={{ padding: 20 }}>
              <TextField
                id="overallExpectedScore"
                label="Overall Expected Score"
                variant="outlined"
                onChange={(event) =>
                  setAssessment({
                    ...assessment,
                    overall_expected_score: parseInt(event.target.value),
                  })
                }
                defaultValue={assessment.overall_expected_score}
              />
              {assessment.overall_buckets.map((bucket, index) => (
                <ScoreBucket
                  bucket={bucket}
                  index={index}
                  isOverallBucket={true}
                  updateOverallBucket={updateOverallBucket}
                  deleteOverallBucket={deleteOverallBucket}
                />
              ))}
              <Button
                variant="contained"
                color="primary"
                onClick={() => tempOnClick()}
              >
                <AddCircle />
              </Button>
              <br />
              <Button
                variant="contained"
                color="primary"
                onClick={() => saveOverallBucket()}
                style={{ marginTop: 40 }}
              >
                Save Overall Buckets
              </Button>
            </Grid>
          </TabPanel>
        </CardContent>
      </Card>
    </div>
  );
};

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <div p={3}>{children}</div>}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default AssessmentForm;
