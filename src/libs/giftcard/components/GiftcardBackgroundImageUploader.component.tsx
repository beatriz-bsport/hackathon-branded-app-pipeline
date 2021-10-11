import React from 'react';

import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';

import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import { makeStyles, Theme } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import MultipleImageUploader from '../../../components/MultipleImageUploader.component';
import ConsumerGiftcardPreview from './ConsumerGiftcardPreview.component';
import { GiftcardBackgroundImage } from '../types';

const Carousel = (props: { imageList: { image: string; id: number } }) => (
  <div>
    {props.imageList.map((img) => (
      // eslint-disable-next-line
      <button onClick={(img) => props.onRemove(img.id)}>
        {JSON.stringify(img)}
      </button>
    ))}
  </div>
);
const useStyles = makeStyles((theme: Theme) => ({
  container: {},
  content: {
    '&>*': {
      marginBottom: theme.spacing(3),
    },
  },
}));

type Props = {
  giftcardBackgroundImageList: Array<GiftcardBackgroundImage>;
  onClose: () => void;
  onAddImage: (data: any) => void;
  onRemoveImage: (id: number) => void;
};

export const GiftcardBackgroundImageUploader = (props: Props) => {
  const classes = useStyles();

  const { t } = useTranslation(['giftcard']);

  return (
    <Dialog open={props.open}>
      <DialogTitle>{t('backgroundImage.dialog.title')}</DialogTitle>
      <DialogContent className={classes.content}>
        <Typography>{t('backgroundImage.dialog.explain')}</Typography>
        <MultipleImageUploader
          initial={[]}
          onAddImage={props.onAddImage}
          onRemoveImage={props.onRemoveImage}
        />
        <Carousel
          onRemove={props.onRemoveImage}
          imageList={props.giftcardBackgroundImageList}
        />
        <ConsumerGiftcardPreview
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
            background_image: props.selectedImage,
          }}
          giftcard={{ amount_gifted: 0 }}
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
