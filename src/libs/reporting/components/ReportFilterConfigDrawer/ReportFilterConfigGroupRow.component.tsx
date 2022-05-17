import React from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';

import { ButtonBase, makeStyles, Typography } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';

import {
  DynamicFilterDataType,
  ReportFilterConfigGroup,
  ReportFilterConfigGroupOperand,
  ReportMetadataColumn,
} from '../../types';

import ReportFilterConfigRow from './ReportFilterConfigRow.component';
import OperandSelect from './OperandSelect.component';

type Props = {
  filterGroup: ReportFilterConfigGroup;
  consumableColumns: ReportMetadataColumn[];
  reportColumns: string[];
  groupOperand: ReportFilterConfigGroupOperand;
  prefix: string;
  hidePrefix?: boolean;
  isPreview?: boolean;
  checkOtherRowExist: (uuid: number) => boolean;
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
  onDelete?: (uuid: number) => () => void;
  addFilter: () => void;
  getDataByType: (datatype: DynamicFilterDataType) => any[];
};

const ReportFilterConfigGroupRow: React.FC<Props> = ({
  consumableColumns,
  reportColumns,
  groupOperand,
  prefix,
  filterGroup,
  hidePrefix,
  isPreview,
  addFilter,
  checkOtherRowExist,
  setFieldValue,
  onDelete,
  getDataByType,
}) => {
  const { t } = useTranslation('reporting');
  const classes = useStyles();

  return (
    <div className={classes.rowGroup}>
      <div className={classNames(classes.groupRule, classes.center)}>
        {!hidePrefix && (
          <Typography color="textSecondary">
            {t(`filter.form.groupOperand.${groupOperand}`)}
          </Typography>
        )}
      </div>
      <div
        className={classNames(classes.flexOne, {
          [classes.groupContainer]: !filterGroup.display_has_single,
        })}
      >
        {!filterGroup.display_has_single && (
          <div className={classes.groupOperand}>
            <OperandSelect
              name={`${prefix}.inner_operand`}
              isPreview={isPreview}
            />
          </div>
        )}
        <div className={classes.verticalRows}>
          {filterGroup.filters_data.map((filterItem, indexFilter) => (
            <ReportFilterConfigRow
              key={filterItem.uuid}
              consumableColumns={consumableColumns}
              reportColumns={reportColumns}
              groupOperand={filterGroup.inner_operand}
              prefix={`${prefix}.filters_data[${indexFilter}]`}
              filterItem={filterItem}
              setFieldValue={setFieldValue}
              hidePrefix={indexFilter === 0}
              isPreview={isPreview}
              displayAsFirstOrderRow={filterGroup.display_has_single}
              hideDelete={!checkOtherRowExist(filterItem.uuid)}
              onDelete={onDelete(filterItem.uuid)}
              getDataByType={getDataByType}
            />
          ))}
        </div>
        {!filterGroup.display_has_single &&
          consumableColumns?.length > 0 &&
          !isPreview && (
            <ButtonBase
              color="primary"
              className={classes.buttonAdd}
              onClick={addFilter}
            >
              <AddIcon color="primary" />
              {t('filter.form.addFilter')?.toUpperCase()}
            </ButtonBase>
          )}
      </div>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  groupOperand: {
    display: 'flex',
    marginBottom: theme.spacing(2),
  },
  groupContainer: {
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: theme.palette.grey[500],
    borderRadius: 8,
    padding: theme.spacing(2),
  },
  rowGroup: {
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
    width: '100%',
    gap: theme.spacing(2),
  },
  groupRule: {
    width: 20,
  },
  center: {
    alignSelf: 'center',
  },
  flexOne: {
    flex: '1 1 120px',
  },
  verticalRows: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: theme.spacing(2),
  },
  buttonAdd: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2),
    color: theme.palette.primary.main,
    marginTop: theme.spacing(2),
  },
}));

export default ReportFilterConfigGroupRow;
