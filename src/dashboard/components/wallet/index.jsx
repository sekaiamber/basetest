/* eslint-disable react/no-array-index-key */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { Component } from 'react';
import classnames from 'classnames';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Spin } from 'antd';
import './style.scss';

// images
import walletBaseImg from '../../../assets/wallet_base.svg';
import walletBase2Img from '../../../assets/wallet_base_2.svg';
import walletUsdtImg from '../../../assets/wallet_usdt.png';
import walletQrImg from '../../../assets/wallet_qr.svg';
import walletDepImg from '../../../assets/wallet_deposit.svg';
import walletWitImg from '../../../assets/wallet_withdraw.svg';

class Wallet extends Component {
  state = {
    use: 'base',
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'account/queryHistory',
      payload: 'BASE',
    });
  }

  getUseWallet() {
    const { use } = this.state;
    const { userInfo, accountInfo } = this.props;
    const info = {
      unit: use.toUpperCase(),
      address: '',
      balance: '',
      logo: '',
    };
    if (use === 'usdt') {
      info.address = userInfo.usdt_payment_address;
      info.balance = accountInfo.usdt_balance;
      info.logo = walletUsdtImg;
    } else {
      info.address = userInfo.payment_address;
      info.balance = accountInfo.balance;
      info.logo = walletBase2Img;
    }
    return info;
  }

  handleGotoDeposit = () => {
    const { use } = this.state;
    const { dispatch } = this.props;
    dispatch({
      type: 'utils/goto',
      goto: '/deposit/' + use,
    });
  }

  handleChangeUse(use) {
    this.setState({
      use,
    });
    const { dispatch } = this.props;
    dispatch({
      type: 'account/queryHistory',
      payload: use.toUpperCase(),
    });
  }

  render() {
    const { history } = this.props;
    const { use } = this.state;
    const useWallet = this.getUseWallet();

    return (
      <div id="wallet" className="container">
        <div className="top-select">
          <span className="shadow-pad">
            <span className={classnames('option', { active: use === 'base' })} onClick={this.handleChangeUse.bind(this, 'base')}>BASE钱包</span>
            <span className={classnames('option', { active: use === 'usdt' })} onClick={this.handleChangeUse.bind(this, 'usdt')}>USDT钱包</span>
          </span>
        </div>
        <div className={classnames('card', { usdt: use === 'usdt' })}>
          <div className="top">
            <img className="logo" src={useWallet.logo} alt="" />
            <div className="address">
              <div className="currency">{useWallet.unit}</div>
              <div className="text">
                <span>{useWallet.address}</span>
                <img src={walletQrImg} alt="" onClick={this.handleGotoDeposit} />
              </div>
            </div>
          </div>
          <div className="amount">{parseFloat(useWallet.balance).toFixed(2)}</div>
        </div>
        <div className="opt">
          <Link className="opt-btn" to={`/deposit/${use}`}>
            <img src={walletDepImg} alt="" />
            <span>充值</span>
          </Link>
          <Link className="opt-btn" to={`/withdraw/${use}`}>
            <img src={walletWitImg} alt="" />
            <span>提現</span>
          </Link>
        </div>
        <div className="page-title">充提歷史</div>
        <div className="history">
          {history === 'LOADING' ? (
            <div className="loading">
              <Spin />
            </div>
          ) : (
            history.map((item, i) => (
              <div className="item shadow-pad" key={item.type + i}>
                <img className="logo" src={useWallet.logo} alt="" />
                <div className="center">
                  <div className="txid">{item.txid || '等待中'}</div>
                  <div className="time">{item.created_at}</div>
                </div>
                <div className="amount">
                  {item.type === 'deposits' ? '+' : '-'}{item.amount}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }
}

function mapStateToProps({ account }) {
  const {
    userInfo, account: accountInfo, history,
  } = account;

  return {
    userInfo,
    accountInfo,
    history,
  };
}

export default connect(mapStateToProps)(Wallet);
