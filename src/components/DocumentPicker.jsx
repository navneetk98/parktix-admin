import React, { useEffect, useState } from "react";
import { firestore } from "../firebase";
import { TextField } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";

// Expects the following props:
// "collection" - Collection name as a String (REQUIRED)
// "handleChange" - Function that is executed with new value when value changes (REQUIRED)
// "initialID" - DocumentID of current value as a String (OPTIONAL)
const DocumentPicker = ({
  collection,
  handleChange,
  initialID = null,
  locked,
}) => {
  const [documents, setDocuments] = useState([]);
  let [value, setValue] = useState(null);

  useEffect(() => {
    firestore
      .collection(collection)
      .get()
      .then((querySnapshot) => {
        let docs = [];
        querySnapshot.forEach((doc) => {
          docs.push({ id: doc.id, name: doc.data().name });
          if (doc.id === initialID)
            setValue({ id: doc.id, name: doc.data().name });
        });
        setDocuments(docs);
      })
      .catch((error) => {
        console.log("Error: ", error);
      });
  }, [collection, initialID]);

  return (
    // TODO: Asynchronous Autocomplete
    <Autocomplete
      style={{ width: "100%" }}
      disabled={locked}
      id={`${collection}-picker`}
      onChange={(event, value) => {
        setValue(value);
        handleChange(
          value === null ? null : firestore.collection(collection).doc(value.id)
        );
      }}
      options={documents}
      value={value}
      getOptionLabel={(doc) => doc.name}
      renderInput={(params) => (
        <TextField
          {...params}
          label={collection}
          fullWidth
          variant="outlined"
        />
      )}
    />
  );
};

export default DocumentPicker;
