import React, { useContext } from "react";
import clsx from "clsx";
import { useTheme } from "@material-ui/core/styles";
import withStyles from "@material-ui/core/styles/withStyles";
import Drawer from "@material-ui/core/Drawer";
import CssBaseline from "@material-ui/core/CssBaseline";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import collections from "../commons/collections";
import { AuthContext } from "../context/AuthContext";
import { NavLink, useParams } from "react-router-dom";
import SideNavStyles from "./SideNavStyles";
import LogoutButton from "./LogoutButton";

function ListItemLink(props) {
  return <ListItem button component="a" {...props} />;
}

const SideNav = ({ classes, setVal, resetVal }) => {
  const theme = useTheme();
  const [open, setOpen] = React.useState(true);
  const { loggedInUser } = useContext(AuthContext);

  const handleDrawerOpen = () => {
    setOpen(true);
    setVal();
  };

  const handleDrawerClose = () => {
    setOpen(false);
    resetVal();
  };

  if (loggedInUser) {
    return (
      <div className={classes.root}>
        <CssBaseline />
        <AppBar
          position="fixed"
          className={clsx(classes.appBar, {
            [classes.appBarShift]: open,
          })}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              className={clsx(classes.menuButton, open && classes.hide)}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              className={classes.title}
            >
              Parktix Admin Panel
            </Typography>
            <LogoutButton />
          </Toolbar>
        </AppBar>
        <Drawer
          className={classes.drawer}
          variant="persistent"
          anchor="left"
          open={open}
          classes={{
            paper: classes.drawerPaper,
          }}
        >
          <div className={classes.drawerHeader}>
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === "ltr" ? (
                <ChevronLeftIcon />
              ) : (
                  <ChevronRightIcon />
                )}
            </IconButton>
          </div>
          <Divider />
          <List>
            <ListItem button key="home">
              <NavLink
                to="/"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <ListItemText primary="Home" />
              </NavLink>
            </ListItem>
            <ListItem button key="Add operator">
              <NavLink to="/operator" style={{ textDecoration: "none", color: "inherit" }}>
                <ListItemText primary="Add Operator" />
              </NavLink>
            </ListItem>
            <ListItem button key="View Logs">
              <NavLink to="/logs" style={{ textDecoration: "none", color: "inherit" }}>
                <ListItemText primary="View Logs" />
              </NavLink>
            </ListItem>

            {collections.map(({ name, urlKey }) => (
              <ListItem button key={name}>
                <NavLink
                  to={`/${urlKey}`}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <ListItemText primary={name} />
                </NavLink>
              </ListItem>
            ))}

            {/* {collections.map(({ name, urlKey }) => (
              <ListItemLink href={`/${urlKey}`}>
                <ListItemText primary={name} />
              </ListItemLink>
            ))} */}
          </List>
        </Drawer>
      </div>
    );
  } else {
    return <p></p>;
  }
};

export default withStyles(SideNavStyles)(SideNav);
