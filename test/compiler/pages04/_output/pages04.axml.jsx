import React from 'react';
import { Checkbox } from 'antd';
import template from 'component-template';

export default function _component(_props) {

  return (
    <Checkbox.Group>
      {template({ is: "test", data: {}, pProps: _props, scope: _component })}
    </Checkbox.Group>
  );
}
