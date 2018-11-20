Page({
  data: {
    todos: [
      { text: 'Learning Javascript', completed: true },
      { text: 'Learning ES2016', completed: true },
      { text: 'Learning 支付宝小程序', completed: false },
    ],
  },
  onCheckedChanged(e) {
    console.log(e);
    const checkedTodos = e.detail.value;
    const newTodos = this.data.todos.map(todo => ({
      ...todo,
      completed: checkedTodos.indexOf(todo.text) > -1,
    }));
    this.setData({ todos: newTodos });
  },
  addTodo() {
    const newTodos = this.data.todos.concat([{ text: 'test todo', completed: false }]);
    this.setData({ todos: newTodos });
  },
});
