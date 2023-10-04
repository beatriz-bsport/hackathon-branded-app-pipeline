// @ts-nocheck
import React from 'react';

import makeStyles from '@material-ui/styles/makeStyles';
import Button from '@material-ui/core/Button';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import HourglassEmptyIcon from '@material-ui/icons/HourglassEmpty';
import AddIcon from '@material-ui/icons/Add';
import VisibilityIcon from '@material-ui/icons/Visibility';
import EuroSymbolIcon from '@material-ui/icons/EuroSymbol';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import { useTranslation } from 'react-i18next';
import { Member } from '#libs/member/types';
import { getCurrencyDisplay } from '../../libs/theme/selectors';

type Props = {
  member: Member;
  selected: boolean;
  hasBooked?: boolean;
  isFull?: boolean;
  anonimize?: boolean;
  shouldHideBookButton?: boolean;

  showMember?: () => void;
  onClickListItem?: () => void;
  onClickOption: () => void;
  onClickBill: () => void;
  onClickRegister: () => void;
};

function MemberBookingHelper(props: Props) {
  let email = '';

  const classes = useStyles();
  const { t } = useTranslation();

  if (!props.anonimize) {
    email += props.member.email
      ? props.member.email
      : t('communication:mail.missing');
  }

  return (
    <ListItem
      key={props.member?.id}
      dense
      divider
      button={!!props.onClickListItem}
      onClick={props.onClickListItem || (() => {})}
      selected={props.selected}
    >
      <ListItemText
        classes={{
          primary: classes.text,
          secondary: classes.text,
        }}
        primary={props.member.name}
        secondary={email}
      />
      <ListItemSecondaryAction>
        {props.hasBooked ? (
          <React.Fragment>
            <IconButton color="secondary" onClick={props.onClickBill}>
              {getCurrencyDisplay() === '€' ? (
                <EuroSymbolIcon />
              ) : (
                <AttachMoneyIcon />
              )}
            </IconButton>
            {!props.shouldHideBookButton && (
              <Button color="primary" onClick={props.onClickRegister}>
                <AddIcon className={classes.rightIcon} />
                {t('offer.reCreateBooking')}
              </Button>
            )}
          </React.Fragment>
        ) : (
          <React.Fragment>
            <Button
              color="primary"
              disabled={!props.isFull}
              onClick={props.onClickOption}
            >
              <HourglassEmptyIcon className={classes.rightIcon} />
              <Hidden xsDown>{t('offer.createBookingOption')}</Hidden>
            </Button>

            {!props.shouldHideBookButton && (
              <Button
                color="primary"
                onClick={props.onClickRegister}
                variant="outlined"
              >
                <AddIcon className={classes.rightIcon} />
                {t('offer.createBooking')}
              </Button>
            )}
          </React.Fragment>
        )}

        {props.showMember ? (
          <IconButton
            color="secondary"
            disabled={!props.showMember}
            onClick={props.showMember}
          >
            <VisibilityIcon />
          </IconButton>
        ) : null}
      </ListItemSecondaryAction>
    </ListItem>
  );
}

const useStyles = makeStyles((theme) => ({
  text: {
    width: 'calc(100% - 233px + 36px)',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  rightIcon: {
    marginRight: theme.spacing(1),
  },
}));

export default React.memo(MemberBookingHelper);
