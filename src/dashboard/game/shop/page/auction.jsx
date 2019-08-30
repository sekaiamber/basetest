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
import Buy from './auction/buy';
import Sell from './auction/sell';


class Shop extends Component {
  state = {
    tab: 0,
  }

  render() {
    const { tab } = this.state;

    return (
      <>
        <div className="content shop-content auction">
          <div className="shop-panel">
            <div className="title auction-title">
              <span className={classnames('auction-title-tab', { active: tab === 0 })} onClick={() => this.setState({ tab: 0 })}>买入</span>
              <span className={classnames('auction-title-tab', { active: tab === 1 })} onClick={() => this.setState({ tab: 1 })}>卖出</span>
            </div>
            {tab === 0 && <Buy />}
            {tab === 1 && <Sell />}
          </div>
        </div>
      </>
    );
  }
}

function mapStateToProps({ hero_shop: shop, farm_player: player }) {
  const { basic } = shop;
  const { accounts } = player;

  return {
    basic,
    accounts,
  };
}

export default connect(mapStateToProps)(Shop);
