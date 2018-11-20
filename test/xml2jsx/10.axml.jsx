import React from 'react';


export default function _component(_props) {
  const { items, text } = _props;
  return (
    <view>
      {(items || []).map((item, index) => item.a ? <text key={index}>
        {text}
      </text> : null)}
    </view>
  );
}
