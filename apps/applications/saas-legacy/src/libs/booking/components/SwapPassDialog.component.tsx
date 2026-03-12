import React from 'react';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import {
  Theme,
  WithStyles,
  createStyles,
  withStyles,
} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

import GenericResponsiveDialog from '#src/components/genericDialog/GenericResponsiveDialog';

export type SwapPassItem = {
  id: number;
  name: string;
  details: string;
};

type Props = {
  isOpen: boolean;
  isLoading?: boolean;
  isSubmitting?: boolean;
  items?: SwapPassItem[];
  selectedItemId: number | null;
  onSelectItem: (itemId: number) => void;
  onSubmit: () => void;
  onClose: () => void;
} & WithStyles<typeof styles>;

const SwapPassDialog: React.FC<Props> = ({
  isOpen,
  isLoading = false,
  isSubmitting = false,
  items = [],
  selectedItemId,
  onSelectItem,
  onSubmit,
  onClose,
  classes,
}) => {
  const { t } = useTranslation(['b2b_booking']);
  const stopPropagation = (event: React.SyntheticEvent) =>
    event.stopPropagation();

  return (
    <GenericResponsiveDialog maxWidth="sm" onClose={onClose} open={isOpen}>
      <div onClick={stopPropagation}>
        <DialogTitle disableTypography>
          <div className={classes.titleRow}>
            <Typography variant="h6">{t('swapPass.dialog.title')}</Typography>
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </div>
        </DialogTitle>

        <DialogContent>
          {(isLoading || isSubmitting) && (
            <div className={classes.loaderContainer}>
              <CircularProgress size={24} />
            </div>
          )}

          {!isLoading && !isSubmitting && items.length === 0 && (
            <Typography>{t('swapPass.dialog.noCompatiblePasses')}</Typography>
          )}

          {!isLoading && !isSubmitting && items.length > 0 && (
            <ul className={classes.list}>
              {items.map((item) => (
                <li key={item.id}>
                  <Button
                    className={clsx(classes.listButton, {
                      [classes.listButtonSelected]: selectedItemId === item.id,
                    })}
                    color="primary"
                    onClick={(event) => {
                      event.stopPropagation();
                      onSelectItem(item.id);
                    }}
                    type="button"
                    variant={selectedItemId === item.id ? 'contained' : 'text'}
                  >
                    <div className={classes.listButtonContent}>
                      <Typography className={classes.passName}>
                        {item.name}
                      </Typography>
                      <Typography
                        className={classes.passDetails}
                        variant="caption"
                      >
                        {item.details}
                      </Typography>
                    </div>
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </DialogContent>

        <DialogActions>
          <Button
            onClick={(event) => {
              event.stopPropagation();
              onClose();
            }}
            type="button"
          >
            {t('swapPass.dialog.actions.close')}
          </Button>
          <Button
            color="primary"
            disabled={
              isLoading ||
              isSubmitting ||
              selectedItemId === null ||
              items.length === 0
            }
            onClick={(event) => {
              event.stopPropagation();
              onSubmit();
            }}
            type="button"
            variant="contained"
          >
            {t('swapPass.dialog.actions.confirm')}
          </Button>
        </DialogActions>
      </div>
    </GenericResponsiveDialog>
  );
};

const styles = (theme: Theme) =>
  createStyles({
    loaderContainer: {
      display: 'flex',
      justifyContent: 'center',
      padding: 24,
    },
    list: {
      margin: 0,
      paddingLeft: 0,
      '& li': {
        listStyle: 'none',
      },
    },
    listButton: {
      justifyContent: 'flex-start',
      textTransform: 'none',
      width: '100%',
    },
    listButtonContent: {
      alignItems: 'flex-start',
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
    },
    listButtonSelected: {
      marginBottom: 4,
      marginTop: 4,
      '& $passName': {
        color: theme.palette.primary.contrastText,
      },
      '& $passDetails': {
        color: theme.palette.primary.contrastText,
        opacity: 0.85,
      },
    },
    passDetails: {
      color: theme.palette.text.secondary,
      lineHeight: 1.25,
    },
    passName: {
      fontWeight: 500,
      lineHeight: 1.25,
    },
    titleRow: {
      alignItems: 'center',
      display: 'flex',
      justifyContent: 'space-between',
    },
  });

export default withStyles(styles)(SwapPassDialog);
