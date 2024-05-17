import React from 'react';
import { compose } from 'recompose';
import type { EstablishmentListGroupByAddress as EstablishmentListGroupByAddressType } from '../types';

import EstablishmentGroupByAddressItem from './EstablishmentGroupByAddressItem.component';

type OwnProps = {
  establishmentGroupByAddress: EstablishmentListGroupByAddressType;
  onClickEdit?: () => void;
  onClickDelete?: () => void;
  onClick?: () => void;
};
type Props = OwnProps;
export const EstablishmentListGroupByAddress = (props: Props) => {
  const { establishmentGroupByAddress } = props;
  return (
    <>
      {establishmentGroupByAddress.map((estaGroup) => (
        <>
          <EstablishmentGroupByAddressItem
            // @ts-expect-error
            establishmentGroup={estaGroup}
            onClick={props.onClick}
            onClickDelete={props.onClickDelete}
            onClickEdit={props.onClickEdit}
          />
        </>
      ))}
    </>
  );
};
export default compose<any, OwnProps>()(EstablishmentListGroupByAddress);
