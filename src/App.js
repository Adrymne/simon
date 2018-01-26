import React from 'react';
import './App.css';
import SimonButton from './app/SimonButton';
import Settings from './app/Settings';
import { POSITIONS } from 'types';

// TODO: swap SimonButton for (new component) SimonDisplay during playback
const App = () => (
  <div className="app-container">
    <div className="simon-container">
      {POSITIONS.map(position => (
        <div className={`simon-area simon-${position}`}>
          <SimonButton position={position} />
        </div>
      ))}
      <div className="simon-settings">
        <Settings />
      </div>
    </div>
  </div>
);

export default App;
