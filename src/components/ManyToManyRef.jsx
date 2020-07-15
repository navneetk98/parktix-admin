import React, { useState, useEffect } from "react";
import { firestore } from "../firebase";
import Chip from "@material-ui/core/Chip";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";

export const ManyToManyRef = ({
  childCollectionName,
  saveToParent,
  displayName,
  defaultValues = [],
}) => {
  const [childList, setChildList] = useState([]);
  const [defaultVals, setDefaultVals] = useState([]);

  useEffect(() => {
    if (!defaultValues || defaultValues.length == 0) return;
    Promise.all(defaultValues.map((docRef) => docRef.get())).then(
      (dataSnapShots) => {
        setDefaultVals(
          dataSnapShots.map((dataSnapShot) => ({
            ...dataSnapShot.data(),
            id: dataSnapShot.id,
          }))
        );
      }
    );
  }, [defaultValues]);

  useEffect(() => {
    firestore
      .collection(childCollectionName)
      .get()
      .then((querySnapshot) => {
        let docs = [];
        querySnapshot.forEach((doc) => {
          docs.push({ id: doc.id, name: doc.data().name });
        });
        setChildList(docs);
      })
      .catch((error) => {
        console.log("Error: ", error);
      });
  }, []);

  return (
    <Autocomplete
      key={defaultVals.length}
      multiple
      defaultValue={defaultVals}
      options={childList}
      getOptionLabel={(option) => option.name}
      onChange={(e, values) => {
        values = values.map(({ id }) =>
          firestore.collection(childCollectionName).doc(id)
        );
        saveToParent(values);
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          fullWidth
          variant="outlined"
          label={`Enter ${displayName} name`}
          placeholder={displayName}
          fullWidth
        />
      )}
    />
  );
};
