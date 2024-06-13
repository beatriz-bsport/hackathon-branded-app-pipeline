import React from 'react';
// @ts-expect-error
import PaginatedListBase from '#src/components/PaginatedListBase.component';
import { FRANCHISE_MEMBER_TAG_PAGE_DEFAULT_SIZE } from '#src/libs/franchise/constants';
import type { FranchiseUserTag } from '#src/libs/franchise/types';
import FranchiseMemberTagListItem from '#src/libs/franchise/components/FranchiseMemberTagListItem.component';
import Button from '@material-ui/core/Button';
import { useTranslation } from 'react-i18next';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Typography from '@material-ui/core/Typography';

type Props = {
  fetchTagsList: (page: number) => void;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  tags: FranchiseUserTag[];
  tagsCount: number;
  tagsLoading: boolean;
  tagsPage: number;
};

const FranchiseMemberTagList: React.FC<Props> = ({
  fetchTagsList,
  setIsModalOpen,
  tags,
  tagsCount,
  tagsLoading,
  tagsPage,
}) => {
  const { t } = useTranslation('franchise');
  const classes = useStyles();

  const listProps = {
    className: classes.tagsContainer,
  };

  const manageTagsHandler = React.useCallback(() => {
    setIsModalOpen(true);
  }, [setIsModalOpen]);

  const handleRenderItem = React.useCallback(
    (tag: FranchiseUserTag) => (
      <FranchiseMemberTagListItem
        isLast={tag.id === tags.at(-1).id}
        tag={tag}
      />
    ),
    [tags],
  );

  return (
    <>
      <div className={classes.headerContainer}>
        <Typography variant="h6">{t('userProfile.tagsListTitle')}</Typography>
        <Button color="primary" onClick={manageTagsHandler} variant="outlined">
          {t('userProfile.manageTags').toUpperCase()}
        </Button>
      </div>
      <PaginatedListBase
        itemPerPage={FRANCHISE_MEMBER_TAG_PAGE_DEFAULT_SIZE}
        items={tags}
        listProps={listProps}
        loading={tagsLoading}
        nbItems={tagsCount}
        onPageRequested={fetchTagsList}
        page={tagsPage}
        renderItem={handleRenderItem}
      />
    </>
  );
};

const useStyles = makeStyles((theme) => ({
  headerContainer: {
    padding: theme.spacing(2),
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tagsContainer: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    paddingTop: 0,
    paddingBottom: 0,
  },
}));

export default React.memo(FranchiseMemberTagList);
