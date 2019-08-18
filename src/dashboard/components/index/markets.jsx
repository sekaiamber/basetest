/* eslint-disable react/jsx-one-expression-per-line */
import React from 'react';
import classnames from 'classnames';

// images
import baseImg from '../../../assets/base.svg';
import ethImg from '../../../assets/eth.svg';
import btcImg from '../../../assets/btc.svg';

export default function Markets(props) {
  const { data } = props;
  const { base, eth, btc } = data;
  return (
    <div id="markets" className="container">
      <div className="item">
        <div className="icon"><img src={baseImg} alt="" /></div>
        <div className="info">
          <div className="name">BASE</div>
          <div className="price">
            <div className="usdt">$ {parseFloat(base.usdt).toFixed(4)}</div>
            <div className="cny">≈ {parseFloat(base.cny).toFixed(4)} CNY</div>
          </div>
          <div className={classnames('change', { down: base.change < 0 })}>{(base.change * 100).toFixed(2)}%</div>
        </div>
      </div>
      <div className="item">
        <div className="icon"><img src={btcImg} alt="" /></div>
        <div className="info">
          <div className="name">BTC</div>
          <div className="price">
            <div className="usdt">$ {parseFloat(btc.usdt).toFixed(4)}</div>
            <div className="cny">≈ {parseFloat(btc.cny).toFixed(4)} CNY</div>
          </div>
          <div className={classnames('change', { down: btc.change < 0 })}>{(btc.change * 100).toFixed(2)}%</div>
        </div>
      </div>
      <div className="item">
        <div className="icon"><img src={ethImg} alt="" /></div>
        <div className="info">
          <div className="name">ETH</div>
          <div className="price">
            <div className="usdt">$ {parseFloat(eth.usdt).toFixed(4)}</div>
            <div className="cny">≈ {parseFloat(eth.cny).toFixed(4)} CNY</div>
          </div>
          <div className={classnames('change', { down: eth.change < 0 })}>{(eth.change * 100).toFixed(2)}%</div>
        </div>
      </div>
    </div>
  );
}
