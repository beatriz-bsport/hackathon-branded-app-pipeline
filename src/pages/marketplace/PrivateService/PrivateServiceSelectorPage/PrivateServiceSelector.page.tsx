// @ts-nocheck
import React from 'react';
import { connect } from 'react-redux';
import {
  Typography,
  Grid,
  Paper,
  ButtonBase,
  Chip,
  Theme,
} from '@material-ui/core';
import Skeleton from '@material-ui/lab/Skeleton';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import { WithTranslation, withTranslation } from 'react-i18next';
import { push } from 'connected-react-router';
import isEqual from 'lodash/isEqual';
import uniq from 'lodash/uniq';
import { compose } from 'recompose';
import { withStyles } from '@material-ui/styles';
import { marketplaceCssHoc } from '#hocs/marketplace-css.hoc';
import { fetchMarketplacePrivateServices } from '../../../../libs/private-service/actions';
import { _getPrivateServicesMarketplace } from '../../../../libs/private-service/selectors/private-service';
// @ts-ignore
import TypographyWithShowMore from '../../../../components/typo/TypographyWithShowMore.component';
import { RootState } from '../../../../reducers';
import { PrivateService } from '../../../../libs/private-service/types';
// @ts-ignore
import routerParamsToProps from '../../../../hocs/router-params-to-props.hoc';
// @ts-ignore
import withQueryParams from '../../../../hocs/with-query-params.hoc';
import { MaterialStyleType } from '../../../../utils/types';
import { urlToMarketplace } from '#libs/marketplace/utils';

type OwnProps = typeof mapParamsToProps & {
  /** Override by the widget */
  onClickPrivateService?: (ps: PrivateService) => void;
  /** Override by the widget */
  store?: any;
  filters: {
    private_service_group?: number[] | null;
  };
  setFilters?: (key: string) => (value: any) => void;
};

type Props = ReturnType<typeof mapStateToProps> &
  typeof mapDispatchToProps &
  OwnProps &
  MaterialStyleType<ReturnType<typeof styles>> &
  WithTranslation;

export class PrivateServiceSelectorPage extends React.PureComponent<Props> {
  componentDidMount() {
    this.fetchData();
  }

  componentDidUpdate(prevProps: Props) {
    if (
      !isEqual(prevProps.filters, this.props.filters) &&
      !this.props.loading
    ) {
      this.fetchData();
    }
  }

  fetchData = () => {
    const { companyId, filters } = this.props;

    const id = typeof companyId === 'string' ? parseInt(companyId) : companyId;
    const data: { private_service_group__in?: number[] } = {};
    if (
      filters &&
      filters.private_service_group &&
      filters.private_service_group.length
    ) {
      data.private_service_group__in = filters.private_service_group;
    }

    this.props.fetchMarketplacePrivateServices(id, data);
  };

  onClickPrivateService = (ps: PrivateService) => {
    const { companyName, companyId } = this.props;
    if (this.props.onClickPrivateService) {
      this.props.onClickPrivateService(ps);
      return;
    }

    this.props.pushRoute(
      `${urlToMarketplace(companyName, companyId)}/private-service/${ps.id}`,
    );
  };

