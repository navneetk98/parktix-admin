import React, { useState, useEffect } from "react";
import { Grid, TextField, Button } from "@material-ui/core";
import { Delete } from "@material-ui/icons";

const ScoreBucket = ({
  bucket = null,
  index,
  categoryID = null,
  updateBucket,
  deleteBucket,
  isOverallBucket = false,
  updateOverallBucket,
  deleteOverallBucket,
}) => {
  const [bucketState, setBucketState] = useState(bucket);

  const handleChange = (key, value) => {
    setBucketState({
      ...bucketState,
      [key]:
        key !== "label" && key !== "text"
          ? value === ""
            ? null
            : parseInt(value)
          : value,
    });

    if (isOverallBucket) {
      updateOverallBucket(index, {
        ...bucketState,
        [key]:
          key !== "label" && key !== "text"
            ? value === ""
              ? null
              : parseInt(value)
            : value,
      });
    } else {
      updateBucket(categoryID, index, {
        ...bucketState,
        [key]:
          key !== "label" && key !== "text"
            ? value === ""
              ? null
              : parseInt(value)
            : value,
      });
    }
  };

  return (
    <Grid container style={{ margin: "20px 0px" }}>
      <Grid item md="3">
        <TextField
          defaultValue={bucketState.label}
          label="Label"
          variant="filled"
          onChange={(event) => {
            handleChange("label", event.target.value);
          }}
        />
      </Grid>
      <Grid item md="3">
        <TextField
          defaultValue={bucketState.lower_limit}
          label="Lower Limit"
          variant="filled"
          onChange={(event) => {
            handleChange("lower_limit", event.target.value);
          }}
        />
      </Grid>
      <Grid item md="3">
        <TextField
          defaultValue={bucketState.upper_limit}
          label="Upper Limit"
          variant="filled"
          onChange={(event) => {
            handleChange("upper_limit", event.target.value);
          }}
        />
      </Grid>
      {isOverallBucket && (
        <Grid item md="3">
          <TextField
            defaultValue={bucketState.text}
            label="Text"
            variant="filled"
            onChange={(event) => {
              handleChange("text", event.target.value);
            }}
          />
        </Grid>
      )}
      <Grid item md="2">
        <Button
          color="secondary"
          style={{ marginBottom: 10 }}
          onClick={() => {
            isOverallBucket
              ? deleteOverallBucket(index)
              : deleteBucket(categoryID, index);
          }}
        >
          <Delete />
        </Button>
      </Grid>
    </Grid>
  );
};

export default ScoreBucket;
