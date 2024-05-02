import React from 'react';
import { Theme, useTheme } from '@material-ui/core';
import { StepperConfig } from '#components/chip/types';
import NumberChip from '#components/chip/NumberChip.component';
import CustomChip from '#components/chip/CustomChip.component';

type Props = {
  value: number;
  translation: string;
  columnName: string;
  row_extra_data?: { [key: string]: number | string };
  chipClass?: string;
};

const getSpecs = (theme: Theme, credits: number | null) => {
  const green = theme.palette.success;
  const yellow = { main: '#FF9800', dark: '#C77700' };
  const orange = { main: '#FF5C00', dark: '#C94800' };
  const red = theme.palette.error;

  const specs: { [key: string]: StepperConfig } = {
    available_credits: {
      low: {
        value: 0,
        color: green.dark,
        icon: 'CheckCircle',
        iconColor: green.main,
      },
      lmed: null,
      medium: {
        range: [0, credits - 1],
        color: orange.dark,
        icon: 'Error',
        iconColor: orange.main,
      },
      high: {
        value: credits,
        color: red.dark,
        icon: 'Cancel',
        iconColor: red.main,
      },
      defaultRange: 'medium',
    },
    rate_attendance: {
      low: { value: 0, color: red.dark, icon: 'Cancel', iconColor: red.main },
      lmed: {
        range: [0, 50],
        color: orange.dark,
        icon: 'Error',
        iconColor: orange.main,
      },
      medium: {
        range: [50, 90],
        color: yellow.dark,
        icon: 'RemoveCircle',
        iconColor: yellow.main,
      },
      high: {
        range: [90, 100],
        color: green.dark,
        icon: 'CheckCircle',
        iconColor: green.main,
      },
      defaultRange: 'lmed',
    },
    credits: {
      low: {
        range: [-Infinity, -1],
        color: yellow.dark,
        icon: 'Warning',
        iconColor: yellow.main,
      },
      lmed: null,
      medium: null,
      high: {
        range: [-1, Infinity],
        color: green.dark,
        icon: 'CheckCircle',
        iconColor: green.main,
      },
      defaultRange: 'low',
    },
    nb_non_activated: {
      low: {
        value: 0,
        color: green.dark,
        icon: 'CheckCircle',
        iconColor: green.main,
      },
      lmed: null,
      medium: null,
      high: {
        range: [0, Infinity],
        color: red.dark,
        icon: 'Error',
        iconColor: red.main,
      },
      defaultRange: 'high',
    },
    unpaid_amount: {
      low: {
        value: 0,
        color: green.dark,
      },
      lmed: null,
      medium: null,
      high: {
        range: [0, Infinity],
        color: red.dark,
      },
      defaultRange: 'high',
    },
    rate_non_attendance: {
      low: {
        value: 0,
        color: green.dark,
        icon: 'CheckCircle',
        iconColor: green.main,
      },
      lmed: {
        range: [0, 10],
        color: yellow.dark,
        icon: 'RemoveCircle',
        iconColor: yellow.main,
      },
      medium: {
        range: [10, 90],
        color: orange.dark,
        icon: 'Error',
        iconColor: orange.main,
      },
      high: {
        range: [90, 100],
        color: red.dark,
        icon: 'Cancel',
        iconColor: red.main,
      },
      defaultRange: 'medium',
    },
    cancel_rate: {
      low: {
        value: 0,
        color: green.dark,
        icon: 'CheckCircle',
        iconColor: green.main,
      },
      lmed: {
        range: [0, 10],
        color: yellow.dark,
        icon: 'RemoveCircle',
        iconColor: yellow.main,
      },
      medium: {
        range: [10, 90],
        color: orange.dark,
        icon: 'Error',
        iconColor: orange.main,
      },
      high: {
        range: [90, 100],
        color: red.dark,
        icon: 'Cancel',
        iconColor: red.main,
      },
      defaultRange: 'medium',
    },
    stock: {
      low: {
        range: [-Infinity, -1],
        color: red.dark,
        icon: 'Error',
        iconColor: red.main,
      },
      lmed: null,
      medium: {
        value: 0,
        color: orange.dark,
        icon: 'RemoveCircle',
        iconColor: orange.main,
      },
      high: {
        range: [0, Infinity],
        color: green.dark,
        icon: 'CheckCircle',
        iconColor: green.main,
      },
      defaultRange: 'medium',
    },
  };
  return specs;
};

const ReportConditionChip: React.FC<Props> = ({
  columnName,
  row_extra_data,
  value,
  translation,
  chipClass,
}) => {
  const theme = useTheme();

  if (row_extra_data) {
    const specs = getSpecs(theme, Number(row_extra_data?.credits));

    if (specs[columnName]) {
      const config = specs[columnName];
      return (
        <NumberChip
          chipClass={chipClass}
          config={config}
          displayedValue={translation}
          value={value}
        />
      );
    }
  }

  return <CustomChip chipClass={chipClass} displayedValue={value.toString()} />;
};

export default React.memo(ReportConditionChip);
