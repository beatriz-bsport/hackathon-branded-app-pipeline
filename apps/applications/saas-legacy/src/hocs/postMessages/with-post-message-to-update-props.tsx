import React, { Component } from 'react';
import isEqual from 'lodash/isEqual';
import pick from 'lodash/pick';
import omitBy from 'lodash/omitBy';
import isUndefined from 'lodash/isUndefined';
import { ObjectSchema, StringSchema } from 'yup';
import { BsportControlledPropsMessageType } from './types';

const omitUndefinedValues = (object: object) => {
  return omitBy(object, isUndefined);
};
/**
 * Represents a mapping between a prop name and its corresponding message type.
 *
 * @template T - The type of the wrapped component's props.
 */
type PropNameWithMessageType<T extends object> = {
  propName: keyof T;
  messageType: BsportControlledPropsMessageType;
  /**
   * The validation schema for component Props can be
   * either object-based (several props) or string-based (singular prop)
   */
  validationSchema: ObjectSchema | StringSchema;
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
       * Returns an array of listened props.
       *
       */
      listenedPropNames = () =>
        PropsNamesWithMessageTypes.map(
          (propNameWithMessageType) => propNameWithMessageType.propName,
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
                          acc[currentPropName] = providedPropData;
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
       * Lifecycle method called after the component updates.
       * It addresses a scenario where the Higher Order Component (HOC) retains control over certain props in its state,
       * making it challenging for the wrapped component to update those props independently.
       *
       * The challenge arises because, when the HOC sets a key in its state, deleting that key from the state becomes
       * problematic due to limitations in class-based components. Even attempts to delete a key using this.setState()
       * prove ineffective. As a result, we monitor props provided by the HOC that are currently in the state
       * and need to be synchronized with the wrapped component's props.
       *
       * If any of these watched props are updated by the wrapped component, indicating changes from another HOC or through
       * a callback in props, we nullify their values in the HOC's state. Nullifying allows us to maintain control over
       * the props and ensures that undefined values are cleared from the state before being passed to the wrapped component.
       *
       */
      componentDidUpdate(prevProps: WrappedComponentProps) {
        try {
          // Extract prop names that the HOC is monitoring
          const listenedPropNames = this.listenedPropNames();

          // Capture the HOC-controlled props from both previous and current props of the wrapped component
          const prevHOCEDProps = pick(prevProps, listenedPropNames);
          const currentHOCEDProps = pick(this.props, listenedPropNames);

          // Identify keys in the HOC's state to be nullified
          const keysToDeleteFromHOCState = listenedPropNames.reduce<
            (keyof WrappedComponentProps)[]
          >((keysToDelete, currentKeyCheck) => {
            // Check if the HOC currently has control over the prop
            const HOCHasControlOverProps = currentKeyCheck in this.state;

            // Compare the previous and current values of the prop in the wrapped component
            if (
              HOCHasControlOverProps &&
              !isEqual(
                prevHOCEDProps?.[currentKeyCheck],
                currentHOCEDProps?.[currentKeyCheck],
              )
            ) {
              keysToDelete.push(currentKeyCheck);
            }
            return keysToDelete;
          }, []);

          // Nullify identified keys in the HOC's state
          if (keysToDeleteFromHOCState?.length) {
            this.setState(
              keysToDeleteFromHOCState.reduce((newState, currentKey) => {
                // Set the value to undefined to clear it from the state
                newState[currentKey] = undefined;
                return newState;
              }, {} as Partial<WrappedComponentProps>),
            );
          }
        } catch (err) {
          console.error(err);
        }
      }

      /**
       * Adds the postMessage event listener when the component mounts (in development environments).
       */
      componentDidMount(): void {
        window?.addEventListener('message', this.handlePostMessages);
      }

      /**
       * Removes the postMessage event listener when the component unmounts.
       */
      componentWillUnmount(): void {
        window?.removeEventListener('message', this.handlePostMessages);
      }

      /**
       * Renders the wrapped component with its props.
       *
       * @returns {React.ReactNode} - The rendered component.
       */
      render(): React.ReactNode {
        return (
          <WrappedComponent
            {...this.props}
            {...omitUndefinedValues(this.state)}
          />
        );
      }
    }

    return WithPostMessageToUpdateProps;
  };
}

export default withPostMessageToUpdateProps;
