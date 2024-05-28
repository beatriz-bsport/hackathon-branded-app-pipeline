import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Button,
  Divider,
  Grid,
  IconButton,
  Paper,
  Typography,
  makeStyles,
} from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { Add, CheckCircle, Delete, Edit } from '@material-ui/icons';
import ObjectLevelPermissionWrapper from '#src/libs/role/permission-utils/ObjectLevelPermissionWrapper.component';
// @ts-expect-error
import PaginatedListBase from '#src/components/PaginatedListBase.component';
import type { MarketingNotification } from '../types';
import type { PaymentPack } from '#src/libs/payment-packs/types';
import type { PrivatePass } from '#src/libs/private-service/types';
import { PassPreview } from '#src/components/passes/PassPreview.component';
import type { PassPreviewData } from '#src/components/passes/types';
import { toPassPreviewData } from '#src/components/passes/utils';
import { PassSelectorDialog } from './PassSelectorDialog.component';

type Props = {
  notification: MarketingNotification;
  paymentPackById: Record<number, PaymentPack>;
  privatePassById: Record<number, PrivatePass>;
  onUpdateNotification: (
    id: number,
    notification: MarketingNotification,
  ) => void;
};

const MarketingRulePassPaginatedList: React.FC<Props> = (props: Props) => {
  const classes = useStyles();
  const { t } = useTranslation('marketing');

  const [currentPagePasses, setCurrentPagePasses] = useState<PassPreviewData[]>(
    [],
  );
  const [currentPage, setCurrentPage] = useState(1);

  const [passSelectionDialogOpen, setPassSelectionDialogOpen] = useState(false);
  const [passSelectionAvailable, setPassSelectionAvailable] = useState<
    PaymentPack[] | PrivatePass[]
  >([]);

  const closeDialog = useCallback(() => {
    setPassSelectionDialogOpen(false);
  }, []);
  const openDialog = useCallback(() => {
    setPassSelectionDialogOpen(true);
  }, []);

  const identifier = useMemo(() => {
    const { contains_all_payment_packs, payment_pack_ids } =
      props.notification.event_rules;
    return contains_all_payment_packs !== undefined ||
      payment_pack_ids !== undefined
      ? 'payment_pack'
      : 'private_pass';
  }, [props.notification.event_rules]);

  const containsAllPasses = useMemo(() => {
    const { contains_all_payment_packs, contains_all_private_passes } =
      props.notification.event_rules;
    return contains_all_payment_packs || contains_all_private_passes;
  }, [props.notification.event_rules]);

  const passIds = useMemo(() => {
    const { payment_pack_ids, private_pass_ids } =
      props.notification.event_rules;
    return payment_pack_ids || private_pass_ids || [];
  }, [props.notification.event_rules]);

  const loadPage = useCallback(
    (page: number, page_size: number) => {
      const { event_rules } = props.notification;
      const { payment_pack_ids, private_pass_ids } = event_rules;

      let passes: PaymentPack[] | PrivatePass[];
      if (payment_pack_ids) {
        passes = payment_pack_ids.map((id) => props.paymentPackById[id]);
      } else if (private_pass_ids) {
        passes = private_pass_ids.map((id) => props.privatePassById[id]);
      }

      const pagePasses = passes
        .slice((page - 1) * page_size, page * page_size)
        .filter(Boolean);

      setCurrentPagePasses(
        pagePasses.map((pass) => toPassPreviewData(t, pass)),
      );
      setCurrentPage(page);
    },
    [props.notification, props.paymentPackById, props.privatePassById, t],
  );

  useEffect(() => {
    loadPage(currentPage, 3);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadPage]);

  const removePassFromNotification = useCallback(
    (passId: number) => {
      const { id: notificationId, event_rules } = props.notification;
      const {
        contains_all_payment_packs,
        contains_all_private_passes,
        payment_pack_ids,
        private_pass_ids,
      } = event_rules;

      if (contains_all_payment_packs || contains_all_private_passes) return;

      const pass_ids = payment_pack_ids
        ? payment_pack_ids.filter((id) => id !== passId)
        : private_pass_ids.filter((id) => id !== passId);

      props.onUpdateNotification(notificationId, {
        ...props.notification,
        event_rules: {
          ...event_rules,
          ...(private_pass_ids
            ? {
                private_pass_ids: pass_ids,
                // :TODO: Remove this line when the related backend migration (BS-3934) is done
                private_pass_id: undefined,
              }
            : {
                payment_pack_ids: pass_ids,
                // :TODO: Remove this line when the related backend migration (BS-3934) is done
                payment_pack_id: undefined,
              }),
        },
      });

      if (currentPage > Math.ceil(pass_ids.length / 3) && currentPage > 1) {
        loadPage(currentPage - 1, 3);
      }
    },
    [currentPage, loadPage, props],
  );

  const updatePassesInNotification = useCallback(
    (selectedPasses: number[], isAll: boolean) => {
      const { id: notificationId, event_rules } = props.notification;

      props.onUpdateNotification(notificationId, {
        ...props.notification,
        event_rules: {
          ...event_rules,
          ...(identifier === 'private_pass'
            ? {
                private_pass_ids: selectedPasses,
                // :TODO: Remove this line when the related backend migration (BS-3934) is done
                private_pass_id: undefined,
                contains_all_private_passes: isAll,
              }
            : {
                payment_pack_ids: selectedPasses,
                // :TODO: Remove this line when the related backend migration (BS-3934) is done
                payment_pack_id: undefined,
                contains_all_payment_packs: isAll,
              }),
        },
      });

      setPassSelectionDialogOpen(false);
      loadPage(1, 3);
    },
    [identifier, loadPage, props],
  );

  const renderListItem = useCallback(
    (pass: PassPreviewData) => (
      <Grid
        key={pass.value}
        container
        className={classes.itemPass}
        justifyContent="space-between"
      >
        <PassPreview pass={pass} />
        <ObjectLevelPermissionWrapper
          forcedBehavior="hidden"
          requiredPermission="member.allowed_actions.manageNotification"
        >
          <IconButton
            className={classes.gray}
            onClick={() => {
              removePassFromNotification(pass.value);
            }}
          >
            <Delete />
          </IconButton>
        </ObjectLevelPermissionWrapper>
      </Grid>
    ),
    [classes.gray, classes.itemPass, removePassFromNotification],
  );

  useEffect(() => {
    const { paymentPackById, privatePassById } = props;

    if (identifier === 'private_pass') {
      setPassSelectionAvailable(Object.values(privatePassById));
    } else {
      setPassSelectionAvailable(Object.values(paymentPackById));
    }
  }, [identifier, passSelectionDialogOpen, props]);

  return (
    <>
      <Grid
        container
        className={classes.titleMargin}
        direction="row"
        justifyContent="space-between"
      >
        <Typography className={classes.sectionTitle} variant="h5">
          {t(`notifications.fabLabels.${identifier}`)}
        </Typography>
        <ObjectLevelPermissionWrapper
          forcedBehavior="hidden"
          requiredPermission="member.allowed_actions.manageNotification"
        >
          <Button
            className={classes.marginLeft}
            color="primary"
            onClick={openDialog}
            startIcon={containsAllPasses ? <Edit /> : <Add />}
            variant="outlined"
          >
            {containsAllPasses
              ? t('notifications.editPasses')
              : t('notifications.addPasses')}
          </Button>
        </ObjectLevelPermissionWrapper>
        <PassSelectorDialog
          identifier={identifier}
          initialIsAll={containsAllPasses}
          initialSelectedPasses={passIds}
          onClose={closeDialog}
          onSubmit={updatePassesInNotification}
          open={passSelectionDialogOpen}
          passes={passSelectionAvailable}
          submitButtonLabel={t('notifications.save')}
          title={`${t('notifications.dialogTitle')}: ${
            props.notification.event_rules.name
          }`}
        />
      </Grid>
      <Divider className={classes.divider} />

      <Paper className={classes.paperDetail}>
        {containsAllPasses ? (
          <Grid
            container
            className={classes.allPasses}
            justifyContent="flex-start"
          >
            <CheckCircle className={classes.gray} />
            <Typography variant="body1">
              {t(`notifications.allPassSelected.${identifier}`)}
            </Typography>
          </Grid>
        ) : (
          <PaginatedListBase
            itemPerPage={3}
            items={currentPagePasses}
            listProps={{
              disablePadding: true,
              className: classes.passList,
            }}
            loading={false}
            nbItems={passIds.length}
            onPageRequested={loadPage}
            page={currentPage}
            renderItem={renderListItem}
          />
        )}
      </Paper>
    </>
  );
};

const useStyles = makeStyles((theme) => ({
  paperDetail: {
    marginTop: theme.spacing(2),
    padding: theme.spacing(2),
  },
  divider: {
    marginBottom: theme.spacing(2),
  },
  gray: {
    color: 'rgba(0,0,0,0.54)',
  },
  itemPass: {
    borderBottom: '1px solid #E0E0E0',
    padding: theme.spacing(2),
  },
  passList: {
    flexDirection: 'column',
    display: 'flex',
    gap: theme.spacing(2),
  },
  marginLeft: {
    marginLeft: theme.spacing(2),
  },
  titleMargin: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(1),
  },
  sectionTitle: {
    marginBottom: theme.spacing(1),
  },
  allPasses: {
    gap: theme.spacing(1),
    padding: theme.spacing(2),
  },
}));

export default MarketingRulePassPaginatedList;
