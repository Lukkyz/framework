export class Component {
  constructor(props, children) {
    this.props = props;
    this.children = children;
  }
}

export function h(type, props, ...children) {
  return { type, props, children };
}

export function updateElement($parent, newNode, oldNode, index = 0) {
  if (!oldNode) {
    $parent.appendChild(createElement(newNode));
  } else if (!newNode) {
    $parent.removeChild($parent.childNodes[index]);
  } else if (changed(newNode, oldNode)) {
    $parent.replaceChild(createElement(newNode), $parent.childNodes[index]);
  } else if (newNode.type) {
    const newLength = newNode.children.length;
    const oldLength = oldNode.children.length;
    for (let i = 0; i < newLength || i < oldLength; i++) {
      updateElement(
        $parent.childNodes[index],
        newNode.children[i],
        oldNode.children[i],
        i
      );
    }
  }
}

function passPropsToChildren(state, node) {
  if (typeof node !== "string") {
    node.state = state;
    if (node.children) {
      node.children.forEach((child) => passPropsToChildren(state, child));
    }
    return node;
  }
}

function passEventListener($el, node) {
  if (node.props) {
    if (node.props.onClick) {
      $el.addEventListener("click", node.props.onClick.bind(node));
    }
    if (node.props.onHover) {
      $el.addEventListener("mouseover", node.props.onHover.bind(node));
    }
  }
}

export function createElement(node) {
  let $el;
  if (typeof node === "string" || typeof node === "number") {
    return document.createTextNode(node);
  }
  if (typeof node.type === "function") {
    let obj = new node.type(node.props, node.children);
    let html = obj.render();
    html = passPropsToChildren(obj.state, html);
    console.log(html);
    $el = createElement(html);
  } else {
    $el = document.createElement(node.type);
    if (Array.isArray(node.children[0]) && node.children[0].length > 0) {
      const a = node.children[0];
      a.map(createElement).forEach($el.appendChild.bind($el));
    } else {
      node.children.map(createElement).forEach($el.appendChild.bind($el));
    }
  }
  if (node.props && node.props.class) {
    $el.className = node.props.class;
  }
  passEventListener($el, node);
  return $el;
}

function changed(node1, node2) {
  return (
    typeof node1 !== typeof node2 ||
    (typeof node1 === "string" && node1 !== node2) ||
    node1.type !== node2.type
  );
}
