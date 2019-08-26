/* eslint-disable react/no-array-index-key */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import { Icon, Tooltip } from 'antd';
import classnames from 'classnames';
import { connect } from 'dva';
import { calculateItemPower, getItemPositionName } from '../../../utils/hero';
import RESOURCE from '../../resource';

import './style.scss';

class ItemModal extends React.Component {
  getSetInfo() {
    const { data, itemSetMap, equipped } = this.props;
    const setInfo = itemSetMap[data.meta.code];
    if (!setInfo) return undefined;
    const ret = setInfo.items.map(item => ({
      code: item.code,
      name: item.name,
      position: item.position,
      equipped: equipped[item.position] && equipped[item.position].meta.code === item.code,
    }));
    return ret;
  }

  render() {
    const { data, inject, onClose } = this.props;
    const setInfo = this.getSetInfo();

    return (
      <div className="game-modal item-modal">
        <div className="content-container">
          <div className="modal-ex">
            {inject && inject.map((btn, i) => (
              <div key={i} className="game-btn" onClick={btn.onClick}>{btn.text}</div>
            ))}
            <div className="game-btn" onClick={onClose}>返回</div>
          </div>
          <div className="content">
            <div className="title">{data.meta.name}</div>
            <div className="item-panel">
              <div className="icon">
                <img src={RESOURCE.ITEM_ICON[data.meta.code]} alt="" />
              </div>
              <div className="info">
                <div className="row">
                  <div>{getItemPositionName(data.meta)}</div>
                  <div>等级{data.level}</div>
                </div>
                <div className="row">
                  <div>战斗力加成</div>
                  <div>{parseInt(calculateItemPower(data), 10)}<Icon type="thunderbolt" /></div>
                </div>
                <div className="row">
                  <div>卖出价格</div>
                  <div>{data.meta.sell_price} BASE</div>
                </div>
                {data.meta.position === 'weapon' && (
                  <div className="row">
                    <div>
                      <span>耐久</span>
                      <Tooltip title="每次战斗都将消耗耐久，耐久归0将不提供战斗力加成。">
                        <Icon type="question-circle" />
                      </Tooltip>
                    </div>
                    <div>{data.durability}/{data.max_durability}</div>
                  </div>
                )}
                {setInfo && (
                  <>
                    <div className="sub-title">套装信息</div>
                    {setInfo.map(item => (
                      <div className={classnames('row set-item', { equipped: item.equipped })} key={item.code}>
                        <div>{item.name}</div>
                        <div>{getItemPositionName(item)}</div>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps({ hero_player: hero }) {
  const { itemSetMap, equipped } = hero;

  return {
    itemSetMap,
    equipped,
  };
}

export default connect(mapStateToProps)(ItemModal);
