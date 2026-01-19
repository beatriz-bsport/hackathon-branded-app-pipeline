import React from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';

import CadenceTemplateCard from './CadenceTemplateCard.component';
import { CADENCE_TEMPLATE_LIST } from '#src/libs/sequential_marketing/cadence_templates/constants';
import { CADENCE_TEMPLATE_CARD_WIDTH } from '#src/libs/sequential_marketing/constants';

import type {
  CadenceConfigData,
  CadenceTemplate,
} from '#src/libs/sequential_marketing/cadence_templates/types';

type Props = {
  onTemplateUse: (config: CadenceConfigData) => void;
  createFromScratch: () => void;
};

const CadenceTemplatePicker: React.FC<Props> = ({
  onTemplateUse,
  createFromScratch,
}) => {
  const classes = useStyles();
  const { t } = useTranslation('marketing');

  const handleTemplateClick = (template: CadenceTemplate) => () => {
    const config = template.getConfig(t);
    onTemplateUse?.(config);
  };

  return (
    <div className={classes.container}>
      <div className={classes.grid}>
        <CadenceTemplateCard
          key="create-from-scratch"
          onButtonClick={createFromScratch}
          variant="scratch"
        />
        {CADENCE_TEMPLATE_LIST.map((template, index) => (
          <CadenceTemplateCard
            key={`template-${index}`}
            description={template.description}
            image={template.cover}
            onButtonClick={handleTemplateClick(template)}
            title={template.title}
            variant="template"
          />
        ))}
      </div>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    width: '100%',
    overflowY: 'auto',
    scrollbarWidth: 'none',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: `repeat(auto-fill, ${CADENCE_TEMPLATE_CARD_WIDTH}px)`,
    gap: theme.spacing(2),
    justifyItems: 'center',
    justifyContent: 'center',
  },
}));

export default React.memo(CadenceTemplatePicker);
