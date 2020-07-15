import firebase from "firebase";
const {
  firestore: { DocumentReference },
} = firebase;

const startHydration = () => {
  let promiseArr = [];
  return {
    getAllHydratedRefs: async (newDocuments) => {
      if (promiseArr.length === 0) {
        return newDocuments;
      }
      try {
        const refDocs = await Promise.all(promiseArr);
        if (Array.isArray(newDocuments)) {
          return newDocuments.reduce((acc, it) => {
            let updatedDoc = { ...it };

            refDocs
              .filter((doc) => {
                if (doc.id == it.id) {
                  return true;
                }
                return false;
              })
              .forEach(
                (it) =>
                  (updatedDoc[it.key] = {
                    id: it.refData.id,
                    ...it.refData.data(),
                  })
              );
            return acc.concat(updatedDoc);
          }, []);
        } else {
          return refDocs
            .filter((doc) => {
              if (doc.id == newDocuments.id) {
                return true;
              }
              return false;
            })
            .reduce(
              (acc, it) => ({
                ...acc,
                [it.key]: {
                  id: it.refData.id,
                  ...it.refData.data(),
                },
              }),
              { ...newDocuments }
            );
        }
      } catch (e) {
        console.log(e);
      }
    },
    hydrateAllRefs: (document, id) =>
      (promiseArr = promiseArr.concat(
        Object.keys(document).reduce((acc, key) => {
          const refDoc = document[key];
          if (refDoc instanceof DocumentReference == false) {
            return acc;
          }
          return acc.concat(
            new Promise(async (resolve, reject) => {
              try {
                const refData = await refDoc.get();
                return resolve({
                  id,
                  key,
                  refData,
                });
              } catch (e) {
                reject();
              }
            })
          );
        }, [])
      )),
  };
};

export { startHydration };
