import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ReportProblemIcon from '@material-ui/icons/ReportProblem';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { Theme } from '@material-ui/core';

export const TagGroupDuplicatedAlert: React.FC = () => {
  const classes = useStyles();
  const { t } = useTranslation(['tag']);
  return (
    <ListItem
      divider
      alignItems="center"
      className={classes.tagGroupDuplicatedItem}
    >
      <ReportProblemIcon className={classes.reportProblemIcon} />
      <ListItemText
        primary={
          <div>
            <Typography variant="subtitle2">
              {t('tagGroupDuplicated')}
            </Typography>
          </div>
        }
      />
    </ListItem>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  tagGroupDuplicatedItem: {
    borderLeft: '5px solid',
    borderLeftColor: '#E35D4D',
    boxShadow: '0px 1px 3px 0.3px rgba(0, 0, 0, 0.25)',
  },
  reportProblemIcon: {
    color: '#E35D4D',
    fontSize: 32,
    marginRight: theme.spacing(3),
    marginLeft: theme.spacing(2),
  },
}));

export default TagGroupDuplicatedAlert;
