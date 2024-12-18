import React from 'react';
import Button from '@material-ui/core/Button';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import { Formik, FormikProps } from 'formik';
import type { OptionCallback } from '../../../../../state/types';

//@ts-expect-error
import { SwitchField } from '../../../../../components/forms';

import { CanvasElement } from '../BaseClasses/Base.tool';
import { CANVAS_SELECTABLE_TOOLS } from '../CanvasStrategy';

const PreferentialBsportSpotSchema = Yup.object().shape({
  type: Yup.string().oneOf([
    CANVAS_SELECTABLE_TOOLS.spot,
    CANVAS_SELECTABLE_TOOLS.spotCustomized,
  ]),
  isPreferentialBsportSpot: Yup.boolean().nullable(),
});

const getInitialValues = (canvasElement: CanvasElement<any>) => {
  if (!canvasElement) {
    return {};
  }
  switch (canvasElement.type) {
    case CANVAS_SELECTABLE_TOOLS.spot:
      return {
        type: canvasElement.type,
        ...canvasElement.data,
        isPreferentialBsportSpot:
          !!canvasElement.data?.isPreferentialBsportSpot,
      };
    default:
      return {
        type: canvasElement.type,
        ...canvasElement.data,
        isPreferentialBsportSpot: false,
      };
  }
};

type Props = {
  onSubmit: (values: any, options?: OptionCallback) => void;
  loading: boolean;
  canvasElement: CanvasElement<any>;
};

/**
 * @description The PreferentialBsportSpot feature aims to flag spots that should be prioritized for Bsport users.
 * This means that when random spot assignments are made for bookings coming from marketplaces,
 * the system should first try to occupy spots that are not flagged as preferential for in-platform (Bsport) bookings.
 */
export const PreferentialBsportSpotForm: React.FC<Props> = ({
  onSubmit,
  loading,
  canvasElement,
}) => {
  const { t } = useTranslation('spotScheduling');
  const classes = useStyles();

  return (
    <Formik
      enableReinitialize
      initialValues={getInitialValues(canvasElement)}
      onSubmit={(values, actions) => {
        onSubmit(values, {
          onSuccess: () => actions.resetForm(),
          onError: () => actions.resetForm(),
        });
      }}
      validationSchema={PreferentialBsportSpotSchema}
    >
      {(formikProps: FormikProps<any>) => {
        return (
          <form onSubmit={formikProps.handleSubmit}>
            <div style={{ width: '100%' }}>
              <div className={classes.centered}>
                <div className={classes.formContainer}>
                  <SwitchField
                    label={t(
                      'bsportPreferentialGroupForm.isPreferentialBsportSpotLabel',
                    )}
                    name="isPreferentialBsportSpot"
                  />
                  <Button
                    color="primary"
                    disabled={loading}
                    type="submit"
                    variant="text"
                  >
                    {t('bsportPreferentialGroupForm.submit')}
                  </Button>
                </div>
              </div>
            </div>
          </form>
        );
      }}
    </Formik>
  );
};

const useStyles = makeStyles((theme) => ({
  centered: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: theme.spacing(0.5),
    paddingRight: theme.spacing(0.5),
  },
  formContainer: {
    padding: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    minWidth: 200,
    maxWidth: 250,
  },
}));

export default React.memo(PreferentialBsportSpotForm);
