import React from 'react';

import { compose } from 'recompose';
import { WithTranslation, withTranslation } from 'react-i18next';
import makeStyles from '@material-ui/styles/makeStyles';

import { Theme } from '@material-ui/core/styles/createTheme';
import FranchiseCompanySearchList from '#libs/franchise/components/FranchiseCompanySearchList.components';
import { CompanyWithTheme } from '#libs/company/types';
import { STEPS } from '#libs/login/utils';
import { WidgetUtils } from '#libs/widget/WidgetUtils';
import RedButton from '#components/button/RedButton.component';

export type OwnProps = {
  companies: Array<CompanyWithTheme>;
  authenticated: boolean;
  setStep?: (step: number) => void;
  disconnect: () => void;
  selectedFranchisee: number;
  goToCompanyMemberProfilePage?: (id: number, name: string) => void;

  goToSignup: (id: number) => void;
  context: string;
};

type Props = OwnProps & WithTranslation;

const FranchiseCompanyLogin = (props: Props) => {
  const { authenticated, companies, setStep, t, disconnect, context } = props;
  const classes = useStyles();

  const handleCompanySelected =
    (selectedCompany: number, name: string) => () => {
      if (props.authenticated) {
        props.goToCompanyMemberProfilePage(selectedCompany, name);
      } else {
        props.goToSignup(selectedCompany);
      }
    };

  return (
    <div className={classes.container}>
      <FranchiseCompanySearchList
        // @ts-expect-error
        companies={companies}
        handleCompanySelected={handleCompanySelected}
        selectedCompanyId={props.selectedFranchisee}
      />
      {context !== 'widget' && (
        <div className={classes.row}>
          <RedButton
            color="primary"
            onClick={() => {
              if (setStep) {
                setStep(STEPS.loginToFranchise);
              }
              if (authenticated) disconnect();
            }}
            variant="outlined"
          >
            {authenticated ? t('login.disconnect') : t('login.previous')}
          </RedButton>
        </div>
      )}
    </div>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    width: 408,
    [theme.breakpoints.down('xs')]: {
      width: '100%',
    },
    marginBottom: WidgetUtils.isWidget() ? theme.spacing(10) : 0,
  },
  row: {
    marginTop: theme.spacing(6),
    display: 'flex',
    justifyContent: 'center',
  },
}));

export default compose<any, OwnProps>(withTranslation(['franchise']))(
  FranchiseCompanyLogin,
);
