/* eslint-disable react/no-array-index-key */
/* eslint-disable array-callback-return */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { Component } from 'react';
import classnames from 'classnames';
import { connect } from 'dva';

import './style.scss';

// images
class Notice extends Component {
  render() {
    const { list } = this.props;

    return (
      <div id="notice" className="container">
        {list.map((notice, i) => (
          <div className="notice" key={i}>
            <div className="title">{notice.title}</div>
            <div className="time">{notice.time}</div>
            <div className="content">{notice.content}</div>
          </div>
        ))}
      </div>
    );
  }
}

function mapStateToProps({ notice }) {
  return {
    list: notice.notices,
  };
}

export default connect(mapStateToProps)(Notice);
