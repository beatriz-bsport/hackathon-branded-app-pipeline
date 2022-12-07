import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import {
  makeStyles,
  Theme,
  LinearProgress,
  useMediaQuery,
} from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import Chip from '@material-ui/core/Chip';
import EventBusy from '@material-ui/icons/EventBusy';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';

import { useTheme } from '@material-ui/styles';
import { ReplacementRequest } from '#libs/replacement-request/types';
import { Coach } from '#libs/associated-coach/types';
import { Level } from '#libs/level/types';
import { Establishment, EstablishmentGroup } from '#libs/establishment/types';
import { Offer, OfferMinimal } from '#libs/offer/types';
import { MetaActivity } from '#libs/meta-activity/types';
import {
  ReplacementDisplays,
  ReplacementRequestCoachAnswerStatus,
  REPLACEMENT_DISPLAYS_OFFERS,
  REPLACEMENT_DISPLAYS_REPLACEMENT_REQUESTS,
} from '#libs/replacement-request/constants';
import ActivitiesToReplaceTableRow from '#libs/replacement-request/components/replacement-request-table/ActivitiesToReplaceTableRow.component';
import ActivitiesToReplaceTableHeader from '#libs/replacement-request/components/replacement-request-table/ActivitiesToReplaceTableHeader.component';
import ActivitiesPlannedTableRow from '#libs/replacement-request/components/replacement-request-table/ActivitiesPlannedTableRow.component';
import { replacementEmptyChipTranslationKey } from '#libs/replacement-request/utils';

type Props = {
  timezoneName: string;
  nbLateRequestsLeft?: number;
  daysBeforeOfferReplacementRequestIsLate?: number;
  isLoading: boolean;
  offers?:
    | Offer<Coach, Establishment, MetaActivity, number, number, number, Level>[]
    | OfferMinimal<Coach, Establishment, MetaActivity, Level>[];
  replacementRequestList?: ReplacementRequest<
    Coach,
    Establishment,
    MetaActivity,
    number,
    number,
    number,
    Level
  >[];
  coach?: Coach;
  enableMultiLocalization: boolean;
  establishmentGroups: EstablishmentGroup[];
  replacementDisplay: ReplacementDisplays;
  handleCheckboxAction?: (offer: Offer) => void;
  selectedOffers?: number[];
  handleDeleteAction?: (replacementRequestId: number) => void;
  getHasPendingReplacementRequest?: (offerId: number) => boolean;
  getHasRefusedReplacementRequest?: (offerId: number) => boolean;
  handleCoachAnswer?: (
    status: ReplacementRequestCoachAnswerStatus,
    replacementRequestId: number,
  ) => void;
  handleExtensionAction?: (
    replacementRequest: ReplacementRequest<
      Coach,
      Establishment,
      MetaActivity,
      number,
      number,
      number,
      Level
    >,
  ) => void;
  handleReplaceAction?: (
    replacementRequest: ReplacementRequest<
      Coach,
      Establishment,
      MetaActivity,
      number,
      number,
      number,
      Level
    >,
  ) => void;
  handleRefuseAction?: (
    replacementRequest: ReplacementRequest<
      Coach,
      Establishment,
      MetaActivity,
      number,
      number,
      number,
      Level
    >,
  ) => void;
};

