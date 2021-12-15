import React from 'react';
import Typography from '@material-ui/core/Typography';
import { FieldAttributes, useField } from 'formik';
import { useTranslation } from 'react-i18next';
import { makeStyles, Theme } from '@material-ui/core';

import { TextField } from '../../../components/forms';
import MaterialUISelector, {
  OptionTypeBase,
} from '../../../components/Selector/MaterialUISelector.component';

import { MAX_LENGTH_PUSH_CONTENT } from '../constant';

type Props = {
  value: string;
  tags: OptionTypeBase[];
} & FieldAttributes<any>;

const NotificationContentInput = (props: Props) => {
  const { tags, ...rest } = props;

  const { t } = useTranslation(['booking']);
  const classes = useStyles();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [field, _, helper] = useField(rest);

  const handleAddvariable = (data: OptionTypeBase) => {
    if (data.value) {
      helper.setValue(`${field.value} ${data.value}`, true);
    }
  };
  return (
    <>
      <TextField
        fullWidth
        multiline
        rows={5}
        inputProps={{ maxLength: MAX_LENGTH_PUSH_CONTENT }}
        variant="outlined"
        {...rest}
      />
      <div className={classes.bottomBar}>
        <Typography variant="caption">
          {`${field.value?.length ?? 0}/${MAX_LENGTH_PUSH_CONTENT}`}
        </Typography>
        <MaterialUISelector
          options={tags}
          value={{
            label: t('booking:notification.form.addVariable'),
            value: '',
          }}
          isMulti={false}
          onChange={handleAddvariable}
          withoutPortal
          className={classes.selector}
        />
      </div>
    </>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  bottomBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  selector: {
    marginTop: theme.spacing(1),
    width: 300,
  },
}));

export default NotificationContentInput;
