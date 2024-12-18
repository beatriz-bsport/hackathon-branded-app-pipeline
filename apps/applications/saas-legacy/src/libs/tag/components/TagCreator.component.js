// @flow
import React from 'react';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import CancelIcon from '@material-ui/icons/Cancel';
import SaveIcon from '@material-ui/icons/Save';

import { compose, withState } from 'recompose';
import { withTranslation, TFunction } from 'react-i18next';

type Props = {
  setTagName: (string) => void,
  tagName: string,
  onCreate: (data: { name: string }) => void,
  onCancel: () => void,
  t: TFunction,
};

export const TagCreator = (props: Props) => (
  <form
    onSubmit={(ev: SyntheticEvent<HTMLElement>) => {
      ev.preventDefault();
      props.onCreate({ name: props.tagName });
    }}
  >
    <IconButton color="primary" type="submit">
      <SaveIcon />
    </IconButton>
    <TextField
      autoFocus
      onChange={(event) => props.setTagName(event.target.value)}
      placeholder={props.t('form.tag.namePlaceholder')}
      style={{ width: 200 }}
      value={props.tagName}
      variant="outlined"
    />
    <IconButton onClick={props.onCancel}>
      <CancelIcon />
    </IconButton>
  </form>
);

export default compose(
  withTranslation(['tag']),
  withState('tagName', 'setTagName', ''),
)(TagCreator);
