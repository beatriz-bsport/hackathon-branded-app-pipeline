import React from 'react';
import Typography from '@material-ui/core/Typography';
import { useTranslation } from 'react-i18next';
import withStyles from '@material-ui/core/styles/withStyles';
import { SpotInformation } from '../types';

type Props = { classes: any; spotInformation: SpotInformation };

const PlaceNumber = (props: Props) => {
  const { classes, spotInformation } = props;
  const { t } = useTranslation('booking');

  return (
    <div className={classes.container}>
      <Typography variant="body2">
        {spotInformation?.name || t('booking:place')} {spotInformation.prefix}
        {spotInformation.indexType}
      </Typography>
      <svg height={20} width={20}>
        <g>
          {spotInformation?.shape === 'circular' && (
            <circle
              cx="10"
              cy="10"
              fill={spotInformation?.fill || 'white'}
              r="4"
              stroke={spotInformation?.stroke || 'black'}
              strokeWidth="2"
            />
          )}
          {spotInformation?.shape === 'rectangle' && (
            <rect
              fill={spotInformation?.fill || 'white'}
              height={8}
              stroke={spotInformation?.stroke || 'black'}
              strokeWidth={2}
              width={13}
              x={6}
              y={6}
            />
          )}
          {spotInformation?.shape === 'square' && (
            <rect
              fill={spotInformation?.fill || 'white'}
              height={9}
              stroke={spotInformation?.stroke || 'black'}
              strokeWidth={2}
              width={9}
              x={6}
              y={5}
            />
          )}
          {spotInformation?.shape === 'triangle' && (
            <polygon
              fill={spotInformation?.fill || 'white'}
              points="11,5 6,15 16,15"
              stroke={spotInformation?.stroke || 'black'}
            />
          )}
        </g>
      </svg>
    </div>
  );
};

const styles = () => {
  return { container: { display: 'flex' } };
};

export default withStyles(styles)(PlaceNumber);
