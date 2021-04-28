import React from 'react';
import { useTranslation } from 'react-i18next';
import Typography from '@material-ui/core/Typography';
import Accordion from '@material-ui/core/Accordion';
import Divider from '@material-ui/core/Divider';
import AlertIcon from '@material-ui/icons/Warning';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import CircularProgress from '@material-ui/core/CircularProgress';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Paper from '@material-ui/core/Paper';
import { makeStyles, Theme } from '@material-ui/core/styles';
import moment from 'moment-timezone';

import PaginatedSubscriptionList from './PaginatedSubscriptionList.component';
import { ContractPause } from '../types';
import { OptionCallback } from '../../../state/types';

type Props = {
  contractPause: ContractPause;
  fetchSubscriptionBulk: (ids: Array<number>, options: OptionCallback) => void;
  fetchMembersBySubscription: (ids: Array<number>) => void;
  goToSubscription: (number) => void;
};

const ContractPauseListDetail = (props: Props) => {
  const classes = useStyles();
  const { t } = useTranslation(['subscription']);
  const { contractPause } = props;
  const [expandedSuccess, setExpandedSuccess] = React.useState(false);
  const [expandedInvalid, setExpandedInvalid] = React.useState(false);
  const [successPage, setSuccessPage] = React.useState(1);
  const [invalidPage, setInvalidPage] = React.useState(1);
  return (
    <div>
      <div>
        <Paper className={classes.row}>
          <div className={classes.textLeft}>
            <Typography>{contractPause.name}</Typography>
            <div>
              <Typography color="textSecondary" variant="caption">
                {t('contractPause.createdAt', {
                  at: `${moment(contractPause.date_created).format('LL')}`,
                })}
              </Typography>
            </div>
            {contractPause.from_date && contractPause.until_date && (
              <Typography variant="caption">
                {t('contractPause.fromUntil', {
                  from: moment(contractPause.from_date).format('LL'),
                  until: moment(contractPause.until_date).format('LL'),
                })}
              </Typography>
            )}
          </div>
          <div className={classes.right}>
            {contractPause.processing ? (
              <CircularProgress />
            ) : (
              <Typography variant="h5">{`+${contractPause.days}`}</Typography>
            )}
          </div>
        </Paper>
        <Divider />
        {!contractPause.processing && (
          <React.Fragment>
            <Accordion
              expanded={expandedSuccess}
              onChange={() => setExpandedSuccess(!expandedSuccess)}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="caption" className={classes.heading}>
                  {t('contractPause.section.success', {
                    nb: contractPause.billing_plan_success.length,
                  })}
                </Typography>
              </AccordionSummary>
              <div
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'stretch',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                }}
              >
                <PaginatedSubscriptionList
                  items={contractPause.billing_plan_success.slice(
                    (successPage - 1) * 6,
                    successPage * 6,
                  )}
                  nbItems={contractPause.billing_plan_success.length}
                  onClick={(sub) => {
                    props.goToSubscription(sub.id);
                  }}
                  page={successPage}
                  itemPerPage={6}
                  onPageRequested={(page: number, pageSize: number) =>
                    props.fetchSubscriptionBulk(
                      contractPause.billing_plan_success_ids.slice(
                        (page - 1) * pageSize,
                        page * pageSize,
                      ),
                      {
                        onSuccess: (subs) => {
                          setSuccessPage(page);
                          props.fetchMembersBySubscription(subs);
                        },
                      },
                    )
                  }
                />
              </div>
            </Accordion>
            {!!contractPause.billing_plan_invalid.length && (
              <Accordion
                expanded={expandedInvalid}
                onChange={() => setExpandedInvalid(!expandedInvalid)}
              >
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <div className={classes.rowCenter}>
                    <AlertIcon
                      fontSize="small"
                      color="error"
                      className={classes.iconLeft}
                    />
                    <Typography variant="caption" className={classes.heading}>
                      {t('contractPause.section.error', {
                        nb: contractPause.billing_plan_invalid.length,
                      })}
                    </Typography>
                  </div>
                </AccordionSummary>
                <div
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'stretch',
                    justifyContent: 'flex-end',
                    flexDirection: 'column',
                  }}
                >
                  <PaginatedSubscriptionList
                    items={contractPause.billing_plan_invalid.slice(
                      (invalidPage - 1) * 6,
                      invalidPage * 6,
                    )}
                    nbItems={contractPause.billing_plan_invalid.length}
                    onClick={(sub) => {
                      props.goToSubscription(sub.id);
                    }}
                    page={invalidPage}
                    itemPerPage={6}
                    onPageRequested={(page: number, pageSize: number) =>
                      props.fetchSubscriptionBulk(
                        contractPause.billing_plan_invalid_ids.slice(
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
                </div>
              </Accordion>
            )}
          </React.Fragment>
        )}
      </div>
    </div>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  row: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    padding: theme.spacing(1),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
  rowCenter: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
  },
  iconLeft: {
    marginRight: theme.spacing(1),
  },
}));

export default ContractPauseListDetail;
