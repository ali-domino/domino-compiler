import React from 'react';


export default function _component(_props) {
  const { addTodo, text } = _props;
  return (
    <view>
      <button onTap={addTodo}>
        {text}
      </button>
    </view>
  );
}
