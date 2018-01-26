import React from 'react';
import { Button } from 'reactstrap';
import OutputDisplay from './settings/OutputDisplay';
import './Settings.css';

const isStrictMode = false;

const Settings = () => (
  <div className="settings-box">
    <OutputDisplay />
    <br />
    <div className="settings-buttons">
      <Button outline={!isStrictMode} color="warning">
        Strict
      </Button>
      <Button outline color="danger">
        Reset
      </Button>
    </div>
  </div>
);

export default Settings;
