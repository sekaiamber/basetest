/* eslint-disable prefer-destructuring */
/* eslint-disable react/no-array-index-key */
/* eslint-disable array-callback-return */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { Component } from 'react';
import classnames from 'classnames';
import Decimal from 'decimal.js-light';
import { connect } from 'dva';
import message from '../../../utils/message';

import './style.scss';

import scanImg from '../../../assets/withdraw_scan.svg';

// images
class Withdraw extends Component {
  state = {
    to: '',
    amount: '',
  }

  getUseWallet() {
    const { match, data } = this.props;
    let currency = 'base';
    if (match && match.params) {
      currency = match.params.currency;
    }
    const info = {
      unit: currency.toUpperCase(),
      balance: '',
    };
    if (currency === 'usdt') {
      info.balance = data.usdt_balance;
    } else {
      info.balance = data.balance;
    }
    return info;
  }

  getFee() {
    const { match } = this.props;
    let currency = 'base';
    if (match && match.params) {
      currency = match.params.currency;
    }
    if (currency === 'usdt') return '5';
    const { amount } = this.state;
    let fee = '0';
    if (amount !== '') {
      fee = new Decimal(amount).mul(new Decimal('0.02'));
      if (fee.lessThan(new Decimal('20'))) {
        fee = '20';
      } else {
        fee = fee.toString();
      }
    }
    return fee;
  }

  getFinal() {
    const { match } = this.props;
    let currency = 'base';
    if (match && match.params) {
      currency = match.params.currency;
    }
    const { amount } = this.state;
    let final = '0';
    if (currency === 'usdt' && amount !== '' && new Decimal(amount).greaterThan(new Decimal('5'))) {
      final = new Decimal(amount).minus('5').toString();
    } else if (amount !== '' && new Decimal(amount).greaterThan(new Decimal('20'))) {
      let fee = new Decimal(amount).mul(new Decimal('0.02'));
      if (fee.lessThan(new Decimal('20'))) {
        fee = new Decimal('20');
      }
      final = new Decimal(amount).minus(fee).toString();
    }
    return final;
  }

  handleChangeTo = (e) => {
    this.setState({
      to: e.target.value,
    });
  }

  handleChangeAmount = (e) => {
    this.setState({
      amount: e.target.value,
    });
  }

  handleScan = () => {
    const { cordova } = window;
    if (cordova && cordova.plugins.barcodeScanner) {
      cordova.plugins.barcodeScanner.scan(this.handleScanSuccess, (error) => {
        message.error(error);
      }, {
        formats: 'QR_CODE',
      });
    } else {
      message.error('初始化相機失敗，請手工輸入');
    }
  }

  handleScanSuccess = (result) => {
    // message.success('We got a barcode\n'
    //   + 'Result: ' + result.text + '\n'
    //   + 'Format: ' + result.format + '\n'
    //   + 'Cancelled: ' + result.cancelled);
    const to = result.text || '';
    this.setState({
      to,
    });
  }

  handleSubmit = () => {
    const { to, amount } = this.state;
    const { dispatch, match } = this.props;
    let currency;
    if (match && match.params) {
      currency = match.params.currency;
    }
    if (!currency) return;
    const payload = {
      to,
      amount,
      currency: currency.toUpperCase(),
    };
    dispatch({
      type: 'account/submitWithdraw',
      payload,
    });
  }

  canSubmit() {
    const { amount, to } = this.state;
    const { match } = this.props;
    let currency = 'base';
    if (match && match.params) {
      currency = match.params.currency;
    }
    if (currency) {
      return !(to !== '' && amount !== '' && new Decimal(amount).greaterThan(new Decimal('5')));
    }
    return !(to !== '' && amount !== '' && new Decimal(amount).greaterThan(new Decimal('20')));
  }

  render() {
    const { to, amount } = this.state;
    const useWallet = this.getUseWallet();

    return (
      <div id="withdraw" className={classnames('container', { usdt: useWallet.unit === 'USDT' })}>
        <div className="banner">
          <div>可提現餘額</div>
          <div>{useWallet.balance} {useWallet.unit}</div>
        </div>
        <div className="form">
          <div className="item">
            <input type="text" placeholder="提現地址" value={to} onChange={this.handleChangeTo} />
            <img className="scan-btn" src={scanImg} alt="" onClick={this.handleScan} />
          </div>
          <div className="item">
            <input type="number" placeholder="提現金額" value={amount} onChange={this.handleChangeAmount} />
          </div>
          <div className="item">
            <div className="form-info">
              <div>手續費</div>
              <div>{this.getFee()} {useWallet.unit}</div>
            </div>
          </div>
          <div className="item">
            <div className="form-info">
              <div>到賬金額</div>
              <div>{this.getFinal()} {useWallet.unit}</div>
            </div>
          </div>
        </div>
        <div className="submit">
          <button className="btn" disabled={this.canSubmit()} onClick={this.handleSubmit}>確認提現</button>
        </div>
      </div>
    );
  }
}

function mapStateToProps({ account }) {
  const { account: data } = account;

  return {
    data,
  };
}
export default connect(mapStateToProps)(Withdraw);
