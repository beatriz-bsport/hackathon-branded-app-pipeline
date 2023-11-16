import React, { useMemo } from 'react';
import uniq from 'lodash/uniq';
import uniqBy from 'lodash/uniqBy';
import { compose } from 'recompose';
import { withTranslation, WithTranslation } from 'react-i18next';
import { WithStyles, createStyles, withStyles, Theme } from '@material-ui/core';
import { FieldArray, Formik, FormikProps, ErrorMessage } from 'formik';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import List from '@material-ui/core/List';
import ListSubheader from '@material-ui/core/ListSubheader';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import Typography from '@material-ui/core/Typography';
import * as Yup from 'yup';
import { Alert } from '@material-ui/lab';
import type {
  EstablishmentBillingGroup,
  EstablishmentBillingGroupAPI,
  Establishment,
  EstablishmentGroupByAddress,
  EstablishmentListGroupByAddress,
} from '../types';
// @ts-expect-error
import { TextField } from '../../../components/forms';
import EstablishmentSelector from './EstablishmentSelector.component';
// @ts-expect-error
import EstablishmentListItem from './EstablishmentListItem.component';

type InitialValues = {
  initial?: EstablishmentBillingGroup;
};
type OwnProps = InitialValues & {
  onSubmit: (
    data: Omit<EstablishmentBillingGroupAPI, 'id' | 'company_id'>,
  ) => void;
  isSubmitting: boolean;
  open: boolean;
  onClose: () => void;
  establishmentData: Establishment[];
};
type Props = OwnProps &
  WithTranslation &
  FormikProps<InitialValues> &
  WithStyles<typeof styles>;
