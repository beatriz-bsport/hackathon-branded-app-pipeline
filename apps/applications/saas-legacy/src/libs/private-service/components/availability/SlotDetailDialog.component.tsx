import React, { useState } from 'react';

import { makeStyles, Theme } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import GenericResponsiveDialog from '#src/components/genericDialog/GenericResponsiveDialog';
import InfoBox from '#src/components/box/InfoBox.component';
import {
  AvailabilityDetail,
  ResourceType,
} from '#src/libs/private-service/types';
import SlotDetailListItem from './SlotDetailListItem.component';

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: theme.palette.grey[300],
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
  resourceNameRow: {
    display: 'flex',
    alignItems: 'center',
  },
  avatar: {
    marginRight: theme.spacing(1),
  },
  flexColumn: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  greyText: {
    color: theme.palette.grey[600],
  },
  slot: {
    marginTop: theme.spacing(1),
  },
  list: {
    margin: 'unset',
    paddingLeft: theme.spacing(3),
  },
  first: {
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  last: {
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
  },
  tabContainer: {
    marginBottom: theme.spacing(2),
  },
  slotContainer: {
    maxHeight: '70vh',
    overflowY: 'scroll',
    marginBottom: theme.spacing(3),
  },
  infoBox: {
    marginBottom: theme.spacing(2),
  },
}));

export type Props = {
  detailByResourceType: Record<ResourceType, Array<AvailabilityDetail>>;
  onLeave: () => void;
};

export const SlotDetailDialog: React.FC<Props> = ({
  detailByResourceType,
  onLeave,
}) => {
  const [selectedResourceType, setSelectedResourceType] = useState(
    Object.keys(detailByResourceType)[0],
  );
  const classes = useStyles();

  const { t } = useTranslation('privateService');

  const handleResourceChange = (
    _: React.ChangeEvent<HTMLElement>,
    newValue: string,
  ) => {
    setSelectedResourceType(newValue);
  };

  // @ts-expect-error
  const availabilityDetails = detailByResourceType[selectedResourceType];

  if (!availabilityDetails) {
    return (
      <GenericResponsiveDialog open maxWidth="sm">
        <DialogTitle>
          <Typography variant="h6">
            {t('availabilitySlot.detail.dialog.title')}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <InfoBox
            className={classes.infoBox}
            content={t('availabilitySlot.detail.detailEmpty')}
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={onLeave} variant="contained">
            {t('availabilitySlot.detail.ok')}
          </Button>
        </DialogActions>
      </GenericResponsiveDialog>
    );
  }

  return (
    <GenericResponsiveDialog open maxWidth="sm">
      <DialogTitle>
        <Typography variant="h6">
          {t('availabilitySlot.detail.dialog.title')}
        </Typography>
      </DialogTitle>
      <DialogContent>
        <div className={classes.tabContainer}>
          <Tabs
            indicatorColor="primary"
            onChange={handleResourceChange}
            textColor="primary"
            value={selectedResourceType}
          >
            {Object.keys(detailByResourceType).map((key) => (
              <Tab
                key={key}
                label={t(`resource.datatype.${key}`)}
                value={key}
              />
            ))}
          </Tabs>
        </div>

        <div className={classes.slotContainer}>
          {/* @ts-expect-error  */}
          {availabilityDetails.map((availabilityDetail, index) => (
            <SlotDetailListItem
              key={`SlotDetailListItem-${index}`}
              {...availabilityDetail}
              isFirst={index === 0}
              isLast={index === availabilityDetails.length - 1}
            />
          ))}
        </div>
      </DialogContent>
      <DialogActions>
        <Button color="primary" onClick={onLeave} variant="contained">
          {t('availabilitySlot.detail.ok')}
        </Button>
      </DialogActions>
    </GenericResponsiveDialog>
  );
};

export default SlotDetailDialog;
