import React from 'react';
import { connect } from 'dva';
import { Spin } from 'antd';

import './style.scss';

function Loading(props) {
  const { loading } = props;
  if (!loading) return <></>;
  return (
    <div id="loading" className="my-modal-conainer">
      <div className="my-modal loading-modal">
        <div><Spin /></div>
        {loading.text && <div className="text">{loading.text}</div>}
      </div>
    </div>
  );
}

function mapStateToProps({ utils }) {
  return {
    loading: utils.loading,
  };
}

export default connect(mapStateToProps)(Loading);
