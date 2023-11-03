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
  return <IntegerField fullWidth label="width" name="width" />;
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
  return <IntegerField fullWidth label="stroke-width" name="strokeWidth" />;
});

export const StrokeColorField: React.FC = React.memo(() => {
  return <TextField label="stroke" name="stroke" />;
});

export const StrokeDasharrayField: React.FC = React.memo(() => {
  return <TextField label="stroke-dasharray" name="strokeDasharray" />;
});
export const FillField: React.FC = React.memo(() => {
  return <TextField label="fill" name="fill" />;
});

export const ImageLinkField: React.FC = React.memo(() => {
  return <TextField label="image-link" name="image" />;
});

export const FontSizeField: React.FC = React.memo(() => {
  return <IntegerField fullWidth label="font-size" name="fontSize" />;
});
export const FontColorField: React.FC = React.memo(() => {
  return <TextField fullWidth label="font-color" name="fontColor" />;
});
export const FontWeightField: React.FC = React.memo(() => {
  return <IntegerField fullWidth label="font-weight" name="fontWeight" />;
});
export const TextStrokeField: React.FC = React.memo(() => {
  return <TextField fullWidth label="text-stroke" name="textStroke" />;
});
export const TextStrokeWidthField: React.FC = React.memo(() => {
  return (
    <IntegerField fullWidth label="text-stroke-width" name="textStrokeWidth" />
  );
});

export const FontStyleField: React.FC = React.memo(() => {
  return (
    <SelectField
      fullWidth
      choices={['normal', 'italic', 'oblique']}
      itemRenderer={(choice: string) => (
        <MenuItem key={choice} value={choice}>
          {choice}
        </MenuItem>
      )}
      label="font-style"
      name="fontStyle"
    />
  );
});
export const TextOffsetXField: React.FC = React.memo(() => {
  return (
    <IntegerField
      fullWidth
      label="text-offset-x"
      min={-100}
      name="textOffsetX"
    />
  );
});

export const TextOffsetYField: React.FC = React.memo(() => {
  return (
    <IntegerField
      fullWidth
      label="text-offset-y"
      min={-100}
      name="textOffsetY"
    />
  );
});
