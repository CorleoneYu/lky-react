import React from '../lib/react'

export default class Welcome extends React.Component {
  componentWillMount() {
    console.log('welcome componentWillMount');
  }

  componentDidMount() {
    console.log('welcome componentDidMount');
  }

  componentWillUpdate() {
    console.log('welcome componentWillUpdate');
  }

  componentDidUpdate() {
    console.log('welcome componentDidUpdate');
  }

  render() {
    console.log('welcome render');

    return <h1>Hello, {this.props.name}</h1>
  }
}