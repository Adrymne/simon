import React from 'react';
import { Button } from 'reactstrap';
import { connect } from 'react-redux';
import { pipe, applySpec } from 'ramda';
import { newGame, toggleStrictMode } from 'store/actions';
import { generateStep } from 'store/effects';
import { isStrictMode } from 'store/selectors';
import OutputDisplay from './settings/OutputDisplay';
import './Settings.css';

const Settings = ({ isStrictMode, onReset, onToggleStrict }) => (
  <div className="settings-box">
    <OutputDisplay />
    <br />
    <div className="settings-buttons">
      <Button outline={!isStrictMode} onClick={onToggleStrict} color="warning">
        Strict
      </Button>
      <Button outline color="danger" onClick={onReset}>
        Reset
      </Button>
    </div>
  </div>
);

const mapStateToProps = applySpec({ isStrictMode });
const mapDispatchToProps = {
  onReset: pipe(generateStep, newGame),
  onToggleStrict: toggleStrictMode
};

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
