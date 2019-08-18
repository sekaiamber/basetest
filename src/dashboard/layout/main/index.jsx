/**
 * @name: Main组件
 * @description: 主layout组件
 */

import React, { Component } from 'react';
import { connect } from 'dva';
import { withRouter } from 'dva/router';
import { CSSTransition } from 'react-transition-group';

import './style.scss';


class Main extends Component {
  render() {
    const { children, match } = this.props;
    return (
      <CSSTransition
        in={match != null}
        timeout={300}
        classNames="page"
        unmountOnExit
      >
        <div id="main" className="page">{children}</div>
      </CSSTransition>
    );
  }
}

function mapStateToProps({ utils }) {
  return {
    pathname: utils.pathname,
  };
}

export default withRouter(connect(mapStateToProps)(Main));
