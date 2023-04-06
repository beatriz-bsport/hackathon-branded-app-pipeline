import React from 'react';
import { useTranslation } from 'react-i18next';

import StarIcon from '@material-ui/icons/Star';
import DateRangeIcon from '@material-ui/icons/DateRange';
import OndemandVideoIcon from '@material-ui/icons/OndemandVideo';
import DoneIcon from '@material-ui/icons/Done';
import PeopleIcon from '@material-ui/icons/People';
import ClearIcon from '@material-ui/icons/Clear';
import StyleIcon from '@material-ui/icons/Style';

import { useValidityInfoForPrivatePassCard } from '#libs/marketplace/utils/private-pass';

import './styles.list.css';

import type { PrivatePass } from '#libs/private-service/types';

export type Props = {
  privatePass: PrivatePass;
  onShowCompatibilityDialog: () => void;
};

const PrivatePassDetailsList: React.FC<Props> = React.memo(
  ({ privatePass, onShowCompatibilityDialog }) => {
    const { t } = useTranslation('marketplace');

    const validityInfos = useValidityInfoForPrivatePassCard(privatePass);

    return (
      <ul className="bs-pass-details-dialog__list">
        <li className="bs-pass-details-dialog__list__item">
          <span className="bs-pass-details-dialog__list__item__icon">
            <StarIcon />
          </span>
          {t('genericCardDetails.credits.availableCredit', {
            count: privatePass?.credits,
          })}
        </li>
        {validityInfos && (
          <li className="bs-pass-details-dialog__list__item">
            <span className="bs-pass-details-dialog__list__item__icon">
              <DateRangeIcon />
            </span>
            {validityInfos}
          </li>
        )}
        {privatePass?.private_services?.length > 0 ? (
          <li className="bs-pass-details-dialog__list__item">
            <span className="bs-pass-details-dialog__list__item__icon">
              <DoneIcon />
            </span>
            <span>
              {t('genericCardDetails.compatibility.compatible', {
                count: privatePass.private_services.length,
              })}
            </span>
            <button
              type="button"
              onClick={onShowCompatibilityDialog}
              className="bs-pass-details-dialog__list__item__link"
            >
              {t('genericCardDetails.includedElements.see')}
            </button>
          </li>
        ) : (
          <li className="bs-pass-details-dialog__list__item">
            <span className="bs-pass-details-dialog__list__item__icon">
              <ClearIcon />
            </span>
            <span>{t('genericCardDetails.compatibility.none')}</span>
          </li>
        )}
        {privatePass?.full_vod_access && (
          <li className="bs-pass-details-dialog__list__item">
            <span className="bs-pass-details-dialog__list__item__icon">
              <OndemandVideoIcon />
            </span>
            {t(`genericCardDetails.includedElements.fullVodAccess`)}
          </li>
        )}
        {privatePass?.new_member_only && (
          <li className="bs-pass-details-dialog__list__item">
            <span className="bs-pass-details-dialog__list__item__icon">
              <PeopleIcon />
            </span>
            {t(`genericCardDetails.includedElements.newMemberOnly`)}
          </li>
        )}
        {!!privatePass?.linked_payment_pack && (
          <li className="bs-pass-details-dialog__list__item">
            <span className="bs-pass-details-dialog__list__item__icon">
              <StyleIcon />
            </span>
            {t(`genericCardDetails.includedElements.isUniversalPass`)}
          </li>
        )}
      </ul>
    );
  },
);
export default PrivatePassDetailsList;
