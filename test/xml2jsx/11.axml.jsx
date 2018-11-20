import React from 'react';


export default function _component(_props) {
  const { array } = _props;
  return (
    <view>
      {(array || []).map((itemName, idx) => <view key={idx}>
        {idx + ": " + itemName.message}
      </view>)}
    </view>
  );
}
