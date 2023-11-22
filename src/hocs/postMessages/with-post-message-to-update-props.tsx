import React, { Component } from 'react';
import isEqual from 'lodash/isEqual';
import { ObjectSchema } from 'yup';
import { BsportControlledPropsMessageType } from './types';

/**
 * Represents a mapping between a prop name and its corresponding message type.
 *
 * @template T - The type of the wrapped component's props.
 */
type PropNameWithMessageType<T extends object> = {
  propName: keyof T;
  messageType: BsportControlledPropsMessageType;
  validationSchema: ObjectSchema;
};

/**
 * A Higher Order Component to update props using postMessage.
 *
 * @template WrappedComponentProps - The type of the wrapped component's props.
 * @param {PropNameWithMessageType<WrappedComponentProps>[]} PropsNamesWithMessageTypes - An array of objects representing prop names and their corresponding message types.
 * @returns {(component: React.ComponentType<WrappedComponentProps>) => React.ComponentType<WrappedComponentProps>} - A function that takes a component and returns a new component with postMessage functionality.
 */
export function withPostMessageToUpdateProps<
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
    class WithPostMessageToUpdateProps extends Component<
      WrappedComponentProps,
      Partial<WrappedComponentProps>
    > {
      constructor(props: WrappedComponentProps) {
        super(props);
        this.state = {} as Partial<WrappedComponentProps>;
      }

      /**
       * Returns an array of listened message types.
       *
       * @returns {BsportControlledPropsMessageType[]} - An array of message types.
       */
      listenedMessageTypes = (): BsportControlledPropsMessageType[] =>
        PropsNamesWithMessageTypes.map(
          (propNameWithMessageType) => propNameWithMessageType.messageType,
        );

      /**
       * Event listener for handling postMessages.
       *
       * @param {MessageEvent<{ type: BsportControlledPropsMessageType; data: Partial<WrappedComponentProps>; }>} event - The postMessage event.
       */
      handlePostMessages = async (
        event: MessageEvent<{
          type: BsportControlledPropsMessageType;
          data: Partial<WrappedComponentProps>;
        }>,
      ): Promise<void> => {
        if (
          event?.data &&
          this.listenedMessageTypes().includes(event?.data?.type)
        ) {
          try {
            const eventMessageData = event?.data?.data;
            // Check if the data payload is an object and has properties
            if (eventMessageData) {
              // Filter out the properties provided in the postMessage that match the prop names
              const dataProvidedCleanUp =
                await PropsNamesWithMessageTypes.reduce(
                  async (accPromise, cV) => {
                    const currentPropName = cV.propName;
                    const currentPropValidationSchema = cV.validationSchema;

                    const acc = await accPromise;

                    if (
                      currentPropName in eventMessageData &&
                      currentPropValidationSchema
                    ) {
                      // Only update the state if the new data is different from the current state
                      const providedPropData =
                        eventMessageData[currentPropName];
                      const providedPropDataHasChanged = !isEqual(
                        providedPropData,
                        this.state?.[currentPropName],
                      );

                      if (providedPropDataHasChanged) {
                        const providedPropDataIsValid =
                          await currentPropValidationSchema.validate(
                            providedPropData,
                          );

                        if (providedPropDataIsValid) {
                          // @ts-expect-error
                          acc[currentPropName] = providedPropDataIsValid;
                        }
                      }
                    }
                    return acc;
                  },
                  Promise.resolve({}) as Promise<
                    Partial<WrappedComponentProps>
                  >,
                );

              const resolvedDataProvidedCleanUp = await dataProvidedCleanUp;

              // Update the component state with the cleaned-up data
              if (resolvedDataProvidedCleanUp) {
                this.setState((prevState) => ({
                  ...prevState,
                  ...resolvedDataProvidedCleanUp,
                }));
              }
            }
          } catch (err) {
            console.error('Error handling postMessage props update', err);
          }
        }
      };

      /**
       * Adds the postMessage event listener when the component mounts (in development environments).
       */
      componentDidMount(): void {
        window.addEventListener('message', this.handlePostMessages);
      }

      /**
       * Removes the postMessage event listener when the component unmounts.
       */
      componentWillUnmount(): void {
        window.removeEventListener('message', this.handlePostMessages);
      }

      /**
       * Renders the wrapped component with its props.
       *
       * @returns {React.ReactNode} - The rendered component.
       */
      render(): React.ReactNode {
        return <WrappedComponent {...this.props} {...this.state} />;
      }
    }

    return WithPostMessageToUpdateProps;
  };
}

export default withPostMessageToUpdateProps;
