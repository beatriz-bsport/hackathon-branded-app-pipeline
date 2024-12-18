import React, { Component } from 'react';
import isEqual from 'lodash/isEqual';
import Config from '../../config';
import { BsportMessageType } from './types';
/**
 * Represents a mapping between a prop name and its corresponding message type.
 *
 * @template T - The type of the wrapped component's props.
 */
type PropNameWithMessageType<T> = {
  propName: keyof T;
  messageType: BsportMessageType;
};

/**
 * A Higher Order Component that sends postMessages when specified props are updated.
 *
 * @template WrappedComponentProps - The type of the wrapped component's props.
 * @param {PropNameWithMessageType<WrappedComponentProps>[]} PropsNamesWithMessageTypes - An array of objects representing prop names and their corresponding message types.
 * @returns {(component: React.ComponentType<WrappedComponentProps>) => React.ComponentType} - A function that takes a component and returns a new component with postMessage functionality.
 */
export function withPostMessageOnPropsUpdate<
  WrappedComponentProps extends object,
>(
  PropsNamesWithMessageTypes: PropNameWithMessageType<WrappedComponentProps>[] = [],
): (
  component: React.ComponentType<WrappedComponentProps>,
) => React.ComponentType<WrappedComponentProps> {
  return (WrappedComponent: React.ComponentType<WrappedComponentProps>) => {
    /**
     * Component that wraps the provided component and sends postMessages on prop updates.
     */
    class WithPostMessageOnPropsUpdate extends Component<WrappedComponentProps> {
      /**
       * Event listener for handling postMessages.(dev environments)
       *
       * @param {MessageEvent} event - The postMessage event.
       */
      logPostMessages = (event: MessageEvent) => {
        if (
          event.data &&
          PropsNamesWithMessageTypes.map(
            (propNameWithMessageType) => propNameWithMessageType.messageType,
          ).includes(event.data.type)
        ) {
          // eslint-disable-next-line no-console
          console.log('withPostMessageOnPropsUpdate - update', event.data);
        }
      };

      /**
       * Adds the postMessage event listener when the component mounts.(dev environments)
       */
      componentDidMount(): void {
        if (
          !['production', 'staging'].includes(
            Config.REACT_APP_SENTRY_ENVIRONMENT,
          )
        )
          window?.addEventListener('message', this.logPostMessages);
      }

      /**
       * Removes the postMessage event listener when the component unmounts.
       */
      componentWillUnmount(): void {
        if (
          !['production', 'staging'].includes(
            Config.REACT_APP_SENTRY_ENVIRONMENT,
          )
        )
          window?.removeEventListener('message', this.logPostMessages);
      }

      /**
       * Checks for prop changes and sends postMessages when necessary.
       *
       * @param {WrappedComponentProps} prevProps - The previous props of the component.
       */
      componentDidUpdate(prevProps: WrappedComponentProps) {
        try {
          const propsChanges = PropsNamesWithMessageTypes.reduce<
            {
              messageType: string;
              data: WrappedComponentProps[keyof WrappedComponentProps];
            }[]
          >((changesMap, currentChangeCheck) => {
            const currentName = currentChangeCheck.propName;
            if (
              currentName in prevProps &&
              currentName in this.props &&
              !isEqual(prevProps[currentName], this.props[currentName])
            ) {
              changesMap.push({
                messageType: currentChangeCheck.messageType,
                data: this.props[currentName],
              });
              return changesMap;
            }
            return changesMap;
          }, []);

          if (propsChanges?.length) {
            propsChanges.map((messageWithData) => {
              const message = {
                type: messageWithData.messageType,
                data: messageWithData.data,
              };

              // Send the postMessage
              return window?.postMessage(message, '*');
            });
          }
        } catch (err) {
          console.error(err);
        }
      }

      render() {
        return <WrappedComponent {...this.props} />;
      }
    }
    return WithPostMessageOnPropsUpdate;
  };
}

export default withPostMessageOnPropsUpdate;
