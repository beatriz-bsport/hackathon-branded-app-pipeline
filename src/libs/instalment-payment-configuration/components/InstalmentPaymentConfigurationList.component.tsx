import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Theme } from '@material-ui/core/styles';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { Collapse, Divider, Paper } from '@material-ui/core';
import Skeleton from '@material-ui/lab/Skeleton';
import Fuse, { FuseOptions } from 'fuse.js';
import { InstalmentPayment, InstalmentPaymentApi } from '../types';
import InstalmentPaymentMenuItem from './InstalmentPaymentConfigurationMenuItem.component';
import FuzeSearch from '../../../components/FuzeSearch.component';

type OwnProps = {
  instalmentPaymentList: Array<InstalmentPaymentApi | InstalmentPayment>;
  selectedInstalmentPaymentId?: number;
  loading: boolean;
  onClickOnItem: (id: number) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
};
type Props = OwnProps;
export const InstalmentPaymentList: React.FC<Props> = (props) => {
  const { t } = useTranslation('instalmentPayment');
  const {
    instalmentPaymentList,
    selectedInstalmentPaymentId,
    loading,
    onClickOnItem,
    onEdit,
    onDelete,
  } = props;
  const classes = useStyles();

  const [search, setSearch] = useState<string>('');
  const [searchResult, setSearchResult] = useState<InstalmentPayment[]>([]);

  if (!instalmentPaymentList?.length && !loading) {
    return null;
  }

  const changeSearch =
    (fuse: Fuse<InstalmentPayment, FuseOptions<InstalmentPayment>>) =>
    (ev: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      setSearch(ev.target.value);
      const result = fuse.search(ev.target.value) as InstalmentPayment[];
      setSearchResult(result);
    };
  let instalmentPaymentListFiltered = [] as InstalmentPayment[];
  if (!search && instalmentPaymentList) {
    instalmentPaymentListFiltered = instalmentPaymentList;
  } else {
    instalmentPaymentListFiltered = searchResult;
  }
  return (
    <div className={classes.container}>
      <div>
        <div className={classes.search}>
          <FuzeSearch
            placeholder={t('form.search')}
            searchText={search}
            items={instalmentPaymentList}
            searchFields={['name']}
            clearSearch={() => {
              setSearch('');
            }}
            changeSearch={changeSearch}
          />
        </div>
        <Divider />
      </div>
      {loading ? (
        <div className={classes.content}>
          {[1, 1, 1, 1].map(() => (
            <Skeleton
              animation="wave"
              width="100%"
              variant="rect"
              height={60}
            />
          ))}
        </div>
      ) : (
        <Collapse in={instalmentPaymentListFiltered?.length > 0}>
          <Paper square>
            {instalmentPaymentListFiltered.map((instalmentPayment) => (
              <InstalmentPaymentMenuItem
                onEdit={onEdit}
                onDelete={onDelete}
                instalmentPayment={instalmentPayment}
                selected={instalmentPayment.id === selectedInstalmentPaymentId}
                onClickOnItem={onClickOnItem}
              />
            ))}
          </Paper>
        </Collapse>
      )}
    </div>
  );
};
const useStyles = makeStyles<Theme>((theme) => ({
  content: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(3),
  },
  search: { maxWidth: theme.spacing(25), marginBottom: theme.spacing(1) },
}));
export default InstalmentPaymentList;
