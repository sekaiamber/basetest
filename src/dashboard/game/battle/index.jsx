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

class Battle extends Component {
  state = {
    // 是否完成搜索动画
    ready: false,
    // 是否请求完成
    battle: false,
    vsanime: true,
    // 结果是否胜利
    result: false,
  }

  componentDidMount() {
    this.handler = setTimeout(() => {
      this.ready();
    }, 3000 + Math.random() * 2000);
  }

  componentWillUnmount() {
    clearTimeout(this.handler);
  }

  ready() {
    // 发送请求，成功后设置battle为true，显示结果
    this.setState({
      ready: true,
    });
  }

  render() {
    const { battle, ready, vsanime, result } = this.state;
    const { onClose } = this.props;
    return (
      <div className="game-modal">
        <div id="battle" className="content-container">
          <div className="close game-btn" onClick={onClose}>返回</div>
          <div className="header">
            <img src={RESOURCE.UI.BATTLE_01} alt="" className="center" />
            <img src={RESOURCE.UI.BATTLE_02} alt="" className="left" />
            <img src={RESOURCE.UI.BATTLE_03} alt="" className="right" />
          </div>
          {!(battle && ready) && (
            <>
              <div className="searching">
                <img src={RESOURCE.UI.BATTLE_04} alt="" className="main" />
                <img src={RESOURCE.UI.BATTLE_05} alt="" className="sec" />
              </div>
              <div className="searching-text">匹配对手中</div>
            </>
          )}
          {battle && ready && vsanime && (
            <div className="vs">
              <span>test</span>
              <img src={RESOURCE.UI.BATTLE_06} alt="" className="main" />
              <span>oa009911</span>
            </div>
          )}
          {battle && ready && (
            <div className="result">
              <span>-30</span>
              {result ? (
                <img src={RESOURCE.UI.BATTLE_VICTORY} alt="" className="main" />
              ) : (
                <img src={RESOURCE.UI.BATTLE_DEFEAT} alt="" className="main" />
              )}
              <span>+30</span>
            </div>
          )}
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

export default connect(mapStateToProps)(Battle);
