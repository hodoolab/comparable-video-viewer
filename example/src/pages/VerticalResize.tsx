import * as React from 'react';

import ComparableVideoViewer from '../../../lib';

import Slider from '@material-ui/core/Slider';

import Layout from '~/components/layout';
import HeightButtons from '~/components/heightButtons';

import { wait, isNumber } from '~/common/utils';

const SampleVideo = "https://dg2ewbztsbj12.cloudfront.net/SampleVideo2.mp4"

const SLIDER_MIN = 20;
const SLIDER_MAX = 90;

// 0<= Bar Position <= 1
const initialBarPosition = 0.5;
const onUpdateBar = (pos: number) => {
  // Redux code should be here
  // console.log('Bar Position Updated: ' + pos);
};

const VerticalResize = (props: any) => {
  const [vhSize, setVhSize] = React.useState(60);
  const [scale, setScale] = React.useState('1.00x');

  const onResize = (scale: number) => {
    setScale(scale.toFixed(2) + 'x');
  };

  return (
    <Layout {...props}>
      <div
        style={{
          marginTop: '30px',
          width: '100%',
          padding: '1.0875rem 2.45rem',
          background: '#f8dad3',
          borderBottom: '3px solid white',
        }}
      >
        <span>{`${vhSize.toFixed(2)} vh (${scale})`}</span>
        <Slider
          id="sliderX"
          value={vhSize}
          min={SLIDER_MIN}
          max={SLIDER_MAX}
          onChange={(e, val) => {
            if (isNumber(val)) {
              setVhSize(val);
            }
          }}
        />
      </div>
      <div
        id="stream"
        style={{
          textAlign: 'center',
          width: '100%',
          margin: '0px auto',
          padding: '1.0875rem 1.45rem',
          height: `calc(${vhSize}vh + 2.175rem)`,
          background: '#f8dad3',
          position: 'relative',
        }}
      >
        <ComparableVideoViewer
          src={SampleVideo}
          initialBarPosition={initialBarPosition}
          onUpdateBarPosition={onUpdateBar}
          onResize={onResize}
          autoPlay={true}
          // muted={true}
        />
      </div>
    </Layout>
  );
};

export default VerticalResize;
