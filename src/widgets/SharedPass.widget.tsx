import React, { Component } from 'react';

import { connect, ConnectedProps } from 'react-redux';
import { compose } from 'recompose';
import {
  WithStyles,
  createStyles,
  withStyles,
  Theme,
} from '@material-ui/core/styles';
import { withTranslation, WithTranslation } from 'react-i18next';
import themify from 'bsport-saas/src/hocs/company-themifier.hoc';
import { PaymentPackTemplateList } from 'bsport-saas/src/pages/marketplace/PaymentPackTemplateList.page';
import { RootState } from '../reducers';

const PaymentPackTemplateList = themify(PaymentPackTemplateList);

type OwnProps = {
  title: string,
};
type State = {};

type Props = OwnProps &
  ConnectedProps<typeof connector> &
  WithStyles<typeof styles> &
  WithTranslation;

export class SharedPass extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
  }

  render() {
    const { classes, t } = this.props;
    console.log(this.props);
    return (
      <div className={classes.container}>
        <PaymentPackTemplateList />
      </div>
    );
  }
}
const styles = (theme: Theme) =>
  createStyles({
    container: {},
  });

const connector = connect((state: RootState) => ({}), {});

export default compose(
  withStyles(styles),
  withTranslation('foo'),
  connector,
)(SharedPass);
