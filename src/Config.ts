import * as CSS from 'csstype';

export interface Bound {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface BarConfig {
  barColor: CSS.Properties['color'];
  // barHoverOpacity: number;
  barWidth: number;
  barInnerWidthRatio: number;
}

export interface TextConfig {
  leftText: string;
  rightText: string;
  textSize: string;
  textColor: CSS.Properties['color'];
}
