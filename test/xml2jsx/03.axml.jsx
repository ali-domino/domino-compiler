import React from 'react';


export default function _component(_props) {
  const { items } = _props;
  return (
    <view>
      {(items || []).map((item, index) => <text key={index}>
        {item.text}
      </text>)}
    </view>
  );
}
