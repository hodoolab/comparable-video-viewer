import * as React from 'react';
import ComparableVideoViewer from '../../../lib';

import Layout from '~/components/layout';

const SampleVideo = "https://dg2ewbztsbj12.cloudfront.net/SampleVideo2.mp4"


// 0<= Bar Position <= 1
const initialBarPosition = 0.5;
const onUpdateBar = (pos: number) => {
  // console.log('Bar Position Updated: ' + pos);
};

const textConfig = { leftText: 'hi', rightText: 'hello', textColor: '#FFFF00', textSize: '20px' };

const IndexPage = (props: any) => {
  return (
    <Layout {...props}>
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
            width: '80%',
            margin: '0px auto',
            padding: '1.0875rem 1.45rem',
            background: '#f8dad3',
          }}
        >
          <ComparableVideoViewer
            src={SampleVideo}
            initialBarPosition={initialBarPosition}
            onUpdateBarPosition={onUpdateBar}
            onResize={s => console.log(s)}
            textConfig={textConfig}
          />
        </div>
      </div>
    </Layout>
  );
};

export default IndexPage;
