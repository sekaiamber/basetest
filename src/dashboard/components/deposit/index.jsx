/* eslint-disable prefer-destructuring */
/* eslint-disable react/button-has-type */
/* eslint-disable react/no-array-index-key */
/* eslint-disable array-callback-return */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { Component } from 'react';
import classnames from 'classnames';
import { connect } from 'dva';
import Qrcode from '../common/qrcode';
import message from '../../../utils/message';
import saveImage from '../../../utils/saveImage';
import './style.scss';

import walletBaseImg from '../../../assets/wallet_base.svg';
import walletUsdtImg from '../../../assets/wallet_usdt.png';
import bitrabbitImg from '../../../assets/bitrabbit.svg';

// images
class Deposit extends Component {
  state = {
    url: '',
  }

  getUseWallet() {
    const { match, userInfo } = this.props;
    let currency = 'base';
    if (match && match.params) {
      currency = match.params.currency;
    }
    const info = {
      unit: currency.toUpperCase(),
      address: '',
      logo: '',
    };
    if (currency === 'usdt') {
      info.address = userInfo.usdt_payment_address;
      info.logo = walletUsdtImg;
    } else {
      info.address = userInfo.payment_address;
      info.logo = walletBaseImg;
    }
    return info;
  }

  handleUrlChange = (url) => {
    this.setState({
      url,
    });
  }

  handleSaveImage = () => {
    const { url } = this.state;
    saveImage(url, () => {
      message.success('已成功保存到相冊');
    }, () => {
      message.error('您的手機不支持自動保存到相冊，請手動截屏');
    });
  }

  handleOpenBitrabbit = () => {
    if (window.cordova) {
      window.cordova.InAppBrowser.open('https://bitrabbit.io', '_system', 'location=yes');
    }
  }

  render() {
    const useWallet = this.getUseWallet();

    return (
      <div id="deposit" className={classnames('container', { usdt: useWallet.unit === 'USDT' })}>
        <div className="banner">
          <img className="logo" src={useWallet.logo} alt="" />
          <div className="amount">{useWallet.unit}</div>
        </div>
        <div className="qrcode-container">
          {useWallet.address && (
            <div className="qrcode"><Qrcode data={useWallet.address} option={{ height: 250, width: 250, margin: 2 }} onUrlChange={this.handleUrlChange} /></div>
          )}
          <div className="btn" onClick={this.handleSaveImage}>保存二維碼</div>
          <div className="desc">{useWallet.unit} 充值地址</div>
          <div className="address clipboard-target" data-clipboard-text={useWallet.address}>{useWallet.address}</div>
        </div>
        <div className="bitrabbit">{useWallet.unit} 購買渠道</div>
        <div className="btn" onClick={this.handleOpenBitrabbit}>
          <img src={bitrabbitImg} alt="" />
        </div>
      </div>
    );
  }
}

function mapStateToProps({ account }) {
  const { userInfo } = account;

  return {
    userInfo,
  };
}
export default connect(mapStateToProps)(Deposit);
