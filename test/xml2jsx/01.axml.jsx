import React from 'react';


export default function _component(_props) {
  const { addTodo } = _props;
  return (
    <view>
      <button onTap={addTodo}>
        Add Todo
      </button>
    </view>
  );
}
