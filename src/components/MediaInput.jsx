import React, { useState, useEffect, useCallback } from "react";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import { useDropzone } from "react-dropzone";

import { firestore, firebaseApp } from "./../firebase";

const MediaInput = ({
  setProcessingForm,
  setDocument,
  imageMetaData,
  videoMetaData,
  document,
  returnStringValue,
  // Usually this component directly modifies parent state object using setdocument, by returnStringValue
  // you only return a string value and not modify parent state object.
}) => {
  const availableMedia = (metaField) => {
    if (returnStringValue) {
      return document;
    }
    if (!metaField) {
      return null;
    }
    const { key } = metaField;
    return document[key] ? document[key] : null;
  };

  const onDrop = useCallback(
    (acceptedFiles, e) => {
      if (acceptedFiles.length == 0) return;
      const { type } = acceptedFiles[0];
      let mediaMetaData = imageMetaData;
      if (type.match("image")) {
        mediaMetaData = imageMetaData;
      } else if (videoMetaData) {
        mediaMetaData = videoMetaData;
      }
      const { folder, key } = mediaMetaData;
      const storageRef = firebaseApp.storage().ref();
      var folderRef = storageRef.child(folder + Date.now());
      if (setProcessingForm) {
        setProcessingForm(true);
      }
      folderRef.put(acceptedFiles[0]).then((snapshot) =>
        snapshot.ref.getDownloadURL().then((url) => {
          if (setProcessingForm) {
            setProcessingForm(false);
          }
          if (returnStringValue) {
            return setDocument(url);
          }
          setDocument((document) => {
            document[key] = url;
            return document;
          });
        })
      );
    },
    [imageMetaData, videoMetaData]
  );
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
  });

  return (
    <div>
      <div {...getRootProps()}>
        <input {...getInputProps()} />
        {imageMetaData && (
          <div>
            <h4>{imageMetaData.displayName}</h4>
            {availableMedia(imageMetaData) ? (
              <img src={availableMedia(imageMetaData)} width="200px" />
            ) : (
              <CloudUploadIcon style={{ fontSize: 100 }} />
            )}
          </div>
        )}
        {videoMetaData && (
          <div>
            <h4>{videoMetaData.displayName}</h4>
            {availableMedia(videoMetaData) ? (
              <video
                src={availableMedia(videoMetaData)}
                width="400px"
                controls
              />
            ) : (
              <CloudUploadIcon style={{ fontSize: 100 }} />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MediaInput;
