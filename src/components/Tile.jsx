import React from 'react';

function Tile({ value }) {
  return (
    <div className={`tile tile-${value}`}>
      {value > 0 ? value : ''}
    </div>
  );
}

export default Tile;
