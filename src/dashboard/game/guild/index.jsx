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
import List from './list';
import MyGuild from './my';

import './style.scss';

class Guild extends Component {
  state = {
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'hero_guild/getMyGuild',
    });
  }

  render() {
    const { onClose, myGuild } = this.props;
    return (
      <div className="game-modal">
        <div id="guild" className="content-container">
          <div className="close game-btn" onClick={onClose}>返回</div>
          {myGuild === '__LOADING__' && (
            <div style={{ textAlign: 'center', marginTop: 30 }}><Spin /></div>
          )}
          {myGuild !== '__LOADING__' && !myGuild && (
            <List />
          )}
          {myGuild !== '__LOADING__' && myGuild && (
            <MyGuild />
          )}
        </div>
      </div>
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
