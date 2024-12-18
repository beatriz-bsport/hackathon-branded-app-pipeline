import React from 'react';
import { compose } from 'recompose';
import { WithTranslation, withTranslation } from 'react-i18next';
import withStyles from '@material-ui/core/styles/withStyles';
import Popover from '@material-ui/core/Popover';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import LinkIcon from '@material-ui/icons/Link';
import LinkOffIcon from '@material-ui/icons/LinkOff';
import FormHelperText from '@material-ui/core/FormHelperText';
import Typography from '@material-ui/core/Typography';
import { Theme } from '@material-ui/core/styles';
import { MaterialStyleType } from '../../../../utils/types';

type OwnProps = {};
type Props = OwnProps &
  WithTranslation &
  MaterialStyleType<ReturnType<typeof styles>>;

export const CustomFormBuilderTagRuleSelector = (props: Props) => {
  const { t, classes } = props;
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [open, setOpen] = React.useState(false);
  // @ts-expect-error
  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
    setOpen(false);
  };
  React.useEffect(() => {
    if (anchorEl) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [anchorEl]);
  const [tagRuleState, setTagRuleState] = React.useState(
    // @ts-expect-error
    props.choice_tag_rule
      ? {
          // @ts-expect-error
          ...props.choice_tag_rule,
          // @ts-expect-error
          ...(props.choice_tag_rule && {
            // @ts-expect-error
            tag_group: props.tag_groups.find((group) =>
              // @ts-expect-error
              group.tags.find((tag) => tag.id === props.choice_tag_rule.tag_id),
            ),
          }),
        }
      : null,
  );
  // @ts-expect-error
  const handleTagGroupSelection = (value) => {
    setTagRuleState({
      ...tagRuleState,
      // @ts-expect-error
      tag_group: props.tag_groups.find((group) => group.id === value),
    });
  };
  const [showTagRule, setShowTagRule] = React.useState(false);
  if (!showTagRule && !tagRuleState) {
    return (
      <>
        <IconButton onClick={() => setShowTagRule(!showTagRule)}>
          <LinkIcon
            aria-haspopup="true"
            aria-owns={open ? 'mouse-over-popover' : undefined}
            color="primary"
            onMouseEnter={handlePopoverOpen}
            onMouseLeave={handlePopoverClose}
          />
        </IconButton>
        <Popover
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          classes={{
            paper: classes.paper,
          }}
          className={classes.popover}
          id="mouse-over-popover"
          onClose={handlePopoverClose}
          open={open}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
        >
          <Typography variant="caption">
            {t('customForm.field.link_to_tag_popover')}
          </Typography>
        </Popover>
      </>
    );
  }
  return (
    <>
      <IconButton
        onClick={() => {
          // @ts-expect-error
          props.deleteTagRule();
          setTagRuleState(null);
          setShowTagRule(false);
          setAnchorEl(null);
          setOpen(false);
        }}
      >
        <LinkOffIcon color="primary" />
      </IconButton>
      <FormControl className={classes.select}>
        <Select
          // @ts-expect-error
          disabled={!!props.choice_tag_rule?.tag_id}
          labelId="tag-group"
          onChange={(event) => handleTagGroupSelection(event.target.value)}
          value={`${tagRuleState?.tag_group && tagRuleState.tag_group.id}`}
        >
          {/* @ts-expect-error */}
          {props.tag_groups.map((group) => (
            <MenuItem key={group.id} value={group.id}>
              {group.name}
            </MenuItem>
          ))}
        </Select>
        <FormHelperText>{`${t('customForm.field.tag_group')}`}</FormHelperText>
      </FormControl>
      <FormControl className={classes.select}>
        <Select
          disabled={!!tagRuleState?.tag_id}
          labelId="tag_name"
          onChange={(event) => {
            // @ts-expect-error
            props.setTag(event.target.value);
            setTagRuleState({
              ...tagRuleState,
              // @ts-expect-error
              tag_id: event.target.value && parseInt(event.target.value),
            });
          }}
          value={`${tagRuleState?.tag_id && tagRuleState.tag_id.toString()}`}
        >
          {tagRuleState &&
            // @ts-expect-error
            tagRuleState?.tag_group?.tags?.map((tag) => (
              <MenuItem key={tag.id} value={tag.id.toString()}>
                {tag.name}
              </MenuItem>
            ))}
        </Select>
        <FormHelperText>{`${t('customForm.field.tag_name')}`}</FormHelperText>
      </FormControl>
    </>
  );
};

const styles = (theme: Theme) => ({
  popover: {
    pointerEvents: 'none',
  },
  paper: {
    padding: theme.spacing(1),
  },
  select: {
    width: '30%',
  },
});
export default compose<any, OwnProps>(
  withTranslation('marketing'),
  // @ts-expect-error
  withStyles(styles),
)(CustomFormBuilderTagRuleSelector);
