import React from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';

import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import ArrowBack from '@material-ui/icons/ArrowBack';

import MuiIcon from '#components/MuiIcon.component';
import useStyles from './styles';

type Props = {
  sectionIcon: string;
  sectionName: string;
  goBack: () => void;
  customClasses?: { [className: string]: string };
};

const QuicksaleItemListHeader: React.FC<Props> = ({
  sectionIcon,
  sectionName,
  goBack,
  customClasses,
}) => {
  const { t } = useTranslation('quicksale');

  const classes = useStyles({});

  return (
    <div
      className={classNames(
        classes.itemListHeader,
        customClasses?.itemListHeader,
      )}
    >
      <Button
        color="default"
        variant="outlined"
        startIcon={<ArrowBack />}
        className={classNames(
          classes.goBackButton,
          customClasses?.goBackButton,
        )}
        onClick={goBack}
      >
        <Typography variant="subtitle2">{t('itemList.goBack')}</Typography>
      </Button>
      <div
        className={classNames(classes.sectionInfo, customClasses?.sectionInfo)}
      >
        <MuiIcon icon={sectionIcon} />
        <Typography
          variant="h6"
          className={classNames(
            classes.sectionTitle,
            customClasses?.sectionTitle,
          )}
        >
          {sectionName}
        </Typography>
      </div>
    </div>
  );
};

export default React.memo(QuicksaleItemListHeader);
