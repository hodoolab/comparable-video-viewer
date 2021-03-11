import * as CSS from 'csstype';
import * as React from 'react';
import styled from 'styled-components';
import { BarConfig, Bound, TextConfig } from './Config';
import Controls from './Controls';
import LoopCanvas from './LoopCanvas';
import { waitUntil, isColorString } from './Utils';

const NO_BOUND: number = -99999;
const BAR_POSITION_UNSET = -99;
const CONTROL_BAR_HEIGHT_PX = 40;

// #region Types
interface Props {
  src: string;

  // viewer
  haveControls?: boolean;
  initialBarPosition: number;
  targetFrameRate: number;

  // video
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;

  // handler
  onResize: (scale: number) => void;
  onUpdateBarPosition: (barPosition: number) => void;

  // appearance
  barConfig: BarConfig;
  textConfig?: TextConfig;

  // bound
  bound: Bound;
}

interface State {
  isFullScreen: boolean;
}

interface RefElements {
  video: HTMLVideoElement;
  componentWrapper: HTMLDivElement;
  leftCanvas: HTMLCanvasElement;
  rightCanvas: HTMLCanvasElement;
  bar: HTMLDivElement;
}

// #endregion

class ComparableVideoViewer extends React.Component<Props, State> {
  // #region props
  static defaultProps: Partial<Props> = {
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

    bound: { x: 0, y: 0, width: NO_BOUND, height: NO_BOUND },
  };

  validateProps(props: Readonly<Props>): boolean {
    let isValidate = true;

    if (!props.barConfig || !props.barConfig.barColor){
      // console.warn('::: Warning!!!!! Wrong Props @ ComparableVideoViewer ::\n' + 'barColor is not Color String');
      isValidate = false;
    }
    if (!props.textConfig || props.textConfig.textColor) {
        // console.warn('::: Warning!!!!! Wrong Props @ ComparableVideoViewer ::\n' + 'textColor is not Color String');
        isValidate = false;
    }
    return isValidate;
  }
  // #endregion

  // #region member variables & properties

  // These member variables are for performance
  // even though we can use ShouldComponentUpdate() method to re-render selectively,
  // the comparison in it consumes time

  videoRef: React.RefObject<HTMLVideoElement>;
  outerWrapperRef: React.RefObject<HTMLDivElement>;
  componentRef: React.RefObject<HTMLDivElement>;
  leftCanvasRef: React.RefObject<HTMLCanvasElement>;
  rightCanvasRef: React.RefObject<HTMLCanvasElement>;
  barRef: React.RefObject<HTMLDivElement>;

  private videoCanvas: OffscreenCanvas;

  private isSetupFinished: boolean;
  private shouldResize: boolean;
  private removeBindMouseEvents: (() => void) | undefined;
  private sourceWidth: number;
  private sourceHeight: number;
  private videoWidth: number;
  private videoHeight: number;
  private videoRatio: number;
  private barCanvasPos: number;
  private mousePressed: boolean;
  private resizeObserver: ResizeObserver;
  private scale: number;
  private isPlaying: boolean;

  private get StyledBar() {
    const { barWidth, barInnerWidthRatio, barColor } = this.props.barConfig;
    const sideWidth = barWidth * (0.5 - barInnerWidthRatio / 2);
    return SBar(barWidth, sideWidth, barColor);
  }

  private get StyledText() {
    if (!this.props.textConfig) {
      return styled.span``;
    }
    const { textColor, textSize } = this.props.textConfig;
    return SText(textColor, textSize);
  }

  // #endregion

  constructor(props: Readonly<Props>) {
    super(props);
    this.validateProps(props);

    this.videoRef = React.createRef();
    this.outerWrapperRef = React.createRef();
    this.componentRef = React.createRef();
    this.leftCanvasRef = React.createRef();
    this.rightCanvasRef = React.createRef();
    this.barRef = React.createRef();

    this.state = {
      isFullScreen: false,
    };

    this.isSetupFinished = false;
    this.shouldResize = true;
    this.sourceWidth = 0;
    this.sourceHeight = 0;
    this.videoWidth = 0;
    this.videoHeight = 0;
    this.videoRatio = 1;
    this.barCanvasPos = BAR_POSITION_UNSET;
    this.mousePressed = false;
    this.isPlaying = false;
  }

