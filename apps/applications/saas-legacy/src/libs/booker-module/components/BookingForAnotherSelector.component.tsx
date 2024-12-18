import React from 'react';

import Typography from '@material-ui/core/Typography';
import Drawer from '@material-ui/core/Drawer';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';
import ButtonBase from '@material-ui/core/ButtonBase';
import MenuItem from '@material-ui/core/MenuItem';
import { createTheme, MuiThemeProvider } from '@material-ui/core';

import { useTranslation } from 'react-i18next';

import type { MemberMinimal } from '#src/libs/member/types';

import { ChevronDown } from '#src/components/untitledui';
import { CONSUMER_SPACE_MOBILE_BREAKPOINT } from '#src/libs/consumer-space/constants';
import useViewport from '#src/components/css-only/Fabrique/hooks/useViewport';

type Props = {
  relatedMembersList: MemberMinimal[];
  memberBookingId: number;
  handleMemberUpdate: (newMemberBookingId: number) => void;
};

type DrawerRelationshipItemProps = {
  memberId: number;
  memberName: string;
  isActive: boolean;
  onClick: (newMemberBookingId: number) => void;
};

type DrawerRelationshipSelectorProps = {
  onToggleDrawer: () => void;
  isOpen: boolean;
  selectedMemberId: number;
  handleChange: (newMemberBookingId: number) => void;
  relatedMembersList: MemberMinimal[];
  onConfirm: () => void;
};

const drawerCustomTheme = createTheme({
  overrides: {
    MuiDrawer: {
      paperAnchorBottom: { borderRadius: '12px 12px 0px 0px' },
    },
  },
});

const DrawerRelationshipItem: React.FC<DrawerRelationshipItemProps> = ({
  memberId,
  memberName,
  isActive,
  onClick,
}) => {
  const onClickDrawerItem = React.useCallback(() => {
    onClick(memberId);
  }, [onClick, memberId]);

  return (
    <ButtonBase
      className={
        isActive
          ? 'bs-new-offer-booking__booking-for-another-mobile-relationship-card-active'
          : 'bs-new-offer-booking__booking-for-another-mobile-relationship-card'
      }
      onClick={onClickDrawerItem}
    >
      {memberName}
    </ButtonBase>
  );
};

const DrawerRelationshipSelector: React.FC<DrawerRelationshipSelectorProps> = ({
  onToggleDrawer,
  isOpen,
  selectedMemberId,
  handleChange,
  relatedMembersList,
  onConfirm,
}) => {
  const { t } = useTranslation(['common', 'booking']);

  return (
    <Drawer
      disablePortal
      anchor="bottom"
      onClose={onToggleDrawer}
      open={isOpen}
    >
      <div className="bs-new-offer-booking__booking-for-another-drawer-header-container">
        <div className="bs-new-offer-booking__booking-for-another-drawer-title-container">
          <div className="bs-new-offer-booking__booking-for-another-drawer-title">
            {t('booking:offer.bookingFor')}
          </div>
          <div className="bs-new-offer-booking__booking-for-another-drawer-subtitle">
            {t('booking:offer.bookingForSubtitle')}
          </div>
        </div>
      </div>
      <div className="bs-new-offer-booking__booking-for-another-drawer-divider"></div>
      <div className="bs-new-offer-booking__booking-for-another-mobile-relationship-card-container">
        <DrawerRelationshipItem
          key={-1}
          isActive={-1 === selectedMemberId}
          memberId={-1}
          memberName={t('booking:offer.bookingForMe')}
          onClick={handleChange}
        />
        {relatedMembersList.map((member) => (
          <DrawerRelationshipItem
            key={member.id}
            isActive={member.id === selectedMemberId}
            memberId={member.id}
            memberName={member.name}
            onClick={handleChange}
          />
        ))}
      </div>
      <div className="bs-new-offer-booking__booking-for-another-drawer-divider"></div>
      <div className="bs-new-offer-booking__booking-for-another-drawer-button-container">
        <ButtonBase
          className="bs-new-offer-booking__booking-for-another-drawer-button-confirm"
          onClick={onConfirm}
        >
          {t('common:confirm').toUpperCase()}
        </ButtonBase>
        <ButtonBase
          className="bs-new-offer-booking__booking-for-another-drawer-button-back"
          onClick={onToggleDrawer}
        >
          {t('common:back').toUpperCase()}
        </ButtonBase>
      </div>
    </Drawer>
  );
};

