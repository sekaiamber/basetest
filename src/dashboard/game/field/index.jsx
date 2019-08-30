/* eslint-disable react/jsx-no-duplicate-props */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable react/button-has-type */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/no-array-index-key */
/* eslint-disable jsx-a11y/alt-text */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Tooltip } from 'antd';
import classnames from 'classnames';
import {
  convertCoordinateToPosition,
  getClickCoordinateRound,
  areaUsedInBuildingsList,
} from '../../../utils/farm';
import RESOURCE from '../../resource';
import message from '../../../utils/message';
import Guild from '../guild';
import Entertainment from '../entertainment';
import Shop from '../shop';
import Hero from '../hero';
import Battle from '../battle';
import Deposit from '../deposit';
import { getRestTimeFormatted, formatNumber } from '../../../utils';

import './style.scss';

const MODE = {
  NORMAL: 0,
  INSERT: 1,
  SELECT: 2,
  MOVE: 3,
};

class Field extends Component {
  state = {
    now: new Date(),
    mode: MODE.NORMAL,
    insertSelectList: [],
    currentInsert: null,
    selectedBuilding: null,
    insertSelectListPage: 0,
    insertSelectType: '',
    showGuild: false,
    showEntertainment: false,
    showShop: false,
    showHero: false,
    showBattle: false,
    showDeposit: false,
  }

