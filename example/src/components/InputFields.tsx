import * as React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  margin: {
    margin: theme.spacing(1),
  },
  textField: {
    flexBasis: 100,
  },
  textFieldLarge: {
    flexBasis: 140,
  },
}));

export const InputBoolean = ({ id, label, value, onChange }) => {
  const classes = useStyles();
  return (
    <TextField
      id={id}
      select
      className={clsx(classes.margin, classes.textField)}
      variant="outlined"
      label={label}
      value={value}
      onChange={onChange}
      // InputProps={{
      //   startAdornment: <InputAdornment position="start">Kg</InputAdornment>,
      // }}
    >
      <MenuItem key={'true'} value={true}>
        True
      </MenuItem>
      <MenuItem key={'false'} value={false}>
        False
      </MenuItem>
    </TextField>
  );
};

export const InputPixel = ({ id, label, value, onChange }) => {
  const classes = useStyles();

  return (
    <TextField
      id={id}
      type="number"
      className={clsx(classes.margin, classes.textField)}
      variant="outlined"
      label={label}
      value={value}
      onChange={onChange}
      InputProps={{
        endAdornment: <InputAdornment position="end">px</InputAdornment>,
      }}
    />
  );
};

export const InputText = ({ id, label, value, onChange }) => {
  const classes = useStyles();

  return (
    <TextField
      id={id}
      className={clsx(classes.margin, classes.textField)}
      variant="outlined"
      label={label}
      value={value}
      onChange={onChange}
    />
  );
};

export const InputColor = ({ id, label, value, onChange }) => {
  const classes = useStyles();

  return (
    <TextField
      id={id}
      className={clsx(classes.margin, classes.textFieldLarge)}
      variant="outlined"
      label={label}
      value={value}
      onChange={onChange}
      InputProps={{
        startAdornment: <InputAdornment position="start">#</InputAdornment>,
        endAdornment: (
          <InputAdornment
            position="end"
            style={{
              height: '17px',
              width: '17px',
              background: '#' + value,
              border: '1px solid rgba(0, 0, 0, 0.23)',
            }}
          >
            {'　'}
          </InputAdornment>
        ),
      }}
    />
  );
};
