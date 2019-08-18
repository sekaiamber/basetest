/* eslint-disable react/no-array-index-key */
/* eslint-disable array-callback-return */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { Component } from 'react';
import classnames from 'classnames';
import { connect } from 'dva';
import { Spin, message } from 'antd';

import './style.scss';

import walletBaseImg from '../../../assets/wallet_base.svg';

class Activities extends Component {
  state = {
    page: 1,
    loading: false,
  }

  handleShowNextPage = () => {
    const { loading, page } = this.state;
    const { dispatch } = this.props;
    if (loading) return;
    this.setState({
      loading: true,
    }, () => {
      dispatch({
        type: 'account/queryAcitiviesDone',
        payload: page + 1,
        onSuccess: () => {
          this.setState({
            loading: false,
            page: page + 1,
          });
        },
      });
    });
  }

  render() {
    const { loading } = this.state;
    const { list } = this.props;

    return (
      <div id="myActivities" className="container">
        {list.map(item => (
          <div className="item" key={item.id}>
            <img className="logo" src={walletBaseImg} alt="" />
            <div className="center">
              <div className="txid">{item.title}</div>
              <div className="time">{item.time}</div>
            </div>
            <div className="amount">{item.amount}</div>
          </div>
        ))}
        {loading ? (
          <div className="my-loading"><Spin /></div>
        ) : (
          <div className="btn" onClick={this.handleShowNextPage}>显示更多</div>
        )}
      </div>
    );
  }
}

function mapStateToProps({ account }) {
  return {
    list: account.acitiviesDone,
  };
}

export default connect(mapStateToProps)(Activities);
