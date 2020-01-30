// import Welcome from './component/Welcome';
import Counter from './component/Counter';
import React from './lib/react';

export default class App extends React.Component {
  componentWillMount() {
    console.log('App componentWillMount');
  }

  componentDidMount() {
    console.log('App componentDidMount');
  }

  componentWillUpdate() {
    console.log('App componentWillUpdate');
  }

  componentDidUpdate() {
    console.log('App componentDidUpdate');
  }

  render() {
    console.log('App render');

    return (
      <div>
        <Counter />
      </div>
    )
  }
}