import React from 'react';
import { connect } from 'react-redux';
import {
  Typography,
  Grid,
  Paper,
  ButtonBase,
  CircularProgress,
  Chip,
  Theme,
} from '@material-ui/core';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import { WithTranslation, withTranslation } from 'react-i18next';
import { push } from 'connected-react-router';
import { uniq, isEqual } from 'lodash';

import { compose } from 'recompose';
import { withStyles } from '@material-ui/styles';
import { fetchMarketplacePrivateServices } from '../../../../libs/private-service/actions';
import { _getPrivateServicesMarketplace } from '../../../../libs/private-service/selectors/private-service';
// @ts-ignore
import TypographyWithShowMore from '../../../../components/TypographyWithShowMore.component';
import { RootState } from '../../../../reducers';
import { PrivateService } from '../../../../libs/private-service/types';
// @ts-ignore
import routerParamsToProps from '../../../../hocs/router-params-to-props.hoc';
// @ts-ignore
import withQueryParams from '../../../../hocs/with-query-params.hoc';
import { MaterialStyleType } from '../../../../utils/types';

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
      `/m/${companyName}/${companyId}/private-service/${ps.id}`,
    );
  };

  render() {
    const { classes, t } = this.props;
    if (this.props.loading) {
      return (
        <div className={classes.loadingContainer}>
          <CircularProgress />
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
              <Grid item xs={12} sm={6} md={4} lg={3} key={ps.id}>
                <ButtonBase
                  className={classes.buttonContainer}
                  onClick={() => this.onClickPrivateService(ps)}
                >
                  <Paper className={classes.itemPaperContainer}>
                    <div className={classes.itemPaperImageContainer}>
                      <img
                        alt={ps.name}
                        src={ps.cover_main}
                        className={classes.itemPaperImage}
                      />
                    </div>

                    <div className={classes.itemPaperContent}>
                      <Typography align="left" variant="h6" color="textPrimary">
                        {ps.name}
                      </Typography>
                      <TypographyWithShowMore
                        align="left"
                        multiline
                        color="textSecondary"
                        variant="subtitle1"
                      >
                        {ps.description}
                      </TypographyWithShowMore>

                      <div className={classes.tagsContainer}>
                        <div className={classes.tagsContainer2}>
                          {uniq(ps.slots_duration_minute).map((duration) => (
                            <Chip
                              size="small"
                              key={duration}
                              className={classes.tagItem}
                              avatar={<AccessTimeIcon fontSize="small" />}
                              label={
                                duration + t('datetime:shortMinuteIdentifier')
                              }
                              variant="outlined"
                            />
                          ))}

                          {ps.is_home_service && (
                            <Chip
                              size="small"
                              className={classes.tagItem}
                              label={t(
                                'privateService:service.form.establishmentResourceType.isHomeService.label',
                              )}
                              color="primary"
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
