// @flow
import React from 'react';

import { WithTranslation, withTranslation } from 'react-i18next';
import Fab from '@material-ui/core/Fab';

import { compose, withState } from 'recompose';
import DoneIcon from '@material-ui/icons/Done';
import { makeStyles } from '@material-ui/styles';
import { Theme } from '@material-ui/core/styles';
import type { Tag } from '../types';
import TagSelector from './TagSelector.selector';
import MaterialUISelector from '../../../components/Selector/MaterialUISelector.component';

type TagFilterFormType = {
  include?: boolean;
  tagId?: number;
};

type OwnProps = {
  form: TagFilterFormType;
  setForm: (form: TagFilterFormType) => void;
  createFilter: (form: TagFilterFormType) => void;
  tagList: Array<Tag>;
};
type Props = OwnProps & WithTranslation;

export const TagFilterForm = (props: Props) => {
  const { t, tagList } = props;
  const classes = useStyles();
  const includeOption = { value: true, label: t('form.filter.include') };
  const excludeOption = { value: false, label: t('form.filter.exclude') };

  return (
    <div className={classes.container}>
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

      <Fab
        className={classes.fabIcon}
        size="small"
        disabled={props.form.include === null || props.form.tagId === null}
        color="primary"
        onClick={() => {
          if (props.form.include !== null && props.form.tagId) {
            props.createFilter(props.form);
            props.setForm({ include: null, tagId: null });
          }
        }}
      >
        <DoneIcon />
      </Fab>
    </div>
  );
};

const useStyles = makeStyles<Theme>((theme) => ({
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
    gap: theme.spacing(2),
    height: theme.spacing(10),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
  selector: {
    width: 250,
  },
}));

export default compose<any, Props>(
  withState('form', 'setForm', {
    include: null,
    tagId: null,
  }),
  withTranslation(['tag']),
)(TagFilterForm);
