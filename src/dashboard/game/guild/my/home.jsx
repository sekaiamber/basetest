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

const userLimit = {
  0: 50,
  1: 100,
  2: 300,
};

const upCost = {
  0: '100,000',
  1: '300,000',
};

const userLevel = {
  president: '会长',
  member: '组员',
};

class Guild extends Component {
  state = {
    showCheckUp: false,
    showDonate: false,
    showNotice: false,
    showDescription: false,
    showBoard: false,
    donateAmount: 1,
    notice: '',
    description: '',
  }

  handleUp = () => {
    const { dispatch, myGuild } = this.props;
    dispatch({
      type: 'hero_guild/up',
      payload: myGuild.id,
      onSuccess: () => {
        this.setState({
          showDonate: false,
        });
      },
    });
  }

  handleDonate = () => {
    const { donateAmount } = this.state;
    const { dispatch, myGuild } = this.props;
    dispatch({
      type: 'hero_guild/donate',
      payload: {
        amount: donateAmount * 1000,
        id: myGuild.id,
      },
      onSuccess: () => {
        this.setState({
          showDonate: false,
        });
      },
    });
  }

  handleChangeNotice = () => {
    const { notice } = this.state;
    const { dispatch, myGuild } = this.props;
    dispatch({
      type: 'hero_guild/update',
      payload: {
        notice,
        id: myGuild.id,
      },
      onSuccess: () => {
        this.setState({
          showNotice: false,
        });
      },
    });
  }

  handleChangeDescription = () => {
    const { description } = this.state;
    const { dispatch, myGuild } = this.props;
    dispatch({
      type: 'hero_guild/update',
      payload: {
        description,
        id: myGuild.id,
      },
      onSuccess: () => {
        this.setState({
          showDescription: false,
        });
      },
    });
  }

  handleDonateChange(value) {
    const { donateAmount } = this.state;
    const newDonateAmount = donateAmount + value;
    if (newDonateAmount <= 0) return;
    this.setState({
      donateAmount: newDonateAmount,
    });
  }

