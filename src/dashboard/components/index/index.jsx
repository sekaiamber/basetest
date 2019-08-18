/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { Component } from 'react';
import classnames from 'classnames';
import { connect } from 'dva';
import { Link } from 'dva/router';
import Markets from './markets';
import Board from './board';
import Activities from './activities';

import './style.scss';

// images
// import blockHeightImg from '../../../assets/block_height.svg';
// import blockPowerImg from '../../../assets/block_power.svg';
import optBuyPowerImg from '../../../assets/opt_buy_power.svg';
import optAddPowerImg from '../../../assets/opt_add_power.svg';
import menuImg from '../../../assets/index_menu.svg';
import menu1Img from '../../../assets/index_menu_1.svg';
import menu2Img from '../../../assets/index_menu_2.svg';
import refreshImg from '../../../assets/index_refresh.svg';


class Index extends Component {
  handleAutoReceive = () => {
    const { autoReceive, dispatch } = this.props;
    dispatch({
      type: 'account/changeAutoReceive',
      payload: !autoReceive,
    });
  }

  handleRedirect(goto) {
    const { dispatch } = this.props;
    dispatch({
      type: 'utils/goto',
      goto,
    });
  }

  render() {
    const {
      prices, block, boardData, acitivies, autoReceive,
    } = this.props;

    return (
      <div>
        <div id="home">
          <div className="block-info container">
            <div className="item">
              <div className="wrapper">塊高：{block.height}</div>
            </div>
            <div className="item">
              <div className="wrapper">算力：{block.power}</div>
            </div>
          </div>
          <div className="index-menu container">
            <img src={menuImg} alt="" />
            <div className="menu">
              <div className="menu-item" onClick={this.handleRedirect.bind(this, '/notice')}>
                <img src={menu1Img} alt="" />
                <span>最新公告</span>
              </div>
              <div className="menu-item" onClick={this.handleRedirect.bind(this, '/activities')}>
                <img src={menu2Img} alt="" />
                <span>歷史記錄</span>
              </div>
            </div>
          </div>
          <Activities data={acitivies} />
          <div className="opt container">
            <div className={classnames('switch', { on: autoReceive })} onClick={this.handleAutoReceive}>
              <span>自動領取</span>
            </div>
            <div className="center" />
            <Link to="/buy" className="opt-link">
              <img src={optBuyPowerImg} alt="" />
              <span>購買算力</span>
            </Link>
            <Link to="/invite" className="opt-link">
              <img src={optAddPowerImg} alt="" />
              <span>增加算力</span>
            </Link>
            <div className="block-level container">
              <div>矿池利润</div>
              <div>{block.level}</div>
            </div>
          </div>
          <div className="container desc">注：超過72小時未領取的幣將被銷毀</div>
        </div>
        <Board data={boardData} />
        <Markets data={prices} />
      </div>
    );
  }
}

function mapStateToProps({ market, account }) {
  const {
    userInfo, account: accountInfo, acitiviesYesterday, acitivies,
  } = account;

  const boardData = {
    myPower: userInfo.power,
    myBase: accountInfo.balance,
    rewardPower: acitiviesYesterday,
    deductionBase: accountInfo.activity_balance,
    canMining: accountInfo.can_mining,
    alreadyMining: accountInfo.already_mining,
  };

  return {
    prices: market.prices,
    block: market.block,
    boardData,
    acitivies,
    autoReceive: userInfo.auto_receive,
  };
}

export default connect(mapStateToProps)(Index);
