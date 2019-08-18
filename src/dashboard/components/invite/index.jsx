/* eslint-disable react/no-array-index-key */
/* eslint-disable array-callback-return */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { Component } from 'react';
import classnames from 'classnames';
import { connect } from 'dva';
import Qrcode from '../common/qrcode';

import './style.scss';

function getUrl(code) {
  return `https://www.basepool.net/sign_up?invite_code=${code}`;
}

// images
class Invite extends Component {
  render() {
    const { userInfo } = this.props;
    const url = getUrl(userInfo.invite_code);

    return (
      <div id="invite" className="container">
        <div className="qrcode">
          <Qrcode data={url} option={{ height: 250, width: 250, margin: 2 }} />
        </div>
        <div className="code">我的邀請碼：{userInfo.invite_code}</div>
        <div className="url">{url}</div>
        <div className="btn clipboard-target" data-clipboard-text={url}>點擊複製鏈接</div>
      </div>
    );
  }
}

function mapStateToProps({ account }) {
  const { userInfo } = account;

  return {
    userInfo,
  };
}
export default connect(mapStateToProps)(Invite);
