/* eslint-disable react/jsx-no-duplicate-props */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable react/button-has-type */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/no-array-index-key */
/* eslint-disable jsx-a11y/alt-text */
import React, { Component } from 'react';
import { connect } from 'dva';
import classnames from 'classnames';
import RESOURCE from '../../resource';

import './style.scss';

class Entertainment extends Component {
  state = {
    amount: '',
  }

  handleDeposit = () => {
    const { amount } = this.state;
    const { dispatch } = this.props;
    if (amount.length > 0) {
      dispatch({
        type: 'farm_player/deposit',
        payload: amount,
      });
    }
  }

  render() {
    const { amount } = this.state;
    const { onClose, outAccount } = this.props;
    return (
      <div className="game-modal">
        <div id="gamedeposit" className="content-container">
          <div className="close game-btn" onClick={onClose}>返回</div>
          <div className="content">
            <div className="title">充值</div>
            <div><input type="number" className="game-input" placeholder="输入充值金额" value={amount} onChange={e => this.setState({ amount: e.target.value })} /></div>
            <div style={{ marginBottom: 24 }}>可用余额 {outAccount.balance} BASE</div>
            <div className="game-btn" onClick={this.handleDeposit}>确认充值</div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps({ account, farm_player: player }) {
  const { account: outAccount } = account;

  return {
    outAccount,
  };
}

export default connect(mapStateToProps)(Entertainment);
