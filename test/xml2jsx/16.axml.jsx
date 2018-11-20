import React from 'react';
import { template } from './_runtime.js';

export default function _component(_props) {
  template.reg(_component, require('./15.axml.jsx').default);
  return (
    template({ is: "item", data: {text: 'forbar'}, pProps: _props, scope: _component })
  );
}
