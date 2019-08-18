/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { Component } from 'react';
import classnames from 'classnames';
import { connect } from 'dva';
import { Link } from 'dva/router';

import './style.scss';

// images
import noticeImg from '../../../assets/header_notice.svg';
import activitiesDoneImg from '../../../assets/header_menu.svg';
import backImg from '../../../assets/header_back.svg';

const iconMap = {
  notices: noticeImg,
  activitiesDone: activitiesDoneImg,
  back: backImg,
};

const iconLinks = {
  notices: '/notice',
  activitiesDone: '/activities',
};

const { $ } = window;
// const $doc = $(document);
const $win = $(window);

class MyHeader extends Component {
  state = {
    top: false,
  }

  componentDidMount() {
    document.addEventListener('scroll', this.handlePageScroll);
  }

  componentWillUnmount() {
    document.removeEventListener('scroll', this.handlePageScroll);
  }

  getIcon(tag) {
    if (tag === 'back') {
      return (
        <img src={iconMap[tag]} alt="" onClick={this.handleBack} />
      );
    }

    return (
      <Link to={iconLinks[tag]}>
        <img src={iconMap[tag]} alt="" />
      </Link>
    );
  }

  handleBack = () => {
    const { dispatch } = this.props;

    dispatch({
      type: 'utils/goBack',
    });
  }

  handlePageScroll = () => {
    const { top } = this.state;
    const scrollTop = $win.scrollTop();
    // const scrollHeight = $doc.height();
    // const scrollPosition = $win.height() + $win.scrollTop();
    if (scrollTop > 50 && !top) {
      this.setState({
        top: true,
      });
    } else if (scrollTop < 50 && top) {
      this.setState({
        top: false,
      });
    }
  }

  render() {
    const { top } = this.state;
    const { config } = this.props;

    if (config.hide) {
      return <div style={{ display: 'none' }} />;
    }

    return (
      <header style={config.style} className={classnames('container', { top })}>
        <div className="icon-container">
          {config.icon && config.icon.left && this.getIcon(config.icon.left)}
        </div>
        <div className="title">{config.title}</div>
        <div className="icon-container">
          {config.icon && config.icon.right && this.getIcon(config.icon.right)}
        </div>
      </header>
    );
  }
}

function mapStateToProps({ utils }) {
  return {
    currentPath: utils.currentPath,
    config: utils.currentPathConfig.header || {},
  };
}

export default connect(mapStateToProps)(MyHeader);
