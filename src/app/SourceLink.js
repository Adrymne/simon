import React from 'react';
import './SourceLink.css';

const SourceLink = () => (
  <div className="source-link">
    View source on <a href={process.env.REACT_APP_SOURCE}>Github</a>
  </div>
);

export default SourceLink;
