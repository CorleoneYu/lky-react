import { enqueueSetState } from './set-state-queue';

class Component {
  constructor(props = {}) {
    this.state = {};
    this.props = props;
  }

  setState(stateChange) {
    enqueueSetState(stateChange, this);
  }
}

export default Component;