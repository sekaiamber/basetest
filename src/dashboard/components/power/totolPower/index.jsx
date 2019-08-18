import React from 'react';
import { connect } from 'dva';

import './style.scss';

import totolImg from '../../../../assets/power_total.svg';

function TotalPower({ level, power }) {
  return (
    <div id="totalPower">
      <div className="bg" style={{ width: ((level + 1) / 8 * 90 + 10) + '%' }} />
      <div className="content">
        <div className="lv"><span>P</span>{level}</div>
        <div className="center">
          <div className="title">總算力</div>
          <div className="data">{power}ph/s</div>
        </div>
        <div className="icon"><img src={totolImg} alt="" /></div>
      </div>
    </div>
  );
}


function mapStateToProps({ account }) {
  const { userInfo } = account;
  const { level, power } = userInfo;

  return {
    level: level ? parseInt(level.slice(1), 10) : 0,
    power,
  };
}

export default connect(mapStateToProps)(TotalPower);
