import React, { useState, useEffect } from "react";
import Add from "@material-ui/icons/Add";
import Remove from "@material-ui/icons/Remove";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";

import CircularProgress from "@material-ui/core/CircularProgress";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import CollectionEdit from "./CollectionEdit";
import MediaInput from "./MediaInput";

export default ({
  title,
  list = [],
  onChange,
  addLabel,
  nested,
  headingKey,
  nestedInputFields,
  nestedKey = null,
  defaultValues,
  meta,
  valueType,
}) => {
  const [localList, setLocalList] = useState(list);
  const [newLabel, setNewLabel] = useState();
  const [canAddNewItem, setCanAddNewItem] = useState(false);
  const [saveDisabled, setSaveDisabled] = useState(false);

  useEffect(() => {
    if (list.length == 0) return;
    if (localList.length > 0) return;
    setLocalList([...list]);
  }, [list]);

  const onAdd = (newDoc) => {
    const newList = localList.concat(newDoc ? newDoc : newLabel);
    onChange(newList);
    setLocalList(newList);
    setNewLabel();
    setCanAddNewItem(false);
  };

  const onRemove = (id, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const newList = localList.filter((it, itId) => id != itId);
    onChange(newList);
    setLocalList(newList);
  };

  const onEdit = (id, doc) => {
    const newList = localList.map((it, itId) => {
      if (id === itId) {
        return doc;
      }
      return it;
    });
    onChange(newList);
    setLocalList(newList);
  };

  return (
    <div
      style={{
        padding: "10px",
        border: "black solid 1px",
      }}
    >
      <h3>{title}</h3>

      {!canAddNewItem && (
        <Button
          onClick={() => setCanAddNewItem(true)}
          variant="contained"
          color="primary"
        >
          <Add />
          {addLabel}
        </Button>
      )}
      {canAddNewItem && !nested && (
        <FlatSyncListForm
          valueType={valueType}
          setNewLabel={setNewLabel}
          addLabel={addLabel}
          onAdd={onAdd}
          newLabel={newLabel}
          meta={meta}
          saveDisabled={saveDisabled}
          setSaveDisabled={setSaveDisabled}
        />
      )}
      {canAddNewItem && nested && (
        <CollectionEdit
          inputFields={nestedInputFields}
          defaultValues={defaultValues}
          disableChildSave={true}
          name={title}
          persistDataToParent={(newDoc) => onAdd(newDoc)}
        />
      )}
      {!nested && (
        <SimpleList
          list={list}
          onRemove={onRemove}
          nestedKey={nestedKey}
          valueType={valueType}
        />
      )}
      {nested &&
        list.map((listItem, id) => (
          <ExpansionPanel className="border-black">
            <ExpansionPanelSummary className="expansion-header">
              <Grid container direction="row" justify="space-between">
                <Grid>{listItem[headingKey]}</Grid>
                <Grid>
                  <Remove onClick={(e) => onRemove(id, e)} />
                </Grid>
              </Grid>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <CollectionEdit
                inputFields={nestedInputFields}
                defaultValues={listItem}
                disableChildSave={true}
                persistDataToParent={(newDoc) => onEdit(id, newDoc)}
              />
            </ExpansionPanelDetails>
          </ExpansionPanel>
        ))}
    </div>
  );
};

const SimpleList = ({ list, onRemove, nestedKey, valueType }) =>
  list.map((item, id) => (
    <Grid container direction="row" justify="start" alignItems="center">
      <Grid>{nestedKey ? item[nestedKey] : item}</Grid>
      &nbsp;
      <Grid>
        <Remove onClick={() => onRemove(id)} />
      </Grid>
    </Grid>
  ));

const FlatSyncListForm = ({
  addLabel,
  onAdd,
  newLabel,
  meta,
  valueType,
  saveDisabled,
  setNewLabel,
  setSaveDisabled,
}) => {
  const [urlValue, setUrlValue] = useState();

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onAdd();
      }}
    >
      <Grid item xs={12} sm={12}>
        {!valueType && (
          <div>
            <Grid item xs={12} sm={12}>
              <TextField
                label={addLabel}
                fullWidth
                variant="outlined"
                required={true}
                onChange={(e) => setNewLabel(e.target.value)}
              />
            </Grid>
            <br />
          </div>
        )}
        {valueType === "Image" && (
          <div>
            <Grid item xs={12} sm={12}>
              <MediaInput
                returnStringValue={true}
                setDocument={onAdd}
                document={newLabel}
                setProcessingForm={setSaveDisabled}
                imageMetaData={meta}
              />
              <TextField
                label={"Enter Url"}
                fullwidth
                variant="outlined"
                required={true}
                onChange={(e) => setUrlValue(e.target.value)}
                disabled={setSaveDisabled}
              />
            </Grid>
            <br />
          </div>
        )}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={saveDisabled}
          onClick={() => onAdd(urlValue)}
        >
          {saveDisabled && <CircularProgress color="secondary" />}
          Add
        </Button>
      </Grid>
    </form>
  );
};
