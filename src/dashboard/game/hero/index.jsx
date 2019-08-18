/* eslint-disable react/jsx-no-duplicate-props */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable react/button-has-type */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/no-array-index-key */
/* eslint-disable jsx-a11y/alt-text */
import React, { Component } from 'react';
import { Icon, message } from 'antd';
import { connect } from 'dva';
import classnames from 'classnames';
import RESOURCE from '../../resource';
import Backpack from '../backpack';
import { calculateHeroPower, calculateItemPower } from '../../../utils/hero';
import Anime from '../anime';

import './style.scss';

const positionMap = {
  head: '头部',
  body: '身体',
  lower: '裤子',
  accessory: '饰品',
  weapon: '武器',
  relic: '圣物',
};

class Hero extends Component {
  state = {
    selectedItem: null,
  }

  handleSelectItem = (item) => {
    this.setState({
      selectedItem: item,
    });
  }

  handleNotEquip = () => {
    const { selectedItem } = this.state;
    const { dispatch } = this.props;
    dispatch({
      type: 'hero_player/notEquip',
      payload: selectedItem,
    });
    this.setState({
      selectedItem: null,
    });
  }

  handleEquip = () => {
    const { selectedItem } = this.state;
    const { dispatch, equipped } = this.props;
    if (equipped[selectedItem.meta.position]) {
      message.error('已经同样位置的装备，请卸下后再装备');
    }
    dispatch({
      type: 'hero_player/equip',
      payload: selectedItem,
    });
    this.setState({
      selectedItem: null,
    });
  }

  render() {
    const { selectedItem } = this.state;
    const { onClose, heroInfo, equipped } = this.props;
    const equipPower = parseInt(heroInfo.equipped.map(i => calculateItemPower(i)).reduce((a, b) => a + b, 10), 10);
    const heroPower = calculateHeroPower(heroInfo.game_level);

    return (
      <div className="game-modal">
        <div id="hero" className="content-container">
          <div className="close game-btn" onClick={onClose}>返回</div>
          <div className="content">
            <div className="hero-panel">
              <div className="title">英雄</div>
              <div className="pic">
                <div className="equips">
                  {['head', 'body', 'lower'].map(key => (
                    <div className="equip" key={key}>
                      {equipped[key] ? (
                        <>
                          <span className="level">Lv.{equipped[key].level}</span>
                          <img src={RESOURCE.ITEM_ICON[equipped[key].meta.code] || RESOURCE.ITEM_ICON.EMPTY} onClick={this.handleSelectItem.bind(this, equipped[key])} />
                        </>
                      ) : (
                        <img src={RESOURCE.ITEM_ICON.EMPTY} onClick={this.handleSelectItem.bind(this, null)} />
                      )}
                      <span className="position">{positionMap[key]}</span>
                    </div>
                  ))}
                </div>
                <div className="preview">
                  <Anime heroInfo={heroInfo} equipped={equipped} />
                </div>
                <div className="equips">
                  {['weapon', 'accessory', 'relic'].map(key => (
                    <div className="equip" key={key}>
                      {equipped[key] ? (
                        <>
                          <span className="level">Lv.{equipped[key].level}</span>
                          <img src={RESOURCE.ITEM_ICON[equipped[key].meta.code] || RESOURCE.ITEM_ICON.EMPTY} onClick={this.handleSelectItem.bind(this, equipped[key])} />
                        </>
                      ) : (
                        <img src={RESOURCE.ITEM_ICON.EMPTY} onClick={this.handleSelectItem.bind(this, null)} />
                      )}
                      <span className="position">{positionMap[key]}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mianban-row">
                <div className="mianban">
                  <div className="key">等级</div>
                  <div className="value">Lv.{heroInfo.game_level}</div>
                </div>
                <div className="mianban">
                  <div className="key">英雄战斗力</div>
                  <div className="value">{heroPower}<Icon type="thunderbolt" /></div>
                </div>
              </div>
              <div className="mianban-row">
                <div className="mianban">
                  <div className="key">战斗力</div>
                  <div className="value">{heroPower + equipPower}<Icon type="thunderbolt" /></div>
                </div>
                <div className="mianban">
                  <div className="key">装备战斗力</div>
                  <div className="value">{equipPower}<Icon type="thunderbolt" /></div>
                </div>
              </div>
            </div>
            <Backpack onItemSelect={this.handleSelectItem} />
          </div>
          {selectedItem && (
            <div className="hero-footer">
              <div>等级{selectedItem.level} {selectedItem.meta.name}</div>
              {selectedItem.equipped ? (
                <div className="game-btn" onClick={this.handleNotEquip}>卸下</div>
              ) : (
                <div className="game-btn" onClick={this.handleEquip}>装备</div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }
}

function mapStateToProps({ hero_player: hero }) {
  const { info: heroInfo, equipped } = hero;

  return {
    heroInfo,
    equipped,
  };
}

export default connect(mapStateToProps)(Hero);
