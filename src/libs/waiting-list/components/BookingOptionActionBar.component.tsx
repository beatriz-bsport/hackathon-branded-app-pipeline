import React from 'react';
import { useTranslation } from 'react-i18next';

import { makeStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import AddIcon from '@material-ui/icons/Add';
import {
  Button,
  Checkbox,
  Collapse,
  FormControlLabel,
} from '@material-ui/core';

type Props = {
  availableBookingOptionsCount: number;
  selectedBookingOptionsCount: number;
  handleSelectAllBookingOptions: () => void;
  handleUnselectAllBookingOptions: () => void;
  onBook: () => void;
  isDisabled: boolean;
};

const BookingOptionActionBar: React.FC<Props> = ({
  availableBookingOptionsCount,
  selectedBookingOptionsCount,
  handleSelectAllBookingOptions,
  handleUnselectAllBookingOptions,
  onBook,
  isDisabled,
}) => {
  const { t } = useTranslation(['common', 'translation']);
  const classes = useStyles();

  const isIndeterminate =
    !!selectedBookingOptionsCount &&
    !!availableBookingOptionsCount &&
    selectedBookingOptionsCount !== availableBookingOptionsCount;

  const isChecked =
    !!selectedBookingOptionsCount &&
    !!availableBookingOptionsCount &&
    selectedBookingOptionsCount === availableBookingOptionsCount;

  const isButtonDisabled = !selectedBookingOptionsCount || isDisabled;

  const handleOnChange = React.useCallback(() => {
    if (isChecked) {
      handleUnselectAllBookingOptions();
    } else {
      handleSelectAllBookingOptions();
    }
  }, [
    handleUnselectAllBookingOptions,
    handleSelectAllBookingOptions,
    isChecked,
  ]);

  const label = isChecked ? t('selector.unselectAll') : t('selector.selectAll');

  return (
    <Collapse in={!!selectedBookingOptionsCount && !isDisabled}>
      <ListItem divider>
        <div className={classes.actionRow}>
          <FormControlLabel
            control={
              <Checkbox
                checked={isChecked}
                indeterminate={isIndeterminate}
                onChange={handleOnChange}
              />
            }
            label={label}
          />
          <Button
            color="primary"
            disabled={isButtonDisabled}
            onClick={onBook}
            size="large"
            variant="outlined"
          >
            <AddIcon />
            {t('translation:booking.add')}
          </Button>
        </div>
      </ListItem>
    </Collapse>
  );
};

const useStyles = makeStyles((theme) => ({
  actionRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    padding: theme.spacing(1),
  },
}));

export default React.memo(BookingOptionActionBar);
