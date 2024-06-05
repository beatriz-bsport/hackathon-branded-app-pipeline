import React, { useCallback, useMemo } from 'react';
import SeamlessImmutable from 'seamless-immutable';
import { Button, CircularProgress, makeStyles } from '@material-ui/core';
import SendIcon from '@material-ui/icons/Send';
import * as Yup from 'yup';

import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import {
  Formik,
  FormikProps,
  validateYupSchema,
  yupToFormErrors,
} from 'formik';
import { useTranslation } from 'react-i18next';
import type { FranchiseCompany } from '#libs/franchise/types';
import type { SmartList } from '#libs/smart-list/types';
import type {
  CompanyWithSmartList,
  CommunicationSentGroupConfig,
  CommunicationSentGroupConfigFormValues,
} from '#libs/communication/types';
import CommunicationSentGroupConfigSmartlistSelectionPanel from '#libs/communication/components/communication-sent-group-config/CommunicationSentGroupConfigSmartlistSelectionPanel';
import { getCompaniesWithSmartLists } from '#libs/communication/utils';
import { OptionCallback } from '../../../../state/types';

const CommunicationSentGroupConfigValidationSchema = Yup.object().shape({
  sendToAllMembers: Yup.boolean().test({
    name: 'nonEmptyToggle',
    test: function nonEmptyToggle(sendToAllMembers) {
      const {
        companiesWithSmartLists,
      }: { companiesWithSmartLists: CompanyWithSmartList[] } = this.parent;
      const countSmartListToggleFalse = companiesWithSmartLists.reduce(
        (acc, companyWithSmartList) =>
          !companyWithSmartList.toggleSend ? acc + 1 : acc,
        0,
      );
      if (
        !sendToAllMembers &&
        countSmartListToggleFalse === companiesWithSmartLists.length
      ) {
        return this.createError({
          message: 'campaign:schemaError.nonEmptyToggle',
          path: this.path,
        });
      }
      return true;
    },
  }),
  companiesWithSmartLists: Yup.array().of(
    Yup.object().shape({
      companyId: Yup.number().required(),
      companyName: Yup.string().required(),
      toggleSend: Yup.boolean().required(),
      smartListId: Yup.number()
        .nullable()
        .test({
          name: 'nonEmptySmartList',
          test: function nonEmptySmartList(smartListId) {
            const { sendToAllMembers } = this.options
              .context as CommunicationSentGroupConfigFormValues;
            const { toggleSend } = this.parent;
            if (!sendToAllMembers && toggleSend && !smartListId) {
              return this.createError({
                message: 'campaign:schemaError.nonEmptySmartList',
                path: this.path,
              });
            }
            return true;
          },
        }),
    }),
  ),
});
type Props = {
  campaignId: number;
  companies: FranchiseCompany[];
  communicationSentGroupConfigSelected: CommunicationSentGroupConfig;
  generateExportLink: () => void;
  handleEmailDrawerOpen: () => void;
  isCampaignExporting: boolean;
  smartLists: SeamlessImmutable.ImmutableArray<SmartList>;
  updateCommunicationSentGroupConfig: (
    id: number,
    data: CommunicationSentGroupConfig,
    options?: OptionCallback<CommunicationSentGroupConfig>,
  ) => void;
};

const CommunicationSentGroupConfigDetailGeneralPanel: React.FC<Props> = ({
  campaignId,
  companies,
  communicationSentGroupConfigSelected,
  generateExportLink,
  handleEmailDrawerOpen,
  isCampaignExporting,
  smartLists,
  updateCommunicationSentGroupConfig,
}) => {
  const { t } = useTranslation('campaign');
  const classes = useStyles();

  const initialValues: CommunicationSentGroupConfigFormValues = useMemo(() => {
    return {
      sendToAllMembers: true,
      companiesWithSmartLists: ((companies as FranchiseCompany[]) || []).map(
        (company: FranchiseCompany) => ({
          companyId: company.id,
          companyName: company.name,
          smartListId: null,
          toggleSend: false,
        }),
      ),
    };
  }, [companies]);

  const handleOnSubmit = useCallback(
    (values: CommunicationSentGroupConfigFormValues) => {
      // We have to update the config of the CommunicationSentGroupConfig before sending message
      // We either have to_all_members to True and smartlists empty, or smartlists defined and to_all_member to False
      updateCommunicationSentGroupConfig(campaignId, {
        ...communicationSentGroupConfigSelected,
        to_all_members: values.sendToAllMembers,
        smartlists: !values.sendToAllMembers
          ? values.companiesWithSmartLists.reduce((acc: number[], item) => {
              if (item.smartListId && item.toggleSend) {
                acc.push(item.smartListId);
              }
              return acc;
            }, [])
          : [],
      });
    },
    [
      updateCommunicationSentGroupConfig,
      campaignId,
      communicationSentGroupConfigSelected,
    ],
  );

  return (
    <Formik
      enableReinitialize
      initialValues={
        communicationSentGroupConfigSelected
          ? {
              ...communicationSentGroupConfigSelected,
              sendToAllMembers:
                communicationSentGroupConfigSelected.to_all_members,
              companiesWithSmartLists: getCompaniesWithSmartLists(
                companies as FranchiseCompany[],
                smartLists,
                communicationSentGroupConfigSelected,
              ),
            }
          : initialValues
      }
      onSubmit={handleOnSubmit}
      validate={(value) => {
        try {
          validateYupSchema(
            value,
            CommunicationSentGroupConfigValidationSchema,
            true,
            value,
          );
        } catch (err) {
          return yupToFormErrors(err); // for rendering validation errors
        }

        return {};
      }}
      validateOnBlur={false}
    >
      {({
        handleSubmit,
        dirty,
      }: FormikProps<CommunicationSentGroupConfigFormValues>) => {
        return (
          <div>
            <div className={classes.buttonsRow}>
              <Button
                color="secondary"
                disabled={dirty}
                onClick={handleEmailDrawerOpen}
                variant="contained"
              >
                <SendIcon className={classes.leftIcon} />
                {t('mail.sendMail')}
              </Button>

              <Button
                color="secondary"
                disabled={dirty || isCampaignExporting}
                onClick={generateExportLink}
                variant="contained"
              >
                {isCampaignExporting ? (
                  <CircularProgress
                    className={classes.leftIcon}
                    color="inherit"
                    size={25}
                  />
                ) : (
                  <CloudDownloadIcon className={classes.leftIcon} />
                )}
                {t('exportCampaign')}
              </Button>
            </div>
            <CommunicationSentGroupConfigSmartlistSelectionPanel
              disabled={!dirty}
              onSave={handleSubmit}
              smartLists={smartLists}
            />
          </div>
        );
      }}
    </Formik>
  );
};

const useStyles = makeStyles((theme) => ({
  sendCommunicationButtons: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
  },
  sendEmailButton: {
    marginTop: theme.spacing(1),
  },
  leftIcon: {
    marginRight: theme.spacing(1),
  },
  buttonsRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(2),
  },
}));

export default React.memo(CommunicationSentGroupConfigDetailGeneralPanel);
