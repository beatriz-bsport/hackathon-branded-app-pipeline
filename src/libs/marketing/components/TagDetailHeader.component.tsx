import { withStyles } from '@material-ui/styles';
import React from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import InfoIcon from '@material-ui/icons/Info';
import Typography from '@material-ui/core/Typography';
import { compose } from 'recompose';
import { Theme } from '@material-ui/core/styles';
import TagIcon from '@material-ui/icons/Label';
import { Tag } from '../../tag/types';
import { MaterialStyleType } from '../../../utils/types';

type OwnProps = {
  tag: Tag | null;
};

type Props = OwnProps &
  MaterialStyleType<ReturnType<typeof styles>> &
  WithTranslation;

class TagDetailHeader extends React.PureComponent<Props> {
  render() {
    const { classes, t } = this.props;

    if (!this.props.tag) {
      return (
        <div className={classes.noTagContainer}>
          <InfoIcon />
          <Typography className={classes.noTag}>
            {t('management.tagDetail.noTag')}
          </Typography>
        </div>
      );
    }

    return (
      <div className={classes.content}>
        <div className={classes.tagNameContainer}>
          <TagIcon fontSize="large" className={classes.leftIcon} />
          <Typography noWrap variant="h3">
            {this.props.tag.name}
          </Typography>
        </div>
      </div>
    );
  }
}

const styles = (theme: Theme) => ({
  noTagContainer: {
    display: 'flex',
    width: '100%',
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: theme.spacing(2),
  },
  noTag: {
    marginTop: theme.spacing(2),
  },
  content: {
    width: '100%',
  },
  leftIcon: {
    marginRight: theme.spacing(1.5),
  },
  tagNameContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    borderWidth: 0,
    borderBottomWidth: 1,
    borderStyle: 'solid',
    borderColor: '#AAA',
    paddingBottom: theme.spacing(1),
  },
});

export default compose<any, OwnProps>(
  withStyles(styles),
  withTranslation(['tag']),
)(TagDetailHeader);
