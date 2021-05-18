import React, { Component } from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { compose } from 'recompose';
import withStyles from '@material-ui/core/styles/withStyles';
import Switch from '@material-ui/core/Switch';
import Typography from '@material-ui/core/Typography';
import { MaterialStyleType } from '../../../../utils/types';

type OwnProps = {
  filter_data: any;
  onChange: (data: any) => void;
  new: boolean;
};

type Props = OwnProps &
  MaterialStyleType<ReturnType<typeof styles>> &
  WithTranslation;

export class WaiverFilter extends Component<Props> {
  componentDidMount() {
    if (this.props.new) {
      this.props.onChange({ value: true });
    }
  }

  render() {
    const { filter_data, t, classes, onChange } = this.props;
    return (
      <div className={classes.container}>
        <div className={classes.content}>
          <Switch
            checked={!!filter_data.value}
            onChange={(ev) => onChange({ value: ev.target.checked })}
          />
          <Typography>
            {t(`filters.${filter_data.filter_identifier}.explain`)}
          </Typography>
        </div>
      </div>
    );
  }
}

const styles = (theme) => ({
  container: {},
  content: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    '&>*': {
      maringRight: theme.spacing(1),
    },
  },
});

export default compose<any, OwnProps>(
  withTranslation(['smartList']),
  withStyles(styles),
)(WaiverFilter);
