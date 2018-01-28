import React from 'react';
import { connect } from 'react-redux';
import { applySpec, pipe, equals } from 'ramda';
import SimonButton from './simonSection/SimonButton';
import SimonDisplay from './simonSection/SimonDisplay';
import { isPlayerPhase, getHighlightedSection } from 'store/reducers';
import './SimonSection.css';

const SimonSection = ({ position, isPlayerPhase, isHighlighted }) => (
  <div className={`simon-area simon-${position}`}>
    {isPlayerPhase ? (
      <SimonButton position={position} />
    ) : (
      <SimonDisplay isHighlighted={isHighlighted} position={position} />
    )}
  </div>
);

const mapStateToProps = (state, ownProps) =>
  applySpec(
    {
      isPlayerPhase,
      isHighlighted: pipe(getHighlightedSection, equals(ownProps.position))
    },
    state
  );

export default connect(mapStateToProps)(SimonSection);
