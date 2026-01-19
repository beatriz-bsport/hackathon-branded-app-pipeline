import React from 'react';

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import { makeStyles } from '@material-ui/core/styles';
import StarIcon from '@material-ui/icons/Star';
import OndemandVideoIcon from '@material-ui/icons/OndemandVideo';
import { useTranslation } from 'react-i18next';
import StyleIcon from '@material-ui/icons/Style';

import TypographyMultilineComponent from '#src/components/typo/TypographyMultiline.component';
import {
  getCreditsDividedDisplay,
  getCreditsDividedValue,
} from '#src/libs/theme/utils';
import type {
  PrivatePass,
  PrivateServiceWithSlots,
  ServiceCompatibilityPass,
} from '#src/libs/private-service/types';
import PrivatePassCompatibleServiceList from '#src/libs/private-service/components/pass/PrivatePassCompatibleServiceList.component';
import ObjectLevelPermissionProviderComponent from '#src/libs/role/permission-utils/ObjectLevelPermissionProvider.component';
import type { OptionCallback } from '#src/state/types';

type Props = {
  pass: PrivatePass;

  isManager?: boolean;

  privateServices: Array<PrivateServiceWithSlots>;
  compatibleServicePass: Array<ServiceCompatibilityPass>;

  deleteCompatibleServicePass?: (
    privatePassId: number,
    privateServiceId: number,
    options: OptionCallback,
  ) => void;
  createCompatibleServicePass?: (
    privatePassId: number,
    privateServiceId: number,
    options: OptionCallback,
  ) => void;
  updateCompatibleServicePass?: (
    privatePassId: number,
    serviceId: number,
    data: any,
  ) => void;
};

export const PrivatePassDetailsCard: React.FC<Props> = (props) => {
  const { t } = useTranslation(['privateService']);
  const classes = useStyles();

  const {
    pass,
    isManager,
    privateServices,
    compatibleServicePass,
    deleteCompatibleServicePass,
    createCompatibleServicePass,
    updateCompatibleServicePass,
  } = props;
  const { full_vod_access, description } = pass;

  return (
    <>
      <Paper className={classes.paper}>
        <div className={classes.horizontalBlock}>
          <div className={classes.header}>
            <div>
              <Typography variant="h4">
                {t('privatePass.detailTitles.name')}
              </Typography>
            </div>

            {description && (
              <TypographyMultilineComponent
                className={classes.description}
                variant="caption"
              >
                {description}
              </TypographyMultilineComponent>
            )}

            <div>
              <div className={isManager ? '' : classes.marginTop}>
                <div className={classes.detailInfo}>
                  <div className={classes.detailCategory}>
                    <StarIcon className={classes.leftIcon} />
                    <Typography variant="subtitle2">
                      {t('privatePass.detailTitles.credit_quantity')}
                    </Typography>
                  </div>
                  <Typography
                    className={classes.passInfo}
                    color="textSecondary"
                    variant="caption"
                  >
                    {`${getCreditsDividedDisplay(pass.credits)}${t(
                      'privatePass.parameters.nbCredits',
                      {
                        count: getCreditsDividedValue(pass.credits),
                      },
                    ).toLowerCase()}`}
                  </Typography>
                </div>
              </div>
            </div>
          </div>

          <div>
            {full_vod_access && (
              <div className={classes.detailInfo}>
                <div className={classes.detailCategory}>
                  <OndemandVideoIcon className={classes.leftIcon} />
                  <Typography variant="subtitle2">
                    {t('privatePass.detailTitles.vod')}
                  </Typography>
                </div>
                <Typography
                  className={classes.passInfo}
                  color="textSecondary"
                  variant="caption"
                >
                  {t('privatePass.form.full_vod_access.label')}
                </Typography>
              </div>
            )}

            {!!pass?.linked_payment_pack && (
              <div className={classes.detailInfo}>
                <div className={classes.detailCategory}>
                  <StyleIcon className={classes.leftIcon} />
                  <Typography variant="subtitle2">
                    {t('paymentPack:detailTitles.universalPass')}
                  </Typography>
                </div>
                <Typography
                  className={classes.passInfo}
                  color="textSecondary"
                  variant="caption"
                >
                  {t('paymentPack:cardDetails.universalPass')}
                </Typography>
              </div>
            )}
          </div>
        </div>
      </Paper>
      <ObjectLevelPermissionProviderComponent
        requiredPermission={[
          'product.privatePass.allowed_actions.compatibility',
        ]}
      >
        {([hasCompatibilityPermission]: boolean[]) => (
          <div className={classes.compatiblePSCard}>
            <PrivatePassCompatibleServiceList
              // @ts-expect-error
              isManager
              canEdit={hasCompatibilityPermission}
              compatibleServicePass={compatibleServicePass}
              createCompatibleServicePass={createCompatibleServicePass}
              deleteCompatibleServicePass={deleteCompatibleServicePass}
              pass={pass}
              privateServices={privateServices}
              updateCompatibleServicePass={updateCompatibleServicePass}
            />
          </div>
        )}
      </ObjectLevelPermissionProviderComponent>
    </>
  );
};

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(2),
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
  },
  category: {
    fontStyle: 'italic',
    color: 'rgba(0, 0, 0, 0.6)',
    fontWeight: 400,
  },
  copyButton: {
    marginLeft: -theme.spacing(1),
  },
  detailInfo: {
    marginBottom: theme.spacing(2),
  },
  detailCategory: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  leftIcon: {
    marginRight: theme.spacing(2),
  },
  passInfo: {
    marginLeft: theme.spacing(5),
  },
  detailContent: {
    marginTop: 0,
    marginBottom: theme.spacing(1),
  },
  horizontalBlock: {
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
  },
  buttonBlock: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  price: {
    fontWeight: 700,
  },
  priceWithoutTax: {
    color: 'rgba(0, 0, 0, 0.38)',
  },
  buttonAlign: {
    marginRight: -theme.spacing(1),
  },
  buttonContainer: {
    marginTop: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
  },
  buttonWidth: {
    width: 'min-content',
    marginLeft: 'auto',
  },
  columnLeft: {
    paddingLeft: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  link: {
    padding: theme.spacing(1),
    marginBottom: theme.spacing(2),
    '&:hover': {
      backgroundColor: '#EFEFEF',
      borderRadius: 5,
    },
  },
  linkTypo: {
    paddingLeft: theme.spacing(2),
    textAlign: 'left',
  },
  marginTop: {
    marginTop: theme.spacing(3),
  },
  flexInfo: {
    display: 'flex',
    flexDirection: 'column',
  },
  description: {
    color: theme.palette.text.secondary,
    wordBreak: 'break-word',
  },
  compatiblePSCard: {
    marginTop: theme.spacing(3),
  },
}));

export default PrivatePassDetailsCard;
