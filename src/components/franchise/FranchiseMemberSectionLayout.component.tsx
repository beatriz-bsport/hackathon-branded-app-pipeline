import React, { ReactNode } from 'react';
import Typography from '@material-ui/core/Typography';
import makeStyles from '@material-ui/core/styles/makeStyles';

type Props = {
  title?: string;
  children: ReactNode;
};

const FranchiseMemberSectionLayout: React.FC<Props> = ({ title, children }) => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      {title && (
        <Typography className={classes.title} variant="h5">
          {title}
        </Typography>
      )}
      {children}
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  title: { marginBottom: theme.spacing(1) },
}));

export default React.memo(FranchiseMemberSectionLayout);
