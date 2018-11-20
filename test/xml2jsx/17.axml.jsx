import React from 'react';
import { template } from './_runtime.js';

export default function _component(_props) {
  const { item } = _props;
  template.reg(_component, require('./15.axml.jsx').default);
  return (
    template({ is: "item", data: {...item}, pProps: _props, scope: _component })
  );
}
