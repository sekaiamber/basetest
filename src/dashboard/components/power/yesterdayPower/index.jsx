/* eslint-disable react/jsx-no-duplicate-props */
import React from 'react';
import { connect } from 'dva';

import './style.scss';

import totolImg from '../../../../assets/power_yesterday.svg';

function YesterdayPower({ amount }) {
  return (
    <div id="yesterdayPower">
      <div className="yesterdaypower shadow-pad">
        <div className="icon"><img src={totolImg} alt="" /></div>
        <div className="center">
          {/* <div className="data">{p.power}ph/s</div> */}
        </div>
        <div className="reward">{amount} ph/s</div>
      </div>
    </div>
  );
}


function mapStateToProps({ account }) {
  const { acitiviesYesterday } = account;

  return {
    amount: acitiviesYesterday,
  };
}

export default connect(mapStateToProps)(YesterdayPower);
