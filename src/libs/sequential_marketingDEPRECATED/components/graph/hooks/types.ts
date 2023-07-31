import { Node as FlowNode } from 'react-flow-renderer';
import { CustomNodesEnum } from './useNodes.hooks';
import type {
  CadenceStep,
  StepConnectedTriggerConfig,
} from '#libs/sequential_marketingDEPRECATED/types';
/* 
Overidding some types coming from react-flow libs to ensure stronger typing
*/

export interface CustomNode<NodeType = CustomNodesEnum, Data = any>
  extends Omit<FlowNode<Data>, 'type'> {
  type?: NodeType;
}

export type StoredStep = Omit<
  CadenceStep<number, number, StepConnectedTriggerConfig<number>>,
  'exits'
>;

export type StoredTrigger = {
  step: CadenceStep;
  trigger: StepConnectedTriggerConfig;
};
