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
import {
  CSSComponentsById,
  VariationConfigurationChoice,
} from '#libs/exportable-components/types';
/*  Wrapper that dynamically passes different props based on the current state.
 * This wrapper is utilized to display the appropriate React component (children) sourced from the configurations.
 * It is also responsible for managing the state/variant in which the user wants to view the displayed component.
 * Once the different variants are selected, it renders the cloned children in the DOM and adds variant-specific inherited props.
 * The "variationsSelected" is then utilized within the component to generate data from factories, modify default props, change states, and more.
 */

import './variation_configuration_preview.css';

const VariationConfigurationWrapper: React.FC<{
  componentId: CSSComponentsById;
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
    (variantCategoryLabel: string) => (_: any, value: any) => {
      setVariationsSelected({
        ...variationsSelected,
        [variantCategoryLabel]: { label: value, value },
      });
    },
    [variationsSelected],
  );

  const isSelectedComponentModal = useMemo(() => {
    switch (componentId) {
      case 'contractDetailModal':
        return true;
      case 'contractTermsModal':
        return true;
      case 'contractCooldownModal':
        return true;
      case 'contractCouponFormModal':
        return true;
      case 'paymentPackCompatibilityModal':
        return true;
      case 'paymentPackRestrictionModal':
        return true;
      case 'privatePassCompatibilityModal':
        return true;
      case 'paymentPackOffPeakRestrictionModal':
        return true;
      default:
        return false;
    }
  }, [componentId]);

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
          <Collapse unmountOnExit in={isOpen}>
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
                    className={classes.checkbox}
                    onChange={handleSelected(variantCategoryLabel)}
                  >
                    {choices.map(({ label: choiceLabel, value }) => (
                      <FormControlLabel
                        key={choiceLabel}
                        control={
                          <Radio
                            checked={
                              value ===
                              variationsSelected?.[variantCategoryLabel]?.value
                            }
                          />
                        }
                        label={t(`widget.cssConfig.option.${choiceLabel}`)}
                        value={value}
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
        className={classNames(
          'bs-custom-css__component__preview',
          classes.preview,
          classes.centered,
          {
            [classes.flex]: config.showAsFlex,
          },
        )}
      >
        {/* Here injecting the new props to the children */}
        <div
          className={classNames(classes.componentWrapper, {
            [classes.fullHeight]: isSelectedComponentModal,
          })}
        >
          {React.cloneElement(children, { variationsSelected })}
        </div>
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
    marginBottom: theme.spacing(2),
  },
  centered: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  componentWrapper: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
  },
  fullHeight: {
    height: '100%',
  },
}));

export default React.memo(VariationConfigurationWrapper);
