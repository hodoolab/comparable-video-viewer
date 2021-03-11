# Comparable Video Viewer

React Component for compare original and filtered Video

[Example Page](https://comparable-video-viewer.pages.dev)

## installation

~~~ shell
// with npm
$ npm install comparable-video-viewer

// with yarn
$ yarn add comparable-video-viewer
~~~

## Run Example

~~~ shell
// build
$ yarn && yarn build

// run example
$ yarn && yarn build && yarn start-demo
~~~

## Source video

- Source video should be merged side-by-side
- [Example Video](https://dg2ewbztsbj12.cloudfront.net/SampleVideo.mp4)

- Merge video with ffmpeg (Sample)

~~~ shell
$ ffmpeg \
  -i ./SampleVideo_320x240.mp4 \
  -i ./SampleVideo_960x720.mp4 \
  -filter_complex "
  [0:v] scale=w=$SW:h=$SH,pad=$SW*2:$SH[int];
  [int][1:v]overlay=W/2:0[vid]
  "  \
  -map [vid] \
  -c:v libx264 \
  -crf 18 \
  -preset veryfast \
  ./OutputVideo_Merged.mp4
~~~

## Usage Examples

- Basic

~~~ jsx
  <ComparableVideoViewer src={SampleVideo} />
~~~

- With Appearance Configs

~~~ jsx
  <ComparableVideoViewer
    src={SampleVideo}
    barConfig={{
      barColor: '#990000',
      barWidth: 15,
      barInnerWidthRatio: 0.3
    }}
    textConfig={{
      leftText: 'LQ',
      rightText: 'HQ',
      textSize: '30px',
      textColor: '#FFFFFF',
    }}
  />
~~~

- With bound (**should give px values**)
- 
~~~ jsx
  <ComparableVideoViewer
    src={SampleVideo}
    bound={{
      x: 100,
      y: 50,
      width: 120,
      height: 90,
    }}
  />
~~~

## Props

### Prop Lists

| name                    | Type              | Default         | Description                               |
| ----------------------- | ----------------- | --------------- | ----------------------------------------- |
| `src`                   | String            | **REQUIRED**    | Source url to show                        |
| `haveControls`          | boolean           | `true`          | Show Controls                             |
| `initialBarPosition`    | number            | `0.5`           | Bar Position between 0,1                  |
| `targetFrameRate`       | number            | `30`            | target frame per second                   |
| ----------------------- | ----------------- | --------------- | ----------------------------------------- |
| `autoPlay`              | boolean           | `true`          | auto play video                           |
| `muted`                 | boolean           | `true`          | mute video                                |
| `loop`                  | boolean           | `true`          | loop video                                |
| ----------------------- | ----------------- | --------------- | ----------------------------------------- |
| `onResize`              | `number => void`  |                 | fires when this component resize          |
| `onUpdateBarPoisition`  | `number => void`  |                 | fires when bar position updated           |
| ----------------------- | ----------------- | --------------- | ----------------------------------------- |
| `barConfig`             | `BarConfig`       |                 | config about bar appearance               |
| `textConfig`            | `TextConfig`      |                 | config about overlay texts                |
| `bound`                 | `Bound`           |                 | bound to show                             |

### Default Props

~~~ typescript
const NO_BOUND: number = -99999;

const defaultProps = {
    haveControls: true,
    initialBarPosition: 0.5,
    targetFrameRate: 30,

    autoPlay: true,
    muted: true,
    loop: true,

    onUpdateBarPosition: (position: number) => {},
    onResize: (scale: number) => {},

    barConfig: {
      barColor: '#FFFFFF',
      barWidth: 15,
      barInnerWidthRatio: 0.3,
    },

    bound: { 
      x: 0,
      y: 0,
      width: NO_BOUND,
      height: NO_BOUND
    },
  }
~~~

### Prop Type definition

~~~typescript
interface Bound {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface BarConfig {
  barColor: Color;
  // barHoverOpacity: number;
  barWidth: number;
  barInnerWidthRatio: number;
}

interface TextConfig {
  leftText: string;
  rightText: string;
  textSize: string;
  textColor: Color;
}
~~~

## Related

- [TSDX](https://github.com/palmerhq/tsdx) - Zero-config CLI for TypeScript used by this repo.
- [p5.js](https://github.com/processing/p5.js) - JavaScript library for creative coding which inspires the method for canvas handling.
