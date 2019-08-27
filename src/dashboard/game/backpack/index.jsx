/* eslint-disable react/jsx-no-duplicate-props */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable react/button-has-type */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/no-array-index-key */
/* eslint-disable jsx-a11y/alt-text */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Icon, Modal } from 'antd';
import classnames from 'classnames';
import RESOURCE from '../../resource';
import ItemModal from '../item';
import ItemIcon from '../item/itemIcon';
import { calculateItemPower, getItemPositionName } from '../../../utils/hero';

import './style.scss';

const { confirm } = Modal;

class Backpack extends Component {
  state = {
    selectedItem: null,
    showItem: false,
    showAddSpace: false,
  }

  componentDidMount() {

  }

  handleCloseItem = () => {
    this.setState({
      showItem: false,
    });
  }

  handleSold = () => {
    const { dispatch } = this.props;
    const { selectedItem } = this.state;
    confirm({
      title: '确认卖出？',
      content: `您将以 ${selectedItem.meta.sell_price} BASE 卖出 ${selectedItem.meta.name}。`,
      okText: '卖出',
      cancelText: '取消',
      onOk: () => {
        dispatch({
          type: 'hero_shop/sell',
          payload: selectedItem.id,
          onSuccess: this.handleCloseItem,
        });
      },
    });
  }

  handleRepair = () => {
    const { dispatch } = this.props;
    const { selectedItem } = this.state;
    console.log('修理', selectedItem);
  }

  handleUpgrade = () => {
    const { dispatch } = this.props;
    const { selectedItem } = this.state;
    console.log('升级', selectedItem);
  }

  handleAddSpace = () => {
    console.log('扩展');
  }

  handleSelectItem(item) {
    this.setState({
      selectedItem: item,
      showItem: true,
    });
    const { onItemSelect } = this.props;
    if (onItemSelect) onItemSelect(item);
  }

  render() {
    const { backpack, accounts, backpackSize, inject } = this.props;
    const { selectedItem, showItem, showAddSpace } = this.state;
    const showItemInject = (inject || []).map(i => ({
      ...i,
      onClick: () => { i.onClick(this.handleCloseItem); },
    }));
    // TODO: 判断是否要修理
    if (selectedItem && selectedItem.max_durability && selectedItem.durability !== selectedItem.max_durability) {
      showItemInject.push({
        text: '修理',
        onClick: this.handleRepair,
      });
    }
    if (selectedItem && ['equipment', 'weapon'].indexOf(selectedItem.meta.item_type) > -1) {
      showItemInject.push({
        text: '升级',
        onClick: this.handleUpgrade,
      });
    }
    showItemInject.push({
      text: '卖出',
      onClick: this.handleSold,
    });

    const equips = [];
    for (let i = 0; i < backpackSize; i += 1) {
      const item = backpack[i];
      if (item) {
        equips.push((
          <div className="backpack-equip" key={i} onClick={this.handleSelectItem.bind(this, item)}>
            <ItemIcon data={item.meta} />
            <span className="level">Lv.{item.level}</span>
            <span className="position">{getItemPositionName(item.meta)}</span>
          </div>
        ));
      } else {
        equips.push((
          <div className="backpack-equip" key={i}>
            <img src={RESOURCE.ITEM_ICON.BLOCK} />
          </div>
        ));
      }
    }
    if (backpackSize < 25) {
      equips.push((
        <div className="backpack-equip" key={backpackSize + 1} onClick={() => this.setState({ showAddSpace: true })}>
          <img src={RESOURCE.ITEM_ICON.ADD} />
        </div>
      ));
    }

    return (
      <div id="backpack">
        <div className="title">
          <div>我的背包</div>
          <div className="account">
            <div>{accounts.base} BASE</div>
            <div>背包容量：{backpack.length}/{backpackSize}</div>
          </div>
        </div>
        <div className="backpack-equips">{equips}</div>
        {showItem && (
          <ItemModal
            data={selectedItem}
            inject={showItemInject}
            onClose={this.handleCloseItem}
          />
        )}
        {showAddSpace && (
          <div className="game-modal add-backpack-space">
            <div className="content-container">
              <div className="modal-ex">
                <div className="game-btn" onClick={this.handleAddSpace}>扩展</div>
                <div className="game-btn" onClick={() => this.setState({ showAddSpace: false })}>返回</div>
              </div>
              <div className="content">
                <div className="title">扩展背包</div>
                <div>扩展背包花费 500 BASE，一共可以扩展3次，每次增加5格。确认扩展？</div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

function mapStateToProps({ hero_player: hero, farm_player: player }) {
  const { info: heroInfo } = hero;
  const { accounts } = player;
  const backpack = heroInfo.backpack || [];

  return {
    heroInfo,
    backpack,
    backpackSize: heroInfo.backpack_size,
    accounts,
  };
}

export default connect(mapStateToProps)(Backpack);
