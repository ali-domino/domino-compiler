import React from 'react';


export default function _template(_props) {
  const { index, msg, time } = _props;
  return (
    <view>
      <text>
        {index + ": " + msg}
      </text>
      <text>
        {"Time: " + time}
      </text>
    </view>
  );
}
_template.templateName = 'test';
