/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import RESOURCE from '../../resource';
import { getItemQuality } from '../../../utils/hero';

export default function ItemIcon(props) {
  const { data, onClick } = props;
  const qu = getItemQuality(data);

  return (
    <span className="item-icon" onClick={onClick}>
      <img src={RESOURCE.ITEM_ICON[data.code] || RESOURCE.ITEM_ICON.EMPTY} alt="" />
      {qu > 0 && (
        <img className="item-quality" src={RESOURCE.ITEM_ICON[`QU${qu}`]} alt="" />
      )}
    </span>
  );
}
