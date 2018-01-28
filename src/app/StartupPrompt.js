import React from 'react';
import { Button } from 'reactstrap';
import { connect } from 'react-redux';
import './StartupPrompt.css';
import { newGame } from 'store/actions';

const StartupPromp = ({ onClick }) => (
  <Button className="startup-button" outline onClick={onClick}>
    Ready?
  </Button>
);

const mapDispatchToProps = { onClick: newGame };

export default connect(null, mapDispatchToProps)(StartupPromp);
