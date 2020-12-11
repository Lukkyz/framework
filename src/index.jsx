import { h, Component, updateElement } from "./framework.js";
import axios from "axios";
/** @jsx h */

// ---------------------------------------------------------------------
class Post extends Component {
  constructor(props, children) {
    super(props, children);
  }
  render() {
    return <div>{this.props.title}</div>;
  }
}

class Posts extends Component {
  constructor(props, children) {
    super(props, children);
    this.state = { todos: "", newTodo: "" };
  }
  async onMount() {
    let res = await axios("https://jsonplaceholder.typicode.com/todos/");
    let obj = res.data;
    this.setState({ todos: obj });
  }
  onChange(e) {
    this.setState({
      newTodo: e.target.value,
    });
  }
  onClick() {
    const newTodo = { title: this.state.newTodo, id: 433 };
    this.setState({
      todos: [newTodo, ...this.state.todos],
      newTodo: "",
    });
  }
  render() {
    let todos = this.state.todos.map((child) => (
      <Post
        title={child.title}
        className={child.completed ? "post line-through" : "post"}
      />
    ));
    return (
      <div id={this.id} className="container">
        <input
          id="in"
          value={this.state.newTodo}
          onChange={this.onChange}
        ></input>
        <button className="btn" onClick={this.onClick}>
          Ajouter
        </button>
        <p>{this.state.newTodo}</p>
        <div className="posts">{todos}</div>
      </div>
    );
  }
}

const a = (
  <div>
    <Posts />
  </div>
);

const $root = document.getElementById("root");

updateElement($root, a);
