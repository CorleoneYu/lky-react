import { setAttribute } from "./dom";

export function renderComponent(component) {
  let base;
  const renderer = component.render();

  if (component.base && component.componentWillUpdate) {
    // 如果已经渲染过 则可以执行 willUpdate
    component.componentWillUpdate();
  }

  base = diff(component.base, renderer);

  if (component.base) {
    // 如果已经渲染过 则可以执行 didUpdate
    component.componentDidUpdate && component.componentDidUpdate();
  } else {
    component.componentDidMount && component.componentDidMount();
  }

  component.base = base;
  base._component = component;
}

/**
 * @param {HTMLElement} dom 真实DOM
 * @param {vNode} vNode 虚拟DOM
 * @param {HTMLElement} container 容器
 * @returns {HTMLElement} 更新后的DOM
 */
export function diff(dom, vNode, container) {
  const ret = diffNode(dom, vNode);

  if (container && ret.parentNode !== container) {
    container.appendChild(ret);
  }
  return ret;
}

/**
 * @param {HTMLElement} dom 真实DOM
 * @param {vNode} vNode 虚拟DOM
 * @returns {HTMLElement} 更新后的DOM
 */
function diffNode(dom, vNode) {
  let out = dom;

  if (vNode === undefined || vNode === null || typeof vNode === "boolean") {
    // 兜底 转成 文本节点
    vNode = "";
  }

  if (typeof vNode === "number") {
    // number 转成 字符串 即文本节点
    vNode = String(vNode);
  }

  if (typeof vNode === "string") {
    if (dom && dom.nodeType === 3) {
      // 如果当前的DOM就是文本节点，则直接更新内容
      if (dom.textContent !== vNode) {
        dom.textContent = vNode;
      }
    } else {
      // 如果DOM不是文本节点，则新建一个文本节点DOM，并移除掉原来的
      out = document.createTextNode(vNode);
      if (dom && dom.parentNode) {
        dom.parentNode.replaceChild(out, dom);
      }
    }

    return out;
  }

  if (typeof vNode.tag === "function") {
    // 组件
    return diffComponent(dom, vNode);
  }

  if (!dom || !isSameNodeType(dom, vNode)) {
    // 新增节点 或 dom 与 vNode 类型不一致
    out = document.createElement(vNode.tag);

    if (dom) {
      // 将 dom 的子节点 挂在 out 下
      [...dom.children].map(out.appendChild);

      if (dom.parentNode) {
        // out 替换 dom
        dom.parentNode.replaceChild(out, dom);
      }
    }
  }
  if (
    (vNode.children && vNode.children.length > 0) ||
    (out.childNodes && out.childNodes.length > 0)
  ) {
    diffChildren(out, vNode.children);
  }

  diffAttributes(out, vNode);

  return out;
}

function diffAttributes(dom, vNode) {
  const old = {};
  const attrs = vNode.attrs;

  for (let i = 0; i < dom.attributes.length; i++) {
    const attr = dom.attributes[i];
    old[attr.name] = attr.value;
  }

  for (let name in old) {
    if (!(name in attrs)) {
      setAttribute(dom, name, undefined);
    }
  }

  for (let name in attrs) {
    if (old[name] !== attrs[name]) {
      setAttribute(dom, name, attrs[name]);
    }
  }
}

function diffChildren(dom, vChildren) {
  const domChildren = dom.childNodes;
  const children = [];
  const keyed = {};

  // 收集 有key的child 以及 无key的child
  if (domChildren.length > 0) {
    for (let i = 0; i < domChildren.length; i++) {
      const child = domChildren[i];
      const key = child.key;
      if (key) {
        keyed[key] = child;
      } else {
        children.push(child);
      }
    }
  }

  if (vChildren && vChildren.length > 0) {
    let min = 0;
    let childrenLen = children.length;

    for (let i = 0; i < vChildren.length; i++) {
      const vChild = vChildren[i];
      const key = vChildren.key;
      let child;

      if (key) {
        // vChild 有 key 则使用 keyed 做比较
        if (keyed[key]) {
          // 有相同的 key
          child = keyed[key];
          keyed[key] = undefined;
        }
      } else if (min < childrenLen) {
        for (let j = min; j < childrenLen; j++) {
          let c = children[j];

          if (c && isSameNodeType(c, vChild)) {
            child = c;
            children[j] = undefined;

            if (j === childrenLen - 1) childrenLen--;
            if (j === min) min++;
            break;
          }
        }
      }

      child = diffNode(child, vChild);

      const f = domChildren[i];
      if (child && child !== dom && child !== f) {
        if (!f) {
          dom.appendChild(child);
        } else if (child === f.nextSibling) {
          removeNode(f);
        } else {
          dom.insertBefore(child, f);
        }
      }
    }
  }
}

function diffComponent(dom, vNode) {
  let c = dom && dom._component;
  let oldDom = dom;

  if (c && c.constructor === vNode.tag) {
    // 如果组件类型没有变化 则 set props
    setComponentProps(c, vNode.attrs);
    dom = c.base;
  } else {
    // 如果组件类型变化 则移除原来组件 并渲染新的组件
    if (c) {
      unmountComponent(c);
      oldDom = null;
    }

    c = createComponent(vNode.tag, vNode.attrs);
    setComponentProps(c, vNode.attrs);
    dom = c.base;

    if (oldDom && dom !== oldDom) {
      oldDom._component = null;
      removeNode(oldDom);
    }
  }

  return dom;
}

function unmountComponent(component) {
  if (component.componentWillUnmount) component.componentWillUnmount();
  removeNode(component.base);
}

function isSameNodeType(dom, vNode) {
  if (typeof vNode === "string" || typeof vNode === "number") {
    return dom.nodeType === 3;
  }

  if (typeof vNode.tag === "string") {
    // 原生组件
    return dom.nodeName.toLowerCase() === vNode.tag.toLowerCase();
  }

  // 组件
  return dom && dom._component && dom._component.constructor === vNode.tag;
}

function removeNode(dom) {
  if (dom && dom.parentNode) {
    dom.parentNode.removeChild(dom);
  }
}

function setComponentProps(component, props) {
  if (!component.base) {
    // 如果还没渲染过 则可以执行 willMount
    if (component.componentWillMount) {
      component.componentWillMount();
    }
  } else if (component.componentWillReceiveProps) {
    // 已经渲染过 则可以执行 willReceiveProps
    componentWillReceiveProps(props);
  }

  component.props = props;
  renderComponent(component);
}

function createComponent(component, props) {
  let inst;
  // 如果是类定义组件，则直接返回实例
  if (component.prototype && component.prototype.render) {
    inst = new component(props);
  } else {
    // 如果函数定义组件 则扩展为类定义组件
    inst = new component(props);
    inst.constructor = component;
    inst.render = function() {
      return this.constructor(props);
    }
  }

  return inst;
}