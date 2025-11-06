import React, { useState } from 'react';

import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';

import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import { makeStyles, Theme } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
// @ts-expect-error
import MultipleImageUploader from '../../../components/MultipleImageUploader.component';
import ConsumerGiftcardPreview from './ConsumerGiftcardPreview.component';
import CarouselInput from '../../../components/input/carousel-input';
import { GiftcardBackgroundImage } from '../types';

const useStyles = makeStyles((theme: Theme) => ({
  container: {},
  content: {
    '&>*': {
      marginBottom: theme.spacing(3),
    },
  },
  spacing: {
    height: '50px',
  },
}));

type Props = {
  giftcardBackgroundImageList: Array<GiftcardBackgroundImage>;
  onClose: () => void;
  onAddImage: (data: any) => void;
  onRemoveImage: (index: number) => void;
  open: boolean;
  companyCover: string;
};

export const GiftcardBackgroundImageUploader = (props: Props) => {
  const classes = useStyles();

  const { t } = useTranslation(['giftcard']);
  const [selectedImage, setSelectedImage] = useState(null);

  return (
    <Dialog open={props.open}>
      <DialogTitle>{t('backgroundImage.dialog.title')}</DialogTitle>
      <DialogContent className={classes.content}>
        <Typography>{t('backgroundImage.dialog.explain')}</Typography>
        <MultipleImageUploader initial={[]} onAddImage={props.onAddImage} />
        {props.giftcardBackgroundImageList.length > 0 ? (
          <CarouselInput
            isManager
            handleClick={(index) =>
              selectedImage === index
                ? setSelectedImage(null)
                : setSelectedImage(index)
            }
            imagesArr={props.giftcardBackgroundImageList.map(
              (img) => img.image,
            )}
            onRemoveImage={(index) => props.onRemoveImage(index)}
            selectedImage={selectedImage}
          />
        ) : (
          <div className={classes.spacing} />
        )}
        <ConsumerGiftcardPreview
          valueIsPlaceholderString
          companyCover={props.companyCover}
          consumerGiftcard={{
            name: t('consumerGiftcard.previewPlaceholder.name'),
            message_is_from: t(
              'consumerGiftcard.previewPlaceholder.message_is_from',
            ),
            message_is_for: t(
              'consumerGiftcard.previewPlaceholder.message_is_for',
            ),
            message_content: t(
              'consumerGiftcard.previewPlaceholder.message_content',
            ),
            background_image:
              props.giftcardBackgroundImageList[selectedImage]?.image,
            price_bought: t(
              'consumerGiftcard.previewPlaceholder.giftcard_amount',
            ) as string,
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onClose}>
          {t('backgroundImage.dialog.actions.close')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default GiftcardBackgroundImageUploader;
