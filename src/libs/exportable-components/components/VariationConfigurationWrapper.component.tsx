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

// Wrapper that pass different props depending on the current state
const VariationConfigurationWrapper: React.FC<{
  componentId: string;
}> = ({ componentId, children }) => {
  const { t } = useTranslation('widget');
  const classes = useStyles();

  const config = useMemo(
    () => getCssComponentByLabel(componentId),
    [componentId],
  );

  const [isOpen, setIsOpen] = useState(false);
  const [variationsSelected, setVariationsSelected] = useState(
    config.defaultVariation,
  );

  useEffect(() => {
    setVariationsSelected(config.defaultVariation);
  }, [config.defaultVariation]);

  const onToggle = useCallback(() => {
    setIsOpen(!isOpen);
  }, [isOpen]);

  const handleSelected = useCallback(
    (index: number) => (_: any, value: any) => {
      const _variationsSelected = [...variationsSelected];
      _variationsSelected[index].value = value;
      setVariationsSelected(_variationsSelected);
    },
    [variationsSelected],
  );

  const formatedProps = useMemo(() => {
    return variationsSelected.reduce<Record<string, any>>((acc, variation) => {
      const variationOptions = config.variations?.find(
        (c) => c.propsKey === variation.propsKey,
      );
      const variationSelected = variationOptions?.choices?.find(
        (opt) => opt.value === variation.value,
      );

      acc[variation.propsKey] = variationSelected?.data;
      return acc;
    }, {});
  }, [config.variations, variationsSelected]);

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
            {config.variations.map(({ propsKey, label, choices }, index) => (
              <div key={propsKey} className={classes.variation}>
                <Typography variant="h6">
                  {t(`widget.cssConfig.title.${label}`)}
                </Typography>
                <RadioGroup
                  onChange={handleSelected(index)}
                  className={classes.checkbox}
                >
                  {choices.map(({ label: choiceLabel, value }) => (
                    <FormControlLabel
                      key={choiceLabel}
                      value={value}
                      control={
                        <Radio
                          checked={variationsSelected?.[index]?.value === value}
                        />
                      }
                      label={t(`widget.cssConfig.option.${choiceLabel}`)}
                    />
                  ))}
                </RadioGroup>
              </div>
            ))}
          </Collapse>
        </div>
      )}
      <div
        className={classNames(classes.preview, {
          [classes.flex]: config.showAsFlex,
        })}
      >
        {/* Here injecting the new props to the children */}
        <div>{React.cloneElement(children, formatedProps)}</div>
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

export default VariationConfigurationWrapper;
