/* eslint-disable react/jsx-no-duplicate-props */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable react/button-has-type */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/no-array-index-key */
/* eslint-disable jsx-a11y/alt-text */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Icon, Modal } from 'antd';
import classnames from 'classnames';
import RESOURCE from '../../../../resource';
import ItemIcon from '../../../item/itemIcon';
import { getItemPositionName, getItemQuality } from '../../../../../utils/hero';
import Backpack from '../../../backpack';

const { confirm } = Modal;

class Shop extends Component {
  state = {
    selectItem: null,
    amount: '',
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'hero_shop/getMyAuctionItems',
    });
  }

  handleSelectItem = (item) => {
    this.setState({
      selectItem: item,
    });
  }

  handleEvent = () => {
    const { selectItem } = this.state;
    const { dispatch } = this.props;
    console.log('卖出', selectItem);
    // dispatch({
    //   type: 'hero_shop/buy',
    //   payload: selectItem.id,
    // });
  }

  handleSell = (callback) => {
    const { selectItem, amount } = this.state;
    const { dispatch } = this.props;
    confirm({
      title: '确认上架拍卖？',
      content: `您将以 ${amount} BASE 上架 ${selectItem.meta.name} 到拍卖行。`,
      okText: '上架',
      cancelText: '取消',
      onOk: () => {
        dispatch({
          type: 'hero_shop/auctionSell',
          payload: {
            id: selectItem.id,
            price: amount,
          },
          onSuccess: callback,
        });
      },
    });
  }

  handleClose(item) {
    const { dispatch } = this.props;
    confirm({
      title: '确认下架这个物品？',
      okText: '下架',
      cancelText: '取消',
      onOk: () => {
        dispatch({
          type: 'hero_shop/auctionClose',
          payload: item.id,
        });
      },
    });
  }


  render() {
    const { selectItem, amount } = this.state;
    const { myAuction } = this.props;
    return (
      <div className="auction-sell">
        <Backpack
          onItemSelect={this.handleSelectItem}
          noAddSpace
          noSell
          noUpgrade
          inject={[{
            type: 'input',
            placeholder: '拍卖金额',
            value: amount,
            onChange: e => this.setState({ amount: e.target.value }),
          }, {
            text: '上架',
            onClick: this.handleSell,
          }]}
        />
        <div className="shop-footer">
          <div className="title">已上架拍卖</div>
          {myAuction.map(item => (
            <div className="auction-set" key={item.id}>
              <ItemIcon data={item.meta} />
              <div className="info">
                <div className="name">{item.meta.name}</div>
                <div className="price">{item.auction_price} BASE</div>
              </div>
              <span className="level">Lv.{item.level}</span>
              <div className="close-btn game-btn" onClick={this.handleClose.bind(this, item)}>下架</div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

function mapStateToProps({ hero_shop: shop, farm_player: player }) {
  const { myAuction } = shop;
  const { accounts } = player;

  return {
    myAuction,
    accounts,
  };
}

export default connect(mapStateToProps)(Shop);
