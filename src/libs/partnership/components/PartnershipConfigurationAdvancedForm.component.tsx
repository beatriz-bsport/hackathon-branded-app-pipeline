import React from 'react';

import { makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import AddIcon from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button';
import { compose } from 'recompose';
import WarningIcon from '@material-ui/icons/Warning';
import { withFormik } from 'formik';
import flatten from 'lodash/flatten';
import * as Yup from 'yup';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useTranslation } from 'react-i18next';

import EstablishmentSelector from '../../establishment/components/EstablishmentSelector.component';
import EstablishmentListItem from '../../establishment/components/EstablishmentListItem.component';

import { Establishment } from '../../establishment/types';
import { PartnershipCompany } from '../types';

type Props = {
  establishmentList: Array<Establishment>;
};

const emptyConf = {
  reference_establishment: null,
  associated_establishment_list: [],
};
export const PartnershipConfigurationMultipleEstablishmentForm: React.FC<
  Props
> = (props) => {
  const { establishmentList } = props;
  const { t } = useTranslation(['partnership']);
  const classes = useStyles();

  const [configuration, setConfiguration] = React.useState<any>(
    props.partnershipEstablishmentMergeList.map((pem) => ({
      reference_establishment: pem.reference_establishment,
      associated_establishment_list: props.associatedEstablishmentList
        .filter((ae) => ae.partnership_merged_as === pem.id)
        .map((ae) => ae.id),
    })) || [emptyConf],
  );

  const selectedEstablishments = props.establishmentList
    .filter((e) =>
      [
        ...configuration.map((pem) => pem.reference_establishment),
        ...flatten(
          configuration.map((pem) => pem.associated_establishment_list),
        ),
      ].includes(e.associatedestablishment_set[0]),
    )
    .map((e) => e.id);

  return (
    <div>
      {configuration.map((conf, idx_ref) => (
        <div key={conf.reference_establishment}>
          <div className={classes.selector}>
            <EstablishmentSelector
              closeMenuOnSelect
              placeholder={t('parameters.establishmentMergeMaster')}
              establishments={establishmentList.filter(
                (e) => !selectedEstablishments.includes(e.id),
              )}
              noMulti
              selectedEstablishments={[]}
              selectOption={(e: { value: number; label: string }) => {
                const newConf = [...configuration];
                newConf[idx_ref].reference_establishment =
                  props.establishmentList.find(
                    (est) => est.id === e.value,
                  ).associatedestablishment_set[0];
                setConfiguration(newConf);
              }}
            />
          </div>
          {
            // eslint-disable-next-line
            !conf.reference_establishment ? (
              <div className={classes.rowAlert}>
                <WarningIcon
                  fontSize="large"
                  className={classes.iconLeft}
                  color="error"
                />
                <Typography>
                  {t('parameters.pleaseChoseEstablishment')}
                </Typography>
              </div>
            ) : props.establishmentList.find((e) =>
                e.associatedestablishment_set.includes(
                  conf.reference_establishment,
                ),
              ) ? (
              <EstablishmentListItem
                establishment={props.establishmentList.find((e) =>
                  e.associatedestablishment_set.includes(
                    conf.reference_establishment,
                  ),
                )}
                onClickDelete={() => {
                  const newConf = [...configuration].filter(
                    (conf_) =>
                      conf_.reference_establishment !==
                      conf.reference_establishment,
                  );
                  setConfiguration(newConf?.length ? newConf : [emptyConf]);
                }}
              />
            ) : (
              <CircularProgress />
            )
          }
          <div className={classes.establishmentSelector}>
            <div className={classes.selector}>
              <EstablishmentSelector
                closeMenuOnSelect
                placeholder={t('parameters.establishmentMergedAs')}
                establishments={establishmentList.filter(
                  (e) => !selectedEstablishments.includes(e.id),
                )}
                selectedEstablishments={[]}
                selectOption={(e: Array<{ value: number; label: string }>) => {
                  const newConf = [...configuration];
                  newConf[idx_ref] = {
                    reference_establishment:
                      newConf[idx_ref].reference_establishment,
                    associated_establishment_list: [
                      ...configuration[idx_ref].associated_establishment_list,
                      ...props.establishmentList
                        .filter((est) =>
                          e.map((ee) => ee.value).includes(est.id),
                        )
                        .map((est) => est.associatedestablishment_set[0]),
                    ],
                  };
                  setConfiguration(newConf);
                }}
              />
            </div>
            {conf.associated_establishment_list.length === 0 ? (
              <div className={classes.rowAlert}>
                <WarningIcon
                  fontSize="large"
                  className={classes.iconLeft}
                  color="error"
                />
                <Typography>
                  {t('parameters.pleaseChoseEstablishmentMany')}
                </Typography>
              </div>
            ) : null}
            {conf.associated_establishment_list?.map(
              (id: number, i: number) => {
                const establishment = props.establishmentList.find(
                  (e) => e.associatedestablishment_set[0] === id,
                );
                if (establishment && establishment.cover) {
                  return (
                    <EstablishmentListItem
                      key={`${id}-${i}`}
                      dense
                      establishment={establishment}
                      onClickDelete={() => {
                        const newConf = [...configuration];
                        newConf[idx_ref].associated_establishment_list =
                          configuration[
                            idx_ref
                          ].associated_establishment_list.filter(
                            (aid: number) =>
                              aid !==
                              establishment.associatedestablishment_set[0],
                          );
                        setConfiguration(newConf);
                      }}
                    />
                  );
                }
                return null;
              },
            )}
          </div>
        </div>
      ))}
      <Button
        onClick={() => setConfiguration([...(configuration || []), emptyConf])}
      >
        <AddIcon className={classes.iconLeft} />
        {t('parameters.add')}
      </Button>
      <Button
        disabled={!configuration?.length}
        variant="contained"
        color="primary"
        onClick={() =>
          props.onSubmit({
            ...(props.initial || {}),
            configuration,
          })
        }
      >
        {t('actions.save')}
      </Button>
    </div>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  establishmentSelector: {
    paddingBottom: theme.spacing(1),
    marginBottom: theme.spacing(2),
    paddingTop: theme.spacing(2),
    marginLeft: theme.spacing(5),
    paddingLeft: theme.spacing(4),
    borderLeft: '2px solid black',
  },
  allEstablishmentText: {
    padding: theme.spacing(2),
  },
  selector: {
    marginBottom: theme.spacing(2),
  },
  row: { display: 'flex', flexDirection: 'row', alignItems: 'center' },
  rowAlert: { display: 'flex', flexDirection: 'row', alignItems: 'center' },
  iconLeft: { marginRight: theme.spacing(1) },
}));

export const PartnershipSchema = Yup.object().shape({
  id: Yup.number().required(),
  associated_establishment_ids: Yup.array().of(Yup.number()),
});

export const PartnershipFormHoc = withFormik({
  // eslint-disable-next-line
  mapPropsToValues: ({ initial, establishmentList }: { initial: PartnershipCompany, establishmentList: Array<Establishment>}) => {
    return initial
      ? {
          ...initial,
          override_establishment_pk: null,
          associated_establishment_ids: [
            ...initial.associated_establishment_ids
              .map((id: number) =>
                establishmentList.find((e) =>
                  e.associatedestablishment_set.includes(id),
                ),
              )
              .filter((e: Establishment) => !!e)
              .map((e: Establishment) => e.id),
          ],
        }
      : initial;
  },
  validationSchema: PartnershipSchema,
  handleSubmit: (values, { props: { onSubmit }, setSubmitting }) => {
    onSubmit(values, {
      onSuccess: () => setSubmitting(false),
      onError: () => setSubmitting(false),
    });
  },
});

export default compose(PartnershipFormHoc)(
  PartnershipConfigurationMultipleEstablishmentForm,
);
