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
import RESOURCE from '../../../resource';
import ItemIcon from '../../item/itemIcon';
import { getItemPositionName } from '../../../../utils/hero';

const modeMap = {
  buy: '买入',
  sell: '卖出',
};

class Shop extends Component {
  state = {
    selectItem: null,
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'hero_shop/getBaseShopItems',
    });
  }

  componentWillReceiveProps(newProps) {
    const { selectItem } = this.state;
    if (newProps.basic && newProps.basic.length > 0 && !selectItem) {
      this.setState({
        selectItem: newProps.basic[0],
      });
    }
  }

  getSetInfo() {
    const { selectItem } = this.state;
    if (!selectItem) return null;
    const { itemSetMap, equipped } = this.props;
    const setInfo = itemSetMap[selectItem.code];
    if (!setInfo) return undefined;
    const ret = {
      ...setInfo,
      items: setInfo.items.map(item => ({
        code: item.code,
        name: item.name,
        position: item.position,
        equipped: equipped[item.position] && equipped[item.position].meta.code === item.code,
      })),
    };
    ret.buff_active = ret.items.map(i => i.equipped).reduce((a, b) => a && b, true);
    return ret;
  }

  handleEvent = () => {
    const { selectItem } = this.state;
    const { dispatch } = this.props;
    dispatch({
      type: 'hero_shop/buy',
      payload: selectItem.id,
    });
  }

  handleSelectBuy(item) {
    this.setState({
      selectItem: item,
    });
  }

  render() {
    const { selectItem } = this.state;
    const { basic } = this.props;
    const selectItemSetInfo = this.getSetInfo();

    return (
      <>
        <div className="content shop-content">
          <div className="shop-panel">
            <div className="title">商店</div>
            {basic.map(item => (
              <div
                key={item.id}
                className={classnames('item', { selected: selectItem === item })}
                onClick={this.handleSelectBuy.bind(this, item)}
              >
                <div className="img-container">
                  <ItemIcon data={item} />
                </div>
                <div className="info">
                  <div>
                    <div>{item.name}</div>
                    <div>Lv.1 {getItemPositionName(item)}</div>
                  </div>
                  <div>
                    <div>{item.price} BASE</div>
                    <div>{item.power}<Icon type="thunderbolt" /></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {selectItem && (
          <div className="shop-footer">
            <div className="title">{selectItem.name}</div>
            <div className="icon"><ItemIcon data={selectItem} /></div>
            <div className="row">
              <div className="key">初始战斗力</div>
              <div className="value">{selectItem.power}<Icon type="thunderbolt" /></div>
            </div>
            <div className="row">
              <div className="key">每级提升</div>
              <div className="value">{selectItem.position === 'weapon' ? '8%' : '5%'}</div>
            </div>
            {selectItemSetInfo && (
              <>
                <div className="sub-title">套装信息 - {selectItemSetInfo.name}</div>
                {selectItemSetInfo.items.map(item => (
                  <div className={classnames('row set-item', { equipped: item.equipped })} key={item.code}>
                    <div className="key">{item.name}</div>
                    <div className="value">{getItemPositionName(item)}</div>
                  </div>
                ))}
                <div className={classnames('set-buff-desc', { active: selectItemSetInfo.buff_active })}>套装效果：{selectItemSetInfo.buff.desc}</div>
              </>
            )}
            <div className="game-btn" onClick={this.handleEvent}>购买({selectItem.price} BASE)</div>
          </div>
        )}
      </>
    );
  }
}

function mapStateToProps({ hero_shop: shop, farm_player: player, hero_player: hero }) {
  const { basic } = shop;
  const { accounts } = player;
  const { itemSetMap, equipped } = hero;

  return {
    basic,
    accounts,
    equipped,
    itemSetMap,
  };
}

export default connect(mapStateToProps)(Shop);
