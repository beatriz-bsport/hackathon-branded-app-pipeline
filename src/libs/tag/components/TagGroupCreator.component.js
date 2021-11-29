// @flow
import React from 'react';
import { withTranslation, TFunction } from 'react-i18next';
import CancelIcon from '@material-ui/icons/Cancel';
import SaveIcon from '@material-ui/icons/Save';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import { compose, withState } from 'recompose';

type Props = {
  t: TFunction,
  onCancel: () => void,
  onCreate: ({ name: string }) => void,
  name: string,
  setName: (string) => void,
};

export const TagGroupCreator = (props: Props) => (
  <form
    style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexDirection: 'row',
    }}
    onSubmit={(ev: SyntheticEvent<HTMLElement>) => {
      ev.preventDefault();
      props.onCreate({ name: props.name });
    }}
  >
    <div>
      <IconButton color="primary" type="submit">
        <SaveIcon />
      </IconButton>
      <TextField
        autoFocus
        value={props.name}
        variant="outlined"
        placeholder={props.t('form.group.namePlaceholder')}
        onChange={(ev) => props.setName(ev.target.value)}
      />
    </div>
    <IconButton onClick={props.onCancel}>
      <CancelIcon />
    </IconButton>
  </form>
);

export default compose(
  withTranslation(['tag']),
  withState('name', 'setName', ''),
)(TagGroupCreator);
