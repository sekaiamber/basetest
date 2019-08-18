/* eslint-disable react/no-array-index-key */
/* eslint-disable array-callback-return */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { Component } from 'react';
import classnames from 'classnames';
import { connect } from 'dva';
import './style.scss';

// images
class Subuser extends Component {
  render() {
    const { list } = this.props;

    return (
      <div id="subuser" className="container">
        {list.map(item => (
          <div className="item shadow-pad" key={item.vip_level}>
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
                />
              </svg>
              <span className="text"><span>P</span>{parseInt(item.vip_level.slice(1), 10)}</span>
            </div>
            <div className="price">{item.count}</div>
          </div>
        ))}
      </div>
    );
  }
}

function mapStateToProps({ account }) {
  const { subuser } = account;

  return {
    list: subuser,
  };
}
export default connect(mapStateToProps)(Subuser);
