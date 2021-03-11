import * as React from 'react';

export interface DrawImageArgs {
  image: CanvasImageSource;
  sourceX: number;
  sourceY: number;
  sourceWidth: number;
  sourceHeight: number;
  drawX: number;
  drawY: number;
  drawWidth: number;
  drawHeight: number;
}

interface Props {
  leftCanvasRef: React.RefObject<HTMLCanvasElement>;
  rightCanvasRef: React.RefObject<HTMLCanvasElement>;
  targetFrameRate: number;
  onLoop: (canvas: HTMLCanvasElement, canvas2: HTMLCanvasElement) => void;
}

class LoopCanvas extends React.Component<Props> {
  static defaultProps: Partial<Props> = {
    targetFrameRate: 30,
  };

  // private frameRate: number;
  // private deltaTime: number;
  private lastFrameTime: number;
  private requestAnimId: number;

  constructor(props: Props) {
    super(props);
    this.lastFrameTime = 0;
  }

  // Inspired by p5.js
  // https://github.com/processing/p5.js/blob/master/src/core/main.js
  draw = () => {
    if (!this || !this.props.onLoop) {
      this.requestAnimId = window.requestAnimationFrame(this.draw);
      return;
    }

    const now = window.performance.now();
    const time_since_last = now - this.lastFrameTime;
    const target_time_between_frames = 1000 / this.props.targetFrameRate;

    // only draw if we really need to; don't overextend the browser.
    // draw if we're within 5ms of when our next frame should paint
    // (this will prevent us from giving up opportunities to draw
    // again when it's really about time for us to do so). fixes an
    // issue where the frameRate is too low if our refresh loop isn't
    // in sync with the browser. note that we have to draw once even
    // if looping is off, so we bypass the time delay if that
    // is the case.
    const epsilon = 5;
    if (time_since_last >= target_time_between_frames - epsilon) {
      // this.frameRate = 1000.0 / (now - this.lastFrameTime);
      // this.deltaTime = now - this.lastFrameTime;
      this.lastFrameTime = now;
      this.props.onLoop && this.props.onLoop(this.props.leftCanvasRef.current!, this.props.rightCanvasRef.current!);
    }

    this.requestAnimId = window.requestAnimationFrame(this.draw);
  };

  stopDraw() {
    this.requestAnimId && window.cancelAnimationFrame(this.requestAnimId);
  }

  componentDidMount() {
    this.draw();
  }

  componentDidUpdate() {
    this.stopDraw();
    this.draw();
  }

  componentWillUnmount() {
    this.stopDraw();
  }

  render() {
    return (
      <>
        <canvas id='lc1' ref={this.props.leftCanvasRef} style={{ width: '100%' }} />
        <canvas id='lc2' ref={this.props.rightCanvasRef} style={{ width: '100%' }} />
      </>
    );
  }
}

// No Need to render again. All Stuffs are just pointers.
export default React.memo(LoopCanvas, (prev, next) => prev.leftCanvasRef === next.leftCanvasRef &&  prev.rightCanvasRef === next.rightCanvasRef);
