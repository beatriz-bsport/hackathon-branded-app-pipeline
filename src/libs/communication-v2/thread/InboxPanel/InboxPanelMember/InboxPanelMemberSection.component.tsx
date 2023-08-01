import React, { memo } from 'react';

import { makeStyles, useTheme } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import { CustomChip } from '#components/chip/CustomChip.component';

type Props = { title: string; count: number };

const InboxPanelMemberSection: React.FC<Props> = ({ title, count }) => {
  const classes = useStyles();

  const theme = useTheme();
  const displayedValue = `${count} ${title.toLowerCase()}`;

  return (
    <div className={classes.container}>
      <Typography className={classes.title} variant="body1">
        {title}
      </Typography>
      <CustomChip
        displayedValue={displayedValue}
        mainColor={theme.palette.text.primary}
      />
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    borderBottom: '1px solid',
    borderBottomColor: theme.palette.grey[300],
  },
  title: {
    paddingBottom: theme.spacing(1),
  },
}));

export default memo(InboxPanelMemberSection);
