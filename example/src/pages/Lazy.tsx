import * as React from 'react';
import ComparableVideoViewer from '../../../lib';

import Layout from '~/components/layout';

const SampleVideo = "https://dg2ewbztsbj12.cloudfront.net/SampleVideo2.mp4"

// 0<= Bar Position <= 1
const initialBarPosition = 0.5;
const onUpdateBar = (pos: number) => {
  // console.log('Bar Position Updated: ' + pos);
};

const queue: any[] = [];

const mediaSource = new MediaSource();
const src = URL.createObjectURL(mediaSource);

const Lazy = (props: any) => {
  // const [src, setSrc] = React.useState('');

  React.useEffect(() => {
    var mimeCodec = 'video/mp4; codecs="avc1.4D401F"';

    if (!('MediaSource' in window && MediaSource.isTypeSupported(mimeCodec))) {
      console.error('Unsupported MIME type or codec: ', mimeCodec);
    }

    const onSourceOpen = (e: Event) => {
      const video = e.target as MediaSource;
      const sourceBuffer = video.addSourceBuffer(mimeCodec);
      console.log(mediaSource.readyState); // open
      queue.push('https://testcontent.eyevinn.technology/mse-tutorial/vinn-video=1660000-0.dash');
      queue.push('https://testcontent.eyevinn.technology/mse-tutorial/vinn-video=1660000-25600.dash');
      queue.push('https://testcontent.eyevinn.technology/mse-tutorial/vinn-video=1660000-51200.dash');
      video.duration = 6; // (51200 + 25600) / 12800

      // Fetch init segment (contains mp4 header)
      fetchSegmentAndAppend(
        'https://testcontent.eyevinn.technology/mse-tutorial/vinn-video=1660000.dash',
        sourceBuffer,
        () => {
          function iter() {
            // Pop segment from queue
            const url = queue.shift();
            if (url === undefined) {
              return;
            }
            // Download segment and append to source buffer
            fetchSegmentAndAppend(url, sourceBuffer, function(err: any) {
              if (err) {
                console.error(err);
              } else {
                setTimeout(iter, 200);
              }
            });
          }
          iter();
          // video.play();
        }
      );

      function fetchSegmentAndAppend(segmentUrl: string, sourceBuffer: SourceBuffer, callback: any) {
        fetchArrayBuffer(segmentUrl, buf => {
          sourceBuffer.addEventListener('updateend', e => {
            callback();
          });
          sourceBuffer.addEventListener('error', e => {
            callback(e);
          });
          sourceBuffer.appendBuffer(buf);
        });
      }

      function fetchArrayBuffer(url: string, callback: (buf: ArrayBuffer) => void) {
        let xhr = new XMLHttpRequest();
        xhr.open('get', url);
        xhr.responseType = 'arraybuffer';
        xhr.onload = function() {
          setTimeout(() => {
            callback(xhr.response);
          }, 4000);
        };
        xhr.send();
      }
    };

    mediaSource.addEventListener('sourceopen', onSourceOpen);
    // setSrc(URL.createObjectURL(mediaSource));
  }, []);

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
          <ComparableVideoViewer src={src} onUpdateBarPosition={onUpdateBar} />
        </div>
      </div>
    </Layout>
  );
};

export default Lazy;
