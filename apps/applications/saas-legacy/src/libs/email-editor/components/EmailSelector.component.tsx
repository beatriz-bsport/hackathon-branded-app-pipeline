import React, { useCallback, useMemo } from 'react';
import Select from 'react-select';
import { DateTime } from 'luxon';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';

import type { OptionsType } from 'react-select/lib/types';
import type { EmailTemplateSummary } from '../types';

type Props = {
  emails: EmailTemplateSummary[];
  onChange: (id?: number) => void;
  helperText: string;
  value?: number;
  disabled?: boolean;
  attachSelectorToBody?: boolean;
};

type EmailOptionProps = {
  data: any;
  innerRef: any;
  innerProps: any;
  isSelected?: boolean;
  isFocused: boolean;
};

type EmailTemplateOption = {
  label: string;
  value: number;
  email?: EmailTemplateSummary;
};

const EmailOption: React.FC<EmailOptionProps> = React.memo(
  ({ data, innerRef, innerProps, isSelected, isFocused }) => {
    return (
      <div ref={innerRef} {...innerProps}>
        <ListItem button divider selected={isFocused || isSelected}>
          <ListItemText
            primary={
              <Typography component="span" variant="subtitle1">
                {data.email.title}
              </Typography>
            }
            secondary={data.email.subject}
          />
        </ListItem>
      </div>
    );
  },
);

const getEmailListOptions = (emails: EmailTemplateSummary[]) =>
  emails?.map((e) => ({ label: e.title, value: e.id, email: e }));

export const EmailSelector: React.FC<Props> = ({
  value,
  onChange,
  emails,
  helperText,
  disabled,
  attachSelectorToBody,
}) => {
  const suggestions: OptionsType<EmailTemplateOption> = useMemo(
    () =>
      emails
        ? [...emails]
            ?.filter((email) => !email?.is_default_bsport_template)
            ?.sort((pp, pp_) => {
              if (
                DateTime.fromISO(pp.date_modified) >
                DateTime.fromISO(pp_.date_modified)
              )
                return 1;
              return -1;
            })
            ?.map((pp) => ({
              value: pp.id,
              label: pp.title,
              email: pp,
            }))
        : [],
    [emails],
  );
  const emailOptionsSelected =
    value && emails
      ? getEmailListOptions(emails).filter(
          (emailOption: { value: number; label: string }) =>
            value === emailOption.value,
        )
      : null;

  const handleChangeEmail = useCallback(
    (option: EmailTemplateOption) => {
      onChange(option?.value);
    },
    [onChange],
  );

  return (
    <Select<EmailTemplateOption>
      isClearable
      components={{ Option: EmailOption }}
      isDisabled={disabled}
      menuPlacement="auto"
      menuPortalTarget={attachSelectorToBody ? document.body : null}
      menuPosition={attachSelectorToBody ? 'absolute' : 'fixed'}
      onChange={handleChangeEmail}
      options={suggestions}
      placeholder={helperText}
      value={emailOptionsSelected}
    />
  );
};

export default React.memo(EmailSelector);
