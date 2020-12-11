import { h, Component, updateElement } from "./framework.js";
/** @jsx h */

// ---------------------------------------------------------------------

class App extends Component {
  constructor(props, children) {
    super(props, children);
    this.state = {
      abc: "ok",
      hover: "hover",
    };
  }
  onClick() {
    console.log(this.state.abc);
  }
  onHover() {
    console.log(this.state.hover);
  }
  render() {
    return (
      <div>
        <div onHover={this.onHover} onClick={this.onClick}>
          {this.state.abc}
        </div>
        <div>{this.children}</div>
      </div>
    );
  }
}

class Box extends Component {
  constructor(props, children) {
    super(props, children);
  }
  render() {
    return (
      <section>
        <h2>BOX Component</h2>
      </section>
    );
  }
}

const a = (
  <div>
    <App>
      <div>efjefeo</div>
    </App>
  </div>
);

const $root = document.getElementById("root");
const $reload = document.getElementById("reload");

updateElement($root, a);
$reload.addEventListener("click", () => {
  updateElement($root, a, a);
});
