import React from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from '@material-ui/core/Typography';
import { makeStyles } from "@material-ui/core/styles";


const useStyles = makeStyles({
  card: {
    margin: "4% 2%",
    minWidth: 175
  }
});

export default (props) => {
  const classes = useStyles();
  return (
      <Card className={classes.card}>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              {props.name}
            </Typography>
            <Typography variant="h5" component="h2">
              {props.value}
            </Typography>
          </CardContent>
        </Card>
  );
};
