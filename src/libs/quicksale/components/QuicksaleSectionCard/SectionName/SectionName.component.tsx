import React from 'react';
import CheckCircle from '@material-ui/icons/CheckCircle';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import {
  EditableQuicksaleSectionKey,
  QuicksaleSectionColor,
} from '../../../constants';
import useStyle from './styles';
import { UserInteractionKey } from '#libs/types';
import useOnClickOutside from '../../../../../hooks/useClickOutside';

const stopEventPropagation = (e: React.MouseEvent | React.KeyboardEvent) =>
  e.stopPropagation();

type Props = {
  admin: boolean;
  sectionId: string;
  sectionName: string;
  color: QuicksaleSectionColor;
  onSectionEdit?: (
    sectionId: string,
    key: EditableQuicksaleSectionKey,
    value: string,
  ) => void;
};

const SectionName: React.FC<Props> = (props) => {
  const { admin, sectionId, sectionName, color, onSectionEdit } = props;
  const classes = useStyle({ admin, color });

  const inputRef = React.useRef<HTMLInputElement>(null);

  const [nameOfSection, setNameOfSection] = React.useState('');
  const [isEditingName, setIsEditingName] = React.useState(false);

  React.useEffect(() => setNameOfSection(sectionName), [sectionName]);

  const editName = React.useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) =>
      setNameOfSection(e.target.value),
    [setNameOfSection],
  );

  const startEditingName = React.useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditingName(true);
  }, []);

  const confirmNameChange = React.useCallback(
    (e?: React.MouseEvent) => {
      e?.stopPropagation();
      setIsEditingName(false);
      onSectionEdit?.(
        sectionId,
        EditableQuicksaleSectionKey.name,
        nameOfSection,
      );
    },
    [sectionId, nameOfSection, onSectionEdit],
  );

  // To confirm name change when user clicks outside the input
  useOnClickOutside(inputRef, confirmNameChange);

  const confirmNameChangeWithEnter = React.useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === UserInteractionKey.ENTER) confirmNameChange();
    },
    [confirmNameChange],
  );

  if (admin) {
    if (isEditingName)
      return (
        <Input
          ref={inputRef}
          autoFocus
          classes={{
            root: classes.nameInput,
            underline: classes.nameInputUnderline,
          }}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                className={classes.confirmNameChangeIconButton}
                id={`card-title-check-icon-${sectionId}`}
                onClick={confirmNameChange}
              >
                <CheckCircle />
              </IconButton>
            </InputAdornment>
          }
          id={`card-title-input-${sectionId}`}
          onChange={editName}
          onClick={stopEventPropagation}
          onKeyDown={confirmNameChangeWithEnter}
          value={nameOfSection}
        />
      );

    return (
      <div
        className={classes.cardTitleContainer}
        id={`editable-card-title-${sectionId}`}
        onClick={startEditingName}
        onKeyDown={stopEventPropagation}
        role="button"
        tabIndex={0}
      >
        <Typography
          className={classes.cardTitle}
          id={`card-title-${sectionId}`}
          variant="h6"
        >
          {nameOfSection}
        </Typography>
      </div>
    );
  }

  return (
    <Typography className={classes.cardTitle} variant="h6">
      {nameOfSection}
    </Typography>
  );
};

export default React.memo(SectionName);
