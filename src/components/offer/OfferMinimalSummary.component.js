// @flow
import React, { useState } from 'react';
import { pure } from 'recompose';
import classNames from 'classnames';
import { withTranslation, TFunction } from 'react-i18next';

import Grid from '@material-ui/core/Grid';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import Hidden from '@material-ui/core/Hidden';
import VideocamIcon from '@material-ui/icons/Videocam';
import withStyles from '@material-ui/core/styles/withStyles';
import LabelIcon from '@material-ui/icons/Label';
import FolderIcon from '@material-ui/icons/Folder';

import { makeStyles } from '@material-ui/styles';
import {
  formatMinutes,
  formatAsDatetime,
  formatAsTime,
} from '../../utils/datetime';

import Tooltip from '../Tooltip.component';
import EmptyListItem from '../LoadingListItem.component';
import PaymentPackTagsDialog from '../../libs/payment-packs/components/PaymentPackTagsDialog.component';
import ReplacementRequestPendingChip from '#libs/replacement-request/components/replacement-request-table/ReplacementRequestPendingChip.component';
import type { Offer } from '../../api/types';
import { DEFAULT_AVATAR } from '../../libs/associated-coach/utils';
import RollCallChip from '../../libs/offer/components/RollCallChip.component';
import OfferIconHybridIndicator from '../../libs/offer/components/OfferHybridIconIndicator.component';
import FreeOfferChip from '#libs/offer/components/FreeOfferChip.component';

import type { Theme as CompanyTheme } from '#libs/theme/types';

const styles = (theme) => ({
  relativeContainer: { position: 'relative' },
  chipContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  offerTitleText: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  videocamIcon: {
    marginRight: theme.spacing(1) / 2,
  },
  listItem: {
    width: '100%',
  },
  disabled: {
    backgroundColor: '#FFDDDD',
    '&:hover': {
      backgroundColor: '#FFC1C1',
    },
  },
  noOverflow: {
    overflow: 'hidden',
  },
  topAlign: {
    alignSelf: 'start',
  },
  noWrap: {
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
  },
  textMaxWidth: {
    maxWidth: '90%',
  },
  rollCallChip: { marginTop: theme.spacing(0.5) },
  replacementChip: { marginBottom: theme.spacing(0.5) },
});

type Props = {
  noDate: ?boolean,
  offer: Offer,
  showCoachName: ?boolean,
  selected: boolean,
  overrideClickAction: () => void,
  onModifyTags: (offer: Offer) => void,
  t: TFunction,
  loading: boolean,
  classes: Object,
  isCoach: boolean,
  showTags: boolean,
  fixedHeight?: number,
  getHasPendingReplacementRequest?: (offerId: number) => boolean,
  openRollCallDrawer: () => void,
  isRollCallMandatory: boolean,
  displayCoachInfoOnHover?: boolean,
  companyTheme: CompanyTheme,
};

const getFillingInfo = (offer: Offer) => {
  const fillingInfo = (
    <div style={{ display: 'inline-flex', alignItems: 'flex-end' }}>
      <Typography inline variant="subtitle2" color="secondary">
        {`${offer.nb_bookings} `}
      </Typography>
      <Typography color="textPrimary" variant="subtitle2">
        {`/${offer.effectif}`}
      </Typography>
      <Hidden smDown>
        <React.Fragment>
          <Typography inline color="textPrimary" variant="caption">
            &nbsp;(
          </Typography>
          <Typography inline variant="caption" color="primary">
            {offer.nb_attendant}
          </Typography>
          <Typography inline variant="caption">
            +
          </Typography>
          <Typography inline variant="caption" color="error">
            {offer.nb_non_attendant}
          </Typography>
          <Typography color="textPrimary" variant="caption">
            )
          </Typography>
        </React.Fragment>
      </Hidden>
    </div>
  );
  const fillingInfoProps = {
    color: offer.nb_bookings < offer.effectif ? 'error' : 'primary',
  };
  const formattedFillingRate = `${parseInt(
    (offer.nb_bookings / (offer.effectif || 1)) * 100,
    10,
  )}%`;

  return [fillingInfo, fillingInfoProps, formattedFillingRate];
};

