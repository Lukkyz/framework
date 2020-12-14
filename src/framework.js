import { v4 as uuidv4 } from "uuid";
export class Component {
  constructor(props, children) {
    this.props = props;
    this.children = children;
    this.id = uuidv4();
    this.oldNode;
  }
  setState(newState) {
    this.state = Object.assign(this.state, newState);
    if (this.oldNode) {
      this.updateComponent();
    }
  }
  updateComponent() {
    let old = this.oldNode;
    let parent = document.getElementById(this.id).parentNode;
    let newNode = this.render();
    newNode.props.id = this.id;
    updateElement(parent, newNode, old);
    this.oldNode = newNode;
  }
}

export function h(type, props, ...children) {
  return { type, props, children };
}

export async function updateElement($parent, newNode, oldNode, index = 0) {
  if (!oldNode) {
    $parent.appendChild(await createElement(newNode));
  } else if (!newNode) {
    if (typeof oldNode.type === "object") {
      if (oldNode.type.onUnmount) {
        oldNode.type.onUnmount();
      }
    }
    $parent.removeChild($parent.childNodes[index]);
  } else if (changed(newNode, oldNode)) {
    if (newNode.props.id === oldNode.props.id) {
      let oldDom = document.getElementById(`${oldNode.props.id}`);
      oldDom = await createElement(newNode);
    }
    if ($parent.childNodes[index]) {
      $parent.replaceChild(
        await createElement(newNode),
        $parent.childNodes[index]
      );
    }
  } else if (newNode.type) {
    const newLength = newNode.children.length;
    const oldLength = oldNode.children.length;
    newNode.children = normalizeArray(newNode.children);
    oldNode.children = normalizeArray(oldNode.children);
    for (let i = 0; i < newLength || i < oldLength; i++) {
      await updateElement(
        $parent.childNodes[index],
        newNode.children[i],
        oldNode.children[i],
        i
      );
    }
  }
}

function normalizeArray(arr) {
  if (Array.isArray(arr[0]) && arr[0].length > 0) {
    return arr[0];
  } else {
    return arr;
  }
}

export async function createElement(node, component) {
  if (component && typeof node !== "string") {
    node.component = component;
  }
  var $el;
  if (typeof node === "string" || typeof node === "number") {
    return document.createTextNode(node);
  }
  if (typeof node.type === "function") {
    let obj = new node.type(node.props, node.children);
    node.type = obj;
    if (obj.onMount) await obj.onMount();
    let html = obj.render();
    html.props.id = obj.id;
    obj.oldNode = html;
    $el = await createElement(html, obj);
    if (node.props && node.props.className) {
      node.props.className.split(" ").forEach((string) => {
        $el.classList.add(string);
      });
    }
    return $el;
  } else {
    $el = document.createElement(node.type);
    if (node.children) {
      node.children = normalizeArray(node.children);
      let promises = node.children.map(async (child) => {
        return createElement(child, component);
      });
      let getNodes = async () => {
        return Promise.all(promises.map((item) => item));
      };
      let nodes = await getNodes();
      nodes.forEach($el.appendChild.bind($el));
    }
  }
  if (node.props && node.props.className) {
    node.props.className.split(" ").forEach((string) => {
      $el.classList.add(string);
    });
  }
  if (node.props) {
    if (node.props.onChange && node.component) {
      $el.addEventListener("input", node.props.onChange.bind(node.component));
    }
    if (node.props.onClick && node.component) {
      $el.addEventListener("click", node.props.onClick.bind(node.component));
    }

    if (node.props.id) {
      $el.id = node.props.id;
    }
    if (node.props.value) {
      $el.value = node.props.value;
    }
    if (node.props.type) {
      $el.type = node.props.type;
    }
    if (node.props.checked) {
      $el.checked = node.props.checked;
    }
  }
  return $el;
}

function changed(node1, node2) {
  return (
    typeof node1 !== typeof node2 ||
    (typeof node1 === "string" && node1 !== node2) ||
    node1.type !== node2.type ||
    (typeof node1 === "object" &&
      typeof node2 === "object" &&
      node1.props &&
      node2.props &&
      node1.props.title !== node2.props.title) ||
    (typeof node1 === "object" &&
      typeof node2 === "object" &&
      node1.props &&
      node2.props &&
      node1.props.value !== node2.props.value) ||
    (typeof node1 === "object" &&
      typeof node2 === "object" &&
      node1.props &&
      node2.props &&
      node1.props.className !== node2.props.className) ||
    (typeof node1 === "object" &&
      typeof node2 === "object" &&
      node1.props &&
      node2.props &&
      node1.props.checked !== node2.props.checked) ||
    (typeof node1 === "object" &&
      typeof node2 === "object" &&
      Object.keys(node1.props) !== Object.keys(node2.props))
  );
}
