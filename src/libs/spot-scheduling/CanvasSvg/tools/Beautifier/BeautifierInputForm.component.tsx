import React from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import {
  IntegerField,
  TextField,
  SelectField,
  // @ts-expect-error
} from '../../../../../components/forms';

export const HeightField: React.FC = React.memo(() => {
  return <IntegerField fullWidth label="height" name="height" />;
});
export const WidthField: React.FC = React.memo(() => {
  return <IntegerField fullWidth label="width" name="height" />;
});

export const PositionXField: React.FC = React.memo(() => {
  return <IntegerField fullWidth label="x" name="x" />;
});

export const PositionYField: React.FC = React.memo(() => {
  return <IntegerField fullWidth label="y" name="y" />;
});

export const RotationField: React.FC = React.memo(() => {
  return <IntegerField fullWidth label="rotation" name="rotation" />;
});

export const StrokeLineCapField: React.FC = React.memo(() => {
  return (
    <SelectField
      fullWidth
      choices={['butt', 'round', 'square']}
      itemRenderer={(choice: string) => (
        <MenuItem key={choice} value={choice}>
          {choice}
        </MenuItem>
      )}
      label="strokeLinecap"
      name="strokeLinecap"
    />
  );
});

export const StrokeWidthField: React.FC = React.memo(() => {
  return <IntegerField fullWidth label="strokeWidth" name="strokeWidth" />;
});

export const StrokeColorField: React.FC = React.memo(() => {
  return <TextField label="stroke" name="stroke" />;
});

export const FillField: React.FC = React.memo(() => {
  return <TextField label="fill" name="fill" />;
});

export const ImageLinkField: React.FC = React.memo(() => {
  return <TextField label="image-link" name="image" />;
});
