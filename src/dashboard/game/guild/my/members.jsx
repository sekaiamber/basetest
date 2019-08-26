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
import RESOURCE from '../../../resource';

const userLevel = {
  president: '会长',
  member: '组员',
};

class Guild extends Component {
  state = {
    // showCreateModal: false,
    // newGuildName: '',
    showCheckLeave: false,
    showCheckRemove: false,
    selectUser: null,
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
      onSuccess: () => {
        this.setState({
          showCheckLeave: false,
        });
      },
    });
  }

  handleRemove = () => {
    const { dispatch, myGuild } = this.props;
    const { selectUser } = this.state;
    dispatch({
      type: 'hero_guild/removeUser',
      payload: {
        id: myGuild.id,
        user_id: selectUser.id,
      },
      onSuccess: () => {
        this.setState({
          showCheckRemove: false,
        });
      },
    });
  }

  handleShowRemove(user) {
    if (user.is_me) return;
    this.setState({
      showCheckRemove: true,
      selectUser: user,
    });
  }

  render() {
    const { showCheckLeave, showCheckRemove } = this.state;
    const { myGuild, myPosition } = this.props;
    return (
      <>
        <div className="guild-content">
          <div className="title">
            <div>公会成员</div>
            {myPosition !== 'president' && (
              <div className="game-btn" onClick={() => this.setState({ showCheckLeave: true })}>退出公会</div>
            )}
          </div>
          <div className="users">
            {myGuild.user.map(user => (
              <div className="user" key={user.id}>
                <div className="nickname">{user.nickname}</div>
                <div className="position">{userLevel[user.level]}</div>
                {myPosition === 'president' && (
                  <div className="opt"><div className="game-btn" onClick={this.handleShowRemove.bind(this, user)}>移出公会</div></div>
                )}
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
        {showCheckRemove && (
          <div className="game-modal">
            <div className="content-container">
              <div className="modal-ex">
                <div className="game-btn" onClick={this.handleRemove}>确认</div>
                <div className="game-btn" onClick={() => this.setState({ showCheckRemove: false })}>取消</div>
              </div>
              <div className="content">
                <div className="title">移出公会</div>
                <div>移出公会将清空成员的公会贡献值和身份，确认移出公会？</div>
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
  const my = myGuild.user.filter(u => u.is_me)[0];
  const myPosition = my.level;

  return {
    accounts,
    myGuild,
    myPosition,
  };
}

export default connect(mapStateToProps)(Guild);
