import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';

import { makeStyles } from '@material-ui/core/styles';
import {
  Collapse,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
} from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';

import { getCssComponentByLabel } from '../utils';
import { VariationConfigurationChoice } from '../types';
// Wrapper that pass different props depending on the current state
const VariationConfigurationWrapper: React.FC<{
  componentId: string;
  // By default React.FC interface interpolates the children as a React.ReactNode
  children: React.ReactElement<any, string | React.JSXElementConstructor<any>>;
}> = ({ componentId, children }) => {
  const { t } = useTranslation('widget');
  const classes = useStyles();

  const config = useMemo(
    () => getCssComponentByLabel(componentId),
    [componentId],
  );

  const [isOpen, setIsOpen] = useState(false);
  const [variationsSelected, setVariationsSelected] = useState<
    Record<string, VariationConfigurationChoice>
  >(
    config.variations.reduce<Record<string, VariationConfigurationChoice>>(
      (acc, cV) => {
        acc[cV.label] = cV.default;
        return acc;
      },
      {},
    ),
  );

  useEffect(() => {
    setVariationsSelected(
      config.variations.reduce<{ [key: string]: VariationConfigurationChoice }>(
        (acc, cV) => {
          acc[cV.label] = cV.default;
          return acc;
        },
        {},
      ),
    );
  }, [config.variations]);

  const onToggle = useCallback(() => {
    setIsOpen(!isOpen);
  }, [isOpen]);

  const handleSelected = useCallback(
    (variantCategoryLabel: string) => (toto: any, value: any) => {
      setVariationsSelected({
        ...variationsSelected,
        [variantCategoryLabel]: { label: value, value },
      });
    },
    [variationsSelected],
  );

  return (
    <div className={classes.config}>
      {config.variations.length > 0 && (
        <div className={classes.whiteBg}>
          <div className={classes.titleVariation}>
            <Typography variant="h5">
              {t(`widget.cssConfig.configurationTitle`)}
            </Typography>
            <IconButton onClick={onToggle}>
              {isOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          </div>
          <Collapse in={isOpen} unmountOnExit>
            {config.variations.map(
              ({ label: variantCategoryLabel, choices }, index) => (
                <div
                  key={`component_variation_${index}`}
                  className={classes.variation}
                >
                  <Typography variant="h6">
                    {t(`widget.cssConfig.title.${variantCategoryLabel}`)}
                  </Typography>
                  <RadioGroup
                    onChange={handleSelected(variantCategoryLabel)}
                    className={classes.checkbox}
                  >
                    {choices.map(({ label: choiceLabel, value }) => (
                      <FormControlLabel
                        key={choiceLabel}
                        value={value}
                        control={
                          <Radio
                            checked={
                              value ===
                              variationsSelected?.[variantCategoryLabel]?.value
                            }
                          />
                        }
                        label={t(`widget.cssConfig.option.${choiceLabel}`)}
                      />
                    ))}
                  </RadioGroup>
                </div>
              ),
            )}
          </Collapse>
        </div>
      )}
      <div
        className={classNames(classes.preview, {
          [classes.flex]: config.showAsFlex,
        })}
      >
        {/* Here injecting the new props to the children */}
        <div>{React.cloneElement(children, { variationsSelected })}</div>
      </div>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  preview: {
    position: 'relative',
    flex: 1,
  },
  flex: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  config: {
    height: '100%',
    flexDirection: 'column',
    display: 'flex',
  },
  checkbox: {
    flexDirection: 'row',
  },
  titleVariation: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  variation: {
    marginLeft: theme.spacing(2),
  },
  whiteBg: {
    backgroundColor: 'white',
    marginBottom: theme.spacing(2),
  },
}));

export default React.memo(VariationConfigurationWrapper);
