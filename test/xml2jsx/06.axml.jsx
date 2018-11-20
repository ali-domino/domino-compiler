import React from 'react';


export default function _component(_props) {
  const { view } = _props;
  return (
    <view>
      {view == 'WEBVIEW' ? <text>
        WEBVIEW
      </text> :
      view == 'APP' ? <text>
        APP
      </text> :
      <text>
        alipay
      </text>}
    </view>
  );
}