  // #region init
  getRefElementsIfExists(): { exists: boolean; refElements?: RefElements } {
    if (!this.state) {
      return { exists: false };
    }
    const { videoRef, leftCanvasRef, rightCanvasRef, componentRef, barRef } = this;
    if (
      !videoRef.current ||
      !leftCanvasRef.current ||
      !rightCanvasRef.current ||
      !componentRef.current ||
      !barRef.current
    ) {
      return { exists: false };
    }
    return {
      exists: true,
      refElements: {
        video: videoRef.current,
        leftCanvas: leftCanvasRef.current,
        rightCanvas: rightCanvasRef.current,
        componentWrapper: componentRef.current,
        bar: barRef.current,
      },
    };
  }

  checkAllThingsSetProperly = () => {
    // console.debug('waiting dom refs are set');
    const refs = this.getRefElementsIfExists();
    if (!refs.exists) {
      return false;
    }
    const { video } = refs.refElements!;
    return video.videoWidth * video.videoHeight !== 0;
  };

  setUp() {
    waitUntil(this.checkAllThingsSetProperly, 2000, 50)()
      .then(() => {
        this.initAfterSetup();
      })
      .catch(e => {
        // console.log(e);
        waitUntil(this.checkAllThingsSetProperly, -1, 500)().then(() => {
          this.initAfterSetup();
        });
      });
  }

  initAfterSetup() {
    const { video, componentWrapper } = this.getRefElementsIfExists().refElements!;

    this.videoWidth = this.props.bound.width === NO_BOUND ? video!.videoWidth / 2 : this.props.bound.width;
    this.videoHeight = this.props.bound.height === NO_BOUND ? video!.videoHeight : this.props.bound.height;

    this.sourceWidth = video.videoWidth;
    this.sourceHeight = video.videoHeight;

    this.videoCanvas = new OffscreenCanvas(this.sourceWidth, this.sourceHeight);

    this.resizeObserver = new ResizeObserver(this.onComponentWrapperResize);
    this.resizeObserver.observe(componentWrapper);

    if (this.barCanvasPos === BAR_POSITION_UNSET) {
      this.updateBarCanvasPosition(this.props.initialBarPosition * this.videoWidth);
    }

    this.removeBindMouseEvents && this.removeBindMouseEvents();
    this.removeBindMouseEvents = this.bindBarMouseEvent();

    this.outerWrapperRef.current!.onfullscreenchange = event => {
      let elem = event.target;
      const isFullScreen = document.fullscreenElement === elem;
      this.setState({ isFullScreen: isFullScreen });
    };

    this.isSetupFinished = true;
    if (this.props.autoPlay) {
      video.muted = true;
      video.play();
      this.isPlaying = true;
    }
  }

  cleanUp() {
    this.resizeObserver && this.resizeObserver.unobserve(this.componentRef.current!);
    this.removeBindMouseEvents && this.removeBindMouseEvents();
    this.isSetupFinished = false;
  }
  // #endregion

  // #region React LifeCycle Methods
  shouldComponentUpdate(nextProps: Props, nextState: State) {
    this.shouldResize = true;
    this.validateProps(nextProps);
    if (
      this.props.src !== nextProps.src ||
      this.props.barConfig !== nextProps.barConfig ||
      this.props.textConfig !== nextProps.textConfig ||
      this.state.isFullScreen !== nextState.isFullScreen
    ) {
      console.log(this.props.src, nextProps.src);
      // console.log('SHOULD UPDATE');
      return true;
    }
    if (this.props.bound !== nextProps.bound) {
      this.removeBindMouseEvents = this.bindBarMouseEvent();
    }
    if (this.props.initialBarPosition !== nextProps.initialBarPosition) {
      this.updateBarCanvasPosition(this.props.initialBarPosition * this.videoWidth);
    }
    return false;
  }

  componentDidMount() {
    this.setUp();
  }

  componentDidUpdate() {
    this.cleanUp();
    this.setUp();
  }

  componentWillUnmount() {
    this.cleanUp();
  }
  // #endregion

