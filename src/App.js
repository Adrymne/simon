import React from 'react';
import { connect } from 'react-redux';
import { applySpec } from 'ramda';
import './App.css';
import SimonSection from './app/SimonSection';
import Settings from './app/Settings';
import StartupPrompt from './app/StartupPrompt';
import { POSITIONS } from 'types';
import { isStartupPhase } from 'store/reducers';

const App = ({ isStartupPhase }) => (
  <div className="app-container">
    <div className="simon-container">
      {POSITIONS.map(p => <SimonSection position={p} key={p} />)}
      <div className="simon-settings">
        {isStartupPhase ? <StartupPrompt /> : <Settings />}
      </div>
    </div>
  </div>
);

const mapStateToProps = applySpec({ isStartupPhase });

export default connect(mapStateToProps)(App);
