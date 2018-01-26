import React from 'react';
import './App.css';
import SimonButton from './app/SimonButton';
import Settings from './app/Settings';

const App = () => (
  <div className="app-container">
    <div className="simon-container">
      <SimonButton className="simon-button simon-top-left" />
      <SimonButton className="simon-button simon-top-right" />
      <SimonButton className="simon-button simon-bottom-left" />
      <SimonButton className="simon-button simon-bottom-right" />
      <div className="simon-settings">
        <Settings />
      </div>
    </div>
  </div>
);

export default App;
