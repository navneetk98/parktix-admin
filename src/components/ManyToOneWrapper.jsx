import React, { useState, useEffect } from "react";
import { firestore, firebaseApp } from "./../firebase";
import AlertDialog from "./AlertDialog";
import Remove from "@material-ui/icons/Remove";

import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";

import CollectionEdit from "./CollectionEdit.jsx";

export default ({ document, moduleName, moduleId, manyToOneReference }) => {
  const [children, setChildren] = useState([]);

  useEffect(() => {
    if (!document || !manyToOneReference || !moduleId) {
      return;
    }
    firestore
      .collection(manyToOneReference.key)
      .where(
        manyToOneReference.parentRefKey,
        "==",
        firestore
          .collection(manyToOneReference.parentRefCollection)
          .doc(moduleId)
      )
      .get()
      .then(async (querySnapshot) => {
        const chidrenDocuments = [];

        querySnapshot.forEach((documentSnapshot) => {
          chidrenDocuments.push({
            ...documentSnapshot.data(),
            id: documentSnapshot.id,
          });
        });
        setChildren(chidrenDocuments);
      });
  }, [manyToOneReference, document, moduleId]);

  const removeManyToManyChild = (id, moduleName, moduleId) => {
    if (!manyToOneReference || !children || children.length == 0) return;
    const updateChildren = () =>
      setChildren((children) =>
        children.reduce((acc, it, chId) => {
          if (chId == id) {
            return acc;
          }
          return acc.concat(it);
        }, [])
      );
    if (moduleId && moduleName) {
      firestore
        .collection(moduleName)
        .doc(moduleId)
        .delete()
        .then(() => {
          updateChildren();
        });
    } else {
      updateChildren();
    }
  };

  return [
    <Grid container direction="row">
      {manyToOneReference &&
        children
          .sort((a, b) => a.order - b.order)
          .map((child, id) => (
            <Grid xs={12}>
              <ExpansionPanel
                className="border-black"
                key={child.id}
                defaultExpanded={false}
              >
                <ExpansionPanelSummary className="expansion-header">
                  <Grid container direction="row" justify="space-between">
                    <Grid>{manyToOneReference.getTitle(child)}</Grid>
                    <Grid>
                      <AlertDialog
                        confirm={(e) =>
                          removeManyToManyChild(
                            id,
                            manyToOneReference.moduleName,
                            child.id
                          )
                        }
                      >
                        <Remove />
                      </AlertDialog>
                    </Grid>
                  </Grid>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                  <CollectionEdit
                    {...manyToOneReference}
                    id={child.id}
                    parentModule={moduleName}
                    parentModuleId={moduleId}
                    disableChildSave={moduleId ? false : true}
                    persistDataToParent={(newDoc) =>
                      setChildren((children) =>
                        children.reduce((acc, it, redIt) => {
                          if (redIt === id) {
                            return acc.concat(newDoc);
                          }
                          return acc.concat(it);
                        }, [])
                      )
                    }
                  />
                </ExpansionPanelDetails>
              </ExpansionPanel>
            </Grid>
          ))}
    </Grid>,
    <Button
      color="primary"
      variant="outlined"
      onClick={(e) =>
        setChildren((children) =>
          children.concat(manyToOneReference.defaultValues)
        )
      }
    >
      {manyToOneReference.addButton}
    </Button>,
  ];
};
