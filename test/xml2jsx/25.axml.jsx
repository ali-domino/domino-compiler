import React from 'react';
import { template } from './_runtime.js';

export default function _component(_props) {
  template.reg(_component, require('./15.axml.jsx').default);
  return (
    <div>
      <p>
        <span>
          add
        </span>
      </p>
      {template({ is: "item", data: {}, pProps: _props, scope: _component })}
    </div>
  );
}
