import { Node as FlowNode } from 'react-flow-renderer';
import { CustomNodesEnum } from './useNodes.hooks';
import type {
  CadenceStep,
  ConnectedTrigger,
} from '#libs/sequential_marketing/types';
import { InnerStepCardProps } from '../nodes/steps/InnerStepCard.component';
import { EntryStepCardProps } from '../nodes/steps/EntryStepCard.component';
import { TriggerCardProps } from '../nodes/triggers/TriggerCard.component';
import { CadenceExitCardProps } from '../nodes/exits/CadenceExitCard.component';
/* 
Overidding some types coming from react-flow libs to ensure stronger typing
*/

export interface OverridenCustomNode<T = CustomNodesEnum, Data = unknown>
  extends Omit<FlowNode<Data>, 'type'> {
  type?: T;
}

export type CustomNodeEntryStep = OverridenCustomNode<
  CustomNodesEnum.EntryStepFlowVersionNode,
  EntryStepCardProps
>;

export type CustomNodeStep = OverridenCustomNode<
  CustomNodesEnum.InnerStepFlowVersionNode,
  InnerStepCardProps
>;

export type CustomNodeExit = OverridenCustomNode<
  CustomNodesEnum.ExitCardFlowVersionNode,
  CadenceExitCardProps
>;
export type CustomNodeTrigger = OverridenCustomNode<
  CustomNodesEnum.TriggerCardFlowVersionNode,
  TriggerCardProps
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
