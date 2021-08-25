import React from 'react';

import ListItem from '@material-ui/core/ListItem';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { Theme, withStyles } from '@material-ui/core/styles';
import { WithTranslation, withTranslation } from 'react-i18next';
import { compose } from 'recompose';

import Paper from '@material-ui/core/Paper';
import LinearProgress from '@material-ui/core/LinearProgress';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import { MaterialStyleType } from '../../../utils/types';
import { Coupon } from '../../coupon/types';
import { Tag } from '../../tag/types';

type OwnProps = {
  coupons: Coupon[];
  loading: boolean;
  onClickRemoveTag: (coupon: Coupon) => void;
  tag: Tag;
};

type Props = OwnProps &
  MaterialStyleType<ReturnType<typeof styles>> &
  WithTranslation;

class TagDetailCoupon extends React.PureComponent<Props> {
  render() {
    const { classes, t } = this.props;
    if (this.props.loading) {
      return <LinearProgress />;
    }

    return (
      <div className={classes.container}>
        {!this.props.loading && !this.props.coupons.length && (
          <div>
            <Typography color="textSecondary">
              {t('management.couponDetail.empty', { tag: this.props.tag.name })}
            </Typography>
            <Button
              onClick={this.props.goToCoupon}
              color="primary"
              variant="outlined"
              className={classes.marginTop}
            >
              <ArrowForwardIcon className={classes.leftIcon} />
              {t('management.couponDetail.createViaCoupon')}
            </Button>
          </div>
        )}

        {!this.props.loading && !!this.props.coupons.length && (
          <>
            <Typography variant="h5">
              {t('management.couponDetail.title')}
            </Typography>

            <Paper className={classes.paper}>
              {this.props.coupons.map((coupon) => (
                <ListItem divider key={coupon.id}>
                  <div className={classes.listItemInfo}>
                    <Typography>{coupon.name}</Typography>
                    {coupon.whitelist_tags.includes(this.props.tag.id) && (
                      <Typography variant="caption" color="textSecondary">
                        {t('management.couponDetail.whitelist')}
                      </Typography>
                    )}

                    {coupon.blacklist_tags.includes(this.props.tag.id) && (
                      <Typography variant="caption" color="textSecondary">
                        {t('management.couponDetail.blacklist')}
                      </Typography>
                    )}
                  </div>
                  <Button
                    color="primary"
                    onClick={() => this.props.onClickRemoveTag(coupon)}
                  >
                    {t('management.couponDetail.removeTag')}
                  </Button>
                </ListItem>
              ))}
            </Paper>
          </>
        )}
      </div>
    );
  }
}

const styles = (theme: Theme) => ({
  container: {
    width: '100%',
    marginTop: theme.spacing(2),
  },
  paper: {
    marginTop: theme.spacing(2),
  },
  listItemInfo: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    flex: 1,
  },
  marginTop: {
    marginTop: theme.spacing(2),
  },
  leftIcon: {
    marginRight: theme.spacing(1),
  },
});

export default compose<any, OwnProps>(
  withStyles(styles),
  withTranslation(['tag']),
)(TagDetailCoupon);
