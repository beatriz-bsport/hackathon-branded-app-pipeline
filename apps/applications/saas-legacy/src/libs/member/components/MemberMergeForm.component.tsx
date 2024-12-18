import React from 'react';
import { DateTime } from 'luxon';

import LinearProgress from '@material-ui/core/LinearProgress';
import makeStyles from '@material-ui/core/styles/makeStyles';
import SwapHorizIcon from '@material-ui/icons/SwapHoriz';
import Button from '@material-ui/core/Button';
import { Theme } from '@material-ui/core/styles';

import { OptionCallback } from '../../../state/types';
// @ts-expect-error
import { unmap } from '../../../pages/form.utils';
import { MemberMap } from '../utils';
import type { Member } from '../types';
// @ts-expect-error
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
    date_joined: DateTime.fromISO(initial.date_joined),
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
    // @ts-expect-error
    <div className={classes.container}>
      <div className={classes.field}>
        <MemberForm
          companyCountry={country}
          generalTermsAndConditions={generalTermsAndConditions}
          goToMember={() => goToMember(dstMember.id)}
          ignoreMail="true"
          initial={prepareData(dstMember)}
          onSubmit={(data: any, options: OptionCallback) =>
            onSubmit(data, options)
          }
          variant="merge-form"
          waiver={waiver}
        />
        <div className={classes.buttonContainer}>
          <Button onClick={() => switchSrcDst()} size="large">
            <SwapHorizIcon fontSize="large" />
          </Button>
        </div>

        <MemberForm
          disabled
          companyCountry={country}
          generalTermsAndConditions={generalTermsAndConditions}
          initial={prepareData(srcMember)}
          variant="merge-form"
          waiver={waiver}
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

export default React.memo(MemberMergeForm);
