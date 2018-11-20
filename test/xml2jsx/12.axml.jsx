import React from 'react';


export default function _component(_props) {

  return (
    <view>
      {([1, 2, 3, 4, 5, 6, 7, 8, 9] || []).map((i, index) => <view key={index}>
        {([1, 2, 3, 4, 5, 6, 7, 8, 9] || []).map((j, index) => <view key={index}>
          {i <= j ? <view>
            {i + " * " + j + " = " + (i * j)}
          </view> : null}
        </view>)}
      </view>)}
    </view>
  );
}
