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
import { ReplacementRequest } from '#src/libs/replacement-request/types';
import { Coach } from '#src/libs/associated-coach/types';
import { Level } from '#src/libs/level/types';
import {
  Establishment,
  EstablishmentGroup,
} from '#src/libs/establishment/types';
import { Offer, OfferMinimal } from '#src/libs/offer/types';
import { MetaActivity } from '#src/libs/meta-activity/types';
import {
  ReplacementDisplays,
  ReplacementRequestCoachAnswerStatus,
  REPLACEMENT_DISPLAYS_OFFERS,
  REPLACEMENT_DISPLAYS_REPLACEMENT_REQUESTS,
} from '#src/libs/replacement-request/constants';
import ActivitiesToReplaceTableRow from '#src/libs/replacement-request/components/replacement-request-table/ActivitiesToReplaceTableRow.component';
import ActivitiesToReplaceTableHeader from '#src/libs/replacement-request/components/replacement-request-table/ActivitiesToReplaceTableHeader.component';
import ActivitiesPlannedTableRow from '#src/libs/replacement-request/components/replacement-request-table/ActivitiesPlannedTableRow.component';
import { replacementEmptyChipTranslationKey } from '#src/libs/replacement-request/utils';

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
  handleMarkSubstituteAsUnavailable?: (requestId: number) => void;
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
  handleMarkSubstituteAsUnavailable,
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
                    isMobile
                    coach={coach}
                    daysBeforeOfferReplacementRequestIsLate={
                      daysBeforeOfferReplacementRequestIsLate
                    }
                    enableMultiLocalization={enableMultiLocalization}
                    establishmentGroups={establishmentGroups}
                    getHasPendingReplacementRequest={
                      getHasPendingReplacementRequest
                    }
                    getHasRefusedReplacementRequest={
                      getHasRefusedReplacementRequest
                    }
                    handleCheckboxAction={handleCheckboxAction}
                    isLastItem={index === offers.length - 1}
                    nbLateRequestsLeft={nbLateRequestsLeft}
                    // @ts-expect-error
                    offer={offer}
                    replacementDisplay={replacementDisplay}
                    selectedOffers={selectedOffers}
                    setMobileReasonActionDisabled={
                      setMobileReasonActionDisabled
                    }
                    timezoneName={timezoneName}
                  />
                ))
              : replacementRequestList.map((replacementRequest, index) => (
                  <ActivitiesToReplaceTableRow
                    key={replacementRequest.id}
                    isMobile
                    coach={coach || null}
                    daysBeforeOfferReplacementRequestIsLate={
                      daysBeforeOfferReplacementRequestIsLate
                    }
                    enableMultiLocalization={enableMultiLocalization}
                    establishmentGroups={establishmentGroups}
                    handleCoachAnswer={handleCoachAnswer}
                    handleDeleteAction={handleDeleteAction}
                    handleExtensionAction={handleExtensionAction}
                    handleMarkSubstituteAsUnavailable={
                      handleMarkSubstituteAsUnavailable
                    }
                    handleRefuseAction={handleRefuseAction}
                    handleReplaceAction={handleReplaceAction}
                    isLastItem={index === replacementRequestList.length - 1}
                    nbLateRequestsLeft={nbLateRequestsLeft}
                    replacementDisplay={replacementDisplay}
                    replacementRequest={replacementRequest}
                    timezoneName={timezoneName}
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
              classes={{
                root: classes.emptyChipLabel,
                label: classes.emptyChipLabel,
              }}
              icon={<EventBusy />}
              label={t(replacementEmptyChipTranslationKey(replacementDisplay))}
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
                    coach={coach}
                    daysBeforeOfferReplacementRequestIsLate={
                      daysBeforeOfferReplacementRequestIsLate
                    }
                    enableMultiLocalization={enableMultiLocalization}
                    establishmentGroups={establishmentGroups}
                    getHasPendingReplacementRequest={
                      getHasPendingReplacementRequest
                    }
                    getHasRefusedReplacementRequest={
                      getHasRefusedReplacementRequest
                    }
                    handleCheckboxAction={handleCheckboxAction}
                    nbLateRequestsLeft={nbLateRequestsLeft}
                    // @ts-expect-error
                    offer={offer}
                    replacementDisplay={replacementDisplay}
                    selectedOffers={selectedOffers}
                    timezoneName={timezoneName}
                  />
                ))
              : replacementRequestList.map((replacementRequest) => (
                  // @ts-expect-error
                  <ActivitiesToReplaceTableRow
                    key={replacementRequest.id}
                    coach={coach || null}
                    daysBeforeOfferReplacementRequestIsLate={
                      daysBeforeOfferReplacementRequestIsLate
                    }
                    enableMultiLocalization={enableMultiLocalization}
                    establishmentGroups={establishmentGroups}
                    handleCoachAnswer={handleCoachAnswer}
                    handleDeleteAction={handleDeleteAction}
                    handleExtensionAction={handleExtensionAction}
                    handleMarkSubstituteAsUnavailable={
                      handleMarkSubstituteAsUnavailable
                    }
                    handleRefuseAction={handleRefuseAction}
                    handleReplaceAction={handleReplaceAction}
                    nbLateRequestsLeft={nbLateRequestsLeft}
                    replacementDisplay={replacementDisplay}
                    replacementRequest={replacementRequest}
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
