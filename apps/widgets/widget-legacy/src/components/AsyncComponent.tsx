import React, { Component } from 'react';

type ImportComponentType = () => Promise<{ default: React.ComponentType<any> }>;

interface Props {}
interface State {
  returnedComponent: React.ComponentType<any> | null;
}

const asyncComponent = (
  importComponent: ImportComponentType,
): React.ComponentType<Props> => {
  class AsyncComponent extends Component<Props, State> {
    constructor(props: Props) {
      super(props);

      this.state = {
        returnedComponent: null,
      };
    }

    async componentDidMount() {
      try {
        const { default: component } = await importComponent();

        this.setState({
          returnedComponent: component,
        });
      } catch (error) {
        console.error('Error loading component:', error);
      }
    }

    render() {
      const DisplayComponent = this.state.returnedComponent;

      return DisplayComponent ? <DisplayComponent {...this.props} /> : null;
    }
  }

  return AsyncComponent;
};

export default asyncComponent;
