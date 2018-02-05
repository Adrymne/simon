import React from 'react';
import { connect } from 'react-redux';
import { applySpec } from 'ramda';
import './OutputDisplay.css';
import { Progress } from 'reactstrap';
import { MAX_SEQUENCE } from 'invariants';
import { getCurrentStep, getCurrentSequenceLength } from 'store/selectors';

const OutputDisplay = ({ currentStep, currentMax, maxSteps }) => (
  <div className="output-display-box">
    <div className="text-center">
      {currentMax} of {maxSteps}
    </div>
    <Progress multi>
      <Progress bar color="primary" value={currentStep} max={maxSteps} />
      <Progress
        bar
        color="secondary"
        value={currentMax - currentStep}
        max={maxSteps}
      />
    </Progress>
  </div>
);

const mapStateToProps = applySpec({
  maxSteps: () => MAX_SEQUENCE,
  currentStep: getCurrentStep,
  currentMax: getCurrentSequenceLength
});

export default connect(mapStateToProps)(OutputDisplay);
