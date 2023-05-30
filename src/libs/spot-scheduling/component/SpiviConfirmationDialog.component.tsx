import React from 'react';
import { useTranslation } from 'react-i18next';
import { Typography, makeStyles, Dialog } from '@material-ui/core';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import { SpotType } from '../types';
import SpiviCorrespondenceTable from './SpiviCorrespondenceTable.component';

export type Props = {
  open: boolean;
  onClose: () => void;
  spotCorrespondence: Array<Array<string>>;
  spotTypes: Array<SpotType>;
  tablePages: { [identifier: string]: number };
  tableCountPages: { [identifier: string]: number };
  handlePageChange: (
    ev: React.ChangeEvent<HTMLInputElement>,
    value: number,
    spotTypeId: number,
  ) => void;
};

export const SpiviConfirmationDialog: React.FC<Props> = (props) => {
  const { t } = useTranslation(['spotScheduling, common']);

  const classes = useStyles();

  return (
    <Dialog open={props.open}>
      <DialogTitle>
        <Typography variant="h6" className={classes.bold}>
          {t('spotScheduling:spiviDialog.spotCorrespondence')}
        </Typography>
      </DialogTitle>
      <DialogContent>
        {props.spotTypes.map((spotType: SpotType, index: number) => {
          return (
            index % 2 === 0 && (
              <div
                key={`${spotType.id}-${index}`}
                className={classes.lineContainer}
              >
                <SpiviCorrespondenceTable
                  spotCorrespondence={props.spotCorrespondence[spotType.id]}
                  spotType={spotType}
                  pageNumber={props.tablePages[spotType.id]}
                  pageCount={props.tableCountPages[spotType.id]}
                  handlePageChange={props.handlePageChange}
                  spotTypeId={spotType.id}
                />
                {index + 1 < props.spotTypes.length && (
                  <SpiviCorrespondenceTable
                    spotCorrespondence={
                      props.spotCorrespondence[props.spotTypes[index + 1].id]
                    }
                    spotType={props.spotTypes[index + 1]}
                    pageNumber={props.tablePages[props.spotTypes[index + 1].id]}
                    pageCount={
                      props.tableCountPages[props.spotTypes[index + 1].id]
                    }
                    handlePageChange={props.handlePageChange}
                    spotTypeId={props.spotTypes[index + 1].id}
                  />
                )}
              </div>
            )
          );
        })}
      </DialogContent>
      <div className={classes.buttonContainer}>
        <DialogActions>
          <Button className={classes.grey} onClick={props.onClose}>
            {t('common:close')}
          </Button>
        </DialogActions>
      </div>
    </Dialog>
  );
};

const useStyles = makeStyles((theme) => ({
  grey: {
    color: theme.palette.text.secondary,
  },
  bold: {
    fontWeight: 500,
  },
  buttonContainer: {
    marginBottom: theme.spacing(1),
  },
  lineContainer: { display: 'flex' },
  header: { display: 'flex', alignItems: 'center' },
  tableContainer: { margin: theme.spacing(1) },
  border: {
    borderColor: theme.palette.grey[300],
    borderWidth: 1,
    borderRadius: 8,
    borderStyle: 'solid',
  },
  pagination: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: theme.spacing(2),
    marginTop: theme.spacing(2),
  },
}));

export default SpiviConfirmationDialog;
