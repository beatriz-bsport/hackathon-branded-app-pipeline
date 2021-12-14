import React from 'react';
import { compose } from 'recompose';
import { WithTranslation, withTranslation } from 'react-i18next';
import { Theme } from '@material-ui/core/styles';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Dialog from '@material-ui/core/Dialog';
import Typography from '@material-ui/core/Typography';
import { useTheme } from '@material-ui/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import type { Establishment } from '#libs/establishment/types';
import PaymentPackForm from './PaymentPackForm.component';
import type {
  PaymentPack,
  PaymentPackCategory,
  PaymentPackFormValues,
} from '../../types';
import type { SCT } from '#libs/category/types';
import type { MetaActivity } from '#libs/meta-activity/types';
import type { Tag, TagGroup } from '#libs/tag/types';
import type { OptionCallback } from '../../../../state/types';

type OwnProps = {
  open: boolean;
  paymentPackCategories: Array<PaymentPackCategory>;
  categoryList: Array<SCT>;
  establishmentList: Array<Establishment>;
  metaActivityList: Array<MetaActivity>;
  tagList: Array<Tag<TagGroup>>;
  onCancel: () => void;
  onCancelText?: string;
  onSubmit: (
    data: PaymentPackFormValues,
    options: OptionCallback<PaymentPack>,
  ) => void;
  initial?: PaymentPack;
  clearPaymentPackToEdit?: () => void;
  closeDialog?: () => void;
};
type Props = OwnProps & WithTranslation;
export const PaymentPackFormDialog = (props: Props) => {
  const {
    t,
    open,
    paymentPackCategories,
    categoryList,
    establishmentList,
    metaActivityList,
    tagList,
    onCancel,
    onCancelText,
    onSubmit,
    initial,
    clearPaymentPackToEdit,
    closeDialog,
  } = props;
  const classes = useStyles();
  const theme: Theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  return (
    <Dialog
      open={open}
      maxWidth="md"
      fullWidth
      fullScreen={fullScreen}
      scroll="body"
    >
      <div className={classes.titleContainer}>
        <Typography variant="h4">{t('addPaymentPack.paymentPack')}</Typography>
      </div>

      <PaymentPackForm
        paymentPackCategories={paymentPackCategories}
        categoryList={categoryList}
        establishmentList={establishmentList}
        metaActivityList={metaActivityList}
        tagList={tagList}
        initial={initial}
        onCancel={onCancel}
        onCancelText={onCancelText}
        onSubmit={onSubmit}
        clearPaymentPackToEdit={clearPaymentPackToEdit}
        closeDialog={closeDialog}
      />
    </Dialog>
  );
};
const useStyles = makeStyles<Theme>((theme) => ({
  titleContainer: {
    padding: theme.spacing(4),
    paddingBottom: 0,
  },
}));
export default compose<any, OwnProps>(withTranslation('paymentPack'))(
  PaymentPackFormDialog,
);
