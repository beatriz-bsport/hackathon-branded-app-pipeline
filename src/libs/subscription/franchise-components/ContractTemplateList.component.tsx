import React from 'react';

import { useTranslation } from 'react-i18next';

import makeStyles from '@material-ui/core/styles/makeStyles';
import List from '@material-ui/core/List';
import Pagination from '@material-ui/lab/Pagination';
import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';

import type { ContractTemplate } from '../types';
import type { PaymentPackTemplateAPI as PaymentPackTemplate } from '#src/libs/payment-packs/types';
import type { PrivatePassTemplateAPI as PrivatePassTemplate } from '#src/libs/private-service/types';
import type { FranchiseCompany } from '#src/libs/franchise/types';

import ContractTemplateListItem from './ContractTemplateListItem.component';

type Props = {
  contractTemplateList: ContractTemplate[];
  loading: boolean;
  page: number;
  contractTemplateNumberOfPages: number;
  fetchNewPage: (page: number) => void;
  getPaymentPackTemplateById: (id: number) => PaymentPackTemplate;
  getPrivatePassTemplateById: (id: number) => PrivatePassTemplate;
  getFranchiseCompanyListById: (id__in: number[]) => FranchiseCompany[];
  onClick?: (id: number) => void;
  onDelete?: (id: number) => void;
  onEdit?: (id: number) => void;
  onRestore?: (id: number) => void;
};

const ContractTemplateList: React.FC<Props> = ({
  contractTemplateList,
  loading,
  contractTemplateNumberOfPages,
  page,
  fetchNewPage,
  getPaymentPackTemplateById,
  getPrivatePassTemplateById,
  getFranchiseCompanyListById,
  onClick,
  onDelete,
  onEdit,
  onRestore,
}) => {
  const { t } = useTranslation('subscription');
  const classes = useStyles();

  const handleChange = React.useCallback(
    (_: React.ChangeEvent, newPage: number) => {
      fetchNewPage(newPage);
    },
    [fetchNewPage],
  );

  if (contractTemplateNumberOfPages === 0 && !loading) {
    return <Typography>{t('contractTemplate.list.isEmpty')}</Typography>;
  }

  return (
    <>
      <div className={classes.paperContainer}>
        {loading && <LinearProgress />}
        <Paper className={classes.paper}>
          <List disablePadding>
            {contractTemplateList.map((contractTemplate) => (
              <ContractTemplateListItem
                key={contractTemplate.id}
                contractTemplate={contractTemplate}
                getFranchiseCompanyListById={getFranchiseCompanyListById}
                getPaymentPackTemplateById={getPaymentPackTemplateById}
                getPrivatePassTemplateById={getPrivatePassTemplateById}
                onClick={onClick}
                onDelete={onDelete}
                onEdit={onEdit}
                onRestore={onRestore}
              />
            ))}
          </List>
        </Paper>
      </div>
      <Pagination
        className={classes.sectionPagination}
        count={contractTemplateNumberOfPages}
        onChange={handleChange}
        page={page}
      />
    </>
  );
};

const useStyles = makeStyles((theme) => ({
  sectionPagination: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: theme.spacing(2),
  },
  linearProgress: {
    width: '100%',
    position: 'absolute',
    zIndex: 1,
  },
  paperContainer: {
    position: 'relative',
  },
  paper: {
    position: 'relative',
    zIndex: 0,
  },
}));

export default React.memo(ContractTemplateList);
