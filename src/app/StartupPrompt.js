import React from 'react';
import { Button } from 'reactstrap';
import { connect } from 'react-redux';
import { pipe, applySpec } from 'ramda';
import './StartupPrompt.css';
import { newGame } from 'store/actions';
import { generateStep } from 'store/effects';
import { isGameOver } from 'store/selectors';

const StartupPromp = ({ onClick, isGameOver }) => (
  <Button className="startup-button" outline onClick={onClick}>
    {isGameOver ? (
      <div>
        You Win!<br />Restart?
      </div>
    ) : (
      <span>Ready?</span>
    )}
  </Button>
);

const mapStateToProps = applySpec({ isGameOver });
const mapDispatchToProps = { onClick: pipe(generateStep, newGame) };

export default connect(mapStateToProps, mapDispatchToProps)(StartupPromp);
