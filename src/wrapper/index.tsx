import * as React from 'react';

export default function wrapper(Component) {
  return class extends React.Component {
    render() {
      return <Component
        setData={data => this.setState(data)}
        data={this.state}
      />;
    }
  }
}
