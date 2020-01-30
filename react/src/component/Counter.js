import React from "../lib/react";

export default class Counter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      num: 0
    };
  }

  componentWillMount() {
    console.log("Counter componentWillMount");
  }

  componentDidMount() {
    console.log("Counter componentDidMount");
  }

  componentWillUpdate() {
    console.log("Counter componentWillUpdate");
  }

  componentDidUpdate() {
    console.log("Counter componentDidUpdate");
  }

  handleClick() {
    for (let i = 0; i < 100; i++) {
      this.setState(prevState => {
        console.log(prevState.num);
        return {
          num: prevState.num + 1
        };
      });
    }
  }

  render() {
    return (
      <div>
        <h1>number: {this.state.num}</h1>
        <button onClick={() => this.handleClick()}>add</button>
      </div>
    );
  }
}
