import React from 'react';
import { template } from './_runtime.js';
import { Checkbox } from 'antd';

export default function _component(_props) {
  template.reg(_component, require('./test.axml.jsx').default);
  return (
    <Checkbox.Group>
      {template({ is: "test", data: {}, pProps: _props, scope: _component })}
    </Checkbox.Group>
  );
}
