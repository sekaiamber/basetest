import React, { Component } from 'react';
import classnames from 'classnames';
import { Spin } from 'antd';

import './style.scss';

const LOADING_DISTANCE = 100;

const { $ } = window;
// const $doc = $(document);
const $win = $(window);

export default class PullRefresh extends Component {
  state = {
    top: true,
    dragging: false,
    distanceStart: 0,
    distanceEnd: 0,
    loading: false,
  }

  componentDidMount() {
    document.addEventListener('scroll', this.handlePageScroll);
    document.addEventListener('touchstart', this.handleTouchStart);
    document.addEventListener('touchend', this.handleTouchEnd);
    document.addEventListener('touchmove', this.handleTouchMove);
  }

  componentWillUnmount() {
    document.removeEventListener('scroll', this.handlePageScroll);
    document.removeEventListener('touchstart', this.handleTouchStart);
    document.removeEventListener('touchend', this.handleTouchEnd);
    document.removeEventListener('touchmove', this.handleTouchMove);
  }

  getDistance() {
    const { distanceStart, distanceEnd } = this.state;
    const distance = distanceEnd - distanceStart;
    if (distance < 0) return 0;
    return distance;
  }

  handlePageScroll = () => {
    const { top } = this.state;
    const scrollTop = $win.scrollTop();
    if (scrollTop === 0 && !top) {
      this.setState({ top: true });
    } else if (scrollTop > 0 && top) {
      this.setState({ top: false });
    }
  }

  handleTouchStart = (e) => {
    const { loading } = this.state;
    if (loading) return;
    const targetTouch = e.targetTouches[0];
    const y = targetTouch.screenY;
    this.setState({
      dragging: true,
      distanceStart: y,
      distanceEnd: y,
    });
  }

  handleTouchEnd = () => {
    const { loading } = this.state;
    if (loading) return;
    this.setState({
      dragging: false,
    }, () => {
      const distance = this.getDistance();
      if (distance > LOADING_DISTANCE) {
        this.setState({
          distanceStart: 0,
          distanceEnd: 100,
          loading: true,
        }, () => {
          const { onRefresh } = this.props;
          if (onRefresh) {
            onRefresh(() => {
              setTimeout(() => {
                this.setState({
                  distanceStart: 0,
                  distanceEnd: 0,
                  loading: false,
                });
              }, 500);
            });
          }
        });
      } else {
        this.setState({
          distanceStart: 0,
          distanceEnd: 0,
        });
      }
    });
  }

  handleTouchMove = (e) => {
    const { top, dragging } = this.state;
    const { loading } = this.state;
    if (loading || !dragging) return;
    const targetTouch = e.targetTouches[0];
    const y = targetTouch.screenY;
    if (top) {
      this.setState({
        distanceEnd: y,
      });
    } else {
      // 未到顶，更新distanceStart和distanceEnd
      this.setState({
        distanceStart: y,
        distanceEnd: y,
      });
    }
  }

  render() {
    const { dragging } = this.state;
    // console.log();
    const distance = this.getDistance();
    return (
      <div id="refreshIcon">
        <div className={classnames('icon-container', { dragging })} style={{ transform: `translate(0, ${distance}px)` }}>
          <Spin />
        </div>
      </div>
    );
  }
}
