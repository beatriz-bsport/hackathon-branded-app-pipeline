// @flow
import React from 'react';
import { withStyles } from '@material-ui/core';
import { compose } from 'recompose';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';

type Props = {
  t: TFunction,
  classes: Object,
  initial: PrivateService,
  onCancel: () => void,
  onSubmit: (data: *) => void,
};

type State = {
  name: ?string,
  description: ?string,
  coaches: Array<number>,
  establishments: Array<number>,
};

export class PrivateServiceForm extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    if (props.initial) {
      this.state = {
        name: props.initial.name,
        description: props.initial.description,
      };
    } else {
      this.state = {
        name: null,
        description: '',
      };
    }
  }

  onSubmit = (ev: SyntheticEvent<HTMLElement>) => {
    ev.preventDefault();
    const data = {
      name: this.state.name,
      description: this.state.description,
    };
    if (this.props.initial && this.props.initial.id) {
      this.props.onSubmit({ ...data, id: this.props.initial.id });
    } else {
      this.props.onSubmit(data);
    }
  };

  render() {
    const { classes, t } = this.props;
    return (
      <form className={classes.container} onSubmit={this.onSubmit}>
        <TextField
          className={classes.field}
          value={this.state.name}
          required
          onChange={(ev) => this.setState({ name: ev.target.value })}
          label={t('service.form.name.label')}
          placeholder={t('service.form.name.placeholder')}
        />
        <TextField
          className={classes.field}
          multiline
          variant="outlined"
          rows={12}
          value={this.state.description}
          onChange={(ev) => this.setState({ description: ev.target.value })}
          label={t('service.form.description.label')}
        />
        <div className={classes.buttonContainer}>
          <Button className={classes.button} onClick={this.props.onCancel}>
            {t('service.form.actions.cancel')}
          </Button>
          <Button className={classes.button} type="submit" color="primary">
            {t('service.form.actions.submit')}
          </Button>
        </div>
      </form>
    );
  }
}

const styles = (theme) => ({
  container: {
    padding: theme.spacing.unit,
    display: 'flex',
    flexDirection: 'column',
    minWidth: 340,
  },
  field: { marginBottom: theme.spacing.unit * 3 },
  sectionTitle: {
    paddingTop: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: theme.spacing.unit * 2,
  },
});

export default compose(
  withNamespaces(['privateService']),
  withStyles(styles),
)(PrivateServiceForm);
