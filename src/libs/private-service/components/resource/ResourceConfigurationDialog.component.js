// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose, withState } from 'recompose';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import CircularProgress from '@material-ui/core/CircularProgress';
import FormLabel from '@material-ui/core/FormLabel';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import ColorInput from '../../../../components/input/ColorInput.component';

type Props = {
  t: TFunction,
  classes: Object,
  setProcessing: (boolean) => void,
  processing: boolean,
  onClose: () => void,

  resourceData: ResourceData,
  open: boolean,

  onSubmit: (
    resourceIdentifier: string,
    data: {
      color: string,
    },
    options: OptionCallback,
  ) => void,
};

type State = {
  color: string,
};

export class ResourceConfigurationDialog extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      color: props.resourceData.data.color || '',
    };
  }

  render() {
    const { resourceData, setProcessing, processing } = this.props;
    return (
      <Dialog open={this.props.open}>
        <DialogTitle>{this.props.resourceData.data.name}</DialogTitle>
        <DialogContent>
          <div className={this.props.classes.row}>
            <ColorInput
              onChange={(color) => this.setState({ color })}
              color={this.state.color}
            />
            <FormLabel>{this.props.t('resource.form.color')}</FormLabel>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.props.onClose}>
            {this.props.t('resource.form.actions.cancel')}
          </Button>
          {processing ? (
            <CircularProgress />
          ) : (
            <Button
              color="primary"
              onClick={() => {
                setProcessing(true);
                this.props.onSubmit(
                  resourceData.data.resource_identifier,
                  {
                    color: this.state.color,
                  },
                  {
                    onSuccess: () => {
                      setProcessing(false);
                      this.props.onClose();
                    },
                    onError: () => setProcessing(false),
                  },
                );
              }}
            >
              {this.props.t('resource.form.actions.submit')}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    );
  }
}

const styles = (theme) => ({
  content: {
    paddingBottom: theme.spacing(2),
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    '& > *': {
      paddingRight: theme.spacing(2),
    },
  },
});

export default compose(
  withNamespaces(['privateService']),
  withStyles(styles),
  withState('processing', 'setProcessing', false),
)(ResourceConfigurationDialog);
