import React, { Component } from 'react';

import { withTranslation, WithTranslation } from 'react-i18next';

import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';

import RedButton from './button/RedButton.component';

type Props = {
  idToDelete?: number;
  deleteObject: () => void;
  checkCanDeleteObjectAPI?: (
    id: number,
  ) => Promise<{ data: { can_destroy: boolean } }>;
  onClose: () => void;
  trad: string;
};

type State = {
  loading: boolean;
  canDeleteObject: boolean;
};

export class DeleteDialogWithCheck extends Component<
  Props & WithTranslation,
  State
> {
  constructor(props: Props & WithTranslation) {
    super(props);
    this.state = {
      loading: false,
      canDeleteObject: !this.props.checkCanDeleteObjectAPI,
    };
  }

  componentDidUpdate(prevProps: Props) {
    if (
      prevProps.idToDelete !== this.props.idToDelete &&
      !!this.props.idToDelete
    ) {
      this.checkCanDeleteObject();
    }
  }

  checkCanDeleteObject = () => {
    if (this.props.checkCanDeleteObjectAPI) {
      this.setState({
        loading: true,
      });

      this.props
        .checkCanDeleteObjectAPI(this.props.idToDelete)
        .then((res) => {
          this.setState({
            loading: false,
            canDeleteObject: res.data.can_destroy,
          });
        })
        .catch((err) => {
          console.error(err);
          this.setState({ loading: false, canDeleteObject: false });
        });
    } else {
      this.setState({ canDeleteObject: true });
    }
  };

  deleteObject = () => {
    this.props.deleteObject();
    this.props.onClose();
  };

  render() {
    if (this.state.loading) {
      return (
        <Dialog open={!!this.props.idToDelete}>
          <DialogTitle>
            {this.props.t(`${this.props.trad}:forms.delete.title`)}
          </DialogTitle>
          <DialogContent>
            <CircularProgress />
          </DialogContent>
        </Dialog>
      );
    }

    return (
      <Dialog open={!!this.props.idToDelete}>
        <DialogTitle>
          {this.props.t(`${this.props.trad}:forms.delete.title`)}
        </DialogTitle>
        <DialogContent>
          {this.state.canDeleteObject
            ? this.props.t(`${this.props.trad}:forms.delete.content.canDelete`)
            : this.props.t(
                `${this.props.trad}:forms.delete.content.cannotDelete`,
              )}
        </DialogContent>
        <DialogActions>
          <Button onClick={this.props.onClose}>
            {this.props.t(`${this.props.trad}:forms.delete.actions.cancel`)}
          </Button>
          <RedButton
            disabled={!this.state.canDeleteObject}
            onClick={this.deleteObject}
          >
            {this.props.t(`${this.props.trad}:forms.delete.actions.confirm`)}
          </RedButton>
        </DialogActions>
      </Dialog>
    );
  }
}

export default withTranslation([
  'coach',
  'establishment',
  'metaActivity',
  'workshop',
  'privateService',
])(DeleteDialogWithCheck);