const EstablishmentBillingGroupSchema = Yup.object().shape({
  id: Yup.number().nullable(true),
  name: Yup.string().required(
    'establishment:billing_group.form.error.groupShouldHaveName',
  ),
  establishments: Yup.array()
    .of(Yup.number())
    .test(
      'billing_group_should_contains_at_least_one_establishment',
      'establishment:billing_group.form.error.groupShouldContainsOneRoom',
      function checkEstablishmentLength() {
        return this.parent.establishments?.length > 0;
      },
    ),
  address: Yup.string().required(
    'establishment:billing_group.form.error.groupShouldHaveAddress',
  ),
});
export function EstablishmentBillingGroupForm(props: Props) {
  const { t, isSubmitting, classes } = props;
  const [loading, setLoading] = React.useState(false);
  const establishmentSelectedGroupedByaddress = (
    establishmentSelectedIds: Array<number>,
  ) => {
    const establishmentGroupByAddress = props.establishmentData
      .filter((item: Establishment) =>
        establishmentSelectedIds.includes(item.id),
      )
      .reduce(
        (
          accumulator: EstablishmentListGroupByAddress,
          establishmentItem: Establishment,
        ) => {
          const temp = accumulator.findIndex(
            (group) =>
              group.address.toUpperCase() ===
              establishmentItem.location.address.toUpperCase(),
          );
          if (temp === -1) {
            accumulator.push({
              address: establishmentItem.location.address,
              establishmentList: [establishmentItem],
            });
          } else {
            accumulator[temp].establishmentList.push(establishmentItem);
          }
          return accumulator;
        },
        [],
      );
    return establishmentGroupByAddress;
  };

  /**
   * Memoized object meant to easily access establishment data.
   */
  const establishmentDataById: { [id: number]: Establishment } = useMemo(
    () =>
      props.establishmentData.reduce((acc, curr) => {
        return {
          ...acc,
          [curr.id]: curr,
        };
      }, {}),
    [props.establishmentData],
  );

  /**
   * Checks if the adresses of all the establishments are equal, in order to display or not the corresponding warning.
   * If the list is null, undefined, or empty, the function returns true.
   *
   * @param establishment - List of establishments id to check
   */
  const allAdressesAreEquals = (establishments: number[]) => {
    if (!establishments?.length) {
      return true;
    }

    return (
      uniqBy(
        establishments,
        (establishmentId) =>
          establishmentDataById?.[establishmentId]?.location?.address,
      ).length === 1
    );
  };

  return (
    <Formik
      initialValues={
        props.initial
          ? {
              ...props.initial,
              establishments: [
                ...props.initial.establishments.map((est) => est.id),
              ],
              address: props.initial.address || '',
            }
          : {
              name: '',
              establishments: [],
              address: '',
            }
      }
      onSubmit={(values) => {
        return props.onSubmit({ ...values });
      }}
      validationSchema={EstablishmentBillingGroupSchema}
    >
      {(formik) => (
        <form>
          <>
            <Dialog
              fullWidth
              aria-labelledby="establishment-billing-group-form"
              maxWidth="xs"
              onClose={props.onClose}
              open={props.open}
            >
              <DialogTitle id="establishment-billing-group-form">
                {t('billing_group.form.dialog.title')}
              </DialogTitle>
              <DialogContent>
                <TextField
                  fullWidth
                  required
                  id="textfield_establishment_billing_group_name"
                  label={t('billing_group.form.name')}
                  name="name"
                />
                <ErrorMessage name="name">
                  {(error_msg) => (
                    <Typography color="error" variant="caption">
                      {t(`${error_msg}`)}
                    </Typography>
                  )}
                </ErrorMessage>
                <div className={classes.localizationLabel}>
                  <Typography color="initial" variant="subtitle1">
                    {t('billing_group.form.associated_localizations')}
                  </Typography>
                </div>
                <div className={classes.establishmentSelector}>
                  <EstablishmentSelector
                    closeMenuOnSelect
                    isClearable
                    isOptionDisabled
                    noMulti
                    nullCurrentValue
                    disabled={isSubmitting}
                    establishments={props.establishmentData?.filter(
                      (est: Establishment) =>
                        !est.establishment_billing_group_id ||
                        est.establishment_billing_group_id ===
                          props.initial?.id,
                    )}
                    isLoading={loading}
                    selectedEstablishments={formik.values.establishments}
                    selectOption={async (item: {
                      value: number;
                      label: string;
                    }) => {
                      if (
                        !formik.values.establishments.length &&
                        !formik.values.address
                      ) {
                        // Set address to first establishment if it is still empty
                        formik.setFieldValue(
                          'address',
                          establishmentDataById?.[item.value]?.location.address,
                        );
                      }
                      formik.setFieldValue(
                        'establishments',
                        uniq([...formik.values.establishments, item.value]),
                      );
                      setLoading(true);
                      await new Promise((resolve) => {
                        setTimeout(resolve, 500);
                      });
                      setLoading(false);
                    }}
                  />
                </div>
                <FieldArray name="establishments">
                  {({
                    remove,
                    form: {
                      values: { establishments },
                    },
                  }) => (
                    <>
                      {establishmentSelectedGroupedByaddress(
                        establishments,
                      ).map(
                        (group: EstablishmentGroupByAddress, index: number) => (
                          <List
                            key={index}
                            component="nav"
                            subheader={
                              <ListSubheader
                                className={classes.listSubHeader}
                                component="div"
                              >
                                <LocationOnIcon color="primary" />
                                <Typography color="initial" variant="caption">
                                  {group.address}
                                </Typography>
                              </ListSubheader>
                            }
                          >
                            {group.establishmentList.map((est) => (
                              <EstablishmentListItem
                                key={`${index}${est.id}`}
                                button
                                noDivider
                                establishment={est}
                                onClickDelete={() => {
                                  if (
                                    formik.values.establishments.length === 1 &&
                                    formik.values.address
                                  ) {
                                    // Erase address field when removing the last establishment
                                    formik.setFieldValue('address', '');
                                  }
                                  const establishmentIndex =
                                    formik.values.establishments.findIndex(
                                      (esta: number) => esta === est.id,
                                    );
                                  remove(establishmentIndex);
                                }}
                              />
                            ))}
                          </List>
                        ),
                      )}
                      {!allAdressesAreEquals(establishments) && (
                        <Alert
                          className={classes.warningAlert}
                          severity="warning"
                        >
                          <Typography variant="body1">
                            {t(
                              'establishment:billing_group.form.warning.groupHasSeveralLocations',
                            )}
                          </Typography>
                        </Alert>
                      )}
                    </>
                  )}
                </FieldArray>
                <ErrorMessage name="establishments">
                  {(error_msg) => (
                    <Typography color="error" variant="caption">
                      {t(`${error_msg}`)}
                    </Typography>
                  )}
                </ErrorMessage>
                <TextField
                  fullWidth
                  required
                  helperText={t('billing_group.form.address.helperText')}
                  id="textfield_establishment_billing_group_address"
                  label={t('billing_group.form.address.label')}
                  name="address"
                />
                <ErrorMessage name="address">
                  {(error_msg) => (
                    <Typography color="error" variant="caption">
                      {t(`${error_msg}`)}
                    </Typography>
                  )}
                </ErrorMessage>
              </DialogContent>
              <DialogActions>
                <Button onClick={props.onClose} variant="text">
                  {t('group.form.dialog.cancel')}
                </Button>
                <Button
                  color="primary"
                  disabled={isSubmitting}
                  id="submit_estabishment_billing_group"
                  onClick={() => formik.handleSubmit()}
                  variant="contained"
                >
                  {t('group.form.dialog.save')}
                </Button>
              </DialogActions>
            </Dialog>
          </>
        </form>
      )}
    </Formik>
  );
}

const styles = (theme: Theme) =>
  createStyles({
    button: { width: '100%', padding: '0' },
    searchPaperDisplayed: {
      maxHeight: '500px',
      overflow: 'auto',
    },
    listSubHeader: {
      display: 'flex',
      alignItems: 'center',
      flexDirection: 'row',
      borderBottom: `1px solid${theme.palette.primary.main}`,
      paddingBottom: theme.spacing(0.5),
      paddingLeft: 0,
    },
    localizationLabel: {
      paddingTop: theme.spacing(1),
      paddingBottom: theme.spacing(1),
    },
    establishmentSelector: {
      paddingBottom: theme.spacing(1),
    },
    warningAlert: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
    },
  });

export default compose<any, OwnProps>(
  withTranslation('establishment'),
  withStyles(styles),
)(EstablishmentBillingGroupForm);
