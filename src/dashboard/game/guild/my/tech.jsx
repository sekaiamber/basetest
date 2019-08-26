/* eslint-disable react/jsx-no-duplicate-props */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable react/button-has-type */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/no-array-index-key */
/* eslint-disable jsx-a11y/alt-text */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Spin, Icon } from 'antd';
import classnames from 'classnames';
import RESOURCE from '../../../resource';

class Guild extends Component {
  state = {
    showUp: false,
    selectTech: null,
  }

  handleUp = () => {
    const { dispatch, myGuild } = this.props;
    const { selectTech } = this.state;
    dispatch({
      type: 'hero_guild/upgradeTech',
      payload: {
        id: myGuild.id,
        technology: selectTech,
      },
    });
  }

  handleShowUp(selectTech) {
    this.setState({
      showUp: true,
      selectTech,
    });
  }

  render() {
    const { showUp, selectTech } = this.state;
    const { myGuild, myPosition } = this.props;
    const { technologies } = myGuild;

    return (
      <>
        <div className="guild-content tech">
          <div className="title">
            <div>公会科技</div>
          </div>
          <div className="techs">
            {Object.keys(technologies).map(tech => (
              <div className={`tech ${tech}`} key={tech}>
                <div>
                  <img src={technologies[tech].icon} alt="" />
                </div>
                <div className="lv">{technologies[tech].level}</div>
                <div className="name">{technologies[tech].name}</div>
                <div className="value">+{technologies[tech].level}%</div>
                {myPosition === 'president' && <div className="game-btn" onClick={this.handleShowUp.bind(this, tech)}>升级</div>}
              </div>
            ))}
          </div>
        </div>
        {showUp && (
          <div className="game-modal uptech">
            <div className="content-container">
              <div className="modal-ex">
                <div className="game-btn" onClick={this.handleUp}>确认</div>
                <div className="game-btn" onClick={() => this.setState({ showUp: false })}>取消</div>
              </div>
              <div className="content">
                <div className="title">升级科技：{technologies[selectTech].name}</div>
                <div className="techs">
                  <div className={`tech ${selectTech}`}>
                    <div>
                      <img src={technologies[selectTech].icon} alt="" />
                    </div>
                    <div className="lv">{technologies[selectTech].level}</div>
                    <div className="name">{technologies[selectTech].name}</div>
                    <div className="value">+{technologies[selectTech].level}%</div>
                  </div>
                  <div className="arrow">
                    <div>30000 BASE</div>
                    <div>
                      <img src={RESOURCE.UI.MENU_ICON_SELECT_POINT} alt="" />
                    </div>
                  </div>
                  <div className={`tech ${selectTech}`}>
                    <div>
                      <img src={technologies[selectTech].icon} alt="" />
                    </div>
                    <div className="lv">{technologies[selectTech].level + 1}</div>
                    <div className="name">{technologies[selectTech].name}</div>
                    <div className="value">+{technologies[selectTech].level + 1}%</div>
                  </div>
                </div>
                <div className="tip">升级科技将作用于所有公会成员，一旦升级将无法退回</div>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }
}

function mapStateToProps({ hero_guild: guild, farm_player: player }) {
  const { accounts } = player;
  const { myGuild } = guild;
  const my = myGuild.user.filter(u => u.is_me)[0];
  const myPosition = my.level;

  return {
    accounts,
    myGuild,
    myPosition,
  };
}

export default connect(mapStateToProps)(Guild);