  // #region resize
  resize() {
    const video = this.videoRef.current!;

    if (video && video.videoWidth !== 0) {
      this.videoWidth = this.props.bound.width === NO_BOUND ? video.videoWidth / 2 : this.props.bound.width;
      this.videoHeight = this.props.bound.height === NO_BOUND ? video.videoHeight : this.props.bound.height;

      this.sourceWidth = video.videoWidth;
      this.sourceHeight = video.videoHeight;
      this.videoRatio = this.videoHeight / this.videoWidth;
    } else {
      return;
    }

    if (video.videoHeight === 0) {
      return;
    }

    const componentWrapper = this.componentRef.current!;
    const leftCanvas = this.leftCanvasRef.current!;

    const h = componentWrapper.offsetParent!.clientHeight
      ? Math.min(
          componentWrapper.offsetParent!.clientWidth * this.videoRatio,
          componentWrapper.offsetParent!.clientHeight
        )
      : componentWrapper.offsetParent!.clientWidth * this.videoRatio;

    if (!this.state.isFullScreen) {
      componentWrapper.style.setProperty('height', `${h}px`);
      componentWrapper.style.setProperty('max-width', `${h / this.videoRatio}px`);
    } else {
      componentWrapper.style.setProperty('height', '100vh');
      componentWrapper.style.setProperty('max-width', `${100 / this.videoRatio}vh`);
    }

    const ow = componentWrapper.offsetWidth;
    const oh = componentWrapper.offsetHeight;
    const iw = leftCanvas.offsetWidth;
    const ih = leftCanvas.offsetHeight;

    if (ow * oh * iw * ih === 0) {
      return;
    }

    const wScale = ow / this.videoWidth;
    const hScale = oh / this.videoHeight;

    const prevScale = this.scale;
    this.scale = Math.min(wScale, hScale);

    prevScale != this.scale && this.props.onResize(this.scale);

    this.updateStyleProperties();
    this.removeBindMouseEvents && this.removeBindMouseEvents();
    this.removeBindMouseEvents = this.bindBarMouseEvent();
  }

  onComponentWrapperResize = (entries: ResizeObserverEntry[], observer: ResizeObserver) => {
    if (!Array.isArray(entries) || !entries.length || !this.videoRef) {
      return;
    }
    this.resize();
  };
  // #endregion

  // #region bar stuffs

  updateBarCanvasPosition(barCanvasPos: number) {
    const prev = this.barCanvasPos;
    if (barCanvasPos < 0) {
      this.barCanvasPos = 0;
    } else if (barCanvasPos > this.videoWidth) {
      this.barCanvasPos = this.videoWidth;
    } else {
      this.barCanvasPos = barCanvasPos;
    }

    const barPos = this.barCanvasPos / this.videoWidth;
    if (prev / this.videoWidth != barPos) {
      this.props.onUpdateBarPosition(barPos);
    }

    this.updateStyleProperties();
  }

  updateStyleProperties() {
    const bar = this.barRef.current!;
    const leftCanvas = this.leftCanvasRef.current!;
    const rightCanvas = this.rightCanvasRef.current!;

    this.barCanvasPos = Math.min(this.barCanvasPos, this.videoWidth);
    this.barCanvasPos = Math.max(this.barCanvasPos, 0);
    const barPosition = (this.barCanvasPos / this.videoWidth) * 100;
    leftCanvas.style.setProperty('clip-path', `inset(0 ${100 - barPosition}% 0 0)`);
    leftCanvas.style.setProperty('margin-right', `-${100 - barPosition}%`);
    rightCanvas.style.setProperty('clip-path', `inset(0 0 0 ${barPosition}%)`);
    rightCanvas.style.setProperty('margin-left', `-${barPosition}%`);

    bar.style.setProperty('display', !this.isSetupFinished ? 'none' : 'block');

    if (!this.isSetupFinished) {
      return;
    }

    const { barWidth, barInnerWidthRatio } = this.props.barConfig;

    const dif: number = Math.min(this.barCanvasPos, this.videoWidth - this.barCanvasPos) * this.scale - barWidth / 2;

    const sideWidth = barWidth * (0.5 - barInnerWidthRatio / 2);
    let leftBorderSize = sideWidth;
    let rightBorderSize = sideWidth;

    let left = `calc(${barPosition}% - ${barWidth / 2}px)`;

    if (dif < 0) {
      if (this.barCanvasPos * this.scale < barWidth / 2) {
        left = `calc(${barPosition}% - ${barWidth / 2 + dif}px)`;
        leftBorderSize = Math.max(0, sideWidth + dif);
      } else {
        rightBorderSize = Math.max(0, sideWidth + dif);
      }
    }

    bar.style.setProperty('width', `${barWidth + Math.min(0, dif)}px`);
    bar.style.setProperty('border-left', `${leftBorderSize}px solid transparent`);
    bar.style.setProperty('border-right', `${rightBorderSize}px solid transparent`);
    bar.style.setProperty('left', left);
  }

