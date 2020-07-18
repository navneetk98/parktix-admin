import React, { useState } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";

import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import Home from "./views/Home";
import Login from "./views/Login";
import AssessmentForm from "./views/AssessmentForm";
import CollectionListing from "./components/CollectionListing.jsx";
import CollectionEdit from "./components/CollectionEdit.jsx";
import AddOperator from "./components/addOperator";
import collections from "./commons/collections";
import SideNav from "./components/SideNav";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#008080",
    },
  },
});

function App() {
  const [value, setValue] = useState(2);

  const setVal = () => {
    setValue(2);
  };

  const resetVal = () => {
    setValue(1);
  };

  return (
    <MuiThemeProvider theme={theme}>
      <BrowserRouter>
        <AuthProvider>
          <Grid container>
            <Grid item xs={value}>
              <SideNav setVal={setVal} resetVal={resetVal} />
            </Grid>
            <Grid item xs={10}>
              <div className="App">
                <Switch>
                  <Route exact path="/login" component={Login} />
                  <PrivateRoute exact path="/" component={Home} />
                  <PrivateRoute exact path="/operator" component={AddOperator} />
                  <PrivateRoute
                    exact
                    path="/assessments/edit/:assessmentID"
                    component={AssessmentForm}
                  />
                  <PrivateRoute
                    exact
                    path="/assessments/create"
                    component={AssessmentForm}
                  />
                  {collections.map((collection) => {
                    const { urlKey } = collection;
                    return (
                      <PrivateRoute
                        exact
                        path={`/${urlKey}`}
                        component={() => <CollectionListing {...collection} />}
                      ></PrivateRoute>
                    );
                  })}
                  {collections.map((collection) => {
                    const {
                      urlKey,
                      enableEdit,
                      dontShowRoute = false,
                    } = collection;
                    if (!enableEdit && dontShowRoute) return;
                    return (
                      <PrivateRoute
                        exact
                        path={`/${urlKey}/edit/:moduleId/`}
                        component={() => <CollectionEdit {...collection} />}
                      ></PrivateRoute>
                    );
                  })}
                  {collections.map((collection) => {
                    const {
                      moduleName,
                      enableCreate,
                      dontShowRoute = false,
                    } = collection;
                    if (!enableCreate && dontShowRoute) return;
                    return (
                      <PrivateRoute
                        exact
                        path={`/${moduleName}/create/`}
                        component={() => <CollectionEdit {...collection} />}
                      ></PrivateRoute>
                    );
                  })}
                </Switch>
              </div>
            </Grid>
          </Grid>
        </AuthProvider>
      </BrowserRouter>
    </MuiThemeProvider>
  );
}

export default App;
