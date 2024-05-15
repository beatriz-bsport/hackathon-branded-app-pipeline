import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DateTime } from 'luxon';
import { pure } from 'recompose';

import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import Switch from '@material-ui/core/Switch';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/styles';
import { Theme } from '@material-ui/core/styles';
import ExpandIcon from '@material-ui/icons/ExpandMore';
import {
  ButtonBase,
  Checkbox,
  Collapse,
  IconButton,
  ListItem,
  ListItemText,
} from '@material-ui/core';

import RedButton from '#components/button/RedButton.component';
import { OffersGroup } from '#libs/group-offer/types';
import { OptionCallback } from '../../../state/types';
import { Offer } from '#libs/offer/types';

type Props = {
  open: boolean;
  group: OffersGroup;
  similarLoading: boolean;
  onCancel: () => void;
  processing?: boolean;
  onSubmit: (data: { notify: boolean; similarIds: number[] }) => void;
  fetchSimilar: (id: number, options: OptionCallback<OffersGroup[]>) => void;
  fetchOfferBulk: (ids: number[]) => void;
  getOffersListByGroup: (id: number) => Offer[];
  similars: Array<OffersGroup>;
};

export const GroupedOfferDelete: React.FC<Props> = ({
  open,
  group,
  processing,
  similarLoading,
  similars = [],
  onCancel,
  onSubmit,
  fetchOfferBulk,
  fetchSimilar,
  getOffersListByGroup,
}) => {
  const { t } = useTranslation();
  const classes = useStyles();

  useEffect(() => {
    fetchSimilar(group.id, {
      onSuccess: (data) => {
        fetchOfferBulk(data.flatMap((g) => g.offers));
      },
    });
  }, [fetchSimilar, fetchOfferBulk, group]);

  const [notify, setNotify] = useState(false);
  const [openSimilar, setOpenSimilar] = useState(false);
  const [similarIds, setSimilarIds] = useState<number[]>([]);
  const [isExpanded, setIsExpanded] = useState(true);

  const handleChangeSelection = (id: number) => () => {
    const indexOf = similarIds.indexOf(id);
    if (indexOf === -1) {
      setSimilarIds([...similarIds, id]);
      return;
    }
    setSimilarIds([
      ...similarIds.splice(0, indexOf),
      ...similarIds.splice(indexOf + 1),
    ]);
  };

  const selectAll = () => {
    setSimilarIds(similars.map((s) => s.id));
  };

  const unselectAll = () => {
    setSimilarIds([group.id]);
  };

  const onNotifySwitch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNotify(event.target.checked);
  };

  const onSimilarSwitch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setOpenSimilar(event.target.checked);
    setSimilarIds(similars.map((s) => s.id));
  };

  const onConfirm = () => {
    return onSubmit({
      notify,
      similarIds: openSimilar ? similarIds : [],
    });
  };

  const handleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const firstOfferInGroup = getOffersListByGroup(group.id)?.[0];

  return (
    <Dialog classes={{ paper: classes.dialog }} onClose={onCancel} open={open}>
      <DialogTitle>
        {t('metaActivity:groupedOption.modal.form.delete.title')}
      </DialogTitle>
      <div>
        <Typography className={classes.explainNotify}>
          {t('metaActivity:groupedOption.modal.form.delete.content')}
        </Typography>
        <div className={classes.row}>
          <Switch
            checked={notify}
            disabled={processing}
            onChange={onNotifySwitch}
          />
          <Typography className={classes.explainNotify}>
            {t('form.offer.delete.explainNotify')}
          </Typography>
        </div>
      </div>
      {group.recurrence_id && (
        <div className={classes.row}>
          <Switch checked={openSimilar} onChange={onSimilarSwitch} />
          <Typography className={classes.explainNotify}>
            {t('metaActivity:groupedOption.modal.form.delete.selectGroup')}
          </Typography>
        </div>
      )}
      {openSimilar && (
        <>
          <div className={classes.row}>
            <Typography>
              {t('metaActivity:groupedOption.modal.form.delete.selectHeader')}
            </Typography>

            <IconButton onClick={handleExpand}>
              <ExpandIcon />
            </IconButton>
          </div>
          <Collapse in={isExpanded}>
            <ButtonBase className={classes.selectOption} onClick={selectAll}>
              <Typography variant="caption">
                {t('offer:liveOfferEdit.selectAll')}
              </Typography>
            </ButtonBase>
            <ButtonBase className={classes.selectOption} onClick={unselectAll}>
              <Typography variant="caption">
                {t('offer:liveOfferEdit.unselectAll')}
              </Typography>
            </ButtonBase>
            {similarLoading && <CircularProgress />}
            {!similarLoading && (
              <>
                {similars.length === 0 ? (
                  <div className={classes.noSimilarOfferMessage}>
                    <Typography>
                      {t('offer:liveOfferEdit.noSimilarOffer')}
                    </Typography>
                  </div>
                ) : (
                  <>
                    <ListItem divider>
                      <Checkbox checked disabled />

                      <ListItemText
                        primary={group.name}
                        secondary={
                          firstOfferInGroup
                            ? t(
                                'metaActivity:groupedOption.modal.form.delete.firstSession',
                                {
                                  day: DateTime.fromISO(
                                    firstOfferInGroup.date_start,
                                  ).toFormat('D'),
                                },
                              )
                            : t(
                                'metaActivity:groupedOption.modal.form.delete.missingOffer',
                              )
                        }
                      />
                    </ListItem>
                    {similars
                      .filter((g) => g.id !== group.id && g.available)
                      .sort((a, b) => {
                        const aFirstOffer = getOffersListByGroup(a.id)?.[0]
                          ?.date_start;
                        const aFirstOfferDate = aFirstOffer
                          ? DateTime.fromISO(aFirstOffer)
                          : DateTime.now();

                        const bFirstOffer = getOffersListByGroup(b.id)?.[0]
                          ?.date_start;
                        const bFirstOfferDate = bFirstOffer
                          ? DateTime.fromISO(bFirstOffer)
                          : DateTime.now();

                        if (aFirstOfferDate < bFirstOfferDate) {
                          return -1;
                        }
                        return 1;
                      })
                      .map((_group) => {
                        const firstOffer = getOffersListByGroup(_group.id)?.[0];
                        return (
                          <ListItem key={_group.id} divider>
                            <Checkbox
                              checked={similarIds.includes(_group.id)}
                              onChange={handleChangeSelection(_group.id)}
                            />

                            <ListItemText
                              primary={_group.name}
                              secondary={
                                firstOffer
                                  ? t(
                                      'metaActivity:groupedOption.modal.form.delete.firstSession',
                                      {
                                        day: DateTime.fromISO(
                                          firstOffer.date_start,
                                        ).toFormat('D'),
                                      },
                                    )
                                  : ''
                              }
                            />
                          </ListItem>
                        );
                      })}
                  </>
                )}
              </>
            )}
          </Collapse>
        </>
      )}{' '}
      <DialogActions>
        <Button disabled={processing} onClick={onCancel}>
          {t('common.cancel')}
        </Button>
        {processing ? (
          <CircularProgress />
        ) : (
          <RedButton onClick={onConfirm}>{t('common.confirm')}</RedButton>
        )}
      </DialogActions>
    </Dialog>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  dialog: {
    minWidth: 600,
    padding: theme.spacing(2),
  },
  explainText: {
    marginBottom: theme.spacing(2),
    padding: theme.spacing(2),
    backgroundColor: '#F2F2F2',
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowPadded: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  rowRight: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  explainNotify: {
    marginLeft: theme.spacing(2),
  },
  danger: {
    marginTop: theme.spacing(1),
    padding: theme.spacing(2),
    borderRadius: 8,
    border: `1px solid ${theme.palette.error.dark}`,
    flexDirection: 'row',
    alignItems: 'center',
    display: 'flex',
  },
  iconLeft: {
    marginRight: theme.spacing(2),
  },
  similarListHeader: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
  selectOption: {
    marginTop: theme.spacing(1),
    paddingTop: theme.spacing(0.5),
    paddingBottom: theme.spacing(0.5),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    color: 'grey',
    '&:hover': {
      color: 'black',
    },
  },
  noSimilarOfferMessage: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
}));

export default pure(GroupedOfferDelete);
