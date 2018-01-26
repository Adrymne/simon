import React from 'react';
import './OutputDisplay.css';
import { Progress } from 'reactstrap';

const maxSteps = 20;
const currentMax = 10;
const currentStep = 6;

const OutputDisplay = () => (
  <div className="output-display-box">
    <div className="text-center">6 of 20</div>
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

export default OutputDisplay;
