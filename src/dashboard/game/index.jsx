import React, { Component } from 'react';
import { connect } from 'dva';
import { Spin } from 'antd';
import classnames from 'classnames';
import Field from './field';

import './style.scss';

class Game extends Component {
  componentDidMount() {
    // allow user rotate
    // screen.orientation.unlock();
  }

  componentWillUnmount() {
    const { screen } = window;
    // screen.lockOrientation = screen.lockOrientation || screen.mozLockOrientation || screen.msLockOrientation;
    // screen.unlockOrientation = screen.unlockOrientation || screen.mozUnlockOrientation || screen.msUnlockOrientation;

    // if (screen.orientation.lock) {
    //   screen.orientation.lock('portrait-primary');
    // } else if (screen.lockOrientation) {
    //   screen.lockOrientation('portrait-primary');
    // }

    if (screen.orientation) {
      // message.success('rotate');
      screen.orientation.lock('portrait-primary');
    }

    if (screen.orientation) {
      screen.orientation.unlock();
    }
  }

  render() {
    const { bg, loading } = this.props;
    return (
      <div id="game">
        <div id="farm" style={{ backgroundImage: `url(${bg})` }}>
          <Field />
        </div>
        {loading && (
          <div id="gameLoading">
            <div className="spin-container">
              <Spin />
            </div>
          </div>
        )}
      </div>
    );
  }
}

function mapStateToProps({ farm_env: farmEnv }) {
  return {
    bg: farmEnv.bg,
    loading: farmEnv.loading,
  };
}

export default connect(mapStateToProps)(Game);