const BookingForAnotherSelector: React.FC<Props> = ({
  memberBookingId,
  relatedMembersList,
  handleMemberUpdate,
}) => {
  const { t } = useTranslation('booking');
  const { width } = useViewport();
  const [isDrawerOpen, setIsDrawerOpen] = React.useState<boolean>(false);
  const [drawerSelectedMemberId, setDrawerSelectedMemberId] =
    React.useState<number>(memberBookingId);

  const isMobile = React.useMemo(() => {
    return width < CONSUMER_SPACE_MOBILE_BREAKPOINT;
  }, [width]);

  const onToggleDrawer = React.useCallback(() => {
    setIsDrawerOpen(!isDrawerOpen);
    setDrawerSelectedMemberId(memberBookingId);
  }, [
    setDrawerSelectedMemberId,
    setIsDrawerOpen,
    isDrawerOpen,
    memberBookingId,
  ]);

  const handleMemberSelect = React.useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      const newMemberBookingId = event.target.value;

      if (!newMemberBookingId) return;
      handleMemberUpdate(parseInt(newMemberBookingId, 10));
    },
    [handleMemberUpdate],
  );

  const onDrawerConfirm = React.useCallback(() => {
    handleMemberUpdate(drawerSelectedMemberId);
    onToggleDrawer();
  }, [handleMemberUpdate, drawerSelectedMemberId, onToggleDrawer]);

  const handleChange = React.useCallback(
    (memberId: number) => {
      setDrawerSelectedMemberId(memberId);
    },
    [setDrawerSelectedMemberId],
  );

  return (
    <div className="bs-new-offer-booking__booking-for-another">
      <Typography className="bs-new-offer-booking__booking-for-another-title">
        {t('booking:offer.bookingFor')}
      </Typography>
      {isDrawerOpen && isMobile && (
        <MuiThemeProvider theme={drawerCustomTheme}>
          <DrawerRelationshipSelector
            handleChange={handleChange}
            isOpen={isDrawerOpen}
            onConfirm={onDrawerConfirm}
            onToggleDrawer={onToggleDrawer}
            relatedMembersList={relatedMembersList}
            selectedMemberId={drawerSelectedMemberId}
          />
        </MuiThemeProvider>
      )}
      {isMobile ? (
        <Button
          className="bs-new-offer-booking__booking-for-another-select"
          onClick={onToggleDrawer}
        >
          {relatedMembersList.find((member) => member.id === memberBookingId)
            ?.name || t('booking:offer.bookingForMe')}
          <ChevronDown stroke="currentColor" />
        </Button>
      ) : (
        <Select
          disableUnderline
          className="bs-new-offer-booking__booking-for-another-select"
          id="user-booking-selector"
          labelId="user-booking-selector-label"
          MenuProps={{
            anchorOrigin: {
              vertical: 'bottom',
              horizontal: 'left',
            },
            transformOrigin: {
              vertical: 'top',
              horizontal: 'left',
            },
            getContentAnchorEl: null,
          }}
          onChange={handleMemberSelect}
          value={memberBookingId}
        >
          <MenuItem key={-1} value={-1}>
            {t('booking:offer.bookingForMe')}
          </MenuItem>
          {relatedMembersList.map((relationship) => (
            <MenuItem key={relationship.id} value={relationship.id}>
              {relationship.name}
            </MenuItem>
          ))}
        </Select>
      )}
    </div>
  );
};

export default React.memo(BookingForAnotherSelector);
