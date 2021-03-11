import * as React from 'react';
import ComparableVideoViewer from '../../../lib';

import Layout from '~/components/layout';
import Options, { defaultOptions, CVVOptions } from '~/components/options';

const SampleVideo = "https://dg2ewbztsbj12.cloudfront.net/SampleVideo.mp4"

// 0 <= Bar Position <= 1
const onUpdateBar = (pos: number) => {
  // console.log('Bar Position Updated: ' + pos);
};

const Basic = (props: any) => {
  const [options, setOptions] = React.useState(defaultOptions);

  const onOptionChange = (options: CVVOptions) => {
    setOptions(options);
  };

  return (
    <Layout {...props}>
      <div
        style={{
          padding: '0 0 10px 0',
        }}
      >
        <Options onOptionChange={onOptionChange} />
        <hr style={{ width: '10%', margin: '1rem auto' }} />
      </div>
      <div
        style={{
          textAlign: 'center',
          padding: '0 0 15px 0',
        }}
      >
        <div
          id="stream"
          style={{
            textAlign: 'center',
            width: '100%',
            margin: '0px auto',
            padding: '1.0875rem 1.45rem',
            background: '#f8dad3',
          }}
        >
          <ComparableVideoViewer
            src={SampleVideo}
            initialBarPosition={0.5}
            onUpdateBarPosition={onUpdateBar}
            barConfig={{ barColor: '#990000', barWidth: 15, barInnerWidthRatio: 0.3 }}
            textConfig={{
              leftText: 'LQ',
              rightText: 'HQ',
              textSize: '30px',
              textColor: '#FFFFFF',
            }}
          />
        </div>
      </div>
    </Layout>
  );
};

export default Basic;
