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
        <div className="guild-content battle">
          <div className="title">
            <div>公会锦标赛</div>
          </div>
          <div className="coming">
            <div><img src={RESOURCE.UI.GUILD_08} alt="" /></div>
            <div className="text">即将来临</div>
          </div>
        </div>
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
