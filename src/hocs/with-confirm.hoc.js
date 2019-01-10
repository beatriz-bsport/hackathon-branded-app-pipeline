// @flow

import React from 'react';

import ModalConfirm from '../components/ModalConfirm.component';

export default function withConfirm<T>(
  Component: React.Component<T>,
  handler: string,
  options: {},
): React.Component<T> {
  return class extends React.Component {
    state = {
      dialogOpen: false,
    };

    handleConfirm = () => {
      const { args } = this.state;
      this.props[handler](...args);
      this.setState({ dialogOpen: false, args: undefined });
    };

    handleCancel = () => {
      this.setState({ dialogOpen: false, args: undefined });
    };

    render() {
      const mergedProps = {
        ...this.props,
        [handler]: (...args) => {
          this.setState({ dialogOpen: true, args });
        },
      };
      return (
        <div style={{ display: 'inline-block' }}>
          <ModalConfirm
            open={this.state.dialogOpen}
            options={options}
            handleCancel={this.handleCancel}
            handleConfirm={this.handleConfirm}
          />
          <Component {...mergedProps} />
        </div>
      );
    }
  };
}