  bindBarMouseEvent() {
    if (this.barCanvasPos === BAR_POSITION_UNSET) {
      return;
    }

    this.mousePressed = false;

    const componentWrapper = this.componentRef.current!;

    const getOffsetX = (e: MouseEvent) => {
      return e.clientX - componentWrapper!.getBoundingClientRect().left;
    };

    const mousedownHandler = (e: MouseEvent) => {
      const targetId = (e.target as HTMLElement)!.id;
      if (targetId !== 'cvv-overlay' && targetId !== 'cvv-bar') {
        return;
      }
      const offset = Math.min(
        e.clientX - componentWrapper!.getBoundingClientRect().left,
        componentWrapper!.getBoundingClientRect().right - e.clientX
      );
      if (offset > 0) {
        this.mousePressed = true;
      }
    };
    componentWrapper.addEventListener('mousedown', mousedownHandler);

    const mouseupHandler = (e: MouseEvent) => {
      e.preventDefault();

      if (this.mousePressed && !this.shouldResize) {
        this.updateBarCanvasPosition(getOffsetX(e) / this.scale);
      }
    };
    componentWrapper.addEventListener('mouseup', mouseupHandler);

    const windowMouseupHandler = (e: MouseEvent) => {
      this.mousePressed = false;
    };
    window.addEventListener('mouseup', windowMouseupHandler);

    const mousemoveHandler = (e: MouseEvent) => {
      if (this.mousePressed && !this.shouldResize) {
        this.updateBarCanvasPosition(getOffsetX(e) / this.scale);
      }
    };
    componentWrapper.addEventListener('mousemove', mousemoveHandler);

    const mouseleaveHandler = (e: MouseEvent) => {
      if (this.mousePressed && !this.shouldResize) {
        this.updateBarCanvasPosition(getOffsetX(e) / this.scale);
      }
    };
    componentWrapper.addEventListener('mouseleave', mouseleaveHandler);

    return () => {
      componentWrapper.removeEventListener('mousedown', mousedownHandler);
      componentWrapper.removeEventListener('mouseup', mouseupHandler);
      window.removeEventListener('mouseup', windowMouseupHandler);
      componentWrapper.removeEventListener('mousemove', mousemoveHandler);
      componentWrapper.removeEventListener('mouseleave', mouseleaveHandler);
    };
  }
  // #endregion

  // #region render
  setFullScreen = (goFull: boolean) => {
    if (goFull) {
      this.outerWrapperRef.current!.requestFullscreen();
      this.shouldResize = true;
    } else {
      document && document.exitFullscreen();
      this.shouldResize = true;
    }
  };

  onCanvasLoop(canvas: HTMLCanvasElement, canvas2: HTMLCanvasElement) {
    if (!this.isSetupFinished) {
      this.shouldResize = true;
      return;
    }

    if (this.shouldResize) {
      this.resize();
      if (!canvas || !canvas2) {
        return;
      }
      canvas.width = this.videoWidth;
      canvas.height = this.videoHeight;
      canvas2.width = this.videoWidth;
      canvas2.height = this.videoHeight;
      this.shouldResize = false;
    }

    if (!this.isPlaying) {
      return;
    }

    const vctx = this.videoCanvas.getContext('2d', { alpha: false });
    const ctx = canvas.getContext('2d', { alpha: false });
    const ctx2 = canvas2.getContext('2d', { alpha: false });
    if (!vctx || !ctx || !ctx2) {
      return;
    }

    vctx.drawImage(this.videoRef.current!, 0, 0);

    const vw = this.videoCanvas.width;
    const vh = this.videoCanvas.height;

    const sx = this.props.bound.x;
    const sy = this.props.bound.y;
    const sw = this.props.bound.width !== NO_BOUND ? this.props.bound.width : vw / 2;
    const sh = this.props.bound.height !== NO_BOUND ? this.props.bound.height : vh;

    ctx.drawImage(this.videoCanvas, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);
    ctx2.drawImage(this.videoCanvas, sx + vw / 2, sy, sw, sh, 0, 0, canvas2.width, canvas2.height);
  }

