/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { Component } from 'react';
import classnames from 'classnames';
import Decimal from 'decimal.js-light';
import { connect } from 'dva';
import { Spin } from 'antd';
import message from '../../../utils/message';

import './style.scss';

// images
// import blockHeightImg from '../../../assets/block_height.svg';

class Buy extends Component {
  state = {
    selected: undefined,
    showOrder: false,
    use: 'usdt',
  }

  getOrderCost() {
    const { accountInfo } = this.props;
    const { selected, use } = this.state;
    if (!selected) {
      return {
        discount: '0',
        cost: '0',
      };
    }
    if (use === 'usdt') {
      return {
        cost: selected.usdt_price,
      };
    }
    const activityBalance = new Decimal(accountInfo.activity_balance);
    const price = new Decimal(selected.price);
    if (price.lessThan(activityBalance)) {
      return {
        discount: selected.price,
        cost: '0',
      };
    }
    return {
      discount: accountInfo.activity_balance,
      cost: price.minus(activityBalance).toString(),
    };
  }

  handleShowOrder = () => {
    this.setState({
      showOrder: true,
    });
  }

  handleCloseModal = (e) => {
    if (e.currentTarget === e.target) {
      this.setState({
        showOrder: false,
      });
    }
  }

  handleSubmitOrder = () => {
    const { selected, use } = this.state;
    const { dispatch } = this.props;
    dispatch({
      type: 'product/buy',
      payload: {
        product_id: selected.id,
        currency: use.toUpperCase(),
      },
      onSuccess: () => {
        message.success('購買成功');
      },
    });
  }

  handleSelect(id) {
    this.setState({
      selected: id,
    });
  }

  handleChangeUse(use) {
    this.setState({
      use,
    });
  }

  render() {
    const { list, usdtCanBuy } = this.props;
    const { selected, showOrder, use } = this.state;
    const orderCost = this.getOrderCost();
    const selectId = selected ? selected.id : undefined;
    const unit = use === 'usdt' ? 'USDT' : 'BASE';

    return (
      <div id="buy">
        <div className="top-select">
          <span className="shadow-pad">
            <span className={classnames('option', { active: use === 'usdt' })} onClick={this.handleChangeUse.bind(this, 'usdt')}>使用USDT购买</span>
            <span className={classnames('option', { active: use === 'base' })} onClick={this.handleChangeUse.bind(this, 'base')}>使用BASE购买</span>
          </span>
        </div>
        <div className="list container">
          {list === 'LOADING' ? (
            <div className="loading">
              <Spin />
            </div>
          ) : (
            list.map(item => (
              <div className={classnames('item shadow-pad', { selected: item.id === selectId })} key={item.id} onClick={this.handleSelect.bind(this, item)}>
                <div className="lv">
                  <svg xmlns="http://www.w3.org/200/svg" height="44" width="44">
                    <circle cx="22" cy="22" r="20" fill="none" stroke="#ececec" strokeWidth="3" strokeLinecap="round" />
                    <circle
                      className="demo2"
                      cx="22"
                      cy="22"
                      r="20"
                      fill="none"
                      stroke="#953E96"
                      strokeWidth="3"
                    />
                  </svg>
                  <span className="text"><span>P</span>{parseInt(item.vip_level.slice(1), 10)}</span>
                </div>
                <div className="center">
                  <div className="data">{item.power} ph/s</div>
                  {/* <div className="rate">預計收益率{item.rate}/天</div> */}
                </div>
                <div className="price">
                  <div>{use === 'usdt' ? item.usdt_price : item.price}</div>
                  <div className="unit">{unit}</div>
                </div>
              </div>
            ))
          )}
        </div>
        {selected && ((usdtCanBuy || use === 'base') ? (
          <div className="footer">
            <div className="info-container">
              <div className="info">
                <div className="cost">合計：{orderCost.cost} {unit}</div>
                { use === 'base' && (
                  <div className="discount">可抵扣：{orderCost.discount} {unit}</div>
                )}
              </div>
            </div>
            <div className="btn-container">
              <div className="btn" onClick={this.handleShowOrder}>去計算</div>
            </div>
          </div>
        ) : (
          <div className="footer">
            <div className="info-container">
              <div className="info">
                USDT购买通道暂时关闭，请通过BASE通道进行购买
              </div>
            </div>
          </div>
          ))
        }
        {showOrder && (
          <div className="order-modal" onClick={this.handleCloseModal}>
            <div className="order-container">
              <div className="item">
                <div>訂單金額：</div>
                <div>
                  {selected ? (
                    use === 'usdt' ? selected.usdt_price : selected.price
                  ) : '0'} {unit}
                </div>
              </div>
              { use === 'base' && (
                <div className="item">
                  <div>抵扣</div>
                  <div>-{orderCost.discount} {unit}</div>
                </div>
              )}
              <div className="item">
                <div>合計</div>
                <div>{orderCost.cost} {unit}</div>
              </div>
              <div className="order-submit">
                <div className="btn" onClick={this.handleSubmitOrder}>提交訂單</div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

function mapStateToProps({ product, account }) {
  const { account: accountInfo } = account;

  return {
    list: product.products,
    canBuy: product.canBuy,
    accountInfo,
    usdtCanBuy: product.usdtCanBuy,
  };
}

export default connect(mapStateToProps)(Buy);
