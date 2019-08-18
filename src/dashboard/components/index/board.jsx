/* eslint-disable react/jsx-one-expression-per-line */
import React from 'react';

function getNumberText(text, fixed) {
  if (!text) return '0.0';
  return parseFloat(text).toFixed(fixed);
}

export default function Board(props) {
  const { data } = props;
  const {
    myPower, myBase, rewardPower, deductionBase, canMining, alreadyMining,
  } = data;
  return (
    <div id="board">
      <div>
        <div className="item">
          <div className="value">{getNumberText(myPower)} ph/s</div>
          <div className="name">我的算力</div>
        </div>
        <div className="item">
          <div className="value">{getNumberText(canMining)}</div>
          <div className="name">我的礦池</div>
        </div>
        <div className="item">
          <div className="value">{getNumberText(myBase)}</div>
          <div className="name">我的BASE</div>
        </div>
      </div>
      <div>
        <div className="item">
          <div className="value">{getNumberText(rewardPower)} ph/s</div>
          <div className="name">獎勵算力</div>
        </div>
        <div className="item">
          <div className="value">{getNumberText(alreadyMining)}</div>
          <div className="name">已挖BASE</div>
        </div>
        <div className="item">
          <div className="value">{getNumberText(deductionBase)}</div>
          <div className="name">可抵扣BASE</div>
        </div>
      </div>
    </div>
  );
}
