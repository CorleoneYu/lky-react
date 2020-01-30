import { renderComponent } from '../react-dom/diff';

const setStateQueue = [];
const renderQueue = [];

function defer(fn) {
  return Promise.resolve().then(fn);
}

export function enqueueSetState(stateChange, component) {
  if (setStateQueue.length === 0) {
    defer(flush);
  }
  setStateQueue.push({
    stateChange,
    component,
  });

  if (!renderQueue.some(item => item === component)) {
    // 保证 renderQueue 没有重复组件
    renderQueue.push(component);
  }
}

// 清空两个队列
function flush() {
  let item, component;

  while (item = setStateQueue.shift()) {
    const { stateChange, component } = item;
    
    // 如果没有 prevState 则将当前的 state 作为初始
    if (!component.prevState) {
      component.prevState = Object.assign({}, component.state);
    }

    if (typeof stateChange === 'function') {
      // this.setState(prevState => {
      //   // return xxx
      // })
      // 形式
      Object.assign(component.state, stateChange(component.prevState, component.props))
    } else {
      // this.setState({
      //   // xxx
      // })
      // 形式
      Object.assign(component.state, stateChange);
    }
    component.prevState = component.state;
  }

  while (component = renderQueue.shift()) {
    renderComponent(component);
  }
}