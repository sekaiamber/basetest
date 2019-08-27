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
      type: 'hero_shop/getUnionShopItems',
    });
  }

  componentWillReceiveProps(newProps) {
    const { selectItem } = this.state;
    if (newProps.union && newProps.union.length > 0 && !selectItem) {
      this.setState({
        selectItem: newProps.union[0],
      });
    }
  }

  handleEvent = () => {
    const { selectItem } = this.state;
    const { dispatch } = this.props;
    console.log(selectItem);
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
    const { union } = this.props;
    return (
      <div className="guild-content shop">
        <div className="title">公会商店</div>
        {union.map(item => (
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
                <div>{item.price} <Icon type="heart" theme="filled" /></div>
                <div>{item.power}<Icon type="thunderbolt" /></div>
              </div>
            </div>
          </div>
        ))}
        {selectItem && (
          <div className="side-bar">
            <div className="title">{selectItem.name}</div>
            <div className="icon"><ItemIcon data={selectItem} alt="" /></div>
            <div className="row">
              <div className="key">花费</div>
              <div className="value">{selectItem.price} <Icon type="heart" theme="filled" /></div>
            </div>
            <div className="row">
              <div className="key">初始战斗力</div>
              <div className="value">{selectItem.power}<Icon type="thunderbolt" /></div>
            </div>
            <div className="row">
              <div className="key">每级提升</div>
              <div className="value">{selectItem.position === 'weapon' ? '8%' : '5%'}</div>
            </div>
            <div className="game-btn" onClick={this.handleEvent}>购买</div>
          </div>
        )}
      </div>
    );
  }
}

function mapStateToProps({ hero_shop: shop, farm_player: player }) {
  const { union } = shop;
  const { accounts } = player;

  return {
    union,
    accounts,
  };
}

export default connect(mapStateToProps)(Shop);