export const ActivitiesToReplaceTable: React.FC<Props> = ({
  offers,
  replacementRequestList,
  coach,
  enableMultiLocalization,
  establishmentGroups,
  replacementDisplay,
  handleCheckboxAction,
  handleDeleteAction,
  handleCoachAnswer,
  handleExtensionAction,
  handleReplaceAction,
  selectedOffers,
  handleRefuseAction,
  isLoading,
  nbLateRequestsLeft,
  daysBeforeOfferReplacementRequestIsLate,
  timezoneName,
  getHasPendingReplacementRequest,
  getHasRefusedReplacementRequest,
}) => {
  const classes = useStyles();

  const { t } = useTranslation('replacement');
  const theme: Theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [mobileReasonActionDisabled, setMobileReasonActionDisabled] =
    useState(null);

  const closeReasonActionDisabledDialog = useCallback(
    () => setMobileReasonActionDisabled(null),
    [],
  );

  if (isLoading) {
    return (
      <>
        {isMobile ? (
          <LinearProgress />
        ) : (
          <>
            <Table>
              <ActivitiesToReplaceTableHeader
                enableMultiLocalization={enableMultiLocalization}
                replacementDisplay={replacementDisplay}
              />
            </Table>
            <LinearProgress />
          </>
        )}
      </>
    );
  }

  // This is ugly, but mobile does not use Table
  if (isMobile) {
    return (
      <div>
        {((REPLACEMENT_DISPLAYS_OFFERS.includes(replacementDisplay) &&
          offers.length > 0) ||
          (REPLACEMENT_DISPLAYS_REPLACEMENT_REQUESTS.includes(
            replacementDisplay,
          ) &&
            replacementRequestList.length > 0)) && (
          <div>
            {REPLACEMENT_DISPLAYS_OFFERS.includes(replacementDisplay)
              ? offers.map((offer, index) => (
                  <ActivitiesPlannedTableRow
                    key={offer.id}
                    offer={offer}
                    coach={coach}
                    selectedOffers={selectedOffers}
                    enableMultiLocalization={enableMultiLocalization}
                    establishmentGroups={establishmentGroups}
                    handleCheckboxAction={handleCheckboxAction}
                    replacementDisplay={replacementDisplay}
                    nbLateRequestsLeft={nbLateRequestsLeft}
                    daysBeforeOfferReplacementRequestIsLate={
                      daysBeforeOfferReplacementRequestIsLate
                    }
                    timezoneName={timezoneName}
                    setMobileReasonActionDisabled={
                      setMobileReasonActionDisabled
                    }
                    getHasPendingReplacementRequest={
                      getHasPendingReplacementRequest
                    }
                    getHasRefusedReplacementRequest={
                      getHasRefusedReplacementRequest
                    }
                    isLastItem={index === offers.length - 1}
                    isMobile
                  />
                ))
              : replacementRequestList.map((replacementRequest, index) => (
                  <ActivitiesToReplaceTableRow
                    key={replacementRequest.id}
                    replacementRequest={replacementRequest}
                    enableMultiLocalization={enableMultiLocalization}
                    establishmentGroups={establishmentGroups}
                    replacementDisplay={replacementDisplay}
                    handleDeleteAction={handleDeleteAction}
                    handleCoachAnswer={handleCoachAnswer}
                    handleExtensionAction={handleExtensionAction}
                    handleReplaceAction={handleReplaceAction}
                    handleRefuseAction={handleRefuseAction}
                    coach={coach || null}
                    timezoneName={timezoneName}
                    isLastItem={index === replacementRequestList.length - 1}
                    isMobile
                  />
                ))}
          </div>
        )}

        {((REPLACEMENT_DISPLAYS_OFFERS.includes(replacementDisplay) &&
          offers.length === 0) ||
          (REPLACEMENT_DISPLAYS_REPLACEMENT_REQUESTS.includes(
            replacementDisplay,
          ) &&
            replacementRequestList.length === 0)) && (
          <div className={classes.noListItem}>
            <Chip
              icon={<EventBusy />}
              label={t(replacementEmptyChipTranslationKey(replacementDisplay))}
              classes={{
                root: classes.emptyChipLabel,
                label: classes.emptyChipLabel,
              }}
            />
          </div>
        )}
        {!!mobileReasonActionDisabled && (
          <Dialog open>
            <DialogContent>
              <Typography>
                {t(`unavailableReplacement.${mobileReasonActionDisabled}`)}
              </Typography>
            </DialogContent>
            <DialogActions>
              <div className={classes.center}>
                <Button
                  className={classes.textSecondary}
                  onClick={closeReasonActionDisabledDialog}
                >
                  {t('askForReplacement.close')}
                </Button>
              </div>
            </DialogActions>
          </Dialog>
        )}
      </div>
    );
  }

  return (
    <>
      <Table>
        <ActivitiesToReplaceTableHeader
          enableMultiLocalization={enableMultiLocalization}
          replacementDisplay={replacementDisplay}
        />
        {((REPLACEMENT_DISPLAYS_OFFERS.includes(replacementDisplay) &&
          offers.length > 0) ||
          (REPLACEMENT_DISPLAYS_REPLACEMENT_REQUESTS.includes(
            replacementDisplay,
          ) &&
            replacementRequestList.length > 0)) && (
          <TableBody>
            {REPLACEMENT_DISPLAYS_OFFERS.includes(replacementDisplay)
              ? offers.map((offer) => (
                  <ActivitiesPlannedTableRow
                    key={offer.id}
                    offer={offer}
                    coach={coach}
                    selectedOffers={selectedOffers}
                    enableMultiLocalization={enableMultiLocalization}
                    establishmentGroups={establishmentGroups}
                    handleCheckboxAction={handleCheckboxAction}
                    replacementDisplay={replacementDisplay}
                    nbLateRequestsLeft={nbLateRequestsLeft}
                    daysBeforeOfferReplacementRequestIsLate={
                      daysBeforeOfferReplacementRequestIsLate
                    }
                    timezoneName={timezoneName}
                    getHasPendingReplacementRequest={
                      getHasPendingReplacementRequest
                    }
                    getHasRefusedReplacementRequest={
                      getHasRefusedReplacementRequest
                    }
                  />
                ))
              : replacementRequestList.map((replacementRequest) => (
                  <ActivitiesToReplaceTableRow
                    key={replacementRequest.id}
                    replacementRequest={replacementRequest}
                    enableMultiLocalization={enableMultiLocalization}
                    establishmentGroups={establishmentGroups}
                    replacementDisplay={replacementDisplay}
                    handleDeleteAction={handleDeleteAction}
                    handleCoachAnswer={handleCoachAnswer}
                    handleExtensionAction={handleExtensionAction}
                    handleReplaceAction={handleReplaceAction}
                    handleRefuseAction={handleRefuseAction}
                    coach={coach || null}
                    timezoneName={timezoneName}
                  />
                ))}
          </TableBody>
        )}
      </Table>
      {((REPLACEMENT_DISPLAYS_OFFERS.includes(replacementDisplay) &&
        offers.length === 0) ||
        (REPLACEMENT_DISPLAYS_REPLACEMENT_REQUESTS.includes(
          replacementDisplay,
        ) &&
          replacementRequestList.length === 0)) && (
        <div className={classes.noListItem}>
          <Chip
            icon={<EventBusy />}
            label={t(replacementEmptyChipTranslationKey(replacementDisplay))}
          />
        </div>
      )}
    </>
  );
};

const useStyles = makeStyles((theme) => ({
  emptyChipLabel: { whiteSpace: 'unset', textOverflow: 'unset' },
  noListItem: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
      height: theme.spacing(5),
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
    },
  },
  center: {
    display: 'flex',
    justifyContent: 'center',
  },
  textSecondary: { color: theme.palette.text.secondary },
}));

export default ActivitiesToReplaceTable;
