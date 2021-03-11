import * as React from 'react';
import { useImmer } from 'use-immer';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import RestoreIcon from '@material-ui/icons/Restore';

import * as InputFields from './InputFields';

export interface CVVOptions {
  textConfig: { leftText: string; rightText: string; textSize: string; textColor: string };
  barConfig: { barColor: string; barWidth: number; barInnerWidthRatio: number };
}

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
  },
  margin: {
    margin: theme.spacing(1),
  },
}));

export const defaultOptions: CVVOptions = {
  textConfig: {
    leftText: 'LQ',
    rightText: 'HQ',
    textSize: '30px',
    textColor: '#FFFFFF',
  },
  barConfig: { barColor: '#990000', barWidth: 15, barInnerWidthRatio: 0.3 },
};

interface Props {
  onOptionChange: (option: CVVOptions) => any;
}

const Options = (props: Props) => {
  const classes = useStyles();
  const [options, updateOptions] = useImmer(defaultOptions);

  const restoreDefault = () => {
    updateOptions(draft => defaultOptions);
  };

  const handleChange = prop => event => {
    event.persist();
    let value = event.target.value;
    if (prop === 'textColor' || prop === 'barColor') {
      value = '#' + value;
    } else if (prop === 'textSize') {
      value = value + 'px';
    } else if (prop === 'barWidth') {
      value = parseInt(value);
    }

    updateOptions(draft => {
      draft.barConfig[prop] = value;
      draft.textConfig[prop] = value;
    });
  };

  React.useEffect(() => {
    props.onOptionChange(options);
  });

  return (
    <div className={classes.root}>
      <InputFields.InputText
        id="leftText"
        label="Left Text"
        value={options.textConfig.leftText}
        onChange={handleChange('leftText')}
      />

      <InputFields.InputText
        id="rightText"
        label="Right Text"
        value={options.textConfig.rightText}
        onChange={handleChange('rightText')}
      />

      <InputFields.InputPixel
        id="textSize"
        label="Text Size"
        value={options.textConfig.textSize.replace('px', '')}
        onChange={handleChange('textSize')}
      />

      <InputFields.InputColor
        id="textColor"
        label="Text Color"
        value={options.textConfig.textColor.replace('#', '')}
        onChange={handleChange('textColor')}
      />

      <InputFields.InputPixel
        id="barWidth"
        label="Bar Width"
        value={options.barConfig.barWidth}
        onChange={handleChange('barWidth')}
      />

      <InputFields.InputColor
        id="barColor"
        label="Bar Color"
        value={options.barConfig.barColor.replace('#', '')}
        onChange={handleChange('barColor')}
      />

      <Button variant="outlined" style={{ padding: '8.5px 16px' }} className={classes.margin} onClick={restoreDefault}>
        <RestoreIcon style={{ color: 'rgba(0, 0, 0, 0.54)' }} fontSize="large" />
      </Button>
    </div>
  );
};

export default Options;
