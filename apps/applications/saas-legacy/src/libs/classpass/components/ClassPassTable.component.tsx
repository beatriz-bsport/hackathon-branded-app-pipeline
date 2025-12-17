import React from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import TableBody from '@material-ui/core/TableBody';
import LinearProgress from '@material-ui/core/LinearProgress';
import Chip from '@material-ui/core/Chip';

type Props = {
  isLoading: boolean;
  venueEstablishmentList: {
    venueId: number | string;
    establishmentNames: string[];
  }[];
};

const ClassPassTable: React.FC<Props> = ({
  isLoading,
  venueEstablishmentList,
}) => {
  const { t } = useTranslation('partnership');

  const classes = useStyles();

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>{t('parameters.table.venueIds')}</TableCell>
          <TableCell align="left">
            {t('parameters.table.establishments')}
          </TableCell>
        </TableRow>
      </TableHead>
      {isLoading && (
        <TableRow>
          <TableCell colSpan={2}>
            <LinearProgress />
          </TableCell>
        </TableRow>
      )}
      <TableBody>
        {venueEstablishmentList?.map((venueEstablishment) => (
          <TableRow key={venueEstablishment.venueId}>
            <TableCell align="left">
              <div className={classes.gap}>
                <Typography variant="body1">
                  {venueEstablishment.venueId}
                </Typography>
              </div>
            </TableCell>
            <TableCell align="left">
              <div className={classes.gap}>
                {venueEstablishment?.establishmentNames?.map(
                  (establishmentName) =>
                    !!establishmentName && (
                      <Chip
                        key={`${venueEstablishment.venueId}-${establishmentName}`}
                        label={establishmentName}
                        variant="outlined"
                      />
                    ),
                )}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

const useStyles = makeStyles((theme) => ({
  gap: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: theme.spacing(1),
  },
}));

export default React.memo(ClassPassTable);
