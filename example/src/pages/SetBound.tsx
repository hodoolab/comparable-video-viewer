import * as React from 'react';

import ComparableVideoViewer from '../../../lib';

import Slider from '@material-ui/core/Slider';
import ReactCrop from 'react-image-crop';
import '~/assets/ReactCrop.css';
import { useDebouncedCallback } from 'use-debounce';

import Layout from '~/components/layout';
import HeightButtons from '~/components/heightButtons';
import { wait } from '~/common/utils';

const SampleVideo = "https://dg2ewbztsbj12.cloudfront.net/SampleVideo.mp4"

interface Crop {
  aspect?: number;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  unit?: 'px' | '%';
}

// 0<= Bar Position <= 1
const onUpdateBar = (pos: number) => {
  // Redux code should be here
  // console.log('Bar Position Updated: ' + pos);
};

const SAMPLE_VIDEO_POSTER = 'https://i.ibb.co/TMH9GGs/sampleimg.png';
const SAMPLE_VIDEO_WIDTH = 960;
const SAMPLE_VIDEO_HEIGHT = 720;

const CROP_WIDTH = 320;
const CROP_HEIGHT = 240;
const INITIAL_CROP_STATE: Crop = {
  unit: '%', // default, can be 'px' or '%'
  x: 20,
  y: 20,
  width: 60,
  height: 60,
  aspect: 4 / 3,
};

// const getScreenshot = videoEl => {
//   const canvas = new OffscreenCanvas(CROP_WIDTH, CROP_HEIGHT);
//   const gl = canvas
//     .getContext('2d')
//     .drawImage(
//       videoEl,
//       SAMPLE_VIDEO_WIDTH,
//       0,
//       SAMPLE_VIDEO_WIDTH,
//       SAMPLE_VIDEO_HEIGHT,
//       0,
//       0,
//       canvas.width,
//       canvas.height
//     );

//   // As a blob
//   return new Promise((resolve, reject) => {
//     resolve(
//       canvas.convertToBlob({
//         type: 'image/jpeg',
//         quality: 0.2,
//       })
//     );
//   });
// };

const makeBound = (crop: Crop) => {
  return {
    x: (crop.x! * SAMPLE_VIDEO_WIDTH) / CROP_WIDTH,
    y: (crop.y! * SAMPLE_VIDEO_HEIGHT) / CROP_HEIGHT,
    width: (crop.width! * SAMPLE_VIDEO_WIDTH) / CROP_WIDTH,
    height: (crop.height! * SAMPLE_VIDEO_HEIGHT) / CROP_HEIGHT,
  };
};

const SetBound = (props: any) => {
  const [vhSize, setVhSize] = React.useState(30);
  const [crop, setCrop] = React.useState(INITIAL_CROP_STATE);
  const [bound, setBound] = React.useState(makeBound(INITIAL_CROP_STATE));
  const [src, setSrc] = React.useState();
  const debouncedCallback = useDebouncedCallback(
    newCrop => {
      setBound(makeBound(newCrop));
    },
    10,
    { maxWait: 30 }
  );

  // #region videoPreview
  // async function waitUntilVideoMount() {
  //   let count = 0;
  //   while (count < 100) {
  //     console.log('waiting...');
  //     if (props.videoRef && props.videoRef.current && props.videoRef.current.videoHeight !== 0) {
  //       return true;
  //     }
  //     await wait(100);
  //     count++;
  //   }
  //   return false;
  // }

  // React.useEffect(() => {
  //   const onTimeUpdate = e => {
  //     getScreenshot(videoRef.current)
  //       .then(blob => {
  //         setSrc(URL.createObjectURL(blob));
  //         // console.log(blob);
  //       })
  //       .catch(e => {
  //         console.log(e);
  //       });
  //   };
  //   async function setAfterVideoMount() {
  //     if (await waitUntilVideoMount()) {
  //       videoRef.current && videoRef.current.addEventListener('timeupdate', onTimeUpdate);
  //     }
  //   }
  //   setAfterVideoMount();

  //   return () => {
  //     videoRef.current && videoRef.current.removeEventListener('timeupdate', onTimeUpdate);
  //   };
  // }, []);
  // #endregion

  const onCropChange = (newCrop: Crop) => {
    setCrop(newCrop);
    debouncedCallback(newCrop);
  };

  return (
    <Layout {...props}>
      <div style={{ width: '50vw', display: 'inline-block' }}>
        <div
          style={{
            padding: '20px 40px',
            background: '#f8dad3',
            borderBottom: '3px solid white',
          }}
        >
          <HeightButtons
            onMinus={() => {
              setVhSize(vhSize - 5);
            }}
            onPlus={() => {
              setVhSize(vhSize + 5);
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
          }}
        >
          <ComparableVideoViewer src={SampleVideo} onUpdateBarPosition={onUpdateBar} bound={bound} />
        </div>
      </div>
      <div
        style={{
          display: 'inline-block',
          position: 'fixed',
          width: `${CROP_WIDTH}px`,
          height: `${CROP_HEIGHT}px`,
          margin: '1.5rem',
        }}
      >
        <ReactCrop
          src={src ? src : SAMPLE_VIDEO_POSTER}
          crop={crop}
          onChange={onCropChange}
          keepSelection={true}
          minWidth={20}
          imageStyle={{ marginBottom: 0 }}
        />
      </div>
    </Layout>
  );
};

export default SetBound;
