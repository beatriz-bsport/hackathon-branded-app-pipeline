export const styles = (theme) => ({
  dropzone: {
    width: '100%',
    minHeight: 20 * theme.spacing.unit,
    border: '2px gray dashed',
    backgroundColor: '#F7F7F7',
    cursor: 'pointer',
  },
  root: {
    marginTop: theme.spacing.unit,
  },
  text: {
    transform: 'translate(-50%, -50%)',
    position: 'absolute',
    top: '50%',
    left: '50%',
    color: '#999999',
  },
  imagePreview: {
    position: 'relative',
    display: 'inline-block',
    textAlign: 'center',
    boxSizing: 'content-box',
    backgroundColor: '#F6f6f6',
    border: '1px solid #e1e1e1',
    margin: theme.spacing.unit,
    height: theme.spacing.unit * 15,
    width: theme.spacing.unit * 15 * 1.618,
  },
  image: {
    objectFit: 'contain',
    maxHeight: theme.spacing.unit * 15,
    maxWidth: theme.spacing.unit * 15 * 1.618,
  },
  imageRemove: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
});

export const smallStyles = (theme) => ({
  ...styles(theme),
  dropzone: {
    width: 32,
    height: 32,
    minHeight: 20 * theme.spacing.unit,
    border: '2px gray dashed',
    backgroundColor: '#F7F7F7',
    cursor: 'pointer',
  },
});
