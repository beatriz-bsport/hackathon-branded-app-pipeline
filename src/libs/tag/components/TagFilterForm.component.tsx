// @flow
import React from 'react';

import { WithTranslation, withTranslation } from 'react-i18next';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { compose, withState } from 'recompose';
import { makeStyles } from '@material-ui/styles';
import { Theme } from '@material-ui/core/styles';
import type { Tag, TagGroupAPI } from '../types';
import MaterialUISelector from '../../../components/Selector/MaterialUISelector.component';
import TagSelector from './TagSelector.selector';

type TagFilterFormType = {
  include?: boolean;
  tagId?: number;
};

type OwnProps = {
  tagList: Array<Tag<TagGroupAPI>>;

  createFilter: (form: TagFilterFormType) => void;
  open: boolean;
  onClose: () => void;
};

type WithState = {
  form: TagFilterFormType;
  setForm: (form: TagFilterFormType) => void;
};

type Props = OwnProps & WithTranslation & WithState;

export const TagFilterForm = (props: Props) => {
  const { tagList, t } = props;
  const classes = useStyle();
  const includeOption = { value: true, label: t('form.filter.include') };
  const excludeOption = { value: false, label: t('form.filter.exclude') };

  return (
    <Dialog open={!!props.open} onClose={props.onClose}>
      <DialogTitle id="alert-dialog-title">
        {props.t('form.filter.title')}
      </DialogTitle>
      <DialogContent className={classes.container}>
        <MaterialUISelector
          className={classes.selector}
          placeholder={t('form.filter.includeLabel')}
          options={[includeOption, excludeOption]}
          onChange={(option: typeof includeOption) =>
            props.setForm({ ...props.form, include: option.value })
          }
        />
        <div className={classes.selector}>
          <TagSelector
            noMulti
            allTagsWithTagGroup={tagList}
            selectedTags={[props.form.tagId]}
            onChange={(option) =>
              props.setForm({
                ...props.form,
                tagId: option.tag.id,
              })
            }
            onDeleteTag={() =>
              props.setForm({
                ...props.form,
                tagId: null,
              })
            }
          />
        </div>
      </DialogContent>
      <DialogActions>
        <Button color="secondary" onClick={props.onClose}>
          {props.t('form.filter.cancel')}
        </Button>
        <Button
          color="primary"
          onClick={() => {
            if (props.form.include !== null && props.form.tagId) {
              props.createFilter(props.form);
              props.setForm({ include: null, tagId: null });
            }
          }}
        >
          {props.t('form.filter.addFilter')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const useStyle = makeStyles<Theme>((theme) => ({
  container: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.spacing(2),
  },
  selector: {
    width: 250,
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  leftIcon: {
    marginRight: theme.spacing(1),
  },
}));

export default compose<any, OwnProps>(
  withState('form', 'setForm', {
    include: null,
    tagId: null,
  }),
  withTranslation(['tag']),
)(TagFilterForm);
