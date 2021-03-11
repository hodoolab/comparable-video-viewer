import * as React from 'react';
import styled from 'styled-components';
import Seek from './Seek';
import SVG from './SVG';
import { waitUntil, convertSecondsToString } from '../Utils';

interface Props {
  videoRef: React.RefObject<HTMLVideoElement>;
  isFullScreen: boolean;
  onPlayStateChanged: (isPlaying: boolean) => void;
  onFullscreenRequested: (goFull: boolean) => void;
}

const Controls = (props: Props) => {
  const [videoEl, setVideoEl] = React.useState<HTMLVideoElement>();
  const [percentagePlayed, setPercentagePlayed] = React.useState(0);
  const [isPlaying, setIsPlaying] = React.useState(false);

  React.useEffect(() => {
    const whenReady = async () => {
      return await waitUntil(() => {
        console.debug('wait video set');
        return !!props.videoRef.current;
      })();
    };

    let remove = () => {};
    whenReady().then(success => {
      const video = props.videoRef.current!;
      setVideoEl(video);

      const onPlay = () => {
        setIsPlaying(true);
      };
      video.addEventListener('playing', onPlay);

      const onPause = () => {
        setIsPlaying(false);
      };
      video.addEventListener('pause', onPause);

      const onTimeUpdate = () => {
        setPercentagePlayed((100 * video.currentTime) / video.duration);
      };
      video.addEventListener('timeupdate', onTimeUpdate);
      remove = () => {
        video.removeEventListener('playing', onPlay);
        video.removeEventListener('pause', onPause);
        video.removeEventListener('timeupdate', onTimeUpdate);
      };
    });
    return () => {
      remove();
    };
  }, []);

  if (videoEl) {
    return (
      <>
        <SControlButton
          onClick={e => {
            props.onPlayStateChanged(!isPlaying)
            if (!isPlaying) {
              videoEl.play();
            } else {
              videoEl.pause();
            }
            setIsPlaying(!isPlaying);
          }}
          style={{ left: 0 }}
        >
          {isPlaying ? <SVG name='pause' size='40px' color='#fff' /> : <SVG name='play' size='40px' color='#fff' />}
        </SControlButton>
        <Seek
          onChange={e => {
            const cur = Math.floor(parseInt(e.target.value) * videoEl.duration) / 100;
            videoEl.currentTime = cur;
            videoEl.play();
            props.onPlayStateChanged(true);
          }}
          percentagePlayed={percentagePlayed}
        />
        <STimeViewer>
          <span style={{ userSelect: 'none' }}>{`${convertSecondsToString(
            ~~(videoEl.duration - videoEl.currentTime)
          )}`}</span>
        </STimeViewer>
        <SControlButton
          onClick={e => {
            props.onFullscreenRequested(!props.isFullScreen);
          }}
          style={{ right: 0 }}
        >
          {props.isFullScreen ? (
            <SVG name='fullscreen_exit' size='40px' color='#fff' />
          ) : (
            <SVG name='fullscreen' size='40px' color='#fff' />
          )}
        </SControlButton>
      </>
    );
  } else {
    return <></>;
  }
};

const SControlButton = styled.div`
  position: absolute;
  height: 100%;
  margin: 0;
  padding: 0;
  display: inline-block;
`;

const STimeViewer = styled.div`
  position: absolute;
  right: 40px;
  width: 80px;
  height: 100%;
  color: #fff;
  margin: 0;
  padding: 0;
  display: inline-block;
  line-height: 2.3em;
  font-size: 1em;
  font-family: Menlo, Monaco, Courier, 'Courier New', Hack, Mono, Monospace, Prestige, Everson Mono;
`;

export default Controls;
