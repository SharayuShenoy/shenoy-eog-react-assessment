import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Checkbox from '@material-ui/core/Checkbox';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    margin: '5% 2%',
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 500,
  },
}));

const MenuProps = {
  PaperProps: {
    style: {
      width: 250,
      margin: '4% 0%',
    },
  },
};

export default (props) => {
  const classes = useStyles();
  const [personName, setPersonName] = useState([]);
  const { names } = props;
  const handleChange = (event) => {
    setPersonName(event.target.value);
    props.metricsChange(event.target.value);
  };

  return (
    <div className={classes.root}>
      <FormControl className={classes.formControl}>
        <InputLabel htmlFor="select-multiple-checkbox">Select Metrics To View Historical Data</InputLabel>
        <Select
          multiple
          value={personName}
          onChange={handleChange}
          input={<Input id="select-multiple-checkbox" />}
          renderValue={(selected) => selected.join(', ')}
          MenuProps={MenuProps}
        >
          {names.map((name) => (
            <MenuItem key={name} value={name}>
              <Checkbox checked={personName.indexOf(name) > -1} />
              <ListItemText primary={name} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
};
