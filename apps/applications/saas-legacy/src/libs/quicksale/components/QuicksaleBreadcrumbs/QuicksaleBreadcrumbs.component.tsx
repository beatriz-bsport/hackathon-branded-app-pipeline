import React from 'react';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import useStyles from './styles';

type Props = {
  categoryLabel: string;
  categoryHref?: string;
  homeLabel: string;
  onHomeClick?: () => void;
};

const QuicksaleBreadcrumbs: React.FC<Props> = ({
  categoryLabel,
  categoryHref,
  homeLabel,
  onHomeClick,
}) => {
  const classes = useStyles();

  return (
    <Breadcrumbs aria-label="breadcrumb" separator=">">
      <Link className={classes.link} color="inherit" onClick={onHomeClick}>
        {homeLabel}
      </Link>
      {categoryHref ? (
        <Link className={classes.link} color="inherit" href={categoryHref}>
          {categoryLabel}
        </Link>
      ) : (
        <Typography className={classes.categoryLabel} component="span">
          {categoryLabel}
        </Typography>
      )}
    </Breadcrumbs>
  );
};

export default React.memo(QuicksaleBreadcrumbs);