  render() {
    const { classes, t } = this.props;
    if (this.props.loading) {
      return (
        <div className={classes.container2}>
          <Grid container align="stretch" className={classes.servicesContainer}>
            {[1, 2, 3].map((i) => (
              <Grid key={i} item lg={3} md={4} sm={6} xs={12}>
                <ButtonBase
                  className={classes.buttonContainer}
                  onClick={() => null}
                >
                  <Paper className={classes.itemPaperContainer}>
                    <div className={classes.itemPaperImageContainer}>
                      <Skeleton
                        animation="wave"
                        className={classes.itemPaperImage}
                        variant="rect"
                      />
                    </div>
                    <div className={classes.itemPaperContent}>
                      <Skeleton animation="wave" width="50%" />
                      {[1, 2, 3].map((j) => (
                        <Skeleton key={j} animation="wave" />
                      ))}
                    </div>
                    <div className={classes.itemPaperContent}>
                      <Skeleton animation="wave" width="20%" />
                    </div>
                  </Paper>
                </ButtonBase>
              </Grid>
            ))}
          </Grid>
        </div>
      );
    }

    return (
      <div className={classes.container}>
        <div className={classes.filterContainer} />
        {!this.props.loading && !this.props._privateServices.length && (
          <div className={classes.emptyTextContainer}>
            <Typography color="textSecondary">
              {t('privateService:marketplace.isEmpty')}
            </Typography>
          </div>
        )}
        <div className={classes.container2}>
          <Grid container align="stretch" className={classes.servicesContainer}>
            {this.props._privateServices.map((ps: PrivateService) => (
              <Grid key={ps.id} item lg={3} md={4} sm={6} xs={12}>
                <ButtonBase
                  className={classes.buttonContainer}
                  onClick={() => this.onClickPrivateService(ps)}
                >
                  <Paper className={classes.itemPaperContainer}>
                    <div className={classes.itemPaperImageContainer}>
                      <img
                        alt={ps.name}
                        className={classes.itemPaperImage}
                        src={ps.cover_main}
                      />
                    </div>

                    <div className={classes.itemPaperContent}>
                      <Typography align="left" color="textPrimary" variant="h6">
                        {ps.name}
                      </Typography>
                      <TypographyWithShowMore
                        multiline
                        align="left"
                        color="textSecondary"
                        variant="subtitle1"
                        whiteSpace="pre-wrap"
                      >
                        {ps.description}
                      </TypographyWithShowMore>

                      <div className={classes.tagsContainer}>
                        <div className={classes.tagsContainer2}>
                          {uniq(ps.slots_duration_minute).map((duration) => (
                            <Chip
                              key={duration}
                              avatar={<AccessTimeIcon fontSize="small" />}
                              className={classes.tagItem}
                              label={
                                duration + t('datetime:shortMinuteIdentifier')
                              }
                              size="small"
                              variant="outlined"
                            />
                          ))}

                          {ps.is_home_service && (
                            <Chip
                              className={classes.tagItem}
                              color="primary"
                              label={t(
                                'privateService:service.form.establishmentResourceType.isHomeService.label',
                              )}
                              size="small"
                              variant="outlined"
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </Paper>
                </ButtonBase>
              </Grid>
            ))}
          </Grid>
        </div>
      </div>
    );
  }
}

const styles = (theme: Theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    width: '100%',
    justifyContent: 'center',
  },
  filterContainer: {
    paddingLeft: 8,
    paddingRight: 8,
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
    marginTop: theme.spacing(2),
  },
  filterContainer2: {
    width: '85%',
    padding: theme.spacing(1),
  },
  container2: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    flex: 1,
    padding: 8,
    marginTop: theme.spacing(2),
  },
  servicesContainer: {
    display: 'flex',
    flex: 1,
    width: '85%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    '&>*': {
      padding: theme.spacing(1),
    },
  },
  buttonContainer: {
    display: 'flex',
    flex: 1,
    width: '100%',
    height: '100%',
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  itemPaperContainer: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    height: '100%',
    overflow: 'hidden',
  },
  itemPaperContent: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    padding: theme.spacing(2),
    height: '100%',
  },
  itemPaperImageContainer: {
    position: 'relative',
    width: '100%',
    paddingTop: '56.25%',
    height: 0,
  },
  itemPaperImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    objectFit: 'cover',
    top: 0,
    left: 0,
  },
  loadingContainer: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tagsContainer: {
    display: 'flex',
    flex: 1,
    alignItems: 'flex-end',
    marginLeft: theme.spacing(-1),
  },
  tagsContainer2: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tagItem: {
    marginLeft: theme.spacing(1),
    marginTop: theme.spacing(1),
  },
  emptyTextContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '100%',
    marginTop: theme.spacing(6),
  },
});

const mapStateToProps = (state: RootState) => {
  return {
    _privateServices: _getPrivateServicesMarketplace(state),
    loading: state.privateService.privateService.loading,
  };
};

const mapDispatchToProps = {
  fetchMarketplacePrivateServices,
  pushRoute: push,
};

const mapParamsToProps = {
  companyId: 'companyId:number',
  companyName: 'companyName',
};

export const PrivateServiceSelectorDataProvider = compose<any, OwnProps>(
  marketplaceCssHoc(),
  // @ts-ignore
  withStyles(styles),
  withTranslation(['privateService', 'datetime']),
  connect(mapStateToProps, mapDispatchToProps),
);

export default compose(
  routerParamsToProps(mapParamsToProps),
  PrivateServiceSelectorDataProvider,
  withQueryParams([
    ['private_service_group'],
    'filters',
    'setFilters',
    'arrayNumber',
  ]),
)(PrivateServiceSelectorPage);