  componentDidMount() {
    this.handler = setInterval(() => {
      this.setState({
        now: new Date(),
      });
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.handler);
  }

  getPosition(i, j) {
    const { field } = this.props;
    return convertCoordinateToPosition(i, j, field);
  }

  getArrowsPosition() {
    const { selectedBuilding } = this.state;
    if (!selectedBuilding) return null;
    const { field } = this.props;
    const { dx, dy } = field;
    const { position } = selectedBuilding;
    const { size } = selectedBuilding.meta;
    const arcCenter = this.getPosition(position[0], position[1]);
    const center = {
      x: arcCenter.x + (size[1] - size[0]) / 2 * dx,
      y: arcCenter.y - (size[1] + size[0] - 2) / 2 * dy,
    };
    return {
      center,
      point: {
        left: center.x - 45 / 2,
        top: center.y - size[0] * dy * 2 - 55 / 2,
      },
      a0: {
        left: dx,
        top: -dy - 30,
      },
      a1: {
        left: dx,
        top: dy,
      },
      a2: {
        left: -dx - 40,
        top: dy,
      },
      a3: {
        left: -dx - 40,
        top: -dy - 30,
      },
    };
  }

  getBrick(i, j) {
    const { mode } = this.state;
    const {
      field, map, buildingsMap, buildingsUsedMap,
    } = this.props;
    const {
      dx, dy, width, height,
    } = field;
    const data = map[i][j];
    const { x, y } = this.getPosition(i, j);
    const building = buildingsMap[i] && buildingsMap[i][j];

    return (
      <div
        key={`${i}_${j}`}
        className="brick"
        style={{
          left: `${x - dx}px`,
          top: `${y - dy}px`,
          width: `${2 * dx}px`,
          height: `${2 * dy}px`,
        }}
      >
        {data.map((elem, k) => (
          <img
            src={elem.texture}
            key={`${i}_${j}_${k}`}
            style={{
              bottom: -elem.offset.top * dy,
              left: elem.offset.left * dx,
              width: `${100 * elem.scale.x}%`,
              height: `${100 * elem.scale.y}%`,
              zIndex: `${elem.z || 2}`,
            }}
          />
        ))}
        {building && (
          <img
            src={RESOURCE.TEXTURES[building.texture]}
            style={{
              width: `${100 * building.meta.size[0]}%`,
              left: `${(1 - building.meta.size[0]) * dx}px`,
              transform: `scaleX(${building.rotate ? -1 : 1})`,
              zIndex: 100,
            }}
          />
        )}
        {mode === MODE.INSERT && i < height && j < width && (
          <img
            src={(buildingsUsedMap[i] && buildingsUsedMap[i][j]) ? RESOURCE.UI.BOX_RED : RESOURCE.UI.BOX_GREEN}
            style={{
              zIndex: 200,
              opacity: 0.5,
            }}
          />
        )}
      </div>
    );
  }

  getBricks() {
    const ret = [];
    const { map } = this.props;
    const maxi = map.length;
    const maxj = map[0].length;
    for (let i = 0; i < maxi; i += 1) {
      for (let j = 0; j < maxj; j += 1) {
        ret.push(this.getBrick(i, j));
      }
    }
    return ret;
  }

  handleClickField = (e) => {
    const { pageX, pageY } = e;
    const { field } = this.props;
    const position = getClickCoordinateRound(pageX, pageY, field);
    if (position[0] < 0 || position[1] < 0) return;
    const { mode } = this.state;
    if (mode === MODE.NORMAL || mode === MODE.SELECT) {
      this.handleModeNormalClick(position);
    } else if (mode === MODE.INSERT) {
      this.handleModeInsertClick(position);
    }
  }

  handleChangeBuildingRotate = () => {
    const { selectedBuilding } = this.state;
    const { dispatch } = this.props;
    dispatch({
      type: 'farm_player/rotateBuilding',
      payload: selectedBuilding,
    });
  }

  handleRemoveBuilding = () => {
    const { selectedBuilding } = this.state;
    const { dispatch } = this.props;
    dispatch({
      type: 'farm_player/removeBuilding',
      payload: selectedBuilding,
      onSuccess: () => {
        this.setState({
          mode: MODE.NORMAL,
          selectedBuilding: null,
        });
      },
    });
  }

  handleMoveBuilding = () => {
    this.setState({
      mode: MODE.MOVE,
    });
  }

  handleTriggerBuildingEvent = () => {
    const { selectedBuilding } = this.state;
    const { dispatch } = this.props;
    dispatch({
      type: 'farm_player/triggerBuildingEvent',
      payload: selectedBuilding,
      onSuccess: (updatedBuilding) => {
        this.setState({
          selectedBuilding: updatedBuilding,
        });
      },
    });
  }

  handleBuildingMoveFinish = () => {
    const { dispatch } = this.props;
    const { selectedBuilding } = this.state;
    dispatch({
      type: 'farm_player/moveBuildingFinish',
      payload: selectedBuilding,
      onSuccess: () => {
        this.setState({
          mode: MODE.SELECT,
        });
      },
    });
  }

  handleModeNormalClick(position) {
    const { buildingsList } = this.props;
    const selectedBuilding = areaUsedInBuildingsList(buildingsList, position[0], position[1]);
    if (selectedBuilding) {
      this.setState({
        mode: MODE.SELECT,
        selectedBuilding,
      });
    }
  }

  handleModeInsertClick(position) {
    const { currentInsert, insertSelectType } = this.state;
    const { buildingsList, dispatch, buildingsStorage } = this.props;
    if (!currentInsert) return;
    const used = areaUsedInBuildingsList(buildingsList, position[0], position[1], currentInsert.size);
    if (used) {
      message.error('无法放置在此格');
      return;
    }
    if (!this.checkPosition(position[0], position[1], currentInsert)) {
      message.error('无法放置在此格');
      return;
    }
    if (insertSelectType === 'storage') {
      // 从仓库中移出来
      const selectedBuilding = buildingsStorage.filter(b => b.meta.id === currentInsert.id)[0];
      dispatch({
        type: 'farm_player/moveBuildingFinish',
        payload: {
          ...selectedBuilding,
          position,
        },
        onSuccess: () => {
          this.setState({
            mode: MODE.NORMAL,
          });
          dispatch({
            type: 'farm_player/getMyBuilding',
          });
        },
      });
    } else {
      dispatch({
        type: 'farm_player/buyBuilding',
        payload: {
          id: currentInsert.id,
          position: `${position[0]},${position[1]}`,
        },
      });
    }
  }

  handleChangeMode(mode) {
    this.setState({
      mode,
      currentInsert: null,
      selectedBuilding: null,
    });
  }

  handleBuildingMove(direction, value) {
    const { selectedBuilding } = this.state;
    if (!selectedBuilding) return;
    const { buildingsList, dispatch } = this.props;
    const { position } = selectedBuilding;
    const nextPosition = [...position];
    if (direction === 'i') {
      nextPosition[0] += value;
    } else {
      nextPosition[1] += value;
    }
    if (!this.checkPosition(nextPosition[0], nextPosition[1], selectedBuilding.meta)) return;
    const used = areaUsedInBuildingsList(
      buildingsList,
      nextPosition[0],
      nextPosition[1],
      selectedBuilding.meta.size,
      building => building.id !== selectedBuilding.id,
    );
    if (used) return;
    dispatch({
      type: 'farm_player/moveBuildingLocal',
      payload: {
        building: selectedBuilding,
        position: nextPosition,
      },
      onSuccess: (updatedBuilding) => {
        this.setState({
          selectedBuilding: updatedBuilding,
        });
      },
    });
  }

  handleClickInsert(list, insertSelectType) {
    const { mode } = this.state;
    if (mode === MODE.INSERT) {
      this.setState({
        mode: MODE.NORMAL,
      });
    } else {
      this.setState({
        mode: MODE.INSERT,
        currentInsert: null,
        insertSelectList: list,
        insertSelectType,
        insertSelectListPage: 0,
      });
    }
  }

  handleChangeInsertSelectListPage(add) {
    const { insertSelectList, insertSelectListPage } = this.state;
    const newInsertSelectListPage = insertSelectListPage + add;
    if (newInsertSelectListPage < 0) return;
    if (newInsertSelectListPage > parseInt(insertSelectList.length / 4, 10)) return;
    this.setState({
      insertSelectListPage: newInsertSelectListPage,
      currentInsert: null,
    });
  }

  handleSelectInsertBuilding(buildingMeta) {
    this.setState({
      currentInsert: buildingMeta || null,
    });
  }

  checkPosition(i, j, meta) {
    const { field } = this.props;
    const { width, height } = field;
    return i - (meta.size[0] - 1) > -1
      && j - (meta.size[1] - 1) > -1
      && i < height
      && j < width;
  }

  render() {
    const {
      mode, selectedBuilding, insertSelectList, insertSelectListPage, currentInsert, insertSelectType, showGuild, showEntertainment, showShop, showHero, showBattle, showDeposit,
    } = this.state;
    const {
      buildingMetas, accounts, buildingsStorage, heroInfo, userInfo, playerInfo, buildingsList,
    } = this.props;
    const arrowPosition = this.getArrowsPosition();
    const currentInsertSelectListPage = insertSelectList.slice(insertSelectListPage * 4, insertSelectListPage * 4 + 4);

    return (
      <>
        <div id="field" onClick={this.handleClickField}>
          {this.getBricks()}
        </div>
        <div id="ui">
          <div className={classnames('bottom-left-menu', { show: mode === MODE.NORMAL })}>
            <div className="item main-icon" onClick={this.handleClickInsert.bind(this, buildingMetas.plant, 'plant')}>
              <img src={RESOURCE.UI.MENU_ICON_PLANT} alt="" />
            </div>
            <div className="item main-icon" onClick={this.handleClickInsert.bind(this, buildingMetas.building, 'building')}>
              <img src={RESOURCE.UI.MENU_ICON_BUILD} alt="" />
            </div>
            <div className="item main-icon" onClick={this.handleClickInsert.bind(this, buildingsStorage.map(b => b.meta), 'storage')}>
              <img src={RESOURCE.UI.MENU_ICON_STORAGE} alt="" />
            </div>
          </div>
          <div className={classnames('top-left-menu', { show: mode === MODE.NORMAL })}>
            <div className="item" onClick={() => this.setState({ showHero: true })}>
              <img src={RESOURCE.UI.MAIN_PLAYER} alt="" />
            </div>
            <div className="accounts">{formatNumber(accounts.base)} BASE</div>
            {/* <div className="avatar"></div> */}
            <div className="nickname">{userInfo.nickname}</div>
            <div className="level">{heroInfo.game_level}</div>
            <div className="exp"><div className="bar" /></div>
            <img className="deposit" src={RESOURCE.UI.MAIN_DEPOSIT} alt="" onClick={() => this.setState({ showDeposit: true })} />
          </div>
          <div className={classnames('bottom-right-menu', { show: mode === MODE.NORMAL })}>
            <div className="item" onClick={() => this.setState({ showEntertainment: true })}>
              <img src={RESOURCE.UI.MENU_ICON_GAME} alt="" />
            </div>
            <div className="item" onClick={() => this.setState({ showShop: true })}>
              <img src={RESOURCE.UI.MENU_ICON_SHOP} alt="" />
            </div>
            <div className="item" onClick={() => this.setState({ showGuild: true })}>
              <img src={RESOURCE.UI.MENU_ICON_GUILD} alt="" />
            </div>
            <div className="item" onClick={() => this.setState({ showBattle: true })}>
              <img src={RESOURCE.UI.MENU_ICON_BATTLE} alt="" />
            </div>
          </div>
          <div className={classnames('bottom-left-menu', { show: mode === MODE.INSERT })}>
            <div className="item" onClick={this.handleChangeMode.bind(this, MODE.NORMAL)}>
              <img src={RESOURCE.UI.MENU_ICON_BACK} alt="" />
            </div>
            <div className="item" onClick={this.handleChangeInsertSelectListPage.bind(this, -1)}>
              <img src={RESOURCE.UI.MENU_ICON_PREV_PAGE} alt="" />
            </div>
            {[0, 1, 2, 3].map(i => (
              <div
                key={i}
                className={classnames('item insert-select', { selected: currentInsert && currentInsertSelectListPage[i] && currentInsert.code === currentInsertSelectListPage[i].code })}
                onClick={this.handleSelectInsertBuilding.bind(this, currentInsertSelectListPage[i])}
              >
                {currentInsertSelectListPage[i] && (
                  <>
                    <div className="img-container">
                      <img src={RESOURCE.TEXTURES[currentInsertSelectListPage[i].textures.slice(-1)[0]]} alt="" />
                      {insertSelectType !== 'storage' && (
                        <span>{currentInsertSelectListPage[i].name}</span>
                      )}
                    </div>
                    {insertSelectType !== 'storage' && (
                      <div className="price">{currentInsertSelectListPage[i].price.toString() === '0' ? '免费' : `${currentInsertSelectListPage[i].price} BASE`}</div>
                    )}
                  </>
                )}
              </div>
            ))}
            <div className="item" onClick={this.handleChangeInsertSelectListPage.bind(this, 1)}>
              <img src={RESOURCE.UI.MENU_ICON_NEXT_PAGE} alt="" />
            </div>
          </div>
          <div className={classnames('top-right-menu', { show: mode === MODE.INSERT && currentInsert && currentInsert.reward })}>
            {currentInsert && (
              <div className="insert-tip">
                <div className="title">{currentInsert.name}</div>
                <div className="row">
                  <div>每日收益</div>
                  <div>{currentInsert.reward} BASE</div>
                </div>
                <div className="row">
                  <div>总收益</div>
                  <div>{currentInsert.reward * currentInsert.day} BASE</div>
                </div>
              </div>
            )}
          </div>
          <div className={classnames('top-left-menu', { show: mode === MODE.INSERT && insertSelectType === 'plant' })}>
            <div className="plant-info">
              <div className="title">种植概况</div>
              <div className="row">
                <div>最大可种数量</div>
                <div>{playerInfo.plant_limit}</div>
              </div>
              <div className="row">
                <div>已种数量</div>
                <div>{buildingsList.filter(b => b.meta.building_type === 'plant').length}</div>
              </div>
              <div className="tip">
                <Tooltip placement="right" title="邀请好友购买BASE矿机，P1矿机限制+1，P2矿机限制+2，以此类推。">
                  <span>增加数量限制？</span>
                </Tooltip>
              </div>
            </div>
          </div>
          <div className={classnames('bottom-left-menu', { show: mode === MODE.SELECT })}>
            <div className="item" onClick={this.handleChangeMode.bind(this, MODE.NORMAL)}>
              <img src={RESOURCE.UI.MENU_ICON_BACK} alt="" />
            </div>
            <div className="item" onClick={this.handleChangeBuildingRotate}>
              <img src={RESOURCE.UI.MENU_ICON_SELECT_ROTATE} alt="" />
            </div>
            {selectedBuilding && selectedBuilding.moveable && (
              <div className="item" onClick={this.handleMoveBuilding}>
                <img src={RESOURCE.UI.MENU_ICON_SELECT_MOVE} alt="" />
              </div>
            )}
            {selectedBuilding && selectedBuilding.removable && (
              <div className="item" onClick={this.handleRemoveBuilding}>
                <img src={RESOURCE.UI.MENU_ICON_SELECT_REMOVE} alt="" />
              </div>
            )}
          </div>
          <div
            className={classnames('select-point', { show: mode === MODE.SELECT })}
            style={{
              left: arrowPosition ? arrowPosition.point.left : 0,
              top: arrowPosition ? arrowPosition.point.top : 0,
            }}
          >
            <img src={RESOURCE.UI.MENU_ICON_SELECT_POINT} alt="" />
            {selectedBuilding && selectedBuilding.finish_at && (
              <span className="game-input resttime">{getRestTimeFormatted(selectedBuilding.finish_at)}</span>
            )}
          </div>
          {mode === MODE.MOVE && selectedBuilding && (
            <div className="arrows" style={{ left: arrowPosition.center.x, top: arrowPosition.center.y }}>
              <img onClick={this.handleBuildingMove.bind(this, 'i', -1)} className="a0" src={RESOURCE.UI.ARROW_0} style={{ left: arrowPosition.a0.left, top: arrowPosition.a0.top }} />
              <img onClick={this.handleBuildingMove.bind(this, 'j', 1)} className="a1" src={RESOURCE.UI.ARROW_1} style={{ left: arrowPosition.a1.left, top: arrowPosition.a1.top }} />
              <img onClick={this.handleBuildingMove.bind(this, 'i', 1)} className="a2" src={RESOURCE.UI.ARROW_2} style={{ left: arrowPosition.a2.left, top: arrowPosition.a2.top }} />
              <img onClick={this.handleBuildingMove.bind(this, 'j', -1)} className="a3" src={RESOURCE.UI.ARROW_3} style={{ left: arrowPosition.a3.left, top: arrowPosition.a3.top }} />
              <img onClick={this.handleBuildingMoveFinish} className="ok" src={RESOURCE.UI.MENU_ICON_MOVE_OK} style={{ left: -25, top: -25 }} />
            </div>
          )}
        </div>
        {showGuild && (
          <Guild onClose={() => this.setState({ showGuild: false })} />
        )}
        {showEntertainment && (
          <Entertainment onClose={() => this.setState({ showEntertainment: false })} />
        )}
        {showShop && (
          <Shop onClose={() => this.setState({ showShop: false })} />
        )}
        {showHero && (
          <Hero onClose={() => this.setState({ showHero: false })} />
        )}
        {showBattle && (
          <Battle onClose={() => this.setState({ showBattle: false })} />
        )}
        {showDeposit && (
          <Deposit onClose={() => this.setState({ showDeposit: false })} />
        )}
      </>
    );
  }
}

function mapStateToProps({ farm_env: env, farm_player: player, hero_player: hero, account }) {
  const { buildings, accounts, info } = player;
  const { map, field, buildingMetas } = env;
  const { info: heroInfo } = hero;
  const { userInfo } = account;

  return {
    field,
    map,
    buildingMetas,
    buildingsMap: buildings.map,
    buildingsList: buildings.list,
    buildingsUsedMap: buildings.usedMap,
    buildingsStorage: buildings.storage,
    accounts,
    heroInfo,
    userInfo,
    playerInfo: info,
  };
}

export default connect(mapStateToProps)(Field);
