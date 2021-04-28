import React from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import IconButton from '@material-ui/core/IconButton';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import Collapse from '@material-ui/core/Collapse';

import moment from 'moment-timezone';

import DateInput from '../../../components/input/DateInput.component';
import NumericInput from '../../../components/input/NumericInput.component';
import PaginatedSubscriptionList from './PaginatedSubscriptionList.component';

import { fetchContractPauseInfo as fetchContractPauseInfoAPI } from '../api';

import { OptionCallback } from '../../../state/types';

type Props = {
  onClose: () => void;
  subscriptionData: (any) => void;
  contractId: number;
  fetchMembersBySubscription: (ids: Array<number>) => void;
  fetchSubscriptionBulk: (ids: Array<number>, options: OptionCallback) => void;
  onSubmit: (any) => void;
};

const ContractPauseFormDialog: React.FC<Props> = (props) => {
  const classes = useStyles();
  const { t } = useTranslation(['subscription']);

  const [name, setName] = React.useState('');
  const [days, setDays] = React.useState(15);

  const [from_date, setFromDate] = React.useState(
    moment().format('YYYY-MM-DD'),
  );
  const [until_date, setUntilDate] = React.useState(
    moment().format('YYYY-MM-DD'),
  );

  const [collapse, toogleCollapse] = React.useState(true);
  const [dateFilter, toogleDateFilter] = React.useState(false);

  const [
    [billingPlanValid, billingPlanInvalid],
    setBillingPlanValidAndInvalid,
  ] = React.useState([[], []]);
  const [step, setStep] = React.useState(0);

  const [validPage, setValidPage] = React.useState(1);
  const [invalidPage, setInvalidPage] = React.useState(1);
  const [processing, setProcessing] = React.useState(false);

  const checkBillingPlan = () => {
    fetchContractPauseInfoAPI({
      contract: props.contractId,
      from_date: dateFilter ? from_date : null,
      until_date: dateFilter ? until_date : null,
    }).then((r) =>
      setBillingPlanValidAndInvalid([
        r.data.valid_for_pause,
        r.data.invalid_for_pause,
      ]),
    );
  };

  const onSubmit = (ev) => {
    ev.preventDefault();
    if (step === 0) {
      setStep(1);
      checkBillingPlan();
      return;
    }
    setProcessing(true);
    props.onSubmit(
      {
        name,
        days,
        from_date: dateFilter ? from_date : null,
        until_date: dateFilter ? until_date : null,
      },
      { onSuccess: () => setProcessing(false) },
    );
  };

  return (
    <Dialog open>
      <form onSubmit={onSubmit}>
        <DialogTitle>{t('contractPause.form.title')}</DialogTitle>
        {step === 0 && (
          <React.Fragment>
            <div className={classes.container}>
              <TextField
                value={name}
                required
                onChange={(ev) => setName(ev.target.value)}
                helperText={t('contractPause.form.name.label')}
                placeholder={t('contractPause.form.name.placeholder')}
              />
              <NumericInput
                value={days}
                required
                onChange={(ev) =>
                  setDays(Math.max(1, parseInt(ev.target.value, 10)))
                }
                label={t('contractPause.form.days.label')}
                helperText={t('contractPause.form.days.helperText')}
              />
              <div className={classes.advancedContainer}>
                <div className={classes.row}>
                  <IconButton onClick={() => toogleCollapse(!collapse)}>
                    <ExpandMoreIcon />
                  </IconButton>
                  <Typography variant="h6">
                    {t('contractPause.form.advanced')}
                  </Typography>
                </div>
                <Divider />
                <Collapse in={!collapse}>
                  <div className={classes.advancedInner}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={dateFilter}
                          onChange={() => toogleDateFilter(!dateFilter)}
                        />
                      }
                      label={t('contractPause.form.dateFilter.label')}
                    />

                    <DateInput
                      value={from_date}
                      disabled={!dateFilter}
                      onChange={(d) => setFromDate(d)}
                      label={t('contractPause.form.fromDate.label')}
                    />
                    <DateInput
                      value={until_date}
                      disabled={!dateFilter}
                      onChange={(d) => setUntilDate(d)}
                      label={t('contractPause.form.untilDate.label')}
                    />
                  </div>
                </Collapse>
              </div>
            </div>
            <DialogActions>
              <Button onClick={props.onClose}>
                {t('contractPause.actions.cancel')}
              </Button>
              <Button type="submit" color="primary">
                {t('contractPause.actions.verify')}
              </Button>
            </DialogActions>
          </React.Fragment>
        )}
        {step === 1 && (
          <React.Fragment>
            <div className={classes.container}>
              <Typography variant="h6">
                {t('contractPause.form.validBillingPlan')}
              </Typography>
            </div>
            <PaginatedSubscriptionList
              items={billingPlanValid
                .slice((validPage - 1) * 6, validPage * 6)
                .map((bp) => props.subscriptionData[bp])}
              nbItems={billingPlanValid.length}
              page={validPage}
              itemPerPage={6}
              onPageRequested={(page: number, pageSize: number) =>
                props.fetchSubscriptionBulk(
                  billingPlanValid.slice(
                    (page - 1) * pageSize,
                    page * pageSize,
                  ),
                  {
                    onSuccess: (subs) => {
                      setValidPage(page);
                      props.fetchMembersBySubscription(subs);
                    },
                  },
                )
              }
            />
            <div className={classes.container}>
              <Typography variant="h6">
                {t('contractPause.form.invalidBillingPlan')}
              </Typography>
            </div>
            <PaginatedSubscriptionList
              items={billingPlanInvalid
                .slice((invalidPage - 1) * 6, invalidPage * 6)
                .map((bp) => props.subscriptionData[bp])}
              nbItems={billingPlanInvalid.length}
              page={invalidPage}
              itemPerPage={6}
              onPageRequested={(page: number, pageSize: number) =>
                props.fetchSubscriptionBulk(
                  billingPlanInvalid.slice(
                    (page - 1) * pageSize,
                    page * pageSize,
                  ),
                  {
                    onSuccess: (subs) => {
                      setInvalidPage(page);
                      props.fetchMembersBySubscription(subs);
                    },
                  },
                )
              }
            />
            <DialogActions>
              <Button onClick={() => setStep(0)}>
                {t('contractPause.actions.previous')}
              </Button>
              <Button disabled={processing} type="submit" color="primary">
                {t('contractPause.actions.submit')}
              </Button>
            </DialogActions>
          </React.Fragment>
        )}
      </form>
    </Dialog>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
    display: 'flex',
    flexDirection: 'column',
    '&>*': {
      marginBottom: theme.spacing(1),
    },
  },
  row: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    marginRight: theme.spacing(1),
  },
  advancedContainer: {
    paddingTop: theme.spacing(2),
  },
  advancedInner: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: theme.spacing(1),
    '&>*': {
      marginTop: theme.spacing(0.5),
      marginBottom: theme.spacing(0.5),
    },
    marginLeft: theme.spacing(2),
  },
}));

export default ContractPauseFormDialog;
