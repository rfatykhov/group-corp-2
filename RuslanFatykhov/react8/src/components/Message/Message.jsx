import React from "react";
import classNames from "classnames";
import { Grid, withStyles } from "@material-ui/core";
import "./Message.scss";

export const Message = ({ text, author }) => {
  const classes = classNames("message", {
    "message-sender": author !== "Робот",
    "message-bot": author === "Робот",
  });

  return (
    <Grid className={classes}>
      <div className="box">
        <b className="message-author">{author}</b>: {text}
      </div>
    </Grid>
  );
};
