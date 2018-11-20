import React from 'react';
import { template } from './_runtime.js';
import { Button } from 'antd';

export default function _component(_props) {

  return (
    <Button>
      按钮
      {template({ is: "test", data: {}, pProps: _props, scope: _component })}
    </Button>
  );
}
