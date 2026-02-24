import React from 'react';

import { compose } from 'recompose';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { withTranslation, WithTranslation } from 'react-i18next';

import {
  createStyles,
  Theme,
  LinearProgress,
  Divider,
} from '@material-ui/core';
import { Link as LinkIcon, Mail, People } from '@material-ui/icons';
import { Formik } from 'formik';
import { Member } from '#src/libs/member/types';
import { CheckboxField } from '#src/libs/custom-form/components/GenericFormik.input';
import MemberSearchModal from '../../member/components/MemberSearchModal.component';
// @ts-expect-error
import { TextFieldEnhancedLabelWithError } from '../../../components/forms';
import { OptionCallback } from '../../../state/types';

type InitialValues = {
  id: number;
  src_name: string;
  dst_name: string;
  src_member: Member;
  dst_member: Member;
  share_email: boolean;
  is_src_autorized_to_control_dst: boolean;
  is_dst_autorized_to_control_src: boolean;
};

type OwnProps = {
  initial: InitialValues;

  src_member: Member;
  dst_member?: Member;
  onSubmit: (data: any, options: OptionCallback) => void;
  searchLoading: boolean;
  searchMembers: (search: string) => void;
  searchedMembers: Array<Member>;
  onCancel: () => void;

  waiver: string;
  generalTermsAndConditions: string;
};

type State = {
  dst_member?: Member;
};
type Props = OwnProps & WithStyles<typeof styles> & WithTranslation;

export class RelationForm extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      dst_member: props.initial.dst_member,
    };
  }

  render() {
    const { t, classes } = this.props;

    if (!this.state.dst_member) {
      return (
        <MemberSearchModal
          asManager
          open
          generalTermsAndConditions={this.props.generalTermsAndConditions}
          handlMemberSelected={(id: number, member: Member) =>
            this.setState({ dst_member: member })
          }
          loading={this.props.searchLoading}
          onClose={this.props.onCancel}
          searchedMembers={this.props.searchedMembers}
          searchMembers={this.props.searchMembers}
          waiver={this.props.waiver}
        />
      );
    }

    return (
      <Formik
        enableReinitialize
        initialValues={{
          id: this.props.initial.id,
          src_name: this.props.initial.src_name,
          dst_name: this.props.initial.dst_name,
          src_member: this.props.initial.src_member,
          dst_member: this.props.initial.dst_member || this.state.dst_member,
          share_email: this.props.initial.share_email || false,
          is_src_autorized_to_control_dst:
            this.props.initial.is_src_autorized_to_control_dst || false,
          is_dst_autorized_to_control_src:
            this.props.initial.is_dst_autorized_to_control_src || false,
        }}
        onSubmit={(values, actions) => {
          this.props.onSubmit(
            {
              ...values,
              src_member: values.src_member.id,
              dst_member: values.dst_member.id,
            },
            {
              onSuccess: () => actions.setSubmitting(false),
              onError: () => {
                actions.setSubmitting(false);
              },
            },
          );
        }}
      >
        {(formikProps) => (
          <form onSubmit={formikProps.handleSubmit}>
            <div className={classes.container}>
              <div className={classes.section}>
                <Typography variant="h4">{t('member.form.title')}</Typography>
                <div className={classes.iconAndText}>
                  <LinkIcon className={classes.icon} />
                  <Typography variant="h6">
                    {t('member.form.parentalLink')}
                  </Typography>
                </div>
                <div className={classes.row}>
                  <div className={classes.name}>
                    <div className={classes.subName}>
                      <Typography variant="subtitle2">
                        {formikProps.values.src_member.name}
                      </Typography>
                    </div>
                    <div className={classes.subName}>
                      <Typography variant="subtitle2">
                        {this.state.dst_member.name}
                      </Typography>
                    </div>
                  </div>
                  <div className={classes.name}>
                    <div className={classes.subName}>
                      <Typography variant="subtitle2">
                        {t('member.form.is')}
                      </Typography>
                    </div>
                    <div className={classes.subName}>
                      <Typography variant="subtitle2">
                        {t('member.form.is')}
                      </Typography>
                    </div>
                  </div>
                  <div className={classes.name}>
                    <div className={classes.subName}>
                      <TextFieldEnhancedLabelWithError
                        required
                        name="src_name"
                        placeholder={t('member.form.src_name.placeholder')}
                      />
                    </div>
                    <div className={classes.subName}>
                      <TextFieldEnhancedLabelWithError
                        required
                        name="dst_name"
                        placeholder={t('member.form.dst_name.placeholder')}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <Divider />
              <div className={classes.section}>
                <div className={classes.iconAndText}>
                  <Mail className={classes.icon} />
                  <Typography variant="h6">{t('member.form.email')}</Typography>
                </div>
                <div className={classes.field}>
                  <div className={classes.checkbox}>
                    <CheckboxField name="share_email" />
                    <Typography className={classes.checkboxTypo}>
                      {t('member.form.shareEmail')}
                    </Typography>
                  </div>
                </div>
              </div>
              <Divider />
              <div className={classes.section}>
                <div className={classes.iconAndText}>
                  <People className={classes.icon} />
                  <Typography variant="h6">
                    {t('member.form.access')}
                  </Typography>
                </div>
                <Typography variant="body2">
                  {t('member.form.accountInfo')}
                </Typography>

                <div className={classes.checkbox}>
                  <CheckboxField name="is_src_autorized_to_control_dst" />
                  <Typography className={classes.checkboxTypo}>
                    {t('member.form.autorization', {
                      name_1: formikProps.values.src_member.name,
                      name_2: formikProps.values.dst_member.name,
                    })}
                  </Typography>
                </div>

                <div className={classes.checkbox}>
                  <CheckboxField name="is_dst_autorized_to_control_src" />
                  <Typography className={classes.checkboxTypo}>
                    {t('member.form.autorization', {
                      name_1: formikProps.values.dst_member.name,
                      name_2: formikProps.values.src_member.name,
                    })}
                  </Typography>
                </div>
              </div>
              <Divider />
              <div className={classes.section}>
                <div className={classes.buttonContainer}>
                  <Button onClick={this.props.onCancel}>
                    {t('member.form.cancel')}
                  </Button>
                  <Button color="primary" type="submit" variant="contained">
                    {t('member.form.submit')}
                  </Button>
                </div>
              </div>
            </div>
            {formikProps.isSubmitting ? <LinearProgress /> : null}
          </form>
        )}
      </Formik>
    );
  }
}

const styles = (theme: Theme) =>
  createStyles({
    row: { display: 'flex', gap: theme.spacing(2) },

    name: {
      display: 'flex',
      flexDirection: 'column',
    },
    subName: {
      height: theme.spacing(8),
      display: 'flex',
      alignItems: 'center',
    },
    icon: { color: '#868686' },
    checkbox: {
      display: 'flex',

      alignItems: 'center',
    },
    checkboxTypo: {
      marginLeft: '-12px',
    },
    iconAndText: {
      alignItems: 'center',
      display: 'flex',
      gap: theme.spacing(1),
    },
    container: {
      display: 'flex',
      flexDirection: 'column',
    },
    section: {
      display: 'flex',
      flexDirection: 'column',
      gap: theme.spacing(2),
      padding: theme.spacing(3),
    },

    field: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
    },

    buttonContainer: {
      gap: theme.spacing(1),
      width: '100%',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'flex-end',
      alignItems: 'center',
    },
  });

export default compose(
  withTranslation(['relationship']),
  withStyles(styles),
)(RelationForm);
