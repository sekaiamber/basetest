/* eslint-disable react/jsx-no-duplicate-props */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable react/button-has-type */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/no-array-index-key */
/* eslint-disable jsx-a11y/alt-text */
import React, { Component } from 'react';
import { Icon, message, Tooltip } from 'antd';
import { connect } from 'dva';
import classnames from 'classnames';
import RESOURCE from '../../resource';
import Backpack from '../backpack';
import { calculateHeroPower, calculateItemPower } from '../../../utils/hero';
import Anime from '../anime';
import ItemModal from '../item';
import ItemIcon from '../item/itemIcon';

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
    selectedEquipItem: null,
  }

  handleSelectItem = (item) => {
    this.setState({
      selectedItem: item,
    });
  }

  handleSelectEquipItem = (item) => {
    this.setState({
      selectedEquipItem: item,
    });
  }

  handleExit = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'utils/goto',
      goto: '/',
    });
  }

  handleNotEquip = () => {
    const { selectedEquipItem } = this.state;
    const { dispatch } = this.props;
    dispatch({
      type: 'hero_player/notEquip',
      payload: selectedEquipItem,
    });
    this.setState({
      selectedEquipItem: null,
    });
  }

  handleEquip = (callback) => {
    const { selectedItem } = this.state;
    const { dispatch, equipped } = this.props;
    if (equipped[selectedItem.meta.position]) {
      message.error('已经同样位置的装备，请卸下后再装备');
      return;
    }
    dispatch({
      type: 'hero_player/equip',
      payload: selectedItem,
    });
    this.setState({
      selectedItem: null,
    });
    callback();
  }

  render() {
    const { selectedItem, selectedEquipItem } = this.state;
    const { onClose, heroInfo, equipped, buffs, power } = this.props;

    return (
      <div className="game-modal">
        <div id="hero" className="content-container">
          <div className="modal-ex">
            <div className="game-btn" onClick={this.handleExit}>退出游戏</div>
            <div className="game-btn" onClick={onClose}>返回</div>
          </div>
          <div className="content hero-content">
            <div className="hero-panel">
              <div className="title">英雄</div>
              <div className="pic">
                <div className="equips">
                  {['head', 'body', 'lower'].map(key => (
                    <div className="equip" key={key}>
                      {equipped[key] ? (
                        <>
                          <ItemIcon data={equipped[key].meta} onClick={this.handleSelectEquipItem.bind(this, equipped[key])} />
                          <span className="level">Lv.{equipped[key].level}</span>
                        </>
                      ) : (
                        <img src={RESOURCE.ITEM_ICON.EMPTY} />
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
                          <ItemIcon data={equipped[key].meta} onClick={this.handleSelectEquipItem.bind(this, equipped[key])} />
                          <span className="level">Lv.{equipped[key].level}</span>
                        </>
                      ) : (
                        <img src={RESOURCE.ITEM_ICON.EMPTY} />
                      )}
                      <span className="position">{positionMap[key]}</span>
                    </div>
                  ))}
                </div>
              </div>
              {buffs.length > 0 && (
                <div className="buffs">
                  {buffs.map((buff, i) => (
                    <Tooltip
                      placement="topLeft"
                      title={(
                        <>
                          <div className="hero-buff-name">{buff.meta.name}</div>
                          <div className="hero-buff-desc">{buff.meta.desc}</div>
                        </>
                      )}
                      key={i}
                    >
                      <div className="buff">
                        <img src={RESOURCE.BUFF_ICON[buff.meta.code]} alt="" />
                        {buff.count > 1 && (
                          <span className="count">{buff.count}</span>
                        )}
                      </div>
                    </Tooltip>
                  ))}
                </div>
              )}
              <div className="mianban-row">
                <div className="mianban">
                  <div className="key">等级</div>
                  <div className="value">Lv.{heroInfo.game_level}</div>
                </div>
                <div className="mianban">
                  <div className="key">英雄战斗力</div>
                  <div className="value">{power.hero}<Icon type="thunderbolt" /></div>
                </div>
              </div>
              <div className="mianban-row">
                <div className="mianban">
                  <div className="key">总战斗力</div>
                  <div className="value">{power.totalBase}<span className="extra">(+{power.totalExtra})</span><Icon type="thunderbolt" /></div>
                </div>
                <div className="mianban">
                  <div className="key">装备战斗力</div>
                  <div className="value">{power.equip}<Icon type="thunderbolt" /></div>
                </div>
              </div>
            </div>
            <Backpack
              onItemSelect={this.handleSelectItem}
              inject={[{
                text: '装备',
                onClick: this.handleEquip,
              }]}
            />
          </div>
          {selectedEquipItem && (
            <ItemModal
              data={selectedEquipItem}
              inject={[{
                text: '卸下',
                onClick: this.handleNotEquip,
              }]}
              onClose={() => this.setState({ selectedEquipItem: null })}
            />
          )}
        </div>
      </div>
    );
  }
}

function mapStateToProps({ hero_player: hero }) {
  const { info: heroInfo, equipped, buffs } = hero;
  // 计算战斗力
  let equipPower = 0;
  let heroPower = 0;
  if (heroInfo) {
    heroPower = calculateHeroPower(heroInfo.game_level);
  }
  if (heroInfo && heroInfo.equipped) {
    equipPower = parseInt(heroInfo.equipped.map(i => calculateItemPower(i)).reduce((a, b) => a + b, 0), 10);
  }
  const totalBasePower = equipPower + heroPower;
  let totalExtraPower = 0;
  buffs.forEach((buff) => {
    if (buff.meta.code === 'buff_union_01') {
      // 公会战斗力
      totalExtraPower += (buff.count * buff.meta.rate) * totalBasePower / 100;
    }
  });
  totalExtraPower = parseInt(totalExtraPower, 10);

  const power = {
    equip: equipPower,
    hero: heroPower,
    totalBase: totalBasePower,
    totalExtra: totalExtraPower,
  };

  return {
    heroInfo,
    equipped,
    buffs,
    power,
  };
}

export default connect(mapStateToProps)(Hero);
