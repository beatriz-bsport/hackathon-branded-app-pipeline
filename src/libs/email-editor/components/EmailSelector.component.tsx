import React, { useMemo } from 'react';
import moment from 'moment-timezone';
import classNames from 'classnames';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';

// @ts-expect-error
import Selector from '../../../components/Selector.component';
import type { EmailTemplateSummary } from '../types';

type Props = {
  classes?: any;
  emails: EmailTemplateSummary[];
  onChange: (id?: number) => void;
  helperText: string;
  value?: number;
  selectorClass?: string;
  nullCurrentValue?: boolean;
  disabled?: boolean;
};

type EmailOptionProps = {
  data: any;
  innerRef: any;
  innerProps: any;
  isSelected?: boolean;
  isFocused: boolean;
};

const EmailOption: React.FC<EmailOptionProps> = React.memo(
  ({ data, innerRef, innerProps, isSelected, isFocused }) => {
    return (
      <div ref={innerRef} {...innerProps}>
        <ListItem button divider selected={isFocused || isSelected}>
          <ListItemText
            primary={
              <Typography component="span" variant="subtitle1">
                {data.pp.title}
              </Typography>
            }
            secondary={data.pp.subject}
          />
        </ListItem>
      </div>
    );
  },
);

export const EmailSelector: React.FC<Props> = ({
  value,
  onChange,
  emails,
  classes,
  selectorClass,
  helperText,
  nullCurrentValue,
  disabled,
}) => {
  const suggestions = useMemo(
    () =>
      emails
        ? [...emails]
            ?.filter((email) => !email?.is_default_bsport_template)
            ?.sort((pp, pp_) => {
              if (moment(pp.date_modified) > moment(pp_.date_modified))
                return 1;
              return -1;
            })
            ?.map((pp) => ({
              value: pp.id,
              label: pp.title,
              pp,
            }))
        : [],
    [emails],
  );

  return (
    <Selector
      isClearable
      searchIcon
      className={classNames(classes, selectorClass)}
      components={{ Option: EmailOption }}
      isDisabled={disabled}
      nullCurrentValue={nullCurrentValue}
      onChange={onChange}
      placeholder={helperText}
      selected={value}
      suggestions={suggestions}
    />
  );
};

export default React.memo(EmailSelector);
