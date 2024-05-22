import React, { Component } from 'react';

type ImportComponentType = () => Promise<{ default: React.ComponentType<any> }>;

interface Props {}
interface State {
  component: React.ComponentType<any> | null;
}

export default function asyncComponent(importComponent: ImportComponentType) {
  class AsyncComponent extends Component<Props, State> {
    constructor(props: Props) {
      super(props);

      this.state = {
        component: null,
      };
    }

    async componentDidMount() {
      const { default: component } = await importComponent();

      // eslint-disable-next-line
      this.setState({
        component,
      });
    }

    render() {
      const C = this.state.component;

      return C ? <C {...this.props} /> : null;
    }
  }

  return AsyncComponent;
}
