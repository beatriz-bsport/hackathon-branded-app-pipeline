import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Typography,
  makeStyles,
  TableContainer,
  TableHead,
  TableCell,
  Table,
  TableRow,
  TableBody,
} from '@material-ui/core';
import Pagination from '@material-ui/lab/Pagination';
import CanvasSpotIcon from '../CanvasSvg/CanvasSpotIcon.component';
import { SpotType } from '../types';
import { SPIVI_CORRESPONDENCE_TABLE_PAGE_SIZE } from '../utils';

export type Props = {
  spotCorrespondence: Array<string>;
  spotType: SpotType;
  pageNumber: number;
  pageCount: number;
  handlePageChange: (
    ev: React.ChangeEvent<unknown>,
    value: number,
    spotTypeId: number,
  ) => void;
  spotTypeId: number;
};

export const SpiviCorrespondenceTable: React.FC<Props> = (props) => {
  const { t } = useTranslation(['spotScheduling, common']);

  const classes = useStyles();

  return (
    <div className={classes.tableContainer}>
      <div className={classes.header}>
        <CanvasSpotIcon spotType={props.spotType} size={71} />
        <Typography className={classes.bold}>
          {props.spotType?.name || t('spotScheduling:toolsMenu.spot')}
        </Typography>
      </div>
      <div className={classes.border}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  {t('spotScheduling:spiviDialog.bsportIdentifiers')}
                </TableCell>
                <TableCell>
                  {t('spotScheduling:spiviDialog.spiviIdentifiers')}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {props.spotCorrespondence &&
                props.spotCorrespondence
                  .slice(
                    SPIVI_CORRESPONDENCE_TABLE_PAGE_SIZE *
                      (props.pageNumber - 1),
                    SPIVI_CORRESPONDENCE_TABLE_PAGE_SIZE * props.pageNumber,
                  )
                  .map((correspondence, index) => {
                    return (
                      <TableRow key={index}>
                        <TableCell>{correspondence[0]}</TableCell>
                        <TableCell>{correspondence[1]}</TableCell>
                      </TableRow>
                    );
                  })}
            </TableBody>
          </Table>
        </TableContainer>
        {props.spotCorrespondence &&
          props.spotCorrespondence.length >
            SPIVI_CORRESPONDENCE_TABLE_PAGE_SIZE && (
            <div className={classes.pagination}>
              <Pagination
                count={props.pageCount}
                onChange={(ev, value) =>
                  props.handlePageChange(ev, value, props.spotTypeId)
                }
                page={props.pageNumber}
              />
            </div>
          )}
      </div>
    </div>
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

export default SpiviCorrespondenceTable;
