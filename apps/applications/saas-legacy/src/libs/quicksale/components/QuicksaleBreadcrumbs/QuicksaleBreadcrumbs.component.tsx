import React from 'react';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import type { QuicksaleSection } from '#src/libs/quicksale/types';
import useStyles from './styles';

type Props = {
  homeLabel: string;
  onHomeClick?: () => void;
  onSectionClick?: (sectionId: string) => void;
  section: QuicksaleSection;
  variantItemLabel?: string;
};

const QuicksaleBreadcrumbs: React.FC<Props> = ({
  homeLabel,
  onHomeClick,
  onSectionClick,
  section,
  variantItemLabel,
}) => {
  const classes = useStyles();

  return (
    <Breadcrumbs aria-label="breadcrumb" separator=">">
      <Link className={classes.link} color="inherit" onClick={onHomeClick}>
        {homeLabel}
      </Link>
      {onSectionClick ? (
        <Link
          className={classes.link}
          color="inherit"
          onClick={
            onSectionClick
              ? () => onSectionClick(section.section_id)
              : undefined
          }
        >
          {section.section_name}
        </Link>
      ) : (
        <Typography className={classes.label} component="span">
          {section.section_name}
        </Typography>
      )}
      {variantItemLabel ? (
        <Typography className={classes.label} component="span">
          {variantItemLabel}
        </Typography>
      ) : null}
    </Breadcrumbs>
  );
};

export default React.memo(QuicksaleBreadcrumbs);
