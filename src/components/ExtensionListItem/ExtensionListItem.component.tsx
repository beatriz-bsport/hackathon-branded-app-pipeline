import React, { useState, useCallback } from 'react';

import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import ListItem from '@material-ui/core/ListItem';
import IconButton from '@material-ui/core/IconButton';
import Collapse from '@material-ui/core/Collapse';
import Button from '@material-ui/core/Button';

import DeleteIcon from '@material-ui/icons/Delete';

import { formatAsDatetimeAdapted } from '#utils/datetime';

import type { PaymentPackMassExtension } from '#libs/payment-packs/types';
import type {
  PrivatePassMassExtension,
  PrivateConsumerPassExtension,
} from '#libs/private-service/types';
import type { ConsumerPaymentPackExtension } from '#libs/consumer-payment-pack/types';

const EXTENSION_LIST_ITEM_COLLAPSED_SIZE = 20;

type MassExtension = PaymentPackMassExtension | PrivatePassMassExtension;

type Props = {
  extension:
    | PaymentPackMassExtension
    | PrivatePassMassExtension
    | PrivateConsumerPassExtension
    | ConsumerPaymentPackExtension;
  showBottomDivider?: boolean;
  onDelete: () => void;
};

export const ExtensionListItem: React.FC<Props> = ({
  extension,
  showBottomDivider,
  onDelete,
}) => {
  const [isExtensionNoteExpanded, setIsExtensionNoteExpanded] = useState(false);
  const { t } = useTranslation(['paymentPack', 'common']);
  const classes = useStyles();

  const handleToggleExpandExtensionNote = useCallback(
    () => setIsExtensionNoteExpanded((prevState) => !prevState),
    [],
  );

  const isNoteExpandable = (extension.note ?? '').length > 50;

  return (
    <ListItem
      dense
      className={classes.itemContainer}
      divider={!!showBottomDivider}
    >
      <div className={classes.itemContent}>
        <Typography
          className={classes.nbDaysTitle}
          color="primary"
          variant="subtitle1"
        >
          {t('extension.nbDaysAdded', {
            count: extension.nb_days,
          })}
        </Typography>

        <div
          className={classNames(classes.collapseContainer, {
            [classes.flexColumn]: isExtensionNoteExpanded,
            [classes.widthFiftyChars]:
              isNoteExpandable && !isExtensionNoteExpanded,
            [classes.fullWidth]: isExtensionNoteExpanded,
          })}
        >
          {extension.note && (
            <>
              {isNoteExpandable ? (
                <Collapse
                  className={classNames({
                    [classes.collapsedNote]: !isExtensionNoteExpanded,
                  })}
                  collapsedSize={EXTENSION_LIST_ITEM_COLLAPSED_SIZE}
                  in={isExtensionNoteExpanded}
                >
                  <Typography
                    className={classes.extensionNoteOverflow}
                    variant="body2"
                  >
                    {extension.note}
                  </Typography>
                </Collapse>
              ) : (
                <Typography variant="body2">{extension.note}</Typography>
              )}
            </>
          )}
          {isNoteExpandable && (
            <Button
              classes={{
                root: classes.seeMoreButton,
                label: classes.seeMoreButtonLabel,
              }}
              onClick={handleToggleExpandExtensionNote}
              size="small"
              variant="text"
            >
              {isExtensionNoteExpanded
                ? t('common:seeLess')
                : t('common:seeMore')}
            </Button>
          )}
        </div>

        {!!(extension as MassExtension).min_ending_date &&
          !!(extension as MassExtension).max_ending_date && (
            <Typography color="textSecondary" variant="caption">
              {t('massExtension.listItemDate', {
                minDate: formatAsDatetimeAdapted(
                  (extension as MassExtension).min_ending_date,
                  'DD',
                ),
                maxDate: formatAsDatetimeAdapted(
                  (extension as MassExtension).max_ending_date,
                  'DD',
                ),
              })}
            </Typography>
          )}

        <Typography color="textSecondary" variant="caption">
          {t('extension.addedOn') +
            formatAsDatetimeAdapted(extension.date_created, 'DD t')}
        </Typography>
      </div>

      {onDelete && (
        <IconButton aria-label="close" onClick={onDelete}>
          <DeleteIcon />
        </IconButton>
      )}
    </ListItem>
  );
};

const useStyles = makeStyles((theme) => ({
  flexColumn: {
    flexDirection: 'column',
  },
  itemContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    container: 'bsExtensionListItem',
  },
  itemContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    width: 'calc(100% - 48px)',
    paddingRight: theme.spacing(1),
  },
  nbDaysTitle: {
    fontWeight: 500,
  },
  collapseContainer: {
    display: 'flex',
    alignItems: 'baseline',
    maxWidth: '70cqw',
  },
  widthFiftyChars: {
    width: '50ch',
  },
  fullWidth: {
    width: '100%',
  },
  collapsedNote: {
    whiteSpace: 'nowrap',
    flex: 1,
  },
  seeMoreButton: {
    height: 20,
  },
  seeMoreButtonLabel: {
    lineHeight: 1,
  },
  extensionNoteOverflow: {
    textOverflow: 'ellipsis',
    overflow: 'hidden',
  },
}));

export default React.memo(ExtensionListItem);
