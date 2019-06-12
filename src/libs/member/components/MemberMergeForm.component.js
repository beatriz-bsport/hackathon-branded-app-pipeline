// @flow
import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import LinearProgress from '@material-ui/core/LinearProgress';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose } from 'recompose';
import moment from 'moment';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import MemberForm from '../MemberForm.component';

import { unmap } from '../../../pages/form.utils';
import { MemberMap } from '../utils';
import type { Member } from '../types';

type Props = {
  dstMember: ?Member,
  t: TFunction,
  srcMember: ?Member,
  classes: Object,
  onCancel: () => void,
  onSubmit: (data: *, options: any) => void,
};

const prepareData = (initial) => {
  const initialData = {
    ...unmap(initial, MemberMap),
    rgpd: [],
    date_joined: moment(initial.date_joined),
  };

  if (initial.phone_number) {
    initialData.phone = initial.phone_number;
  }
  if (initial.accept_email) {
    initialData.rgpd.push('accept_email');
  }
  if (initial.accept_sms) {
    initialData.rgpd.push('accept_sms');
  }
  delete initialData.address;
  return initialData;
};

export class MemberMergeForm extends Component<Props> {
  render() {
    const { classes, srcMember, dstMember, t } = this.props;
    if (!srcMember || !dstMember) {
      return <LinearProgress />;
    }
    return (
      <div className={classes.container}>
        <div className={classes.field}>
          <Typography variant="h6" component="h2">
            {t('forms.merge.srcMember')}
          </Typography>
          <Typography variant="h6" component="h2">
            {t('forms.merge.dstMember')}
          </Typography>
        </div>
        <div className={classes.field}>
          <MemberForm
            variant="merge-form"
            disabled
            initial={prepareData(srcMember)}
          />
          <MemberForm
            variant="merge-form"
            initial={prepareData(dstMember)}
            onCancel={this.props.onCancel}
            onSubmit={(data, options) => this.props.onSubmit(data, options)}
          />
        </div>
      </div>
    );
  }
}

const styles = () => ({
  container: {},
  field: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
    flexDirection: 'row',
  },
});

export default compose(
  withStyles(styles),
  withNamespaces(['member']),
)(MemberMergeForm);
