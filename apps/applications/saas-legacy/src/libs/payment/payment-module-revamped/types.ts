import { RequestClientSecretPayload } from '#src/libs/invoice/types';
import { ErrorAndLoading } from '#src/libs/types';
import { PaymentMethod } from '#src/libs/payment/types';

export type PaymentModuleState = {
  applyBalanceToInvoice: {
    [invoiceUuid: string]: { balance: string } & ErrorAndLoading;
  };
  invoiceClientSecret: {
    [invoiceUuid: string]: RequestClientSecretPayload & ErrorAndLoading;
  };
  basketClientSecret: {
    [basketId: string]: RequestClientSecretPayload & ErrorAndLoading;
  };
  paymentMethodList: {
    [memberId: number]: {
      paymentMethods: Array<PaymentMethod>;
    } & { hasFetchSucceeded: boolean } & ErrorAndLoading;
  };
  paymentGroupStatus: {
    [paymentGroupId: number]: { succeeded: boolean; processing: boolean };
  };
  backendStatusAfterPayment: {
    [paymentGroupId: number]: { processing: boolean };
  };
  detachPaymentMethod: {
    [memberId: number]: {
      alternativePaymentMethod: string | null;
    } & ErrorAndLoading;
  };
  updateIntentStatus: {
    [paymentGroupId: number]: ErrorAndLoading;
  };
};

export enum PaymentRequesterRole {
  MANAGER = 'manager',
  MEMBER = 'member',
}

export type PayerContext =
  | {
      asRole: PaymentRequesterRole.MEMBER;
      memberId: number;
    }
  | {
      asRole: PaymentRequesterRole.MANAGER;
      managerId: number;
      memberId: number;
    };