  render() {
    // console.log('render');
    const textConfig = this.props.textConfig;

    return (
      <SOuterWrapper ref={this.outerWrapperRef}>
        <video
          src={this.props.src}
          ref={this.videoRef}
          style={{ display: 'none' }}
          autoPlay={this.props.autoPlay}
          muted={this.props.muted}
          loop={this.props.loop}
        />
        <SComponent id='comparable_video_viewer' ref={this.componentRef}>
          <SInnerWrapper>
            <LoopCanvas
              targetFrameRate={this.props.targetFrameRate}
              leftCanvasRef={this.leftCanvasRef}
              rightCanvasRef={this.rightCanvasRef}
              onLoop={(canvas, canvas2) => this.onCanvasLoop(canvas, canvas2)}
            />

            <SOverlay id='cvv-overlay'>
              {textConfig && (
                <SVideoText>
                  <this.StyledText
                    style={{
                      left: 0,
                    }}
                  >
                    {textConfig.leftText}
                  </this.StyledText>
                  <this.StyledText
                    style={{
                      right: 0,
                    }}
                  >
                    {textConfig.rightText}
                  </this.StyledText>
                </SVideoText>
              )}
            </SOverlay>
            {this.props.haveControls && (
              <SControls id='cvv-controls-div'>
                <Controls
                  videoRef={this.videoRef}
                  isFullScreen={this.state.isFullScreen}
                  onPlayStateChanged={isPlaying => (this.isPlaying = isPlaying)}
                  onFullscreenRequested={this.setFullScreen}
                />
              </SControls>
            )}
            <this.StyledBar id='cvv-bar' ref={this.barRef} />
          </SInnerWrapper>
        </SComponent>
      </SOuterWrapper>
    );
  }
  // #endregion
}

// #region Styled
const SOuterWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

const SComponent = styled.div`
  position: relative;
  width: 100%;
  height: 0;
  margin: 0 auto;
  overflow: hidden;
  text-align: start;
  box-sizing: content-box;
`;

const SInnerWrapper = styled.div`
  position: absolute;
  resize: both;
  top: 0;
  left: 0;
  width: 100%;
  line-height: 0;
`;

const SOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: transparent;
`;

const SVideoText = styled.div`
  left: 0;
  top: 0;
  width: 100%;
`;

const SControls = styled.div`
  width: 100%;
  height: ${CONTROL_BAR_HEIGHT_PX}px;
  background: #000000a0;
  position: absolute;
  bottom: 0;
  text-align: center;
`;

const SText = (textColor: CSS.Properties['color'], textSize: string) => styled.span`
  font-size: ${textSize};
  line-height: 1em;
  user-select: none;
  color: ${textColor};
  padding: 15px;
  position: absolute;
`;

const SBar = (barWidth: number, sideWidth: number, barColor: CSS.Properties['color']) => styled.div`
  display: 'block';
  width: ${barWidth}px;
  border-left: ${sideWidth}px solid transparent;
  border-right: ${sideWidth}px solid transparent;
  background: ${barColor};
  background-origin: padding-box;
  background-clip: padding-box;
  box-sizing: border-box;
  position: absolute;
  top: 0;
  bottom: ${CONTROL_BAR_HEIGHT_PX}px;
  cursor: col-resize;
  :hover {
    border-left-color: ${barColor}88 !important;
    border-right-color: ${barColor}88 !important;
    -webkit-transition: all 0.5s ease;
    transition: all 0.5s ease;
  }
`;
// #endregion

export default ComparableVideoViewer;