const coachTooltipUseStyle = makeStyles(() => ({
  italic: { fontStyle: 'italic' },
  bold: { fontWeight: 'bold' },
}));

const CoachTooltipTitle: React.FC<{ coach?: Coach }> = (props) => {
  const { coach } = props;
  const classes = coachTooltipUseStyle();

  return (
    <React.Fragment>
      {coach && coach?.name && (
        <Typography display="block" className={classes.bold} variant="caption">
          {coach.name}
        </Typography>
      )}
      {coach && coach?.notes && (
        <Typography
          display="block"
          align="left"
          className={classes.italic}
          variant="caption"
        >
          {coach.notes}
        </Typography>
      )}
    </React.Fragment>
  );
};

export function OfferMinimalSummary(props: Props) {
  const {
    noDate,
    offer,
    showCoachName,
    overrideClickAction,
    onModifyTags,
    selected,
    t,
    classes,
    loading,
    isCoach,
    showTags,
    fixedHeight,
    getHasPendingReplacementRequest,
    displayCoachInfoOnHover,
    companyTheme,
  } = props;

  const [tagManagementDialog, setTagManagementDialog] = useState(false);

  const hasPendingReplacementRequest = getHasPendingReplacementRequest
    ? getHasPendingReplacementRequest(offer.id)
    : false;

  if (!offer || loading) {
    return <EmptyListItem key="" divider dense />;
  }

  const {
    name,
    id,
    establishment,
    establishment_override,
    duration_minute,
    coach,
    coach_override,
    available,
    date_start,
    whitelist_tags,
    blacklist_tags,
    credit_price,
    credit_price_override,
  } = offer;

  const disabledAvatarProps = {
    style: {
      opacity: '0.65',
      backgroundColor: 'rgb(0,0,0)',
    },
  };

  let formattedName = name;
  if (!available) {
    formattedName += ` - ${t('offer:disabled')}`;
  }
  const currentEstablishment =
    establishment_override || establishment || offer.etablissement;
  const dateFormatter = noDate ? formatAsTime : formatAsDatetime;
  const [fillingInfo, fillingInfoProps, formattedFillingRate] =
    getFillingInfo(offer);

  let actualCoachName = '  -  ';
  if (coach && !coach_override) {
    actualCoachName = coach.name;
  }
  if (coach_override) {
    actualCoachName = coach_override.name;
  }

  const textClasses = fixedHeight
    ? {
        primary: classes.noWrap,
        secondary: classes.noWrap,
      }
    : {};
  return (
    <>
      <PaymentPackTagsDialog
        open={tagManagementDialog}
        className={classes.noOverflow}
        whitelistTags={whitelist_tags}
        blacklistTags={blacklist_tags}
        onClose={() => setTagManagementDialog(false)}
        onModify={() => {
          setTagManagementDialog(false);
          onModifyTags();
        }}
      />
      <ListItem
        key={id}
        dense
        button={!!overrideClickAction}
        selected={selected}
        onClick={overrideClickAction}
        className={classNames(
          classes.listItem,
          available ? {} : classes.disabled,
        )}
        divider
        style={{
          borderLeft: offer.meta_activity_color ? '5px solid' : '0px',
          borderLeftColor: offer.meta_activity_color,
          height: fixedHeight,
        }}
      >
        <Grid container directon="row" alignItems="center">
          <Grid item xs={6}>
            <Grid container direction="row" alignItems="center" wrap="nowrap">
              <Hidden smDown>
                <Grid item>
                  {coach_override && isCoach ? (
                    <Tooltip
                      title={
                        displayCoachInfoOnHover ? (
                          <CoachTooltipTitle coach={coach_override} />
                        ) : (
                          ''
                        )
                      }
                    >
                      <div>
                        <Avatar
                          src={
                            coach_override
                              ? coach_override.photo || DEFAULT_AVATAR
                              : ''
                          }
                        />
                      </div>
                    </Tooltip>
                  ) : (
                    <Tooltip
                      title={
                        displayCoachInfoOnHover ? (
                          <CoachTooltipTitle coach={coach} />
                        ) : (
                          ''
                        )
                      }
                    >
                      <div>
                        <IconButton disableRipple disabled={!!coach_override}>
                          <Avatar
                            src={coach ? coach.photo || DEFAULT_AVATAR : ''}
                            imgProps={coach_override ? disabledAvatarProps : {}}
                          />
                        </IconButton>
                      </div>
                    </Tooltip>
                  )}
                </Grid>
              </Hidden>
              <Grid item style={coach_override ? { marginLeft: -30 } : {}}>
                {coach_override && !isCoach ? (
                  <Tooltip
                    title={
                      displayCoachInfoOnHover ? (
                        <CoachTooltipTitle coach={coach_override} />
                      ) : (
                        ''
                      )
                    }
                  >
                    <IconButton disableRipple>
                      <Avatar
                        src={
                          coach_override
                            ? coach_override.photo || DEFAULT_AVATAR
                            : ''
                        }
                      />
                    </IconButton>
                  </Tooltip>
                ) : null}
              </Grid>
              <Grid item xs={9}>
                <ListItemText
                  primary={
                    <div className={classes.offerTitleText}>
                      {offer.is_broadcast && !offer?.linked_hybrid_offer_id && (
                        <VideocamIcon className={classes.videocamIcon} />
                      )}
                      {offer?.linked_hybrid_offer_id && (
                        <OfferIconHybridIndicator
                          className={classes.videocamIcon}
                          iconProps={{ fontSize: 'large' }}
                        />
                      )}
                      {offer.group && (
                        <FolderIcon className={classes.videocamIcon} />
                      )}
                      <Typography
                        variant="inherit"
                        className={classNames(textClasses?.primary, {
                          [classes.textMaxWidth]: fixedHeight,
                        })}
                      >
                        {formattedName}
                      </Typography>
                      <FreeOfferChip
                        credits={credit_price}
                        creditsOverride={credit_price_override}
                        companyTheme={companyTheme}
                        size="small"
                      />
                    </div>
                  }
                  secondary={`${dateFormatter(
                    date_start,
                    offer.timezone_name,
                  )} - ${formatMinutes(duration_minute, t)}`}
                  classes={textClasses}
                />
              </Grid>
              {showTags &&
                (whitelist_tags?.length > 0 || blacklist_tags?.length > 0) && (
                  <Grid item className={classes.topAlign}>
                    <Tooltip
                      disableInteractive
                      title={t('offer:tagManagementInfo', {
                        authorized: whitelist_tags.length || 0,
                        unauthorized: blacklist_tags.length || 0,
                      })}
                      placement="bottom-start"
                    >
                      <IconButton
                        disableRipple
                        onClick={(ev) => {
                          ev.stopPropagation();
                          setTagManagementDialog(true);
                        }}
                        onMouseDown={(ev) => ev.stopPropagation()}
                      >
                        <LabelIcon color="primary" />
                      </IconButton>
                    </Tooltip>
                  </Grid>
                )}
            </Grid>
          </Grid>
          <Grid item xs={3}>
            <ListItemText
              primary={fillingInfo}
              primaryTypographyProps={fillingInfoProps}
              secondary={formattedFillingRate}
              classes={textClasses}
            />
          </Grid>
          <Grid item xs={2} className={classes.relativeContainer}>
            <ListItemText
              primary={
                showCoachName
                  ? actualCoachName
                  : (currentEstablishment || {}).title
              }
              secondary={actualCoachName}
              classes={textClasses}
            />
          </Grid>
          <Grid item xs={1} className={classes.chipContainer}>
            {hasPendingReplacementRequest && (
              <Tooltip>
                <div
                  title={t('offer:pendingReplacementRequest')}
                  className={
                    props.isRollCallMandatory && classes.replacementChip
                  }
                >
                  <ReplacementRequestPendingChip height={22} width={30} />
                </div>
              </Tooltip>
            )}
            {props.isRollCallMandatory && (
              <div
                className={hasPendingReplacementRequest && classes.rollCallChip}
              >
                <RollCallChip
                  isValidated={!offer.roll_call_needs_validation}
                  onClick={props.openRollCallDrawer}
                />
              </div>
            )}
          </Grid>
        </Grid>
      </ListItem>
    </>
  );
}

export default withTranslation(['offer', 'datetime'])(
  withStyles(styles)(pure(OfferMinimalSummary)),
);
