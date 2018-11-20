import React from 'react';
import { template } from './_runtime.js';

export default function _component(_props) {
  const { obj1, obj2, a, d } = _props;
  template.reg(_component, require('./15.axml.jsx').default);
  return (
    template({ is: "item", data: {...obj1, ...obj2, a, c: d, e: 6}, pProps: _props, scope: _component })
  );
}
