import React from 'react';
import ReactDom from 'react-dom';
import PageTodos from "domino-compiler/loader/!./todos/todos";

ReactDom.render(<PageTodos />, document.querySelector('#content'));
