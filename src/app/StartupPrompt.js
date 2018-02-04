import React from 'react';
import { Button } from 'reactstrap';
import { connect } from 'react-redux';
import { pipe } from 'ramda';
import './StartupPrompt.css';
import { addStep } from 'store/actions';
import { generateStep } from 'store/effects';

const StartupPromp = ({ onClick }) => (
  <Button className="startup-button" outline onClick={onClick}>
    Ready?
  </Button>
);

const mapDispatchToProps = { onClick: pipe(generateStep, addStep) };

export default connect(null, mapDispatchToProps)(StartupPromp);
