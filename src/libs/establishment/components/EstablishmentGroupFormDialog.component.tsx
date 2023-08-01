// @ts-nocheck
import React from 'react';
import uniq from 'lodash/uniq';
import { compose } from 'recompose';
import { withTranslation, WithTranslation } from 'react-i18next';
import { FieldArray, Formik, FormikProps, ErrorMessage } from 'formik';
import { Theme } from '@material-ui/core/styles';
import withStyles from '@material-ui/core/styles/withStyles';
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
import type {
  EstablishmentGroup,
  EstablishmentGroupAPI,
  Establishment,
  EstablishmentGroupByAddress,
  EstablishmentListGroupByAddress,
  AssociatedEstablishment,
} from '../types';
import { MaterialStyleType } from '../../../utils/types';
import { TextField } from '../../../components/forms';
import EstablishmentSelector from './EstablishmentSelector.component';
import EstablishmentListItem from './EstablishmentListItem.component';

type InitialValues = {
  initial?: EstablishmentGroup;
};
type OwnProps = InitialValues & {
  onSubmit: (data: EstablishmentGroupAPI) => void;
  isSubmitting: boolean;
  open: boolean;
  onClose: () => void;
  establishments: any;
};
type Props = OwnProps &
  WithTranslation &
  FormikProps<InitialValues> &
  MaterialStyleType<ReturnType<typeof styles>>;

const EstablishmentGroupSchema = Yup.object().shape({
  id: Yup.number().nullable(true),
  name: Yup.string().nullable(false),
  establishment: Yup.array()
    .of(Yup.number())
    .test(
      'group_should_contains_at_least_one_establishment',
      'establishment:billing_group.form.error.groupShouldContainsOneRoom',
      function checkEstablishmentLength() {
        return this.parent.establishment?.length >= 1;
      },
    ),
});
export function EstablishmentGroupForm(props: Props) {
  const { t, isSubmitting, classes } = props;
  const [loading, setLoading] = React.useState(false);
  const establishmentSelectedGroupedByaddress = (
    establishmentSelectedIds: Array<number>,
  ) => {
    const establishmentGourpByAddress = props.establishments
      .filter((item: Establishment) =>
        establishmentSelectedIds.includes(item.id),
      )
      .reduce(
        (
          accumulator: EstablishmentListGroupByAddress,
          establishmentItem: AssociatedEstablishment,
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
    return establishmentGourpByAddress;
  };
  return (
    <Formik
      initialValues={
        props.initial
          ? {
              ...props.initial,
              establishment: [
                ...props.initial.establishment.map((est) => est.id),
              ],
            }
          : {
              name: '',
              establishment: [],
            }
      }
      onSubmit={(values) => {
        return props.onSubmit({ ...values });
      }}
      validationSchema={EstablishmentGroupSchema}
    >
      {(formik) => (
        <form>
          <>
            <Dialog
              fullWidth
              aria-labelledby="establishment-group-form"
              maxWidth="xs"
              onClose={props.onClose}
              open={props.open}
            >
              <DialogTitle id="establishment-group-form">
                {t('group.form.dialog.title')}
              </DialogTitle>
              <DialogContent>
                <TextField
                  fullWidth
                  required
                  id="textfield_establishment_group_name"
                  label={t('group.form.name')}
                  name="name"
                />
                <div className={classes.localizationLabel}>
                  <Typography color="initial" variant="subtitle1">
                    {t('group.form.associated_localizations')}
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
                    establishments={props.establishments}
                    isLoading={loading}
                    selectedEstablishments={formik.values.establishment}
                    selectOption={async (item: {
                      value: number;
                      label: string;
                    }) => {
                      formik.setFieldValue(
                        'establishment',
                        uniq([...formik.values.establishment, item.value]),
                      );
                      setLoading(true);
                      await new Promise((resolve) => {
                        setTimeout(resolve, 500);
                      });
                      setLoading(false);
                    }}
                  />
                </div>
                <ErrorMessage name="name">
                  {(error_msg) => (
                    <Typography color="error" variant="caption">
                      {t(`${error_msg}`)}
                    </Typography>
                  )}
                </ErrorMessage>
                <FieldArray name="establishment">
                  {({
                    remove,
                    form: {
                      values: { establishment },
                    },
                  }) => (
                    <>
                      {establishmentSelectedGroupedByaddress(establishment).map(
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
                                  const establishmentIndex =
                                    establishment.findIndex(
                                      (esta: number) => esta === est.id,
                                    );
                                  remove(establishmentIndex);
                                }}
                              />
                            ))}
                          </List>
                        ),
                      )}
                    </>
                  )}
                </FieldArray>
                <ErrorMessage name="establishment">
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
                  id="submit_estabishment_group"
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
const styles = (theme: Theme) => ({
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
});
export default compose<any, OwnProps>(
  withTranslation('establishment'),
  withStyles(styles),
)(EstablishmentGroupForm);
