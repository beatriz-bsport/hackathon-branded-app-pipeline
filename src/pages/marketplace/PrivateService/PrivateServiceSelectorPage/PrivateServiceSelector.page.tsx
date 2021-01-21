import React, { useCallback, useEffect } from 'react';
import { connect } from 'react-redux';
import {
  Typography,
  Grid,
  Paper,
  ButtonBase,
  LinearProgress,
  Chip,
} from '@material-ui/core';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import { push } from 'connected-react-router';
import { uniq } from 'lodash';

import { compose } from 'recompose';
import { fetchMarketplacePrivateServices } from '../../../../libs/private-service/actions';
import { _getPrivateServicesMarketplace } from '../../../../libs/private-service/selectors/private-service';
// @ts-ignore
import TypographyWithShowMore from '../../../../components/TypographyWithShowMore.component';
import { RootState } from '../../../../reducers';
import { PrivateService } from '../../../../libs/private-service/types';
// @ts-ignore
import routerParamsToProps from '../../../../hocs/router-params-to-props.hoc';

type OwnProps = typeof mapParamsToProps & {
  /** Override by the widget */
  onClickPrivateService?: (ps: PrivateService) => void;
  /** Override by the widget */
  store?: any;
};

type Props = ReturnType<typeof mapStateToProps> &
  typeof mapDispatchToProps &
  OwnProps;

export const PrivateServiceSelectorPage: React.FC<Props> = (props) => {
  const { companyId, companyName } = props;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = useCallback(async () => {
    const id = typeof companyId === 'string' ? parseInt(companyId) : companyId;
    props.fetchMarketplacePrivateServices(id);
  }, [companyId]);

  const classes = useStyles();
  const { t } = useTranslation(['privateService', 'datetime']);

  const onClickPrivateService = useCallback(
    (ps: PrivateService) => {
      if (props.onClickPrivateService) {
        props.onClickPrivateService(ps);
        return;
      }

      props.pushRoute(
        `/m/${companyName}/${companyId}/private-service/${ps.id}`,
      );
    },
    [companyName, companyId],
  );

  return (
    <div className={classes.container}>
      {!!props.loading && (
        <div className={classes.loadingContainer}>
          <LinearProgress />
        </div>
      )}
      {!props.loading && !props._privateServices.length && (
        <div className={classes.emptyTextContainer}>
          <Typography color="textSecondary">
            {t('privateService:marketplace.isEmpty')}
          </Typography>
        </div>
      )}
      <div className={classes.container2}>
        <Grid container className={classes.servicesContainer}>
          {props._privateServices.map((ps: PrivateService) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={ps.id}>
              <ButtonBase
                className={classes.buttonContainer}
                onClick={() => onClickPrivateService(ps)}
              >
                <Paper className={classes.itemPaperContainer}>
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
                          label={duration + t('datetime:shortMinuteIdentifier')}
                          variant="outlined"
                        />
                      ))}

                      {ps.is_home_service && (
                        <Chip
                          size="small"
                          className={classes.tagItem}
                          label="Service à domicile"
                          color="primary"
                          variant="outlined"
                        />
                      )}
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
};

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    width: '100%',
    justifyContent: 'center',
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
    justifyContent: 'flex-start',
    padding: theme.spacing(2),
    height: '100%',
  },
  loadingContainer: {
    width: '100%',
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
}));

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
  connect(mapStateToProps, mapDispatchToProps),
);

export default compose(
  routerParamsToProps(mapParamsToProps),
  PrivateServiceSelectorDataProvider,
)(PrivateServiceSelectorPage);
