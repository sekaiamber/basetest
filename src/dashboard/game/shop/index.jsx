/* eslint-disable react/jsx-no-duplicate-props */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable react/button-has-type */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/no-array-index-key */
/* eslint-disable jsx-a11y/alt-text */
import React, { Component } from 'react';
import classnames from 'classnames';
import ShopBase from './page/base';
import RESOURCE from '../../resource';

import './style.scss';

export default class Guild extends Component {
  state = {
    tab: 0,
  }

  render() {
    const { tab } = this.state;
    const { onClose } = this.props;

    return (
      <div className="game-modal">
        <div id="shop" className="content-container">
          <div className="close game-btn" onClick={onClose}>返回</div>
          <div className="tabs">
            <div className={classnames('tab', { active: tab === 0 })} onClick={() => this.setState({ tab: 0 })}>
              <div>
                <div className="icon">
                  <img src={RESOURCE.UI.GUILD_01} />
                </div>
                <div className="text">新手商店</div>
              </div>
            </div>
            <div className={classnames('tab', { active: tab === 1 })} onClick={() => this.setState({ tab: 1 })}>
              <div>
                <div className="icon">
                  <img src={RESOURCE.UI.GUILD_02} />
                </div>
                <div className="text">拍卖行</div>
              </div>
            </div>
          </div>
          {tab === 0 && <ShopBase />}
        </div>
      </div>
    );
  }
}
