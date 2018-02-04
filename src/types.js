import Type from 'union-type';

export const TOP_LEFT = 'top-left';
export const TOP_RIGHT = 'top-right';
export const BOTTOM_LEFT = 'bottom-left';
export const BOTTOM_RIGHT = 'bottom-right';
export const POSITIONS = [TOP_LEFT, TOP_RIGHT, BOTTOM_LEFT, BOTTOM_RIGHT];

export const Phase = Type({
  None: [],
  Playback: { index: Number, isVisible: Boolean },
  Player: { index: Number }
});
