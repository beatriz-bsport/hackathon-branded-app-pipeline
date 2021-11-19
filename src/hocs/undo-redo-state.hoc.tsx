import React from 'react';
import cloneDeep from 'lodash/cloneDeep';
import { DeepPartial } from '../utils/types';

interface State<S> {
  current: S;
  undo: S[];
  redo: S[];
}

export interface WithUndoRedo<S> {
  current: S;
  setStateWithHistory: (s: DeepPartial<S>) => void;
  setInitialState: (s: DeepPartial<S>) => void;
  undo: () => void;
  redo: () => void;
}

const withUndoRedoState = (initialState: any) => {
  return (
    WrappedComponent: React.ComponentType<WithUndoRedo<typeof initialState>>,
  ) => {
    return class extends React.PureComponent<null, State<typeof initialState>> {
      constructor(props: any) {
        super(props);

        const state =
          typeof initialState === 'function'
            ? initialState(props)
            : initialState;

        this.state = {
          current: state,
          undo: [state],
          redo: [],
        };
      }

      setInitial = (state: typeof initialState) => {
        this.setState({
          current: state,
          undo: [state],
          redo: [],
        });
      };

      setStateWithHistory = (state: typeof initialState) => {
        this.setState((prevState) => {
          return {
            current: { ...prevState.current, ...state },
            undo: [...prevState.undo, prevState.current],
            redo: [],
          };
        });
      };

      undo = () => {
        if (this.state.undo.length) {
          const undo = cloneDeep(this.state.undo);
          const last = undo.pop();
          this.setState((prevState: State<typeof initialState>) => ({
            current: last,
            undo,
            redo: [...prevState.redo, cloneDeep(prevState.current)],
          }));
        }
      };

      redo = () => {
        if (this.state.redo.length) {
          const redo = cloneDeep(this.state.redo);
          const last = redo.pop();
          this.setState((prevState: State<typeof initialState>) => ({
            current: last,
            redo,
            undo: [...prevState.undo, cloneDeep(prevState.current)],
          }));
        }
      };

      render() {
        return (
          <WrappedComponent
            {...this.props}
            current={this.state.current}
            setStateWithHistory={this.setStateWithHistory}
            setInitialState={this.setInitial}
            undo={this.undo}
            redo={this.redo}
          />
        );
      }
    };
  };
};

export default withUndoRedoState;
