// @flow

import React from 'react';

import withStyles from '@material-ui/core/styles/withStyles';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/DeleteForever';

type Props = {
  onRemoveImage: (number) => void,
  images: *[],

  classes: Object,
};

export function ImageList(props: Props) {
  const { images, onRemoveImage, classes } = props;
  return (
    <div className={classes.container}>
      {images.map((image) => (
        <div key={image.id} className={classes.imagePreview}>
          <Button
            aria-label="Remove"
            className={classes.imageRemove}
            onClick={(e) => {
              e.preventDefault();
              onRemoveImage(image.id);
            }}
            size="small"
          >
            <DeleteIcon />
          </Button>
          <img alt="preview" className={classes.image} src={image.image} />
        </div>
      ))}
    </div>
  );
}

const styles = (theme) => ({
  container: {
    overflowX: 'scroll',
    display: 'flex',
    flexFlow: 'row no-wrap',
  },
  imagePreview: {
    position: 'relative',
    minWidth: 220,
    textAlign: 'center',
    boxSizing: 'content-box',
    backgroundColor: '#F6f6f6',
    border: '1px solid #e1e1e1',
    marginTop: theme.spacing(2),
    marginRight: theme.spacing(2),
    height: theme.spacing(15),
    width: theme.spacing(15) * 1.618,
  },
  image: {
    objectFit: 'contain',
    maxHeight: theme.spacing(15),
    maxWidth: theme.spacing(15) * 1.618,
  },
  imageRemove: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
});
export default withStyles(styles)(ImageList);
