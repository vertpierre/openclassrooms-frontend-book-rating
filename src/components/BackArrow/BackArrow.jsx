import { Link } from 'react-router-dom';
import React from 'react';

function BackArrow() {
  return (
    <Link to="/" className="backArrow">
      <span>←</span>
      Retour
    </Link>
  );
}

export default BackArrow;
