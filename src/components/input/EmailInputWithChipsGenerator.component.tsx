import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import TextField from '@material-ui/core/TextField';
import Chip from '@material-ui/core/Chip';
import { FieldArray } from 'formik';
import { makeStyles, Theme } from '@material-ui/core';

type Props = {
  emailList: Array<string>;
  textFieldLabel: string;
  textFieldName: string;
  addEmailToList: (email: string) => void;
  removeEmailFromList: (index: number) => void;
  disabled: boolean;
};

const emailRegexp = new RegExp('[A-z0-9-_]+@[A-z0-9-_]+.[A-z]+$');

export const EmailInputWithChipsGenerator = (props: Props) => {
  const { removeEmailFromList, emailList, addEmailToList } = props;
  const { t } = useTranslation(['translation']);
  const classes = useStyles();
  const [currentTextInput, setCurrentTextInput] = useState('');
  const [wrongChips, setWrongChips] = useState([]);
  const [error, setError] = useState(false);

  const handleKeyDown = (e: any) => {
    const text = currentTextInput;
    if (
      (e.key === ' ' || e.key === ',' || e.key === 'Tab') &&
      text.length > 0
    ) {
      if (emailRegexp.test(text) && emailList.includes(text)) {
        setError(true);
      } else if (emailRegexp.test(text) && !emailList.includes(text)) {
        addEmailToList(text);
        setCurrentTextInput('');
      } else {
        setWrongChips((prevState) => [...prevState, text]);
        setCurrentTextInput('');
      }
    }
  };

  const handleChange = (e: any) => {
    if (error) {
      setError(false);
    }
    if (e.target.value !== ' ' && e.target.value !== ',') {
      setCurrentTextInput(e.target.value);
    }
  };

  const removeChip = (text: string) => {
    const chipList = [...wrongChips];
    const updatedWrongChips = chipList.filter((c) => c !== text);
    setWrongChips(updatedWrongChips);
  };

  const handleBlur = () => {
    const text = currentTextInput;
    if (emailRegexp.test(text) && !emailList.includes(text)) {
      addEmailToList(text);
      setCurrentTextInput('');
    }
  };

  return (
    <div className={classes.container}>
      <TextField
        error={error}
        value={currentTextInput}
        label={props.textFieldLabel}
        variant="standard"
        onChange={(e) => handleChange(e)}
        onKeyDown={(e) => handleKeyDown(e)}
        helperText={error ? t('form.warningAddEmail') : t('form.emailHelper')}
        name={props.textFieldName}
        disabled={props.disabled}
        onBlur={handleBlur}
      />
      <div className={classes.chipContainer}>
        {wrongChips &&
          wrongChips.length > 0 &&
          wrongChips.map((text, index) => (
            <div className={classes.chip}>
              <Chip
                label={text}
                key={`${index} - ${text}`}
                onDelete={props.disabled ? null : () => removeChip(text)}
                color="primary"
                style={{ backgroundColor: 'red' }}
              />
            </div>
          ))}
        {emailList &&
          emailList.length > 0 &&
          emailList.map((email, index) => (
            <div className={classes.chip}>
              <Chip
                label={email}
                key={`${index} - ${email}`}
                onDelete={
                  props.disabled ? null : () => removeEmailFromList(index)
                }
              />
            </div>
          ))}
      </div>
    </div>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
  },
  chip: {
    padding: theme.spacing(0.2),
  },
  chipContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: theme.spacing(0.5),
  },
}));

export default EmailInputWithChipsGenerator;

export const EmailInputWithChipsField = (props: Props) => {
  return (
    <FieldArray {...props} name={props.textFieldName}>
      {({ remove, push }) => {
        return (
          <div>
            <EmailInputWithChipsGenerator
              {...props}
              addEmailToList={push}
              removeEmailFromList={remove}
            />
          </div>
        );
      }}
    </FieldArray>
  );
};
