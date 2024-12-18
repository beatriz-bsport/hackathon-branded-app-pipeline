import React, { useState, useCallback } from 'react';
import debounce from 'lodash/debounce';
import { useTranslation } from 'react-i18next';
import TextField from '@material-ui/core/TextField';
import Chip from '@material-ui/core/Chip';
import { makeStyles, Theme } from '@material-ui/core';
import { emailValidationRegExp } from '#src/libs/custom-form/constants';

export type Props = {
  emailList: Array<string>;
  textFieldLabel: string;
  textFieldName: string;
  addEmailToList: (email: string) => void;
  removeEmailFromList: (index: number) => void;
  disabled: boolean;
  required: true;
};

export const EmailInputWithChips = (props: Props) => {
  const { removeEmailFromList, emailList, addEmailToList } = props;
  const { t } = useTranslation(['translation']);
  const classes = useStyles();
  const [currentTextInput, setCurrentTextInput] = useState('');
  const [wrongChips, setWrongChips] = useState([]);
  const [error, setError] = useState(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const generateAutomaticChip = useCallback(
    debounce(
      (
        text: string,
        addTextToList: (text: string) => void,
        setTextInput: (text: string) => void,
        list: Array<string>,
      ) => {
        if (emailValidationRegExp.test(text) && !list.includes(text)) {
          addTextToList(text);
          setTextInput('');
        }
      },
      500,
    ),
    [],
  );

  const handleKeyDown = (e: any) => {
    const text = currentTextInput;
    if (
      (e.key === ' ' || e.key === ',' || e.key === 'Tab') &&
      text.length > 0
    ) {
      if (emailValidationRegExp.test(text) && !emailList.includes(text)) {
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
    if (e.key !== ' ' && e.key !== ',') {
      if (emailList.includes(e.target.value)) {
        setError(true);
      }
      setCurrentTextInput(e.target.value);
    }
    generateAutomaticChip(
      e.target.value,
      addEmailToList,
      setCurrentTextInput,
      emailList,
    );
  };

  const removeChip = (text: string) => {
    const chipList = [...wrongChips];
    const updatedWrongChips = chipList.filter((c) => c !== text);
    setWrongChips(updatedWrongChips);
  };

  return (
    <div className={classes.container}>
      <TextField
        disabled={props.disabled}
        error={error || (props.required && !emailList?.length)}
        helperText={error ? t('form.warningAddEmail') : t('form.emailHelper')}
        label={props.textFieldLabel}
        name={props.textFieldName}
        onChange={(e) => handleChange(e)}
        onKeyDown={(e) => handleKeyDown(e)}
        value={currentTextInput}
        variant="standard"
      />
      <div className={classes.chipContainer}>
        {wrongChips &&
          wrongChips.length > 0 &&
          wrongChips.map((text, index) => (
            <div className={classes.chip}>
              <Chip
                key={`${index} - ${text}`}
                color="primary"
                label={text}
                onDelete={props.disabled ? null : () => removeChip(text)}
                style={{ backgroundColor: 'red' }}
              />
            </div>
          ))}
        {emailList &&
          emailList.length > 0 &&
          emailList.map((email, index) => (
            <div className={classes.chip}>
              <Chip
                key={`${index} - ${email}`}
                label={email}
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

export default EmailInputWithChips;
