/* eslint-disable react/jsx-no-duplicate-props */
import React from 'react';
import { connect } from 'dva';

import './style.scss';

const circleLength = Math.floor(2 * Math.PI * 20);

function getTotalDays(create, end) {
  const d = (new Date(end) - new Date(create)) / (1000 * 60 * 60 * 24);
  return Math.round(d);
}

function PaidPower({ list }) {
  return (
    <div id="paidPower">
      {list.map(((p, i) => (
        <div className="paidpower shadow-pad" key={i}>
          <div className="lv">
            <svg xmlns="http://www.w3.org/200/svg" height="44" width="44">
              <circle cx="22" cy="22" r="20" fill="none" stroke="#ececec" strokeWidth="3" strokeLinecap="round" />
              <circle
                className="demo2"
                cx="22"
                cy="22"
                r="20"
                fill="none"
                stroke="#953E96"
                strokeWidth="3"
                // strokeDasharray="0,10000"
                // strokeDasharray={circleLength * p.days / getTotalDays(p.created_at, p.end_at) + ',10000'}
              />
            </svg>
            <span className="text"><span>P</span>{parseInt(p.vip_level.slice(1), 10)}</span>
          </div>
          <div className="center">
            <div className="data">{p.power} ph/s</div>
            {/* <div className="rate">預計收益率{p.rate}/天</div> */}
          </div>
          <div className="price">
            <div>{p.price}</div>
            <div className="unit">{p.currency}</div>
          </div>
        </div>
      )))}
    </div>
  );
}


function mapStateToProps({ account }) {
  return {
    list: account.orders,
  };
}

export default connect(mapStateToProps)(PaidPower);
