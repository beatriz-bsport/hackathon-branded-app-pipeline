import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { Divider, Paper } from '@material-ui/core';
import Collapse from '@material-ui/core/Collapse';
import List from '@material-ui/core/List';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import { Theme } from '@material-ui/styles';

type Props = {
  disabledItems: any;
  restoreItem: (id: number) => void;
  width?: string | number;

  // eslint-disable-next-line react/no-unused-prop-types
  ListItemComponent: any;
};

export const ArchivedSection = (props: Props) => {
  const { t } = useTranslation('ordering');
  const classes = useStyles({ width: props.width });

  const [showDisabled, setShowDisabled] = useState(false);

  return props.disabledItems.length ? (
    <div className={classes.disabledList}>
      <div className={classes.buttonTitle}>
        <Typography variant="h5" className={classes.sectionTitle}>
          {`${t('disabledItemsTitle')} (${(props.disabledItems || []).length})`}
        </Typography>

        <IconButton onClick={() => setShowDisabled(!showDisabled)}>
          {showDisabled ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </div>
      <Divider className={classes.divider} />
      <Collapse in={showDisabled}>
        {showDisabled && (
          <List disablePadding>
            {props.disabledItems.map((item: any) => (
              <Paper className={classes.paper}>
                <props.ListItemComponent
                  item={item}
                  onRestore={() => props.restoreItem(item.id)}
                  key={item.id}
                  disabled
                />
              </Paper>
            ))}
          </List>
        )}
      </Collapse>
    </div>
  ) : null;
};

const useStyles = makeStyles((theme: Theme) => ({
  disabledList: {
    width: (props: { width: string | number }) =>
      props.width ? props.width : '100%',
    marginTop: theme.spacing(6),
    paddingBottom: theme.spacing(16),
  },
  buttonTitle: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingBottom: theme.spacing(1),
  },
  sectionTitle: {
    marginBottom: theme.spacing(1),
  },
  divider: {
    marginBottom: theme.spacing(2),
  },
  paper: {
    marginLeft: theme.spacing(2),
  },
}));

export default ArchivedSection;
