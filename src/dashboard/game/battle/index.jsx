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
import Anime from './anime';

import config from '../../../config';

import './style.scss';

class Battle extends Component {
  state = {
    showBattle: false,
    // 是否完成搜索动画
    ready: false,
    // 是否请求完成
    battle: false,
    vsanime: true,
    battleData: null,
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'hero_player/getBattleHistory',
    });
  }

  componentWillUnmount() {
    if (this.handler) {
      clearTimeout(this.handler);
    }
  }

  handleStartBattle = () => {
    const time = config.PROXY_DOMAIN ? 500 : 3000 + Math.random() * 2000;
    this.handler = setTimeout(() => {
      this.ready();
    }, time);
    this.setState({
      showBattle: true,
    });
  }

  handleCancelBattle = () => {
    if (this.handler) {
      clearTimeout(this.handler);
    }
    const { ready } = this.state;
    if (ready) {
      const { dispatch } = this.props;
      dispatch({
        type: 'hero_player/getBattleHistory',
      });
    }
    this.setState({
      showBattle: false,
      // 是否完成搜索动画
      ready: false,
      // 是否请求完成
      battle: false,
      vsanime: true,
    });
  }

  handleGetResult = (result) => {
    // 获得结果
    this.setState({
      battle: true,
      battleData: result,
    });
  }

  handleAnimeFinish = () => {
    this.setState({
      vsanime: false,
    });
  }

  ready() {
    // 发送请求，成功后设置battle为true，显示结果
    const { dispatch } = this.props;
    this.setState({
      ready: true,
    });
    dispatch({
      type: 'hero_player/battle',
      onSuccess: this.handleGetResult,
    });
  }

  render() {
    const { battle, ready, vsanime, showBattle, battleData } = this.state;
    const { onClose, battles } = this.props;
    return (
      <div className="game-modal">
        <div id="battle" className="content-container">
          <div className="close game-btn" onClick={onClose}>返回</div>
          <div className="content">
            <div className="title">
              <div>战斗历史</div>
              <div className="game-btn" onClick={this.handleStartBattle}>开始战斗</div>
            </div>
            {battles === '__LOADING__' && (
              <div style={{ textAlign: 'center', marginTop: 30 }}><Spin /></div>
            )}
            {battles !== '__LOADING__' && battles.length === 0 && (
              <>
                <div style={{ textAlign: 'center', marginTop: 30 }}>您还没有战斗过，赶紧加入战斗，赢取BASE</div>
                <div style={{ textAlign: 'center', marginTop: 30, marginLeft: 'auto', marginRight: 'auto', width: '2rem' }} className="game-btn" onClick={this.handleStartBattle}>开始战斗</div>
              </>
            )}
            {battles !== '__LOADING__' && battles.length > 0 && (
              <div className="battles">
                {battles.map((b, i) => (
                  <div className="battle" key={i}>
                    <div className={classnames('result', { win: b.winer === 'from' })}><span>{b.winer === 'from' ? '胜利' : '失败'}</span></div>
                    <div className="date">{b.created_at}</div>
                    <div className="to">{b.from.is_me ? b.to.nickname : b.from.nickname}</div>
                    <div className="number">{b.winer === 'from' ? '+' : '-'}{b.win_amount} BASE</div>
                  </div>
                ))}
              </div>
            )}
          </div>
          {showBattle && (
            <div className="game-modal searching-model">
              <div className="content-container battle-search-modal">
                <div className="modal-ex">
                  <div className="game-btn" onClick={this.handleCancelBattle}>{vsanime ? '取消' : '确定'}</div>
                </div>
                <div className="content">
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
                  {battle && ready && !vsanime && battleData && (
                    <div className="vs">
                      <span>{battleData.from.nickname}</span>
                      <img src={RESOURCE.UI.BATTLE_06} alt="" className="main" />
                      <span>{battleData.to.nickname}</span>
                    </div>
                  )}
                  {battle && ready && !vsanime && battleData && (
                    <div className="result">
                      <span>{`${battleData.winer === 'from' ? '+' : '-'}${battleData.win_amount}`}</span>
                      {battleData.winer === 'from' ? (
                        <img src={RESOURCE.UI.BATTLE_VICTORY} alt="" className="main" />
                      ) : (
                        <img src={RESOURCE.UI.BATTLE_DEFEAT} alt="" className="main" />
                      )}
                      <span>{`${battleData.winer === 'to' ? '+' : '-'}${battleData.win_amount}`}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
        {battle && ready && vsanime && battleData && (
          <Anime data={battleData} onFinish={this.handleAnimeFinish} />
        )}
      </div>
    );
  }
}

function mapStateToProps({ hero_player: hero, farm_player: player }) {
  const { accounts } = player;
  const { battles } = hero;

  return {
    accounts,
    battles,
  };
}

export default connect(mapStateToProps)(Battle);
