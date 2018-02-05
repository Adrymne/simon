import React from 'react';
import { connect } from 'react-redux';
import { partial } from 'ramda';
import * as actions from 'store/actions';
import './SimonButton.css';

const SimonButton = ({ position, onClick }) => (
  <button className={`${position} simon-button`} onClick={onClick} />
);

const mergeProps = (stateProps, { inputSection }, ownProps) => ({
  ...ownProps,
  onClick: partial(inputSection, [ownProps.position])
});

export default connect(undefined, actions, mergeProps)(SimonButton);
