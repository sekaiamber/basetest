import React, { Component } from 'react';
import { connect } from 'dva';
import baseImg from '../../../assets/base_shine.svg';
import { play } from '../../../utils/media';
import vibration from '../../../utils/vibration';

import pickSound from '../../../assets/pick.mp3';

class Activities extends Component {
  handleCollect(item) {
    const { dispatch } = this.props;
    dispatch({
      type: 'account/collect',
      payload: item.id,
    });
    play(pickSound);
    vibration(150);
  }

  render() {
    const { data } = this.props;
    const list = data.slice(0, 10);
    return (
      <div id="activities">
        {list.map(item => (
          <div className="activity" key={item.id.toString()} style={{ top: item.position.top * 100 + '%', left: item.position.left * 100 + '%', animationDelay: item.animationDelay }} onClick={this.handleCollect.bind(this, item)}>
            <div className="content" style={{ animationDelay: item.animation.delay }}>
              <div><img src={baseImg} alt="" /></div>
              <div>{parseFloat(item.amount).toFixed(2)}</div>
            </div>
          </div>
        ))}
      </div>
    );
  }
}

function mapStateToProps() {
  return {};
}

export default connect(mapStateToProps)(Activities);
