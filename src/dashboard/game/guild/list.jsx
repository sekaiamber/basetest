/* eslint-disable react/jsx-no-duplicate-props */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable react/button-has-type */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/no-array-index-key */
/* eslint-disable jsx-a11y/alt-text */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Spin } from 'antd';
import classnames from 'classnames';
import RESOURCE from '../../resource';


class Guild extends Component {
  state = {
    showCreateModal: false,
    newGuildName: '',
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'hero_guild/getGuildList',
    });
  }

  handleCreateGuild = () => {
    const { dispatch } = this.props;
    const { newGuildName } = this.state;
    if (newGuildName.length > 0) {
      dispatch({
        type: 'hero_guild/create',
        payload: {
          name: newGuildName,
        },
      });
    }
  }

  handleJoinGuild(guild) {
    const { dispatch } = this.props;
    dispatch({
      type: 'hero_guild/join',
      payload: guild.id || 1,
    });
  }

  render() {
    const { showCreateModal, newGuildName } = this.state;
    const { guilds } = this.props;
    return (
      <div className="content">
        <div className="title">
          <div>公会列表</div>
          <div className="game-btn" onClick={() => this.setState({ showCreateModal: true })}>创建公会</div>
        </div>
        {guilds === '__LOADING__' && (
          <div style={{ textAlign: 'center', marginTop: 30 }}><Spin /></div>
        )}
        {guilds !== '__LOADING__' && guilds && (
          <div className="guilds">
            {guilds.map(guild => (
              <div className="guild" key={guild.id}>
                <div className="level">Lv.{guild.level + 1}</div>
                <div className="name">{guild.name}</div>
                <div className="join"><div className="game-btn" onClick={this.handleJoinGuild.bind(this, guild)}>加入</div></div>
              </div>
            ))}
          </div>
        )}
        {guilds !== '__LOADING__' && guilds && guilds.length === 0 && (
          <div style={{ textAlign: 'center', marginTop: 30 }}>还没有任何公会，创建一个吧！</div>
        )}

        {showCreateModal && (
          <div className="game-modal inner create-guild-modal">
            <div id="guild" className="content-container">
              <div className="close game-btn" onClick={() => this.setState({ showCreateModal: false })}>返回</div>
              <div className="content">
                <div className="title">创建公会</div>
                <div><input type="text" className="game-input" placeholder="输入公会名" value={newGuildName} onChange={e => this.setState({ newGuildName: e.target.value })} /></div>
                <div style={{ marginBottom: 24 }}>创建公会将花费 50000 BASE</div>
                <div><div className="game-btn" onClick={this.handleCreateGuild}>创建公会</div></div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

function mapStateToProps({ hero_guild: guild, farm_player: player }) {
  const { accounts } = player;
  const { guilds } = guild;

  return {
    accounts,
    guilds,
  };
}

export default connect(mapStateToProps)(Guild);
