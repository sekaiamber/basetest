/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { Component } from 'react';
import classnames from 'classnames';
import { connect } from 'dva';
import { Link } from 'dva/router';

import './style.scss';

// images
import avatarImg from '../../../assets/me_avatar.svg';

class Me extends Component {
  handleLogout = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'account/logout',
    });
  }

  render() {
    const { userInfo } = this.props;
    return (
      <div id="me" className="container">
        <div className="avatar-container">
          <div className="avatar">
            <img src={avatarImg} alt="" />
          </div>
          <div className="code">推廣碼 {userInfo.invite_code}</div>
        </div>
        <div className="nickname">{userInfo.nickname}</div>
        <div className="page-title">等級</div>
        <div className="link-list">
          <div className="link">
            <div>社區等級</div>
            <div>{userInfo.community_level && userInfo.community_level.toUpperCase()}</div>
          </div>
          <div className="link">
            <div>礦工等級</div>
            <div>{userInfo.level && userInfo.level.toUpperCase()}</div>
          </div>
        </div>
        <div className="page-title">安全</div>
        <div className="link-list">
          <div className="link">
            <div>手機驗證</div>
            <div>已完成</div>
          </div>
        </div>
        <div className="page-title">我的礦工</div>
        <div className="link-list">
          <Link to="/invite" className="link">
            <div>邀請好友</div>
            <div>&gt;</div>
          </Link>
          <Link to="/miners" className="link">
            <div>礦工管理</div>
            <div>&gt;</div>
          </Link>
          <Link to="/subuser" className="link">
            <div>我的礦工</div>
            <div>&gt;</div>
          </Link>
        </div>
        <div className="logout">
          <a onClick={this.handleLogout}>退出登錄</a>
        </div>
        <div className="version">
          {__VERSION__}
        </div>
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

export default connect(mapStateToProps)(Me);
