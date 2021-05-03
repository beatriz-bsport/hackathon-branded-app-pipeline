import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import SaveIcon from '@material-ui/icons/Save';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close';
import DoubleArrowIcon from '@material-ui/icons/DoubleArrow';
import FormHelperText from '@material-ui/core/FormHelperText';
import GroupIcon from '@material-ui/icons/Group';
import Zoom from '@material-ui/core/Zoom';

type Props = {
  t: TFunction,
  tagRule: Object,
  tag_groups: Object,
  createAutoTag: (data: object) => void,
  deleteAutoTag: (id: number) => void,
  updateAutoTag: (id: number, data: object) => void,
  tags: Object,
  creationCard: boolean,
};
const useStyles = makeStyles((theme) => ({
  formHeader: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  formFooter: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tagSelect: {
    paddingTop: theme.spacing(2),
    display: 'flex',
    justifyContent: 'space-around',
    margin: 'auto',
  },
  flexLabelSelector: {
    display: 'flex',
    flexDirectio: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  insideIcon: {
    color: '#3f51b5',
  },
  joinIcon: {
    color: '#00c853',
  },
  leavingIcon: {
    color: '#ff3d00',
    transform: 'rotate(180deg)',
  },
}));

const TAG_ON_JOIN_AND_UNTAG_ON_LEFT = 1;
const TAG_ON_JOIN_AND_KEEP_TAG = 2;
const TAG_ON_LEFT = 3;

export const TagRuleListItem = (props: Props) => {
  const { t } = props;
  const classes = useStyles();
  const [editRule, setEditRule] = useState(false);
  const [tagRuleState, setTagRuleState] = useState(props.tagRule);

  const handleTagGroupSelection = (value) => {
    setTagChoices(props.tag_groups.find((group) => group.id === value));
  };
  const [tagChoices, setTagChoices] = useState({});
  const handleUpdateTagRule = () => {
    setEditRule(false);
    props.updateAutoTag(props.tagRule.id, tagRuleState);
  };
  const handleCreateTagRule = () => {
    setEditRule(false);
    if (props.creationCard) {
      setTagRuleState(props.tagRule);
    }
    props.createAutoTag(tagRuleState);
  };
  useEffect(() => {
    const initialTagGroup = props.tag_groups.find((group) =>
      group.tags.find((tag) => tag.id === props.tagRule.tag),
    );
    if (initialTagGroup) setTagChoices(initialTagGroup);
  }, [props.tag_groups, props.tags, props.tagRule.tag]);
  const TAG_RULE_CHOICES = [
    {
      value: TAG_ON_JOIN_AND_UNTAG_ON_LEFT,
      label: (
        <div className={classes.flexLabelSelector}>
          <GroupIcon className={classes.insideIcon} />
          <Typography>
            {`${t('tag_rules.tag_on_join_and_untag_on_left')}`}
          </Typography>
        </div>
      ),
    },
    {
      value: TAG_ON_JOIN_AND_KEEP_TAG,
      label: (
        <div className={classes.flexLabelSelector}>
          <DoubleArrowIcon className={classes.joinIcon} />
          <Typography>{`${t('tag_rules.tag_on_join')}`}</Typography>
        </div>
      ),
    },
    {
      value: TAG_ON_LEFT,
      label: (
        <div className={classes.flexLabelSelector}>
          <DoubleArrowIcon className={classes.leavingIcon} />
          <Typography>{`${t('tag_rules.tag_on_left')}`}</Typography>
        </div>
      ),
    },
  ];
  return (
    <Card>
      <CardContent>
        <div>
          <Select
            id="standard-select-currency"
            disabled={!editRule}
            value={tagRuleState.kind}
            label="Select"
            onChange={(event) =>
              setTagRuleState({ ...tagRuleState, kind: event.target.value })
            }
          >
            {TAG_RULE_CHOICES.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </div>
        <div className={classes.tagSelect}>
          <FormControl>
            <Select
              labelId="tag-group"
              value={`${tagChoices.id}`}
              disabled={!editRule}
              onChange={(event) => handleTagGroupSelection(event.target.value)}
            >
              {props.tag_groups.map((group) => (
                <MenuItem key={group.id} value={group.id}>
                  {group.name}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>{`${t('tag_rules.tag_group')}`}</FormHelperText>
          </FormControl>
          <FormControl error={!tagRuleState.tag}>
            <Select
              labelId="tag_name"
              value={tagRuleState.tag}
              disabled={!editRule}
              onChange={(event) =>
                setTagRuleState({ ...tagRuleState, tag: event.target.value })
              }
            >
              {tagChoices.tags &&
                tagChoices.tags.map((tag) => (
                  <MenuItem key={tag.id} value={tag.id.toString()}>
                    {tag.name}
                  </MenuItem>
                ))}
            </Select>
            <FormHelperText>{`${t('tag_rules.tag_name')}`}</FormHelperText>
          </FormControl>
        </div>
      </CardContent>
      <CardActions className={classes.formFooter}>
        {props.updateAutoTag && (
          <IconButton
            color="secondary"
            aria-label="modify rule"
            component="span"
            onClick={() => setEditRule(!editRule)}
            className={classes.editIcon}
          >
            {editRule ? <CloseIcon /> : <EditIcon />}
          </IconButton>
        )}

        {editRule && !props.creationCard && (
          <IconButton
            color="primary"
            aria-label="save rule modification"
            component="span"
            onClick={() => {
              props.deleteAutoTag(props.tagRule.id);
              setEditRule(!editRule);
            }}
          >
            <Zoom in={editRule}>
              <DeleteIcon />
            </Zoom>
          </IconButton>
        )}

        {props.updateAutoTag && editRule && (
          <IconButton
            disabled={!editRule}
            color="secondary"
            aria-label="save rule modification"
            component="span"
            onClick={() => handleUpdateTagRule()}
          >
            <Zoom in={editRule}>
              <SaveIcon />
            </Zoom>
          </IconButton>
        )}
        {props.createAutoTag && (
          <Button
            variant="contained"
            color="primary"
            onClick={() => setEditRule(!editRule)}
            startIcon={editRule ? <CloseIcon /> : <AddIcon />}
          >
            {`${editRule ? t('tag_rules.cancel') : t('tag_rules.create')}`}
          </Button>
        )}
        {props.createAutoTag && editRule && (
          <IconButton
            disabled={!editRule || !tagRuleState.tag}
            color="primary"
            aria-label="create rule"
            component="span"
            onClick={() => handleCreateTagRule()}
          >
            <Zoom in={editRule}>
              <SaveIcon />
            </Zoom>
          </IconButton>
        )}
      </CardActions>
    </Card>
  );
};

export default withTranslation(['smartList'])(TagRuleListItem);
