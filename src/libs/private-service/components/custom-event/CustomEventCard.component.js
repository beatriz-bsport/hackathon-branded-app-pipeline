// @flow
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { useTranslation } from 'react-i18next';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withState } from 'recompose';

import CoachListItemBasic from '../../../associated-coach/components/CoachListItemBasic.component';
import RedButton from '../../../../components/button/RedButton.component';

type Props = {};

export const CustomEventCard = (props: Props) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const { customEvent } = props;
  return (
    <div className={classes.container}>
      <Typography className={classes.title} variant="h4">
        {customEvent.name}
      </Typography>
      {customEvent.coaches.map((c) =>
        c ? <CoachListItemBasic coach={c} key={c.id} /> : <CircularProgress />,
      )}
      <Typography className={classes.description}>
        {customEvent.description}
      </Typography>
      {!!props.onDelete && (
        <div className={classes.actions}>
          {props.loading ? (
            <CircularProgress />
          ) : (
            <RedButton
              onClick={() => {
                props.setLoading(true);
                props.onDelete({
                  onSuccess: () => props.setLoading(false),
                  onError: () => props.setLoading(false),
                });
              }}
            >
              {t('customEvent.card.actions.delete')}
            </RedButton>
          )}
        </div>
      )}
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    padding: theme.spacing(2),
    minWidth: 200,
  },
  title: {
    marginBottom: theme.spacing(2),
  },
  description: {
    marginTop: theme.spacing(2),
  },
  actions: {
    marginTopt: theme.spacing(2),
    display: 'flex',
    width: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
    flexDirection: 'row',
  },
}));

export default withState('loading', 'setLoading', false)(CustomEventCard);
