import { Node as FlowNode } from 'react-flow-renderer';
import { CustomNodesEnum } from './useNodes.hooks';
import type {
  CadenceStep,
  ConnectedTrigger,
} from '#libs/sequential_marketing/types';
// import { ConnectedTriggerNodeProps } from '#libs/sequential_marketing/components/graph/nodes/ConnectedTriggerNodeElement.component';
import { StepNodeElementProps } from '#libs/sequential_marketing/components/graph/nodes/StepNodeElement.component';
import { FlowVersionProps } from '#libs/sequential_marketing/components/graph/nodes/ConnectedTriggerNodeElementFlowVersion.component';
/* 
Overidding some types coming from react-flow libs to ensure stronger typing
*/

export interface OverridenCustomNode<T = CustomNodesEnum, Data = unknown>
  extends Omit<FlowNode<Data>, 'type'> {
  type?: T;
}

export type CustomNodeEntryStep = OverridenCustomNode<
  CustomNodesEnum.EntryStepNodeElementFlowVersionNode,
  StepNodeElementProps
>;

export type CustomNodeStep = OverridenCustomNode<
  CustomNodesEnum.StepNodeElementFlowVersionNode,
  StepNodeElementProps
>;

export type CustomNodeExit = OverridenCustomNode<
  CustomNodesEnum.ExitStepNodeElementFlowVersionNode,
  any
>;
export type CustomNodeTrigger = OverridenCustomNode<
  CustomNodesEnum.ConnectedTriggerNodeElementFlowVersionNode,
  FlowVersionProps
>;

export type CustomNode =
  | CustomNodeEntryStep
  | CustomNodeStep
  | CustomNodeExit
  | CustomNodeTrigger;

export type StoredStep = Omit<CadenceStep, 'exits'>;

export type StoredTrigger = {
  step: StoredStep;
  trigger: ConnectedTrigger;
};
