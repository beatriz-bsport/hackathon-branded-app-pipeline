import React from 'react';
import { DateTime } from 'luxon';
import clx from 'classnames';

import { useTranslation } from 'react-i18next';
import green from '@material-ui/core/colors/green';
import red from '@material-ui/core/colors/red';
import { makeStyles } from '@material-ui/styles';
import { Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';

import LabelOffIcon from '@material-ui/icons/LabelOff';
import BlockIcon from '@material-ui/icons/Block';
import CheckIcon from '@material-ui/icons/Check';

import { OptionCallback } from '../../../state/types';
// @ts-ignore
import PaginatedListBase from '../../../components/PaginatedListBase.component';
import type { Offer } from '#libs/offer/types';
import type { MetaActivity } from '#libs/meta-activity/types';
import type { Tag } from '#libs/tag/types';

type Props = {
  tag: Tag;
  page: number;
  count: number;
  itemPerPage: number;
  offers: Offer<number, number, MetaActivity>[];
  loading: boolean;
  onPageRequested: (page: number, page_size: number) => void;
  onClickOffer?: (activity_id: number) => void;
  unTagAll: (options?: OptionCallback) => void;
  unTagOffer: (offerId: number, options?: OptionCallback) => void;
};
const TagDetailOffers = (props: Props) => {
  const [processing, setProcessing] = React.useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = React.useState<number | null>(
    null,
  );
  const classes = useStyles();
  const { t } = useTranslation('tag');

  const handleUnTagOffer =
    (id: number, isGroup: boolean) =>
    (ev: React.MouseEvent<HTMLButtonElement>) => {
      if (isGroup) {
        setConfirmModalOpen(id);
        return;
      }

      setProcessing(true);
      ev.stopPropagation();
      props.unTagOffer(id, {
        onSuccess: () => setProcessing(false),
        onError: () => setProcessing(false),
      });
      setConfirmModalOpen(null);
    };

  const handleCloseConfirmModalOpen = () => {
    setConfirmModalOpen(null);
  };

  return (
    <div className={classes.container}>
      <div className={classes.row}>
        <Typography variant="h5">
          {t('management.offerDetail.offerWithTag')}
        </Typography>

        <Button
          color="primary"
          disabled={processing || !props.count}
          onClick={() => {
            setProcessing(true);
            props.unTagAll({
              onSuccess: () => setProcessing(false),
              onError: () => setProcessing(false),
            });
          }}
          variant="outlined"
        >
          <LabelOffIcon className={classes.leftIcon} />
          {t('management.offerDetail.removeTagFromAll')}
        </Button>
      </div>

      <Paper className={classes.listContainer}>
        <PaginatedListBase
          itemPerPage={props.itemPerPage}
          items={props.offers || []}
          listProps={{ dense: true }}
          loading={props.loading || processing}
          nbItems={props.count}
          onPageRequested={props.onPageRequested}
          page={props.page}
          renderItem={(item: Offer<number, number, MetaActivity>) => {
            return (
              <React.Fragment key={item.id}>
                <ListItem
                  dense
                  divider
                  // @ts-ignore
                  button={!!props.onClickOffer}
                  disabled={props.loading || processing}
                  onClick={
                    props.onClickOffer
                      ? () => props.onClickOffer(item.activity)
                      : null
                  }
                >
                  <div className={classes.listItemInfo}>
                    <ListItemText
                      primary={
                        <div className={classes.primaryInfo}>
                          <Typography>
                            {`${
                              item?.name_override ||
                              item?.meta_activity?.name ||
                              '-'
                            }\u00A0-\u00A0`}
                          </Typography>
                          <Typography color="secondary">
                            {`${
                              item?.date_start
                                ? DateTime.fromISO(
                                    item.date_start,
                                  ).toLocaleString()
                                : '-'
                            }\u00A0:\u00A0${
                              item?.date_start
                                ? DateTime.fromISO(item.date_start).toFormat(
                                    'HH:mm',
                                  )
                                : '-'
                            }`}
                          </Typography>
                        </div>
                      }
                      secondary={
                        <div className={classes.secondaryInfo}>
                          {item?.whitelist_tags.includes(props.tag?.id) ? (
                            <>
                              <CheckIcon
                                className={clx(
                                  classes.tagAuthorizationIcon,
                                  classes.greenIcon,
                                )}
                              />

                              <Typography>
                                {t(
                                  'management.offerDetail.detailTable.tagInWhiteList',
                                )}
                              </Typography>
                            </>
                          ) : (
                            <>
                              <BlockIcon
                                className={clx(
                                  classes.tagAuthorizationIcon,
                                  classes.redIcon,
                                )}
                              />
                              <Typography>
                                {t(
                                  'management.offerDetail.detailTable.tagInBlackList',
                                )}
                              </Typography>
                            </>
                          )}
                        </div>
                      }
                    />
                  </div>
                  <ListItemSecondaryAction>
                    <Button
                      color="primary"
                      onClick={handleUnTagOffer(item.id, !!item.group)}
                    >
                      <LabelOffIcon className={classes.leftIcon} />
                      {t('management.memberDetail.removeTag')}
                    </Button>
                  </ListItemSecondaryAction>
                </ListItem>
                {confirmModalOpen === item.id && (
                  <Dialog open onClose={handleCloseConfirmModalOpen}>
                    <DialogTitle id="alert-dialog-title">
                      {t('modal.confirm.title')}
                    </DialogTitle>
                    <DialogContent>
                      <DialogContentText id="alert-dialog-description">
                        {t('modal.confirm.text')}
                      </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                      <Button
                        color="primary"
                        onClick={handleUnTagOffer(item.id, false)}
                      >
                        {t('modal.confirm.submit')}
                      </Button>
                    </DialogActions>
                  </Dialog>
                )}
              </React.Fragment>
            );
          }}
        />
      </Paper>
      <div className={classes.divider} />
    </div>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    width: '100%',
    marginTop: theme.spacing(2),
  },
  divider: {
    height: 64,
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'space-between',
  },
  listContainer: {
    marginTop: theme.spacing(2),
  },
  listItemInfo: {
    display: 'flex',
    alignItems: 'center',
    flex: 1,
  },
  name: {
    marginLeft: theme.spacing(1),
  },
  leftIcon: {
    marginRight: theme.spacing(1),
  },
  secondaryInfo: {
    display: 'flex',
    flexDirection: 'row',
  },
  primaryInfo: {
    display: 'flex',
    flexDirection: 'row',
  },
  tagAuthorizationIcon: {
    marginRight: theme.spacing(1),
  },
  greenIcon: {
    color: green[600],
  },
  redIcon: {
    color: red[600],
  },
}));

export default TagDetailOffers;
