import React from 'react';


export default function _component(_props) {
  const { list, bringToFront } = _props;
  return (
    <view className="container">
      {(list || []).map((item, index) => <view key={item}>
        <view onTap={bringToFront} data-value={item}>
          {item + ": click to bring to front"}
        </view>
      </view>)}
    </view>
  );
}
