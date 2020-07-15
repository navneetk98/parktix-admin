import React, { useEffect, useState } from "react";
import { Grid } from "@material-ui/core";
import {
  TextField,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  FormControlLabel,
  Button
} from "@material-ui/core";
import { firestore } from "../firebase";
import Skeleton from "@material-ui/lab/Skeleton";
import { Lock, LockOpen, AddCircle, Delete } from "@material-ui/icons";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import DocumentPicker from "./DocumentPicker";

const Answer = ({
  answer,
  index,
  handleAnswerChange,
  deleteAnswer,
  locked
}) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        width: "100%"
      }}
    >
      <TextField
        inputProps={{
          readOnly: locked
        }}
        style={{ margin: "0px 10px 10px 0px" }}
        label="Label"
        defaultValue={answer.label}
        variant="filled"
        onChange={event => {
          handleAnswerChange({ ...answer, label: event.target.value }, index);
        }}
      />
      <TextField
        inputProps={{
          readOnly: locked
        }}
        style={{ margin: "0px 0px 10px 0px" }}
        label="Value"
        defaultValue={answer.value}
        variant="filled"
        onChange={event => {
          handleAnswerChange(
            {
              ...answer,
              value:
                event.target.value === "" ? null : parseInt(event.target.value)
            },
            index
          );
        }}
      />
      <Button
        color="secondary"
        disabled={locked}
        style={{ marginBottom: 10 }}
        onClick={() => deleteAnswer(index)}
      >
        <Delete />
      </Button>
    </div>
  );
};

const Question = ({
  questionRef = null,
  updateParentQuestions,
  deleteQuestion,
  index
}) => {
  const [question, setQuestion] = useState({
    answers: [],
    category: null,
    text: null
  });
  const [locked, setLocked] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (questionRef !== null)
      questionRef
        .get()
        .then(doc => {
          if (doc.exists) {
            setQuestion(doc.data());
          }
        })
        .catch(error => console.log("Error: ", error));
  }, [questionRef]);

  const handleAnswerChange = (updatedAnswer, index) => {
    // construct new answers array
    let newAnswers = question.answers;
    newAnswers[index] = updatedAnswer;
    // Update question state
    setQuestion({ ...question, answers: newAnswers });
  };

  const deleteAnswer = index => {
    let newAnswers = question.answers;
    newAnswers.splice(index, 1);
    setQuestion({ ...question, answers: newAnswers });
  };

  const handleCategoryChange = newCategoryRef => {
    setQuestion({ ...question, category: newCategoryRef });
  };

  const saveQuestion = () => {
    setLocked(true);
    setSaving(true);

    console.log(question);

    // assumes question already exists
    if (questionRef != null) {
      firestore
        .collection("assessment-questions")
        .doc(questionRef.id)
        .update({
          text: question.text,
          category: question.category,
          answers: question.answers
        })
        .then(() => setSaving(false))
        .catch(error => console.log("Error: ", error));
    } else {
      firestore
        .collection("assessment-questions")
        .add({
          text: question.text,
          category: question.category,
          answers: question.answers
        })
        .then(docRef => updateParentQuestions(docRef, setSaving))
        .catch(error => console.log("Error: ", error));
    }
  };

  // if (question === null)
  //   return <Skeleton variant="rect" height={118} animation="wave" />;

  return (
    <Grid item xs="12" style={{ padding: "10px" }}>
      <ExpansionPanel>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.09)",
            paddingTop: 10,
            paddingBottom: 10,
            paddingLeft: 54
          }}
        >
          <FormControlLabel
            style={{ width: "75%" }}
            onClick={event => event.stopPropagation()}
            onFocus={event => event.stopPropagation()}
            control={
              <TextField
                inputProps={{
                  readOnly: locked
                }}
                value={question.text}
                defaultValue=" "
                fullWidth
                label={`${index + 1} - Question Text`}
                onChange={event =>
                  setQuestion({ ...question, text: event.target.value })
                }
              />
            }
          />
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <div>
            {questionRef && (
              <div style={{ margin: "40px 20px" }}>
                <h3>ID</h3>
                <p>{questionRef.id}</p>
              </div>
            )}
            <div style={{ margin: "40px 20px" }}>
              <h3>Category</h3>
              <DocumentPicker
                collection="categories"
                initialID={question.category && question.category.id}
                locked={locked}
                handleChange={handleCategoryChange}
              />
            </div>
            <div style={{ margin: "40px 20px" }}>
              <h3>Answers</h3>
              {question.answers.map((answer, index) => (
                <Answer
                  answer={answer}
                  index={index}
                  handleAnswerChange={handleAnswerChange}
                  deleteAnswer={deleteAnswer}
                  locked={locked}
                />
              ))}
              <Button
                disabled={locked}
                style={{ width: "100%" }}
                onClick={() => {
                  setQuestion({
                    ...question,
                    answers: [...question.answers, { label: null, value: null }]
                  });
                }}
              >
                <AddCircle />
              </Button>
            </div>
            <div style={{ margin: "40px 0px 0px 20px", width: "100%" }}>
              <Button
                variant="contained"
                style={{ marginRight: 20 }}
                // startIcon={locked ? <Lock /> : <LockOpen />}
                onClick={() => setLocked(!locked)}
              >
                {/* Edits {locked ? "locked" : "unlocked"} */}
                {locked ? <Lock /> : <LockOpen />}
              </Button>
              <Button
                color="primary"
                variant="contained"
                style={{ marginRight: 20 }}
                disabled={locked}
                onClick={() => saveQuestion()}
              >
                {saving ? "Saving..." : "Save"}
              </Button>
              <Button
                color="secondary"
                variant="contained"
                style={{ marginRight: 20 }}
                disabled={locked}
                startIcon={<Delete />}
                onClick={() => deleteQuestion(questionRef, index)}
              >
                Delete Question
              </Button>
            </div>
          </div>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    </Grid>
  );
};

export default Question;
