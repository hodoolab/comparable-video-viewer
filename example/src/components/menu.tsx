import * as React from 'react';

import { makeStyles, withStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import * as Routes from '../common/routes';
import * as Utils from '../common/utils';

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}
interface StyledTabProps {
  label: string;
}
interface StyledTabsProps {
  value: number;
  onChange: (event: React.ChangeEvent<{}>, newValue: number) => void;
}

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: '#FFFCFC',
    display: 'flex',
    height: '60vh',
    margin: '0 auto',
    maxWidth: '1920px',
  },
  tabPanel: {
    width: '100%',
  },
  indicator: {
    backgroundColor: '#a91b0d',
  },
}));

const CustomTabs = withStyles({
  root: {
    width: '100%',
    borderRight: '1px solid #e8e8e8',
  },
  indicator: {
    width: '4px',
    backgroundColor: '#a91b0d',
  },
})(Tabs);

const CustomTab = withStyles(theme => ({
  root: {
    margin: '0 0 0 auto',
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    '&:hover': {
      color: '#a91b0d',
      opacity: 0.5,
    },
    '&$selected': {
      color: '#a91b0d',
      fontWeight: theme.typography.fontWeightMedium,
    },
    '&:focus': {
      color: '#a91b0d',
    },
  },
  selected: {},
}))((props: StyledTabProps) => <Tab disableRipple {...props} />);

const getTabValueByPathName = (pathName: string) => {
  switch (Utils.stripTrailingSlash(pathName.toLowerCase())) {
    case '':
    case Routes.HOME:
      return 0;
    case Routes.BASIC:
      return 1;
    case Routes.VERTICAL_RESIZE:
      return 2;
    case Routes.SET_BOUND:
      return 3;
    case Routes.LATE_PAGE:
      return 4;
  }
  return -1;
};

const Menu = props => {
  const classes = useStyles();
  const { pathName, history } = props;
  return (
    <div className={classes.root}>
      <CustomTabs orientation="vertical" value={getTabValueByPathName(pathName)} aria-label="Vertical tabs">
        <CustomTab
          className={classes.tab}
          label="HOME"
          onClick={() => {
            history.push(Routes.HOME);
          }}
          // {...a11yProps(0)}
        />
        <CustomTab
          className={classes.tab}
          label="Basic Usage"
          onClick={() => {
            history.push(Routes.BASIC);
          }}
          // {...a11yProps(1)}
        />
        <CustomTab
          className={classes.tab}
          label="Vertical Resize"
          onClick={() => {
            history.push(Routes.VERTICAL_RESIZE);
          }}
          // {...a11yProps(2)}
        />
        <CustomTab
          className={classes.tab}
          label="Set Bound"
          onClick={() => {
            history.push(Routes.SET_BOUND);
          }}
          // {...a11yProps(3)}
        />
        <CustomTab
          className={classes.tab}
          label="Late"
          onClick={() => {
            history.push(Routes.LATE_PAGE);
          }}
          // {...a11yProps(3)}
        />
      </CustomTabs>
    </div>
  );
};

export default Menu;
