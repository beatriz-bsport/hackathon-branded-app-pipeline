import {
  Button,
  ButtonBase,
  Collapse,
  ListItem,
  Paper,
  Typography,
  makeStyles,
} from '@material-ui/core';
import React, { memo, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { Alert } from '@material-ui/lab';
import { ErrorMessage, useFormikContext } from 'formik';

import SeamlessImmutable from 'seamless-immutable';
import { SwitchField } from '#src/libs/custom-form/components/GenericFormik.input';
import { CommunicationSentGroupConfigFormValues } from '#src/libs/communication/types';
import { SmartList } from '#src/libs/smart-list/types';
import CommunicationSentGroupConfigSmartlistSelectionRow from './CommunicationSentGroupConfigSmartlistSelectionRow.component';

type Props = {
  smartLists: SeamlessImmutable.ImmutableArray<SmartList>;
  onSave: () => void;
  disabled: boolean;
};

const CommunicationSentGroupConfigSmartlistSelectionPanel: React.FC<Props> = ({
  smartLists,
  onSave,
  disabled,
}) => {
  const { t } = useTranslation('campaign');
  const classes = useStyle();
  const { values, setFieldValue } =
    useFormikContext<CommunicationSentGroupConfigFormValues>();
  const [displayMembersSelection, setDisplayMembersSelection] = useState(true);

  const handleOnDisplayMemberSelectionPanel = useCallback(
    () => setDisplayMembersSelection(!displayMembersSelection),
    [displayMembersSelection],
  );
  const onSaveClick = useCallback(() => onSave(), [onSave]);
  const handleSendToAllMemberField = useCallback(
    () => setFieldValue('sendToAllMembers', !values.sendToAllMembers, false),
    [setFieldValue, values.sendToAllMembers],
  );

  return (
    <div className={classes.memberSelectionPaper}>
      <Paper>
        <ButtonBase
          className={classes.header}
          onClick={handleOnDisplayMemberSelectionPanel}
        >
          <Typography
            className={classes.memberSelectionTitle}
            color={displayMembersSelection ? 'initial' : 'textSecondary'}
            variant="h6"
          >
            {t('memberSelectionTitle')}
          </Typography>
          {displayMembersSelection ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </ButtonBase>
        <Collapse in={displayMembersSelection}>
          <Alert className={classes.alertInfo} severity="info">
            {t('memberSelectionInfo')}
          </Alert>
          <ListItem>
            <div className={classes.column}>
              <SwitchField
                label={t('sendToAllMembers')}
                name="sendToAllMembers"
                onChange={handleSendToAllMemberField}
              />
              <ErrorMessage name="sendToAllMembers">
                {(error_msg) => (
                  <Typography color="error" variant="caption">
                    {t(`${error_msg}`)}
                  </Typography>
                )}
              </ErrorMessage>
            </div>
          </ListItem>
          {!values.sendToAllMembers &&
            values.companiesWithSmartLists.map(
              (companyWithSmartList, index) => (
                <CommunicationSentGroupConfigSmartlistSelectionRow
                  key={companyWithSmartList.smartListId}
                  companyId={companyWithSmartList.companyId}
                  companyName={companyWithSmartList.companyName}
                  index={index}
                  smartLists={smartLists}
                  toggleDisabled={!companyWithSmartList.toggleSend}
                />
              ),
            )}
          <Button
            className={classes.submit}
            color="primary"
            disabled={disabled}
            id="button_config_save"
            onClick={onSaveClick}
            type="submit"
            variant="contained"
          >
            {t('save')}
          </Button>
        </Collapse>
      </Paper>
    </div>
  );
};

const useStyle = makeStyles((theme) => ({
  memberSelectionPaper: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2),
  },
  header: {
    display: 'flex',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    padding: theme.spacing(2),
  },
  alertInfo: { marginLeft: theme.spacing(2), marginRight: theme.spacing(2) },
  column: { display: 'flex', flexDirection: 'column' },
  submit: { marginLeft: theme.spacing(2), marginBottom: theme.spacing(2) },
  memberSelectionTitle: { marginRight: '10px' },
}));

export default memo(CommunicationSentGroupConfigSmartlistSelectionPanel);
