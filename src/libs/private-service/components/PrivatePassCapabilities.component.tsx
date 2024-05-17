import React, { useCallback, useState } from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Divider from '@material-ui/core/Divider';
import { compose } from 'recompose';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import RefreshIcon from '@material-ui/icons/Refresh';
import { WithTranslation, useTranslation } from 'react-i18next';
import Paper from '@material-ui/core/Paper';
import Collapse from '@material-ui/core/Collapse';
import ButtonBase from '@material-ui/core/ButtonBase';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Box from '@material-ui/core/Box';
import Skeleton from '@material-ui/lab/Skeleton';
import PrivatePassBookerListItem from './booking-module/PrivatePassBookerListItem.component';
import PrivateConsumerPassBookerListItem from './booking-module/PrivateConsumerPassBookerListItem.component';
import type {
  PrivatePass,
  PrivateConsumerPass,
} from '#libs/private-service/types';
import { OptionCallback } from '../../../state/types';
import { MaterialStyleType } from '../../../utils/types';
import UnPrivateConsumerPassBookerListItem from '#libs/private-service/components/booking-module/UnpaidPrivateConsumerPassBookerListItem.component';
import ObjectLevelPermissionWrapper from '#libs/role/permission-utils/ObjectLevelPermissionWrapper.component';

type OwnProps = {
  registerPrivateBooking: (
    privateConsumerPassId: number,
    options: OptionCallback,
  ) => void;

  billMemberPrivatePass: (privatePassId: number) => void;
  fetchPass: () => void;
  compatiblePrivatePass: Array<PrivatePass>;
  compatiblePrivateConsumerPass: Array<PrivateConsumerPass>;
  nonCompatiblePrivateConsumerPass: Array<PrivateConsumerPass>;
  recurrenceRule?: boolean;
  createRecurrentRule?: (options?: OptionCallback) => void;
  registerUnPaidPrivateBooking: (options?: OptionCallback) => void;
  compatibleWithUnpaidBooking: boolean;
  privateSlotCredit?: number | null;
  privateSlot: number;
  fetchNonCompatiblePrivateConsumerPass: () => void;
  nonCompatiblePrivateConsumerPassIsLoading: boolean;
  fetchIncompatibilitiesReasonsBySlotByConsumerPass: (
    private_consumer_pass_id: number,
    offer_id: number,
    options: OptionCallback,
  ) => void;
  incompatibilitiesReasons: { [consumer_private_pass_id: number]: number[] };
  goToPrivatePass: (private_consumer_pass_id: number) => void;
};

type Props = OwnProps &
  WithTranslation &
  MaterialStyleType<ReturnType<typeof useStyles>>;

