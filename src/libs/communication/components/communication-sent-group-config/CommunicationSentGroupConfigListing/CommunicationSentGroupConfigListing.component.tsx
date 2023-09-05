import React, { useCallback, useState } from 'react';
import { Collapse, Grid, List, Paper, makeStyles } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { ImmutableArray, ImmutableObject } from 'seamless-immutable';
import Fuse, { FuseOptions } from 'fuse.js';
import CommunicationSentGroupConfigListItem from './CommunicationSentGroupConfigListItem.component';
// @ts-expect-error
import FuzeSearch from '../../../../../components/FuzeSearch.component';
import IsEmptyList from '#components/navigation/IsEmptyList.component';
import { isNotCommunicationSentGroupConfigList } from '#libs/communication/utils';
import { CommunicationSentGroupConfig } from '#libs/communication/types';
// @ts-expect-error
import SmartListCard from '#libs/smart-list/components/SmartlistCard.component';

type Props = {
  loading: boolean;
  communicationSentGroupConfigsList: ImmutableArray<CommunicationSentGroupConfig>;
  handleOpenCommunicationSentGroupConfigCreateDialog: () => void;
  handleCommunicationSentGroupConfigItemOnClick: (id: number) => void;
  handleCommunicationSentGroupConfigDeleteOnClick: (id: number) => void;
  handleCommunicationSentGroupConfigDuplicateOnClick: (id: number) => void;
  goToEdit: (id: number) => void;
  communicationSentGroupConfigSelected: CommunicationSentGroupConfig;
  goToSelectedCommunicationSentGroupConfig: (id: number) => void;
  handleEditSmartListCard: () => void;
};

const CommunicationSentGroupConfigListing: React.FC<Props> = ({
  loading,
  communicationSentGroupConfigsList,
  handleOpenCommunicationSentGroupConfigCreateDialog,
  handleCommunicationSentGroupConfigItemOnClick,
  handleCommunicationSentGroupConfigDeleteOnClick,
  handleCommunicationSentGroupConfigDuplicateOnClick,
  goToEdit,
  communicationSentGroupConfigSelected,
  goToSelectedCommunicationSentGroupConfig,
  handleEditSmartListCard,
}) => {
  const { t } = useTranslation(['campaign']);
  const classes = useStyles();
  const [searchText, setSearchText] = useState('');
  const [searchResult, setSearchResult] = useState<
    ImmutableObject<CommunicationSentGroupConfig>[]
  >([]);

  const changeSearch = useCallback(
    (
        fuse: Fuse<
          ImmutableObject<CommunicationSentGroupConfig>,
          FuseOptions<ImmutableObject<CommunicationSentGroupConfig>>
        >,
      ) =>
      (ev: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        const results = fuse.search(ev.target.value);
        setSearchText(ev.target.value);
        if (isNotCommunicationSentGroupConfigList(results)) {
          setSearchResult(results.map((result) => result.item));
        } else setSearchResult(results);
      },
    [],
  );

  const clearSearch = useCallback(() => {
    setSearchText('');
    setSearchResult([]);
  }, []);

  if (!loading && communicationSentGroupConfigsList.length === 0) {
    return (
      <IsEmptyList
        button={t('campaign.add')}
        onCreate={handleOpenCommunicationSentGroupConfigCreateDialog}
        text={t('noCampaign')}
      />
    );
  }

  return (
    <Grid container direction="row" spacing={3}>
      <Grid item md={6} xs={12}>
        {communicationSentGroupConfigsList.length > 0 ? (
          <div className={classes.search}>
            <FuzeSearch
              changeSearch={changeSearch}
              clearSearch={clearSearch}
              items={communicationSentGroupConfigsList}
              placeholder={t('search')}
              searchFields={['name', 'description']}
              searchResult={searchResult}
              searchText={searchText}
            />
            <Paper
              className={
                searchResult.length > 0 && searchText !== ''
                  ? classes.searchPaperDisplayed
                  : classes.searchPaperHidden
              }
            >
              <Collapse in={searchResult.length > 0 && searchText !== ''}>
                <List disablePadding className={classes.list} component="nav">
                  {searchResult.map((communicationSentGroupConfig) => (
                    <CommunicationSentGroupConfigListItem
                      key={communicationSentGroupConfig.id}
                      communicationSentGroupConfig={
                        communicationSentGroupConfig
                      }
                      onClick={handleCommunicationSentGroupConfigItemOnClick}
                      onClickDelete={
                        handleCommunicationSentGroupConfigDeleteOnClick
                      }
                      onClickDuplicate={
                        handleCommunicationSentGroupConfigDuplicateOnClick
                      }
                      onClickEdit={goToEdit}
                      selected={
                        communicationSentGroupConfigSelected &&
                        communicationSentGroupConfig.id ===
                          communicationSentGroupConfigSelected.id
                      }
                    />
                  ))}
                </List>
              </Collapse>
            </Paper>
          </div>
        ) : null}
        <Paper>
          <List disablePadding className={classes.list} component="nav">
            {communicationSentGroupConfigsList.map(
              (communicationSentGroupConfig) => (
                <CommunicationSentGroupConfigListItem
                  key={communicationSentGroupConfig.id}
                  communicationSentGroupConfig={communicationSentGroupConfig}
                  onClick={handleCommunicationSentGroupConfigItemOnClick}
                  onClickDelete={
                    handleCommunicationSentGroupConfigDeleteOnClick
                  }
                  onClickDuplicate={
                    handleCommunicationSentGroupConfigDuplicateOnClick
                  }
                  onClickEdit={goToEdit}
                  selected={
                    communicationSentGroupConfigSelected &&
                    communicationSentGroupConfig.id ===
                      communicationSentGroupConfigSelected.id
                  }
                />
              ),
            )}
          </List>
        </Paper>
      </Grid>
      <Grid item md={6} xs={12}>
        <SmartListCard
          onClickCampaign={goToSelectedCommunicationSentGroupConfig}
          onClickConfigure={goToEdit}
          onEdit={handleEditSmartListCard}
          smartlist={communicationSentGroupConfigSelected}
        />
      </Grid>
    </Grid>
  );
};

const useStyles = makeStyles((theme) => ({
  list: {
    display: 'flex',
    flexDirection: 'column',
  },
  search: { marginBottom: theme.spacing(2) },
  searchPaperDisplayed: {
    border: '1px solid',
    borderColor: theme.palette.primary.main,
    borderTop: '0px',
  },
  searchPaperHidden: {
    border: '1px solid',
    borderColor: theme.palette.primary.main,
    borderTop: '0px',
    boderBottom: '0px',
  },
}));
export default React.memo(CommunicationSentGroupConfigListing);
