// @flow
import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';

import type { TFunction } from 'react-i18next';
import RedButton from './button/RedButton.component';

type Props = {
  idToDelete: ?number,
  deleteObject: () => void,
  checkCanDeleteObjectAPI: (
    id: number,
  ) => Promise<{ data: { can_destroy: boolean } }>,
  onClose: () => void,
  t: TFunction,
};

type State = {
  loading: boolean,
  canDeleteObject: boolean,
};

export class DeleteDialoWithCheck extends React.Component<Props, State> {
  state = {
    loading: false,
    canDeleteObject: false,
  };

  componentDidUpdate(prevProps: Props) {
    if (
      prevProps.idToDelete !== this.props.idToDelete &&
      !!this.props.idToDelete
    ) {
      this.checkCanDeleteObject();
    }
  }

  checkCanDeleteObject = () => {
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
  };

  deleteObject = () => {
    this.props.deleteObject();
    this.props.onClose();
  };

  render() {
    if (this.state.loading) {
      return (
        <Dialog open={!!this.props.idToDelete}>
          <DialogTitle>{this.props.t('forms.delete.title')}</DialogTitle>
          <DialogContent>
            <CircularProgress />
          </DialogContent>
        </Dialog>
      );
    }

    return (
      <Dialog open={!!this.props.idToDelete}>
        <DialogTitle>{this.props.t('forms.delete.title')}</DialogTitle>
        <DialogContent>
          {this.state.canDeleteObject
            ? this.props.t('forms.delete.content.canDelete')
            : this.props.t('forms.delete.content.cannotDelete')}
        </DialogContent>
        <DialogActions>
          <Button onClick={this.props.onClose}>
            {this.props.t('forms.delete.actions.cancel')}
          </Button>
          <RedButton
            disabled={!this.state.canDeleteObject}
            onClick={this.deleteObject}
          >
            {this.props.t('forms.delete.actions.confirm')}
          </RedButton>
        </DialogActions>
      </Dialog>
    );
  }
}

export default DeleteDialoWithCheck;
