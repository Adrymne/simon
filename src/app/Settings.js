import React from 'react';
import { Button } from 'reactstrap';
import { connect } from 'react-redux';
import { pipe } from 'ramda';
import { newGame } from 'store/actions';
import { generateStep } from 'store/effects';
import OutputDisplay from './settings/OutputDisplay';
import './Settings.css';

const isStrictMode = false;

const Settings = ({ onReset }) => (
  <div className="settings-box">
    <OutputDisplay />
    <br />
    <div className="settings-buttons">
      <Button outline={!isStrictMode} color="warning">
        Strict
      </Button>
      <Button outline color="danger" onClick={onReset}>
        Reset
      </Button>
    </div>
  </div>
);

const mapDispatchToProps = {
  onReset: pipe(generateStep, newGame)
};

export default connect(null, mapDispatchToProps)(Settings);
