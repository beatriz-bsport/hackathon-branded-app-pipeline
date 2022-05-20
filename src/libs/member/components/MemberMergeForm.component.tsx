import React from 'react';
import moment from 'moment-timezone';

import LinearProgress from '@material-ui/core/LinearProgress';
import makeStyles from '@material-ui/core/styles/makeStyles';
import SwapHorizIcon from '@material-ui/icons/SwapHoriz';
import Button from '@material-ui/core/Button';
import { Theme } from '@material-ui/core/styles';

import { OptionCallback } from '../../../state/types';
import { unmap } from '../../../pages/form.utils';
import { MemberMap } from '../utils';
import type { Member } from '../types';
import MemberForm from '../MemberForm.component';

type Props = {
  dstMember?: Member;
  srcMember?: Member;
  goToMember: (id: number) => void;
  country: string;

  onSubmit: (data: any, options: OptionCallback) => void;
  switchSrcDst: () => void;

  waiver: string;
  generalTermsAndConditions: string;
};

const prepareData = (initial: Member) => {
  const initialData = {
    ...unmap(initial, MemberMap),
    date_joined: moment(initial.date_joined),
    waiver: !!initial.waiver_accepted,
  };

  if (initial.phone_number) {
    initialData.phone = initial.phone_number;
  }
  delete initialData.address;
  return initialData;
};

export const MemberMergeForm: React.FC<Props> = ({
  dstMember,
  srcMember,
  goToMember,
  country,
  onSubmit,
  switchSrcDst,
  waiver,
  generalTermsAndConditions,
}) => {
  const classes = useStyles();
  if (!srcMember || !dstMember) {
    return <LinearProgress />;
  }
  return (
    <div className={classes.container}>
      <div className={classes.field}>
        <MemberForm
          variant="merge-form"
          goToMember={() => goToMember(dstMember.id)}
          initial={prepareData(dstMember)}
          ignoreMail="true"
          onSubmit={(data: any, options: OptionCallback) =>
            onSubmit(data, options)
          }
          companyCountry={country}
          waiver={waiver}
          generalTermsAndConditions={generalTermsAndConditions}
        />
        <div className={classes.buttonContainer}>
          <Button size="large" onClick={() => switchSrcDst()}>
            <SwapHorizIcon fontSize="large" />
          </Button>
        </div>

        <MemberForm
          variant="merge-form"
          disabled
          initial={prepareData(srcMember)}
          waiver={waiver}
          companyCountry={country}
          generalTermsAndConditions={generalTermsAndConditions}
        />
      </div>
    </div>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  buttonContainer: {
    marginTop: theme.spacing(15),
  },
  field: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
    flexDirection: 'row',
  },
}));

export default MemberMergeForm;
