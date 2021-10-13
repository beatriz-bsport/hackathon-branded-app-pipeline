import React, { useState } from 'react';
import { Typography } from '@material-ui/core';
import { Theme } from '@material-ui/core/styles';
import { compose } from 'recompose';
import { WithTranslation, withTranslation } from 'react-i18next';
import withStyles from '@material-ui/core/styles/withStyles';
import ButtonBase from '@material-ui/core/ButtonBase';
import PaymentPackBookableItem from './PaymentPackBookableItem.component';
import { RadioItem } from '../../../components/radio/RadioItem';
import { PaymentPackCategoryWithPacks } from '../../payment-packs/types';
import { MaterialStyleType } from '../../../utils/types';
import { SelectedPack } from '../utils';
import CollapsibleSection from '../../../components/CollapsibleSection';

type OwnProps = {
  paymentPackCategory: PaymentPackCategoryWithPacks;
  selectedPack?: SelectedPack;
  onPackChange: (selectedPack: SelectedPack) => void;
  opened: boolean;
  openPacks: (id: number) => void;
};
type Props = OwnProps &
  MaterialStyleType<ReturnType<typeof styles>> &
  WithTranslation;

export const PaymentPackCategoryBookableItem = (props: Props) => {
  const { classes, paymentPackCategory, t } = props;
  const [paymentPackMore, setPaymentPackMore] = useState(false);

  return (
    <CollapsibleSection
      title={paymentPackCategory ? `${paymentPackCategory.name}` : null}
      in={props.opened}
      onSwitch={() => props.openPacks(paymentPackCategory.id)}
    >
      {paymentPackCategory &&
      paymentPackCategory.packs &&
      paymentPackCategory.packs.length
        ? paymentPackCategory.packs
            .slice(0, paymentPackMore ? paymentPackCategory.packs.length : 3)
            .map((pack) => (
              <div key={pack.id}>
                <RadioItem
                  selected={pack.id === props.selectedPack?.paymentPack?.id}
                  onClick={() => props.onPackChange({ paymentPack: pack })}
                  renderItem={() => (
                    <PaymentPackBookableItem paymentPack={pack} />
                  )}
                />
              </div>
            ))
        : null}
      {paymentPackCategory.packs.length > 3 && !paymentPackMore && (
        <ButtonBase
          className={classes.buttonBase}
          onClick={() => setPaymentPackMore(true)}
        >
          <Typography color="primary">{t('offer.showMore')}</Typography>
        </ButtonBase>
      )}
    </CollapsibleSection>
  );
};

const styles = (theme: Theme) => ({
  category: {
    marginTop: theme.spacing(2),
  },
  titleActions: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
  },
  collapse: {
    width: '100%',
    marginRight: theme.spacing(2),
    marginLeft: theme.spacing(2),
  },
  title: {
    marginLeft: theme.spacing(0.5),
  },
  buttonBase: {
    marginLeft: theme.spacing(1.5),
  },
});
export default compose<any, OwnProps>(
  withTranslation('booking'),
  withStyles(styles),
)(PaymentPackCategoryBookableItem);
