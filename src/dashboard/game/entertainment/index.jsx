/* eslint-disable react/jsx-no-duplicate-props */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable react/button-has-type */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/no-array-index-key */
/* eslint-disable jsx-a11y/alt-text */
import React, { Component } from 'react';
import { connect } from 'dva';
import classnames from 'classnames';
import RESOURCE from '../../resource';

import './style.scss';

class Entertainment extends Component {
  state = {
  }

  render() {
    const { onClose } = this.props;
    return (
      <div className="game-modal">
        <div id="entertainment" className="content-container">
          <div className="close game-btn" onClick={onClose}>返回</div>
          <img src={RESOURCE.OTHER.CONSTRACTION} alt="" />
        </div>
      </div>
    );
  }
}

function mapStateToProps({ farm_env: env, farm_player: player }) {
  const { accounts } = player;

  return {
    accounts,
  };
}

export default connect(mapStateToProps)(Entertainment);
