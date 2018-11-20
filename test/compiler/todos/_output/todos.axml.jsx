import React from 'react';


export default function _component(_props) {
  const { onCheckedChanged, todos, addTodo } = _props;
  return (
    <view className="page-todos">
      <checkbox-group onChange={onCheckedChanged}>
        {(todos || []).map((item, index) => <view key={index}>
          <checkbox value={item.text} checked={item.completed}/>
          <text>
            {item.text}
          </text>
        </view>)}
      </checkbox-group>
      <view>
        <button onTap={addTodo}>
          Add Todo
        </button>
      </view>
    </view>
  );
}
