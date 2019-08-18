import React, { Component } from 'react';
import TotalPower from './totolPower';
import PaidPower from './paidPower';
import YesterdayPower from './yesterdayPower';

import './style.scss';


export default class Power extends Component {
  render() {
    return (
      <div id="power" className="container">
        <TotalPower />
        <div className="page-title">已購買算力</div>
        <PaidPower />
        <div className="page-title">昨日獎勵</div>
        <YesterdayPower />
      </div>
    );
  }
}
