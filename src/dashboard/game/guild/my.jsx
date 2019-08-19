/* eslint-disable react/jsx-no-duplicate-props */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable react/button-has-type */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/no-array-index-key */
/* eslint-disable jsx-a11y/alt-text */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Spin, Icon } from 'antd';
import classnames from 'classnames';
import RESOURCE from '../../resource';

const userLevel = {
  president: '会长',
  member: '组员',
};

class Guild extends Component {
  state = {
    // showCreateModal: false,
    // newGuildName: '',
    showCheckLeave: false,
  }

  // handleCreateGuild = () => {
  //   const { dispatch } = this.props;
  //   const { newGuildName } = this.state;
  //   if (newGuildName.length > 0) {
  //     dispatch({
  //       type: 'hero_guild/create',
  //       payload: {
  //         name: newGuildName,
  //       },
  //     });
  //   }
  // }

  handleLeaveGuild = () => {
    const { dispatch, myGuild } = this.props;
    dispatch({
      type: 'hero_guild/leave',
      payload: myGuild.id,
    });
  }

  handleUp = () => {
    const { dispatch, myGuild } = this.props;
    dispatch({
      type: 'hero_guild/up',
      payload: myGuild.id,
    });
  }

  render() {
    const { showCheckLeave } = this.state;
    const { myGuild } = this.props;
    return (
      <>
        <div className="content">
          <div className="title">
            <div>我的公会</div>
            <div className="game-btn" onClick={() => this.setState({ showCheckLeave: true })}>退出公会</div>
          </div>
          <div className="top">
            <div className="name">{myGuild.name}</div>
            <div className="level">Lv.{myGuild.level + 1}</div>
            <div className="game-btn" onClick={this.handleUp}>升级</div>
          </div>
          <div className="info">
            <div>
              <div className="icon">
                <img src={RESOURCE.UI.GUILD_01} />
              </div>
              <div className="name">公会总资产</div>
              <div className="value">{myGuild.money_library} BASE</div>
            </div>
            <div>
              <div className="icon">
                <img src={RESOURCE.UI.GUILD_02} />
              </div>
              <div className="name">我的贡献度</div>
              <div className="value">0</div>
            </div>
            <div>
              <div className="icon">
                <img src={RESOURCE.UI.GUILD_03} />
              </div>
              <div className="name">公会商店</div>
              <div className="value">敬请期待</div>
            </div>
            <div>
              <div className="icon">
                <img src={RESOURCE.UI.GUILD_04} />
              </div>
              <div className="name">公会科技</div>
              <div className="value">敬请期待</div>
            </div>
            <div>
              <div className="icon">
                <img src={RESOURCE.UI.GUILD_05} />
              </div>
              <div className="name">公会竞标赛</div>
              <div className="value">即将到来</div>
            </div>
          </div>
          <div className="title">公会成员</div>
          <div className="users game-input">
            {myGuild.user.map(user => (
              <div className="user" key={user.id}>
                <div className="nickname">{user.nickname}</div>
                <div className="nickname">{userLevel[user.level]}</div>
              </div>
            ))}
          </div>
        </div>
        {showCheckLeave && (
          <div className="game-modal">
            <div className="content-container">
              <div className="modal-ex">
                <div className="game-btn" onClick={this.handleLeaveGuild}>确认</div>
                <div className="game-btn" onClick={() => this.setState({ showCheckLeave: false })}>取消</div>
              </div>
              <div className="content">
                <div className="title">退出公会</div>
                <div>退出公会将清空公会贡献值和身份，确认退出公会？</div>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }
}

function mapStateToProps({ hero_guild: guild, farm_player: player }) {
  const { accounts } = player;
  const { myGuild } = guild;

  return {
    accounts,
    myGuild,
  };
}

export default connect(mapStateToProps)(Guild);
