// @flow
import React from 'react';

import Select from '@material-ui/core/Select';
import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import InputLabel from '@material-ui/core/InputLabel';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose, withState } from 'recompose';
import type { TagGroup } from '../types';

type TagFilterFormType = {
  include: ?boolean,
  tagGroupId: ?number,
  tagId: ?number,
};

type Props = {
  tagGroups: Array<TagGroup>,
  form: TagFilterFormType,
  setForm: (TagFilterFormType) => void,
  createFilter: (TagFilterFormType) => void,
  open: boolean,
  onClose: () => void,
  selectedTagGroup: TagGroup,

  t: TFunction,
  classes: Object,
};

export const TagFilterForm = (props: Props) => {
  const selectedTagGroup = props.tagGroups.find(
    (tg) => tg.id === props.form.tagGroupId,
  );

  const handleChange = (field) => (value) =>
    props.setForm({ ...props.form, [field]: value });

  return (
    <Dialog open={!!props.open} onClose={props.onClose}>
      <DialogTitle id="alert-dialog-title">
        {props.t('form.filter.title')}
      </DialogTitle>
      <DialogContent>
        <FormControl className={props.classes.selector}>
          <InputLabel shrink={props.form.include !== null}>
            {props.t('form.filter.includeLabel')}
          </InputLabel>
          <Select
            value={props.form.include}
            onChange={(ev) => handleChange('include')(!!ev.target.value)}
          >
            <MenuItem value>{props.t('form.filter.include')}</MenuItem>
            <MenuItem value={false}>{props.t('form.filter.exclude')}</MenuItem>
          </Select>
        </FormControl>
        <FormControl className={props.classes.selector}>
          <InputLabel shrink={!!props.form.tagGroupId}>
            {props.t('form.filter.tagGroupLabel')}
          </InputLabel>
          <Select
            value={props.form.tagGroupId}
            onChange={(ev) => {
              props.setForm({
                ...props.form,
                tagId: null,
                tagGroupId: parseInt(ev.target.value, 10),
              });
            }}
          >
            {props.tagGroups.map((tg) => (
              <MenuItem key={`${tg.id}`} value={tg.id}>
                {tg.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl className={props.classes.selector}>
          <InputLabel shrink={!!props.form.tagId}>
            {props.t('form.filter.tagLabel')}
          </InputLabel>
          <Select
            className={props.classes.selector}
            disabled={!!props.selectedTagGroup}
            onChange={(ev) =>
              handleChange('tagId')(parseInt(ev.target.value, 10))
            }
            placeholder={props.t('tag.noTagAttributed')}
            value={props.form.tagId}
          >
            {(selectedTagGroup ? selectedTagGroup.tags.asMutable() : []).map(
              (tag) => (
                <MenuItem key={`${tag.id}`} value={tag.id}>
                  {tag.name}
                </MenuItem>
              ),
            )}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button color="secondary" onClick={props.onClose}>
          {props.t('form.filter.cancel')}
        </Button>
        <Button
          color="primary"
          onClick={() => {
            if (
              props.form.include !== null &&
              props.form.tagId &&
              props.form.tagGroupId
            ) {
              props.createFilter(props.form);
              props.setForm({ include: null, tagId: null, tagGroupId: null });
            }
          }}
        >
          {props.t('form.filter.addFilter')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const styles = (theme) => ({
  container: {
    display: 'flex',
    alignItems: 'flex-end',
    flexDirection: 'column',
  },
  selector: {
    width: 180,
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  leftIcon: {
    marginRight: theme.spacing(1),
  },
});

export default compose(
  withStyles(styles),
  withState('form', 'setForm', {
    include: null,
    tagGroupId: null,
    tagId: null,
  }),
  withTranslation(['tag']),
)(TagFilterForm);
