// @flow
import React, { Component } from 'react';
import LinearProgress from '@material-ui/core/LinearProgress';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose } from 'recompose';
import moment from 'moment-timezone';
import SwapHorizIcon from '@material-ui/icons/SwapHoriz';
import Button from '@material-ui/core/Button';
import { unmap } from '../../../pages/form.utils';
import { MemberMap } from '../utils';
import type { Member } from '../types';
import MemberForm from '../MemberForm.component';

type Props = {
  dstMember: ?Member,
  srcMember: ?Member,
  classes: Object,
  goToMember: () => void,
  country: string,

  onSubmit: (data: *, options: any) => void,
  switchSrcDst: (src: number, dst: number) => void,
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
    const { classes, srcMember, dstMember } = this.props;
    if (!srcMember || !dstMember) {
      return <LinearProgress />;
    }
    return (
      <div className={classes.container}>
        <div className={classes.field}>
          <MemberForm
            variant="merge-form"
            goToMember={() => this.props.goToMember(this.props.dstMember.id)}
            initial={prepareData(this.props.dstMember)}
            ignoreMail="true"
            onSubmit={(data, options) => this.props.onSubmit(data, options)}
            country={this.props.country}
          />
          <div className={classes.buttonContainer}>
            <Button size="large" onClick={() => this.props.switchSrcDst()}>
              <SwapHorizIcon fontSize="large" />
            </Button>
          </div>

          <MemberForm
            variant="merge-form"
            disabled
            initial={prepareData(this.props.srcMember)}
          />
        </div>
      </div>
    );
  }
}

const styles = (theme) => ({
  buttonContainer: {
    marginTop: theme.spacing(15),
  },
  container: {},
  field: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
    flexDirection: 'row',
  },
});

export default compose(withStyles(styles))(MemberMergeForm);