  render() {
    const { showCheckUp, showDonate, showNotice, showDescription, donateAmount, notice, description, showBoard } = this.state;
    const { myGuild, myPosition, myContribution } = this.props;

    return (
      <>
        <div className="guild-content home">
          <div className="main">
            <div className="title">
              <div>公会等级</div>
              {myGuild.level < 2 && myPosition === 'president' && (
                <div className="game-btn" onClick={() => this.setState({ showCheckUp: true })}>升级</div>
              )}
            </div>
            <div className="level">
              <div className="step">
                <div><img src={RESOURCE.UI.GUILD_LV_1} className={classnames({ active: myGuild.level > -1 })} /></div>
                <div className="text">上限50人</div>
              </div>
              <div className={classnames('bar', { active: myGuild.level > 0 })} />
              <div className="step">
                <div><img src={RESOURCE.UI.GUILD_LV_2} className={classnames({ active: myGuild.level > 0 })} /></div>
                <div className="text">上限100人</div>
              </div>
              <div className={classnames('bar', { active: myGuild.level > 1 })} />
              <div className="step">
                <div><img src={RESOURCE.UI.GUILD_LV_3} className={classnames({ active: myGuild.level > 1 })} /></div>
                <div className="text">上限300人</div>
              </div>
            </div>
            <div className="balance">
              <div>
                <div>
                  <img src={RESOURCE.UI.GUILD_07} alt="" />
                </div>
                <div className="title">公会资产</div>
                <div className="value">{myGuild.money_library}</div>
                <div className="game-btn" onClick={() => this.setState({ showBoard: true, })}>贡献榜</div>
              </div>
              <div>
                <div>
                  <img src={RESOURCE.UI.GUILD_06} alt="" />
                </div>
                <div className="title">我的贡献度</div>
                <div className="value">{myContribution} <Icon type="heart" theme="filled" /></div>
                <div className="game-btn" onClick={() => this.setState({ showDonate: true })}>贡献</div>
              </div>
            </div>
          </div>
          <div className="side-bar">
            <div className="name">{myGuild.name}</div>
            <div className="user"><Icon type="team" /> {myGuild.user.length}/{userLimit[myGuild.level]}</div>
            <div className="slogan">{myGuild.description || '暂无口号'} {
              myPosition === 'president' && (
                <Icon type="edit" theme="filled" onClick={() => this.setState({ showDescription: true })} />
              )
            }
            </div>
            <div className="title">公告</div>
            <div className="message">{myGuild.notice || '暂无公告'} {
              myPosition === 'president' && (
                <Icon type="edit" theme="filled" onClick={() => this.setState({ showNotice: true })} />
              )
            }
            </div>
          </div>
        </div>
        {showCheckUp && (
          <div className="game-modal">
            <div className="content-container">
              <div className="modal-ex">
                <div className="game-btn" onClick={this.handleUp}>确认</div>
                <div className="game-btn" onClick={() => this.setState({ showCheckUp: false })}>取消</div>
              </div>
              <div className="content">
                <div className="title">升级公会</div>
                <div>本次升级需要花费 {upCost[myGuild.level]} BASE，一旦升级将不能撤销，确认升级？</div>
              </div>
            </div>
          </div>
        )}
        {showDonate && (
          <div className="game-modal donate">
            <div className="content-container">
              <div className="modal-ex">
                <div className="game-btn" onClick={this.handleDonate}>确认</div>
                <div className="game-btn" onClick={() => this.setState({ showDonate: false })}>取消</div>
              </div>
              <div className="content">
                <div className="title">提升贡献值</div>
                <div className="form">
                  <img src={RESOURCE.UI.BTN_REDUCE} alt="" onClick={this.handleDonateChange.bind(this, -1)} />
                  <span>{donateAmount} <Icon type="heart" theme="filled" /></span>
                  <img src={RESOURCE.UI.BTN_ADD} alt="" onClick={this.handleDonateChange.bind(this, 1)} />
                </div>
                <div className="cost">
                  花费 {donateAmount * 1000} BASE
                </div>
                <div className="tip">提升贡献度可以在公会商店换取装备，一旦贡献将无法退回</div>
              </div>
            </div>
          </div>
        )}
        {showNotice && (
          <div className="game-modal">
            <div className="content-container">
              <div className="modal-ex">
                <div className="game-btn" onClick={this.handleChangeNotice}>确认</div>
                <div className="game-btn" onClick={() => this.setState({ showNotice: false })}>取消</div>
              </div>
              <div className="content">
                <div className="title">修改公会公告</div>
                <div><input type="text" className="game-input" placeholder="输入公告" value={notice} onChange={e => this.setState({ notice: e.target.value })} /></div>
              </div>
            </div>
          </div>
        )}
        {showDescription && (
          <div className="game-modal">
            <div className="content-container">
              <div className="modal-ex">
                <div className="game-btn" onClick={this.handleChangeDescription}>确认</div>
                <div className="game-btn" onClick={() => this.setState({ showDescription: false })}>取消</div>
              </div>
              <div className="content">
                <div className="title">修改公会口号</div>
                <div><input type="text" className="game-input" placeholder="输入口号" value={description} onChange={e => this.setState({ description: e.target.value })} /></div>
              </div>
            </div>
          </div>
        )}
        {showBoard && (
          <div className="game-modal contribution">
            <div className="content-container">
              <div className="modal-ex">
                <div className="game-btn" onClick={() => this.setState({ showBoard: false })}>确认</div>
              </div>
              <div className="content">
                <div className="title">公会贡献榜</div>
                <div className="users">
                  {myGuild.user.map(user => (
                    <div className="user" key={user.id}>
                      <div className="nickname">{user.nickname}</div>
                      <div className="contribution">{user.contribution} <Icon type="heart" theme="filled" /></div>
                      <div className="position">{userLevel[user.level]}</div>
                    </div>
                  ))}
                </div>
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
  const myContribution = my.contribution;

  return {
    accounts,
    myGuild,
    myPosition,
    myContribution,
  };
}

export default connect(mapStateToProps)(Guild);
