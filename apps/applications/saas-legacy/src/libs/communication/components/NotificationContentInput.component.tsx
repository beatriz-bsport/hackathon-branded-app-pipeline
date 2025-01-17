import React from 'react';
import Typography from '@material-ui/core/Typography';
import { FieldAttributes, useField } from 'formik';
import { useTranslation } from 'react-i18next';
import { makeStyles, Theme } from '@material-ui/core';

// @ts-expect-error
import { TextField } from '../../../components/forms';
import MaterialUISelector, {
  OptionTypeBase,
} from '../../../components/Selector/MaterialUISelector.component';

import { MAX_LENGTH_PUSH_CONTENT } from '../constants';

type Props = {
  value: string;
  tags: OptionTypeBase[];
} & FieldAttributes<any>;

const NotificationContentInput = (props: Props) => {
  const { tags, ...rest } = props;

  const { t } = useTranslation(['booking']);
  const classes = useStyles();

  const [field, _, helper] = useField(rest);

  const handleAddvariable = (data: OptionTypeBase) => {
    // @ts-expect-error
    if (data.value) {
      // @ts-expect-error
      helper.setValue(`${field.value} ${data.value}`, true);
    }
  };
  return (
    <>
      <TextField
        fullWidth
        multiline
        inputProps={{ maxLength: MAX_LENGTH_PUSH_CONTENT }}
        rows={5}
        variant="outlined"
        {...rest}
      />
      <div className={classes.bottomBar}>
        <Typography variant="caption">
          {`${field.value?.length ?? 0}/${MAX_LENGTH_PUSH_CONTENT}`}
        </Typography>
        <MaterialUISelector
          withoutPortal
          className={classes.selector}
          isMulti={false}
          onChange={handleAddvariable}
          options={tags}
          value={{
            label: t('booking:notification.form.addVariable'),
            value: '',
          }}
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
