
Page({
  data: {
    todos: [
      { text: 'Learning Javascript', completed: true },
      { text: 'Learning ES2016', completed: true },
      { text: 'Learning 支付宝小程序', completed: false },
    ],
  },
  getCheckedValue() {
    return this.data.todos.filter(t => t.completed).map(t => t.text);
  },
  onCheckedChanged(value) {
    const newTodos = this.data.todos.map(todo => ({
      ...todo,
      completed: value.indexOf(todo.text) > -1,
    }));
    this.setData({ todos: newTodos });
  },
  addTodo() {
    const newTodos = this.data.todos.concat([{ text: 'test todo ' + (this.data.todos.length + 1), completed: false }]);
    this.setData({ todos: newTodos });
  },
});
