import React from 'react';
import S from 'sanctuary-module';
import { applySpec } from 'ramda';
import { connect } from 'react-redux';
import { getLastPosition } from 'store/selectors';
import Sound from 'components/Sound';

const noSound = () => null;
const playSound = position => <Sound position={position} />;

const PlayerSound = ({ lastPosition }) =>
  S.maybe_(noSound, playSound, lastPosition);

const mapStateToProps = applySpec({ lastPosition: getLastPosition });
export default connect(mapStateToProps)(PlayerSound);
