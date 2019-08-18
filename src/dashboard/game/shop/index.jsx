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
import Backpack from '../backpack';

import './style.scss';

const positionMap = {
  head: '头部',
  body: '身体',
  lower: '裤子',
  accessory: '饰品',
  weapon: '武器',
  relic: '圣物',
};

const modeMap = {
  buy: '买入',
  sell: '卖出',
};

class Shop extends Component {
  state = {
    selectMode: null,
    selectItem: null,
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'hero_shop/getBaseShopItems',
    });
  }

  handleEvent = () => {
    const { selectMode, selectItem } = this.state;
    const { dispatch } = this.props;
    if (selectMode === 'buy' && selectItem) {
      dispatch({
        type: 'hero_shop/buy',
        payload: selectItem.id,
      });
    }
  }

  handleSelectBuy(item) {
    this.setState({
      selectMode: 'buy',
      selectItem: item,
    });
  }

  render() {
    const { selectMode, selectItem } = this.state;
    const { onClose, basic } = this.props;
    return (
      <div className="game-modal">
        <div id="shop" className="content-container">
          <div className="close game-btn" onClick={onClose}>返回</div>
          <div className="content">
            <div className="shop-panel">
              <div className="title">商店</div>
              {basic.map(item => (
                <div
                  key={item.id}
                  className={classnames('item', { selected: selectItem === item })}
                  onClick={this.handleSelectBuy.bind(this, item)}
                >
                  <div className="img-container">
                    <img src={RESOURCE.ITEM_ICON[item.code]} alt="" />
                  </div>
                  <div className="info">
                    <div>
                      <div>{item.name}</div>
                      <div>Lv.1 {positionMap[item.position]}</div>
                    </div>
                    <div>
                      <div>{item.price} BASE</div>
                      <div>{item.power}<Icon type="thunderbolt" /></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Backpack />
          </div>
          {selectMode && (
            <div className="shop-footer">
              <div>{selectItem.name}: 价值 {selectItem.price} BASE</div>
              <div className="game-btn" onClick={this.handleEvent}>{modeMap[selectMode]}</div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

function mapStateToProps({ hero_shop: shop, farm_player: player }) {
  const { basic } = shop;
  const { accounts } = player;

  return {
    basic,
    accounts,
  };
}

export default connect(mapStateToProps)(Shop);
