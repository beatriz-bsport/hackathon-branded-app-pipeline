import React from 'react';
import { useDispatch } from 'react-redux';

import NewsletterFormComponent from 'bsport-saas/src/libs/marketing/components/NewsletterForm.component';
import { createNewsletterMember } from 'bsport-saas/src/libs/marketing/api';
import {
  snackbarSuccess,
  snackbarError,
} from 'bsport-saas/src/libs/snackbar/actions';
import themify from 'bsport-saas/src/hocs/company-themifier.hoc';
import { CompanyTheme } from 'bsport-saas/src/libs/theme/types';
import makeStyles from '@material-ui/styles/makeStyles';

const NewsletterFormComponentStyled = themify(NewsletterFormComponent);

type Props = {
  companyId: number,
  theme: CompanyTheme,
};

export const NewsletterWidget: React.FC<Props> = ({ companyId, theme }) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const onSubmit = async (
    email: string,
    first_name: string,
    last_name: string,
  ) => {
    const res = await createNewsletterMember({
      email,
      first_name,
      last_name,
      company: companyId,
    });

    if (res.status === 200) {
      dispatch(snackbarSuccess('marketing:newsletter.messages.success'));
    } else {
      dispatch(snackbarError('marketing:newsletter.messages.error'));
    }
  };

  return (
    <div className={classes.container}>
      <NewsletterFormComponentStyled onSubmit={onSubmit} theme={theme} />
    </div>
  );
};

const useStyles = makeStyles({
  container: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default React.memo(NewsletterWidget);
