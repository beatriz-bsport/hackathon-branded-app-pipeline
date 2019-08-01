// @flow

import * as React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

import { colors as bsportColors } from '@bsport/common/lib/colors';

type colors = 'blue' | 'blueLight' | 'yellow' | 'red';

type Props = {
  name: string,
  count: number,
  color: colors,
  children: ?React.Node,
  classes: { [colors]: string },
};
const styles = () => ({
  green: {
    borderColor: '#469B7C',
    backgroundColor: bsportColors.primary,
  },
  blue: {
    borderColor: '#187DAB',
    backgroundColor: bsportColors.secondary,
  },
  blueLight: {
    borderColor: '#2eadd3',
    backgroundColor: '#63c2de',
  },
  marine: {
    borderColor: 'rgb(36, 54, 92)',
    backgroundColor: bsportColors.secondary,
  },
  yellow: {
    borderColor: '#c69500',
    backgroundColor: '#ffc107',
  },
  red: {
    borderColor: '#f5302e',
    backgroundColor: '#f86c6b',
  },
  content: {
    color: 'white',
    padding: '0px !important',
  },
  textLight: {
    color: 'white',
  },
  text: {
    fontWeight: 'bold',
  },
  header: {
    margin: 10,
  },
});

export function Figure(props: Props) {
  const { name, count, children, classes, color } = props;
  return (
    <Card className={classes[color || 'blue']}>
      <CardContent className={classes.content}>
        <div className={classes.header}>
          <Typography
            variant="subtitle1"
            gutterBottom
            className={[classes.textLight, classes.text].join(' ')}
          >
            {count}
          </Typography>
          <Typography
            color="textSecondary"
            gutterBottom
            className={classes.textLight}
          >
            {name}
          </Typography>
        </div>
        {children}
      </CardContent>
    </Card>
  );
}

export default withStyles(styles)(Figure);
