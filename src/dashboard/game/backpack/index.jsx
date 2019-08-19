/* eslint-disable react/jsx-no-duplicate-props */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable react/button-has-type */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/no-array-index-key */
/* eslint-disable jsx-a11y/alt-text */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Icon } from 'antd';
import classnames from 'classnames';
import RESOURCE from '../../resource';
import { calculateItemPower } from '../../../utils/hero';

import './style.scss';

const positionMap = {
  head: '头部',
  body: '身体',
  lower: '裤子',
  accessory: '饰品',
  weapon: '武器',
  relic: '圣物',
};

class Backpack extends Component {
  state = {
    selectedItem: null,
    showItem: false,
  }

  componentDidMount() {

  }

  handleCloseItem = () => {
    this.setState({
      showItem: false,
    });
  }

  handleSelectItem(item) {
    this.setState({
      selectedItem: item,
      showItem: true,
    });
    const { onItemSelect } = this.props;
    if (onItemSelect) onItemSelect(item);
  }

  render() {
    const { backpack, accounts, backpackSize, inject } = this.props;
    const { selectedItem, showItem } = this.state;

    return (
      <div id="backpack">
        <div className="title">
          <div>我的背包</div>
          <div className="account">
            <div>{accounts.base} BASE</div>
            <div>背包容量：{backpack.length}/{backpackSize}</div>
          </div>
        </div>
        <div className="backpack-equips">
          {backpack.map(item => (
            <div className="backpack-equip" key={item.id} onClick={this.handleSelectItem.bind(this, item)}>
              <span className="level">Lv.{item.level}</span>
              <img src={RESOURCE.ITEM_ICON[item.meta.code]} />
              <span className="position">{positionMap[item.meta.position]}</span>
            </div>
          ))}
        </div>
        {showItem && (
          <div className="game-modal backpack-item-modal">
            <div className="content-container">
              <div className="modal-ex">
                {inject && inject.map((btn, i) => (
                  <div key={i} className="game-btn" onClick={() => btn.onClick(this.handleCloseItem)}>{btn.text}</div>
                ))}
                <div className="game-btn" onClick={this.handleCloseItem}>返回</div>
              </div>
              <div className="content">
                <div className="title">{selectedItem.meta.name}</div>
                <div className="row">
                  <div>{positionMap[selectedItem.meta.position]}</div>
                  <div>等级{selectedItem.level}</div>
                </div>
                <div className="row">
                  <div>战斗力加成</div>
                  <div>{parseInt(calculateItemPower(selectedItem), 10)}<Icon type="thunderbolt" /></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

function mapStateToProps({ hero_player: hero, farm_player: player }) {
  const { info: heroInfo } = hero;
  const { accounts } = player;
  const backpack = heroInfo.backpack || [];

  return {
    backpack,
    backpackSize: heroInfo.backpack_size,
    accounts,
  };
}

export default connect(mapStateToProps)(Backpack);
