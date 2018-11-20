import React from 'react';


export default function _component(_props) {
  const { id, text } = _props;
  return (
    <view>
      <text id={"item-" + id}>
        {"aaa: " + text}
      </text>
    </view>
  );
}
