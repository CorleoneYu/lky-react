import { diff } from './diff';

export default function render(vNode, container, dom) {
  return diff(dom, vNode, container);
}