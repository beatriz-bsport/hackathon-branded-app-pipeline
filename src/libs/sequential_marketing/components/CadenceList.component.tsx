import React from 'react';

import { useTranslation } from 'react-i18next';

import type { Theme } from '@material-ui/core/styles';
import makeStyles from '@material-ui/styles/makeStyles';
import List from '@material-ui/core/List';
import ButtonBase from '@material-ui/core/ButtonBase';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Typography from '@material-ui/core/Typography';
import Collapse from '@material-ui/core/Collapse';

import CadenceListItem, {
  CadenceListItemLoading,
} from './CadenceListItem.component';

import type { Cadence } from '#libs/sequential_marketing/types';

type Props = {
  cadences: Cadence[];
  cadenceLoading: boolean;
  onClickItem?: (cadence: Cadence) => void;
  onShow?: (id: number) => void;
  onEdit?: (cadence: Cadence) => void;
  onDelete?: (cadence: Cadence) => void;
  onRestore?: (id: number) => void;
  archivedVersion?: boolean;
  selectedId?: number;
};
export const CadenceList: React.FC<Props> = ({
  cadences,
  cadenceLoading,
  onShow,
  onEdit,
  onDelete,
  onRestore,
  onClickItem,
  archivedVersion,
  selectedId,
}) => {
  const { t } = useTranslation('marketing');
  const classes = useStyles();
  const [collapseOpen, setCollapseOpen] = React.useState(false);

  const handleEditCadence = (cadence: Cadence) => onEdit(cadence);
  const handleShowCadence = (cadence: Cadence) => onShow(cadence.id);
  const handleDeleteCadence = (cadence: Cadence) => onDelete(cadence);
  const handleRestoreCadence = (cadence: Cadence) => onRestore(cadence.id);
  const handleClickItem = (cadence: Cadence) => onClickItem(cadence);

  if (cadenceLoading || !cadences) {
    return (cadences?.map((item) => item?.id) || [1, 2, 3]).map((_idx) => (
      <CadenceListItemLoading key={`cadence_item_loading${_idx}`} />
    ));
  }

  if (archivedVersion) {
    return (
      <div className={classes.whiteSection}>
        <ButtonBase
          className={classes.buttonTitle}
          onClick={() => setCollapseOpen(!collapseOpen)}
        >
          {collapseOpen ? <ExpandMoreIcon /> : <ExpandLessIcon />}
          <Typography
            variant="h5"
            color={collapseOpen ? 'textPrimary' : 'textSecondary'}
          >
            {`${t('cadence.archive.archivedHeader')}${'\u00A0'}(${
              cadences?.length || 0
            })${'\u00A0'}`}
          </Typography>
        </ButtonBase>

        <Collapse in={collapseOpen}>
          <List>
            {cadences.map((cadence) => (
              <CadenceListItem
                key={`cadence_disabled${cadence.id}`}
                loading={cadenceLoading}
                withoutIndex
                dense
                cadence={cadence}
                onRestore={onRestore && handleRestoreCadence}
              />
            ))}
          </List>
        </Collapse>
      </div>
    );
  }
  return (
    <>
      <List>
        {cadences.map((cadence) => (
          <CadenceListItem
            loading={cadenceLoading}
            key={`cadence_enable${cadence.id}`}
            cadence={cadence}
            onClick={onClickItem && handleClickItem}
            onShow={onShow && handleShowCadence}
            onEdit={onEdit && handleEditCadence}
            onDelete={onDelete && handleDeleteCadence}
            onRestore={onRestore && handleRestoreCadence}
            selectedId={selectedId}
          />
        ))}
      </List>
    </>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  buttonTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-Start',
    width: '100%',
    paddingBottom: theme.spacing(1),
    paddingTop: theme.spacing(2),
    paddingLeft: theme.spacing(2),
    gap: theme.spacing(1),
  },
  whiteSection: {
    backgroundColor: 'white',
  },
}));

export default CadenceList;
