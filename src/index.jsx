import { h, Component, updateElement } from "./framework.js";
import "tailwindcss/tailwind.css";
import axios from "axios";

/** @jsx h */

// ---------------------------------------------------------------------
class Post extends Component {
  constructor(props, children) {
    super(props, children);
    this.state = {
      completed: false,
    };
    this.onClick = this.onClick.bind(this);
  }

  onClick() {
    console.log(this);
    this.props.completed = !this.props.completed;
    this.updateComponent();
  }
  render() {
    return (
      <div
        className={
          this.props.completed ? "line-through bg-red-300" : "bg-green-300"
        }
      >
        {this.props.title}
        <input
          type="checkbox"
          onClick={this.onClick}
          checked={this.props.completed}
          name="state"
        />
        <label>{this.props.completed ? "Completed" : "Uncompleted"}</label>
      </div>
    );
  }
}

class Posts extends Component {
  constructor(props, children) {
    super(props, children);
    this.state = { date: "", todos: "", newTodo: "" };
  }
  async onMount() {
    let res = await axios("https://jsonplaceholder.typicode.com/todos/");
    let obj = res.data;
    this.setState({ todos: obj });
  }
  onUnmount() {
    clearInterval(this.timerID);
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
      <Post title={child.title} completed={child.completed} />
    ));
    return (
      <div id={this.id} className="bg-gray-100 container">
        <button className="btn" onClick={this.onClick}>
          Ajouter
        </button>
        <p>{this.state.date}</p>
        <div className="posts">{todos}</div>
      </div>
    );
  }
}

const a = <Posts />;

const $root = document.getElementById("root");
const upload = document.querySelector("#upload");
upload.addEventListener("click", () => {
  updateElement($root, null, a);
});
updateElement($root, a);
