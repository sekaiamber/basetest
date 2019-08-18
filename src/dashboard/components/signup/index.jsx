/* eslint-disable camelcase */
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

const phoneReg = /^1\d{10}$/;

let handler;

// images
class Signup extends Component {
  state = {
    phone_number: '',
    password: '',
    password_confirmation: '',
    invite_code: '',
    nickname: '',
    verify_code: '',
    counting: 0,
  }

  handleSubmit = () => {
    const {
      phone_number, password, password_confirmation, invite_code, nickname, verify_code,
    } = this.state;
    const { dispatch } = this.props;
    const payload = {
      phone_number, password, password_confirmation, invite_code, nickname, verify_code,
    };
    dispatch({
      type: 'utils/signup',
      payload,
    });
  }

  handleSendSms = () => {
    const { phone_number } = this.state;
    const { dispatch } = this.props;
    if (!phoneReg.test(phone_number)) {
      message.error('請輸入正確的手機號');
      return;
    }
    dispatch({
      type: 'utils/sendSms',
      payload: {
        phone_number,
      },
      onSuccess: () => {
        this.handleCountDown(true);
      },
    });
  }

  handleChange(key, e) {
    this.setState({
      [key]: e.target.value,
    });
  }

  canSubmit() {
    const {
      phone_number, password, password_confirmation, invite_code, nickname, verify_code,
    } = this.state;
    return phone_number !== ''
      && password !== ''
      && password_confirmation !== ''
      && invite_code !== ''
      && nickname !== ''
      && verify_code !== '';
  }

  handleCountDown(start) {
    const { counting } = this.state;
    if (start) {
      this.setState({
        counting: 60,
      });
      handler = setTimeout(this.handleCountDown.bind(this), 1000);
    } else if (counting > 0) {
      this.setState({
        counting: counting - 1,
      });
      handler = setTimeout(this.handleCountDown.bind(this), 1000);
    }
  }

  render() {
    const {
      phone_number, password, password_confirmation, invite_code, nickname, verify_code, counting,
    } = this.state;

    return (
      <div id="signup" className="container">
        <div className="form">
          <div className="item">
            <input type="text" placeholder="用戶名" value={nickname} onChange={this.handleChange.bind(this, 'nickname')} />
          </div>
          <div className="item">
            <input type="password" placeholder="密碼（8-20位數字或字母）" value={password} onChange={this.handleChange.bind(this, 'password')} />
          </div>
          <div className="item">
            <input type="password" placeholder="確認密碼" value={password_confirmation} onChange={this.handleChange.bind(this, 'password_confirmation')} />
          </div>
          <div className="item">
            <input type="text" placeholder="邀請碼（必填）" value={invite_code} onChange={this.handleChange.bind(this, 'invite_code')} />
          </div>
          <div className="item">
            <input type="number" placeholder="手機號碼" value={phone_number} onChange={this.handleChange.bind(this, 'phone_number')} />
          </div>
          <div className="item verify">
            <input type="text" placeholder="驗證碼" value={verify_code} onChange={this.handleChange.bind(this, 'verify_code')} />
            <a onClick={this.handleSendSms} disabled={counting > 0}>
              {counting > 0 ? counting : '發送驗證碼'}
            </a>
          </div>
        </div>
        <div className="submit">
          <button className="btn" disabled={!this.canSubmit()} onClick={this.handleSubmit}>註 冊</button>
        </div>
      </div>
    );
  }
}

function mapStateToProps() {
  return {};
}
export default connect(mapStateToProps)(Signup);
