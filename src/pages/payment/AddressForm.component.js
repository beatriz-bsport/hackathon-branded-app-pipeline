// @flow
import React from 'react';
import TextField from '@material-ui/core/TextField';
import { compose } from 'recompose';
import { withTranslation } from 'react-i18next';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import type { TFunction } from 'react-i18next';
import Button from '@material-ui/core/Button';

type Props = {
  address: ?string,
  onSubmit: (address: string) => void,
  t: TFunction,
  classes: Object,
};

type State = {
  address: string,
};

export class AddressForm extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    if (props.address) {
      this.state = { address: props.address };
    } else {
      this.state = { address: null };
    }
  }

  onSubmit = (ev: SyntheticEvent<HTMLElement>) => {
    ev.preventDefault();
    this.props.onSubmit(this.state.address);
  };

  render() {
    return (
      <form onSubmit={this.onSubmit} className={this.props.classes.container}>
        <Typography className={this.props.classes.content}>
          {this.props.t('payment.address.explain')}
        </Typography>
        <TextField
          multiline
          required
          fullWidth
          rows={5}
          variant="outlined"
          value={this.state.address}
          onChange={(ev) => this.setState({ address: ev.target.value })}
        />
        <Button
          type="submit"
          color="primary"
          className={this.props.classes.button}
        >
          {this.props.t('payment.address.save')}
        </Button>
      </form>
    );
  }
}

const styles = (theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  button: {
    marginTop: theme.spacing(1),
  },
  content: {
    marginBottom: theme.spacing(1),
  },
});

export default compose(
  withStyles(styles),
  withTranslation(['privateService']),
)(AddressForm);
