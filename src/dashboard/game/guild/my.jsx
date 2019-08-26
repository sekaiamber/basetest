/* eslint-disable react/jsx-no-duplicate-props */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable react/button-has-type */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/no-array-index-key */
/* eslint-disable jsx-a11y/alt-text */
import React, { Component } from 'react';
import classnames from 'classnames';
import GuildHome from './my/home';
import GuildMembers from './my/members';
import GuildMy from './my/shop';
import GuildTech from './my/tech';
import GuildBattle from './my/battle';
import RESOURCE from '../../resource';

export default class Guild extends Component {
  state = {
    tab: 0,
  }

  render() {
    const { tab } = this.state;
    return (
      <div className="content my-guild">
        <div className="tabs">
          <div className={classnames('tab', { active: tab === 0 })} onClick={() => this.setState({ tab: 0 })}>
            <div>
              <div className="icon">
                <img src={RESOURCE.UI.GUILD_01} />
              </div>
              <div className="text">大厅</div>
            </div>
          </div>
          <div className={classnames('tab', { active: tab === 1 })} onClick={() => this.setState({ tab: 1 })}>
            <div>
              <div className="icon">
                <img src={RESOURCE.UI.GUILD_02} />
              </div>
              <div className="text">成员</div>
            </div>
          </div>
          <div className={classnames('tab', { active: tab === 2 })} onClick={() => this.setState({ tab: 2 })}>
            <div>
              <div className="icon">
                <img src={RESOURCE.UI.GUILD_03} />
              </div>
              <div className="text">商店</div>
            </div>
          </div>
          <div className={classnames('tab', { active: tab === 3 })} onClick={() => this.setState({ tab: 3 })}>
            <div>
              <div className="icon">
                <img src={RESOURCE.UI.GUILD_04} />
              </div>
              <div className="text">科技</div>
            </div>
          </div>
          <div className={classnames('tab', { active: tab === 4 })} onClick={() => this.setState({ tab: 4 })}>
            <div>
              <div className="icon">
                <img src={RESOURCE.UI.GUILD_05} />
              </div>
              <div className="text">锦标赛</div>
            </div>
          </div>
        </div>
        {tab === 0 && <GuildHome />}
        {tab === 1 && <GuildMembers />}
        {tab === 2 && <GuildMy />}
        {tab === 3 && <GuildTech />}
        {tab === 4 && <GuildBattle />}
      </div>
    );
  }
}
