// @ts-nocheck
import React from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';

import { ButtonBase, makeStyles, Typography } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';

import { ReportMetadataColumn } from '#libs/reporting/types';

import {
  DataSourceFieldMetadata,
  DynamicFilterDataType,
  DatatypeFilterConfigGroupOperand,
  DatatypeFilterConfigGroup,
} from '#libs/datatype-filtering/types';

import DatatypeFilterConfigRow from './DatatypeFilterConfigRow.component';
import OperandSelect from '#libs/datatype-filtering/components/OperandSelect.component';

type Props = {
  filterGroup: DatatypeFilterConfigGroup;
  consumableColumns: Array<DataSourceFieldMetadata | ReportMetadataColumn>;
  reportColumns: string[];
  groupOperand: DatatypeFilterConfigGroupOperand;
  prefix: string;
  hidePrefix?: boolean;
  isPreview?: boolean;
  checkOtherRowExist: (uuid: number) => boolean;
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
  onDelete?: (uuid: number) => () => void;
  addFilter: () => void;
  getDataByType: (datatype: DynamicFilterDataType) => any[];
  noHideDelete?: boolean;
  dashboardTranslationNamespace?: boolean;
};

const DatatypeFilterConfigGroupRow: React.FC<Props> = ({
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
  noHideDelete,
  dashboardTranslationNamespace,
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
              isPreview={isPreview}
              name={`${prefix}.inner_operand`}
            />
          </div>
        )}
        <div className={classes.verticalRows}>
          {filterGroup.filters_data.map((filterItem, indexFilter) => (
            <DatatypeFilterConfigRow
              key={filterItem.uuid}
              consumableColumns={consumableColumns}
              dashboardTranslationNamespace={dashboardTranslationNamespace}
              displayAsFirstOrderRow={filterGroup.display_has_single}
              filterItem={filterItem}
              getDataByType={getDataByType}
              groupOperand={filterGroup.inner_operand}
              hideDelete={!noHideDelete && !checkOtherRowExist(filterItem.uuid)}
              hidePrefix={indexFilter === 0}
              isPreview={isPreview}
              onDelete={onDelete(filterItem.uuid)}
              prefix={`${prefix}.filters_data[${indexFilter}]`}
              reportColumns={reportColumns}
              setFieldValue={setFieldValue}
            />
          ))}
        </div>
        {!filterGroup.display_has_single &&
          consumableColumns?.length > 0 &&
          !isPreview && (
            <ButtonBase
              className={classes.buttonAdd}
              color="primary"
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

export default DatatypeFilterConfigGroupRow;
