import { Theme, Typography, makeStyles } from '@material-ui/core';
import React from 'react';
import { useTranslation } from 'react-i18next';

type Props = {
  requiredTagsList: string[];
};

const useStyles = makeStyles((theme: Theme) => ({
  listStyle: {
    margin: 'unset',
    paddingLeft: theme.spacing(3),
    '& li': {
      listStyleType: 'unset',
    },
  },
}));

export const RequiredTags: React.FC<Props> = (props: Props) => {
  const { t } = useTranslation('notificationRule');
  const classes = useStyles();

  const { requiredTagsList } = props;

  return (
    <ul className={classes.listStyle}>
      {requiredTagsList.map((tag) => (
        <li key={tag}>
          <Typography>{t(`tag.requiredTags.${tag}`)}</Typography>
        </li>
      ))}
    </ul>
  );
};

export default RequiredTags;