export const PrivatePassCapabilities = (props: Props) => {
  const classes = useStyles();
  const { t } = useTranslation('privateService');
  const [needRefresh, setNeedRefresh] = React.useState<boolean>(false);
  const [
    openNonCompatiblePrivateConsumerPass,
    setOpenNonCompatiblePrivateConsumerPass,
  ] = useState(false);
  const [
    nonCompatiblePrivateConsumerPassHaveBeenFetched,
    setNonCompatiblePrivateConsumerPassHaveBeenFetched,
  ] = useState(false);

  const handleSwitchCollapse = useCallback(() => {
    if (!nonCompatiblePrivateConsumerPassHaveBeenFetched) {
      props.fetchNonCompatiblePrivateConsumerPass();
      setNonCompatiblePrivateConsumerPassHaveBeenFetched(true);
    }
    setOpenNonCompatiblePrivateConsumerPass(
      !openNonCompatiblePrivateConsumerPass,
    );
  }, [
    nonCompatiblePrivateConsumerPassHaveBeenFetched,
    openNonCompatiblePrivateConsumerPass,
    props,
  ]);

  const handleGoToPrivatePass = (privatePassId: number) => () =>
    props.goToPrivatePass(privatePassId);

  return (
    <div>
      <Typography className={classes.sectionTitle} variant="h5">
        {t('privateBooking.managerAdd.compatiblePrivateConsumerPass')}
      </Typography>
      <Divider className={classes.divider} />
      {needRefresh ? (
        <div className={classes.refreshButtonContainer}>
          <Button
            color="primary"
            onClick={() => {
              props.fetchPass();
              setNeedRefresh(false);
            }}
            variant="contained"
          >
            <RefreshIcon className={classes.leftIcon} />
            {t('privateBooking.managerAdd.privateConsumerPassNeedRefresh')}
          </Button>
        </div>
      ) : (
        <List disablePadding>
          <Paper>
            {props.compatibleWithUnpaidBooking &&
              props.registerUnPaidPrivateBooking && (
                <UnPrivateConsumerPassBookerListItem
                  key="unpaid_booking_pass"
                  divider
                  onBook={() => {
                    props.recurrenceRule
                      ? // @ts-expect-error
                        props.createRecurrentRule(null, true)
                      : props.registerUnPaidPrivateBooking();
                  }}
                  privateSlotCredit={props.privateSlotCredit}
                />
              )}

            {props.compatiblePrivateConsumerPass.length
              ? props.compatiblePrivateConsumerPass.map(
                  (pcp: PrivateConsumerPass) => (
                    <PrivateConsumerPassBookerListItem
                      key={pcp.id}
                      divider
                      onBook={(options: OptionCallback) =>
                        props.recurrenceRule
                          ? props.createRecurrentRule(options)
                          : props.registerPrivateBooking(pcp.id, options)
                      }
                      // @ts-expect-error
                      private_consumer_pass={pcp}
                    />
                  ),
                )
              : null}
          </Paper>
        </List>
      )}
      <div className={classes.nonCompatibleSection}>
        <ButtonBase
          className={classes.nonCompatibleCollapsable}
          onClick={() => handleSwitchCollapse()}
        >
          <Typography className={classes.textAlign} variant="h5">
            {t('privateBooking.managerAdd.nonCompatiblePrivateConsumerPass')}
          </Typography>
          {openNonCompatiblePrivateConsumerPass ? (
            <ExpandLessIcon />
          ) : (
            <ExpandMoreIcon />
          )}
        </ButtonBase>
        <Collapse in={openNonCompatiblePrivateConsumerPass}>
          <div>
            {props.nonCompatiblePrivateConsumerPassIsLoading ? (
              <>
                <div>
                  <Skeleton
                    animation="wave"
                    height={30}
                    variant="text"
                    width="40%"
                  />
                  <Box mt={2} />
                  <Skeleton
                    animation="wave"
                    height={50}
                    variant="rect"
                    width="100%"
                  />
                </div>
                <div>
                  <Skeleton
                    animation="wave"
                    height={30}
                    variant="text"
                    width="40%"
                  />
                  <Box mt={2} />
                  <Skeleton
                    animation="wave"
                    height={50}
                    variant="rect"
                    width="100%"
                  />
                </div>
              </>
            ) : (
              <>
                {props.nonCompatiblePrivateConsumerPass?.length > 0 ? (
                  <div className={classes.disabled}>
                    {props.nonCompatiblePrivateConsumerPass.map((pcp) => (
                      <PrivateConsumerPassBookerListItem
                        key={pcp.id}
                        divider
                        isNonCompatible
                        fetchIncompatibilitiesReasonsBySlotByConsumerPass={
                          props.fetchIncompatibilitiesReasonsBySlotByConsumerPass
                        }
                        goToPrivatePass={handleGoToPrivatePass(
                          pcp.private_pass?.id,
                        )}
                        incompatibilitiesReasons={
                          props.incompatibilitiesReasons
                        }
                        onBook={(options: OptionCallback) =>
                          props.recurrenceRule
                            ? props.createRecurrentRule(options)
                            : props.registerPrivateBooking(pcp.id, options)
                        }
                        // @ts-expect-error
                        private_consumer_pass={pcp}
                        privateSlotId={props.privateSlot}
                      />
                    ))}
                  </div>
                ) : (
                  <Typography color="textSecondary">
                    {t('privateBooking.managerAdd.noUncompatiblePassToDisplay')}
                  </Typography>
                )}
              </>
            )}
          </div>
        </Collapse>
      </div>
      <ObjectLevelPermissionWrapper
        forcedBehavior="hidden"
        requiredPermission="billing.allowed_actions.createInvoice"
      >
        <>
          <Typography className={classes.sectionTitle} variant="h5">
            {t('privateBooking.managerAdd.compatiblePrivatePass')}
          </Typography>
          <Divider className={classes.divider} />
          <List disablePadding>
            {props.compatiblePrivatePass.length ? (
              <Paper>
                {props.compatiblePrivatePass.map((privatePass: PrivatePass) => (
                  <PrivatePassBookerListItem
                    key={privatePass.id}
                    divider
                    onClick={() => {
                      props.billMemberPrivatePass(privatePass.id);
                      setNeedRefresh(true);
                    }}
                    private_pass={privatePass}
                  />
                ))}
              </Paper>
            ) : null}
          </List>
          {props.compatiblePrivatePass.length === 0 ? (
            <Typography color="textSecondary">
              {t('privateBooking.managerAdd.emptyPrivatePass')}
            </Typography>
          ) : null}
        </>
      </ObjectLevelPermissionWrapper>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  sectionTitle: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(1),
  },
  leftIcon: {
    marginRight: theme.spacing(1),
  },
  divider: {
    marginBottom: theme.spacing(2),
  },
  refreshButtonContainer: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabled: {
    backgroundColor: '#FFDDDD',
  },
  nonCompatibleCollapsable: {
    width: '100%',
    justifyContent: 'space-between',
    display: 'flex',
    paddingBottom: theme.spacing(1),
    borderBottom: '1px solid rgba(224, 224, 224, 1)',
  },
  nonCompatibleSection: {
    paddingTop: theme.spacing(2),
  },
  textAlign: { textAlign: 'start' },
}));

export default compose<any, OwnProps>()(PrivatePassCapabilities);
