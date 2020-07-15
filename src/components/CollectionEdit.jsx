import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { withRouter } from "react-router";
import { firestore, firebaseApp } from "./../firebase";

import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";

import CircularProgress from "@material-ui/core/CircularProgress";
import Switch from "@material-ui/core/Switch";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import { makeStyles } from "@material-ui/core/styles";

import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";

import SyncListSave from "./SyncListSave.jsx";
import DocumentPicker from "./DocumentPicker";
import { ManyToManyRef } from "./ManyToManyRef";
import MediaInput from "./MediaInput";
import ManyToOneWrapper from "./ManyToOneWrapper";
import { TableContainer, Paper, TableHead, TableRow } from "@material-ui/core";
//import classes from "*.module.css";

const useStyles = makeStyles({
  root: {
    marginLeft: "60px",
    marginRight: "50px",
    marginTop: "100px",
  },
});

const CollectionEdit = ({
  name,
  moduleName,
  inputFields,
  id,
  hasComingSoon,
  defaultValues,
  parentModule,
  parentModuleId,
  parentRefKey,
  persistDataToParent,
  parentRefCollection,
  disableChildSave,
  history,
  urlKey,
  postDataPersistanceURL,
}) => {
  let { moduleId } = useParams();
  if (parentModuleId) moduleId = null;
  if (id) moduleId = id;
  const [document, setDocument] = useState(defaultValues ? defaultValues : {});
  const [processingForm, setProcessingForm] = useState(false);

  const [imageMetaData, setImageData] = useState(null);
  const [videoMetaData, setVideoData] = useState(null);
  const classes = useStyles();

  useEffect(() => {
    if (!moduleId || !moduleName) return;
    firestore
      .collection(moduleName)
      .doc(moduleId)
      .get()
      .then(async (documentSnapshot) => {
        const document = documentSnapshot.data();
        if (!document) return;
        document.id = documentSnapshot.id;
        return setDocument(document);
      });
  }, []);

  const onSave = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
      if (!e.currentTarget.reportValidity()) {
        return false;
      }
    }
    if (disableChildSave) {
      return persistDataToParent(document);
    }
    setProcessingForm(true);
    const savebleDoc = { ...document };
    const isNew = savebleDoc.id ? false : true;
    delete savebleDoc.id;
    if (parentModule) {
      savebleDoc[parentRefKey] = firestore
        .collection(parentModule)
        .doc(parentModuleId);
    }
    if (!moduleId) {
      savebleDoc.created_at = new Date();
      return firestore
        .collection(moduleName)
        .add(savebleDoc)
        .then(
          (doc) => {
            if (persistDataToParent && isNew) persistDataToParent(document);
            setProcessingForm(false);
            postSaveProcess(doc.id);
            if (!parentModule) {
              return history.push(`/${urlKey}/edit/${doc.id}`);
            }
          },
          (_) => setProcessingForm(false)
        );
    }
    savebleDoc.modified_at = new Date();
    firestore
      .collection(moduleName)
      .doc(moduleId)
      .set(savebleDoc)
      .then(
        (_) => {
          postSaveProcess(moduleId);
          setProcessingForm(false);
        }, //Success
        (_) => setProcessingForm(false) //Error
      );
  };

  const postSaveProcess = (id) => {
    if (!postDataPersistanceURL) return;
    fetch(postDataPersistanceURL + id, {
      method: "GET",
    });
  };
  const handleChange = (key, e) => {
    const setVal = (key, val) =>
      setDocument(() => ({
        ...document,
        [key]: val,
      }));
    if (e instanceof Date) {
      return setVal(key, e);
    }
    const { type, value } = e.target;
    setVal(key, type == "number" ? parseInt(value) : value);
  };

  return (
    <div>
      <Card variant="outlined" className={classes.root}>
        <CardContent>
          <Grid container direction="row" justify="space-between">
            <h1>Edit form for {name}</h1>
            {hasComingSoon && (
              <Grid key={document.name}>
                <h3>Coming Soon</h3>
                <Switch
                  key={document && document.id}
                  checked={document && document.coming_soon}
                  onChange={() =>
                    setDocument((document) => ({
                      ...document,
                      coming_soon: !document.coming_soon,
                    }))
                  }
                  inputProps={{ "aria-label": "secondary checkbox" }}
                />
              </Grid>
            )}
          </Grid>

          <form
            name="saveForm"
            style={{ padding: "20px" }}
            noValidate
            autoComplete="off"
            onSubmit={(e) => onSave(e)}
          >
            <Grid container spacing={3}>
              {Object.keys(document).length > 0 &&
                inputFields &&
                inputFields.map((inpField, id) => {
                  const {
                    displayName,
                    key,
                    type,
                    required,
                    hidden,
                    multiline,
                    collectionName,
                    addLabel,
                    nested,
                    headingKey,
                    inputFields: nestedInputFields,
                    nestedKey,
                    defaultValues,
                    values,
                    valueType,
                    meta,
                    choices,
                  } = inpField;
                  if (hidden) return;
                  if (type == "Date") console.log(document[key]);
                  return (
                    <Grid item xs={12} sm={12}>
                      {type == "Image" && (
                        <MediaInput
                          setProcessingForm={setProcessingForm}
                          setDocument={setDocument}
                          imageMetaData={inpField}
                          document={document}
                        />
                      )}

                      {type == "Video" && (
                        <MediaInput
                          setProcessingForm={setProcessingForm}
                          setDocument={setDocument}
                          videoMetaData={inpField}
                          document={document}
                        />
                      )}
                      {(type == "String" || type == "Integer") && (
                        <TextField
                          fullWidth
                          id="outlined-basic"
                          label="Outlined"
                          variant="outlined"
                          type={type == "String" ? "text" : "number"}
                          key={document[key] ? key : `${key}-${id}`}
                          defaultValue={document[key]}
                          label={displayName}
                          multiline={multiline ? true : false}
                          required={required ? true : false}
                          onChange={(e) => handleChange(key, e)}
                          rowsMax="6"
                        />
                      )}
                      {type == "Select" && (
                        <Select
                          value={document[key]}
                          onChange={handleChange}
                          onChange={(e) => handleChange(key, e)}
                        >
                          <MenuItem>Select choice</MenuItem>
                          {choices.map(({ label, type }) => (
                            <MenuItem value={type}>{label}</MenuItem>
                          ))}
                        </Select>
                      )}
                      {type == "Date" && (
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                          <KeyboardDatePicker
                            disableToolbar
                            variant="inline"
                            format="dd/MM/yyyy"
                            margin="normal"
                            id="date-picker-inline"
                            label={displayName}
                            value={(() => {
                              if (document[key] && document[key].toDate) {
                                return document[key].toDate();
                              }
                              return document[key];
                            })()}
                            onChange={(e) => handleChange(key, e)}
                            KeyboardButtonProps={{
                              "aria-label": "change date",
                            }}
                          />
                        </MuiPickersUtilsProvider>
                      )}
                      {type == "Boolean" && (
                        <Grid
                          container
                          direction="row"
                          justify="left"
                          alignItems="center"
                        >
                          <h3>{displayName}</h3>
                          <Switch
                            key={document && document.id}
                            checked={document && document[key]}
                            onChange={() =>
                              setDocument((document) => ({
                                ...document,
                                [key]: !document[key],
                              }))
                            }
                            inputProps={{ "aria-label": "secondary checkbox" }}
                          />
                        </Grid>
                      )}
                      {type == "Radio" && (
                        <Grid
                          container
                          direction="row"
                          justify="left"
                          alignItems="center"
                        >
                          <h3>{displayName}</h3>
                          <RadioGroup
                            aria-label="gender"
                            name="gender1"
                            value={document[key]}
                            onChange={(radioEvent) => {
                              const val = radioEvent.target.value;
                              setDocument((document) => ({
                                ...document,
                                [key]: val,
                              }));
                            }}
                          >
                            {values.map(({ key, value }) => {
                              return (
                                <FormControlLabel
                                  value={key}
                                  control={<Radio />}
                                  label={value}
                                />
                              );
                            })}
                          </RadioGroup>
                        </Grid>
                      )}
                      {type == "OneToOneReference" && (
                        <DocumentPicker
                          key={document[key] ? key : `${key}-${id}`}
                          collection={collectionName}
                          initialID={document[key] && document[key].id}
                          locked={false}
                          handleChange={(newDoc) =>
                            setDocument((document) => ({
                              ...document,
                              [key]: newDoc,
                            }))
                          }
                        />
                      )}
                      {type == "SyncList" && (
                        <SyncListSave
                          addLabel={addLabel}
                          title={displayName}
                          list={document[key]}
                          nested={nested}
                          headingKey={headingKey}
                          nestedInputFields={nestedInputFields}
                          nestedKey={nestedKey}
                          defaultValues={defaultValues}
                          meta={meta}
                          valueType={valueType}
                          onChange={(newList) => {
                            setDocument((document) => ({
                              ...document,
                              [key]: newList,
                            }));
                          }}
                        />
                      )}
                      {type == "ManyToManyReference" && (
                        <ManyToManyRef
                          defaultValues={document[key]}
                          childCollectionName={collectionName}
                          displayName={displayName}
                          saveToParent={(children) =>
                            (document[key] = children)
                          }
                        />
                      )}
                      {type === "ManyToOneReference" && moduleId && (
                        <ManyToOneWrapper
                          manyToOneReference={inpField}
                          document={document}
                          moduleName={moduleName}
                          moduleId={moduleId}
                        />
                      )}
                    </Grid>
                  );
                })}
            </Grid>
            <br />
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                disabled={processingForm}
              >
                {processingForm && <CircularProgress color="secondary" />}
                Save
              </Button>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default withRouter(CollectionEdit);
