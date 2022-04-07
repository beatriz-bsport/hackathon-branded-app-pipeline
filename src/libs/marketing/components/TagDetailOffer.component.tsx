import React from 'react';
import moment from 'moment-timezone';
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

import LabelOffIcon from '@material-ui/icons/LabelOff';
import BlockIcon from '@material-ui/icons/Block';
import CheckIcon from '@material-ui/icons/Check';

import { OptionCallback } from '../../../state/types';
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
  const classes = useStyles();
  const { t } = useTranslation('tag');
  return (
    <div className={classes.container}>
      <div className={classes.row}>
        <Typography variant="h5">
          {t('management.offerDetail.offerWithTag')}
        </Typography>

        <Button
          variant="outlined"
          color="primary"
          disabled={processing || !props.count}
          onClick={() => {
            setProcessing(true);
            props.unTagAll({
              onSuccess: () => setProcessing(false),
              onError: () => setProcessing(false),
            });
          }}
        >
          <LabelOffIcon className={classes.leftIcon} />
          {t('management.offerDetail.removeTagFromAll')}
        </Button>
      </div>

      <Paper className={classes.listContainer}>
        <PaginatedListBase
          page={props.page}
          nbItems={props.count}
          itemPerPage={props.itemPerPage}
          loading={props.loading || processing}
          onPageRequested={props.onPageRequested}
          items={props.offers || []}
          renderItem={(item: Offer<number, number, MetaActivity>) => {
            return (
              <ListItem
                divider
                key={item.id}
                dense
                disabled={props.loading || processing}
                button={!!props.onClickOffer}
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
                          {`${item?.meta_activity?.name || '-'}\u00A0-\u00A0`}
                        </Typography>
                        <Typography color="secondary">
                          {`${
                            item?.date_start
                              ? moment(item.date_start).format('L')
                              : '-'
                          }\u00A0:\u00A0${
                            item?.date_start
                              ? moment(item.date_start).format('HH:mm')
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
                    onClick={(ev) => {
                      setProcessing(true);
                      ev.stopPropagation();
                      props.unTagOffer(item.id, {
                        onSuccess: () => setProcessing(false),
                        onError: () => setProcessing(false),
                      });
                    }}
                  >
                    <LabelOffIcon className={classes.leftIcon} />
                    {t('management.memberDetail.removeTag')}
                  </Button>
                </ListItemSecondaryAction>
              </ListItem>
            );
          }}
          listProps={{ dense: true }}
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
