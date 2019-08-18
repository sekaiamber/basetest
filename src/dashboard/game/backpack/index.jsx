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
  }

  componentDidMount() {

  }

  handleSelectItem(item) {
    const { onItemSelect } = this.props;
    if (!onItemSelect) return;
    this.setState({
      selectedItem: item,
    });
    onItemSelect(item);
  }

  render() {
    const { backpack, accounts, backpackSize } = this.props;
    const { selectedItem } = this.state;

    return (
      <div id="backpack">
        <div className="title">
          <div>我的背包</div>
          <div className="account">
            <div>{accounts.base} BASE</div>
            <div>背包容量：{backpack.length}/{backpackSize}</div>
          </div>
        </div>
        {backpack.map(item => (
          <div
            key={item.id}
            className={classnames('item', { selected: selectedItem === item })}
            onClick={this.handleSelectItem.bind(this, item)}
          >
            <div className="img-container">
              <img src={RESOURCE.ITEM_ICON[item.meta.code]} alt="" />
            </div>
            <div className="info">
              <div>
                <div>{item.meta.name}</div>
                <div>等级{item.level}</div>
              </div>
              <div>
                <div>{positionMap[item.meta.position]}</div>
                <div>{parseInt(calculateItemPower(item), 10)}<Icon type="thunderbolt" /></div>
              </div>
            </div>
          </div>
        ))}
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
