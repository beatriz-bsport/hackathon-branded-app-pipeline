import React from 'react';
import { compose } from 'recompose';
import moment from 'moment-timezone';
import { withTranslation, WithTranslation } from 'react-i18next';
import { withStyles } from '@material-ui/styles';
import { Theme, WithStyles } from '@material-ui/core';
import Select from 'react-select';

import CircularProgress from '@material-ui/core/CircularProgress';
import Pagination from '@material-ui/lab/Pagination';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Avatar from '@material-ui/core/Avatar';

import CommunicationInformationStatusChip from './CommunicationInformationStatusChip.component';
import CommunicationInformationOpenChip from './CommunicationInformationOpenChip.component';
import CommunicationWrapperDialog from './CommunicationWrapperDialog.component';

import { RecipientWithMember, SelectFieldItem } from '../types';

type OwnProps = {
  contextInformation?: string;
  contextTitle?: string;
  dateCreated: string;
  fetchPage: (page: number, filters: number[]) => void;
  filterOptions?: SelectFieldItem[];
  fullScreen?: boolean;
  handleCloseDialog: () => void;
  kind: number;
  loadingRecipientList: boolean;
  recipientsCount: number;
  open?: boolean;
  paginationSize: number;
  recipientList: RecipientWithMember[];
};

export type Props = OwnProps & WithTranslation & WithStyles;

type State = {
  page: number;
  filters: SelectFieldItem[];
};

export class CommunicationInformationModal extends React.Component<
  Props,
  State
> {
  constructor(props: Props) {
    super(props);
    this.state = {
      page: 1,
      filters: [],
    };
  }

  handleChangePage = (
    event: React.ChangeEvent<unknown> | null,
    page: number = 1,
  ) => {
    this.props.fetchPage(
      page,
      this.state.filters.map((field: SelectFieldItem) => field.value),
    );
    this.setState({ page });
  };

  handleSelectFilter = (values: SelectFieldItem[]) =>
    this.setState(() => ({ filters: values }), this.fetchPageWithFilters);

  fetchPageWithFilters = () => {
    this.props.fetchPage(
      1,
      this.state.filters.map((field: SelectFieldItem) => field.value),
    );
  };

  onClose = () => {
    this.setState({ page: 1, filters: [] }, this.props.handleCloseDialog);
  };

  render() {
    const {
      dateCreated,
      fullScreen,
      open,
      kind,
      loadingRecipientList,
      recipientsCount,
      recipientList,
      paginationSize,
      t,
      classes,
    } = this.props;
    const pageCount = Math.ceil(recipientsCount / paginationSize);
    const title = `${t(`campaign.kind.${kind}`)} -  ${moment(
      dateCreated,
    ).format('L - LT')}`;
    return (
      <CommunicationWrapperDialog
        open={open}
        fullScreen={fullScreen}
        title={title}
        buttonCancelText={t('common.close')}
        onCancel={this.onClose}
      >
        <>
          {!!this.props.contextTitle && (
            <div className={classes.contextContainer}>
              <Typography variant="body1" className={classes.boldTypo}>
                {this.props.contextTitle}
              </Typography>
              <Typography variant="body2">
                {this.props.contextInformation}
              </Typography>
            </div>
          )}
          {!!this.props.filterOptions && (
            <Select
              value={this.state.filters}
              options={this.props.filterOptions}
              onChange={this.handleSelectFilter}
              isMulti
              className={classes.filterSelector}
            />
          )}
          <Table
            className={classes.table}
            aria-label="simple table"
            size="small"
            padding="normal"
          >
            <TableHead>
              <TableRow>
                <TableCell>
                  <Typography variant="body1" className={classes.boldTypo}>
                    {recipientsCount}{' '}
                    {t('common.recipient', {
                      count: recipientsCount,
                    })}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography variant="body1" className={classes.boldTypo}>
                    {t('dialogInformation.headerStatus')}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography variant="body1" className={classes.boldTypo}>
                    {t('dialogInformation.headerOpen')}
                  </Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            {!loadingRecipientList && (
              <TableBody>
                {recipientList.map((recipient: RecipientWithMember) => (
                  <TableRow key={recipient.id}>
                    <TableCell
                      component="th"
                      scope="row"
                      className={classes.tableCell}
                    >
                      <div className={classes.tableCellRecipient}>
                        <Avatar
                          alt={recipient.member.name}
                          src={recipient.member.photo}
                          className={classes.avatar}
                        />
                        <Typography
                          variant="body1"
                          className={classes.recipientName}
                        >
                          {recipient.member.name}
                        </Typography>
                      </div>
                    </TableCell>
                    <TableCell align="center" className={classes.tableCell}>
                      <CommunicationInformationStatusChip
                        statusNumber={recipient.status}
                      />
                    </TableCell>
                    <TableCell align="center" className={classes.tableCell}>
                      <CommunicationInformationOpenChip
                        openStatus={recipient.read_count > 0}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            )}
          </Table>
          {loadingRecipientList && (
            <div className={classes.circularProgressContainer}>
              <CircularProgress />
            </div>
          )}
          {pageCount > 1 && (
            <Pagination
              page={this.state.page}
              count={pageCount}
              onChange={this.handleChangePage}
              className={classes.paginationContainer}
            />
          )}
        </>
      </CommunicationWrapperDialog>
    );
  }
}

const styles: any = (theme: Theme) => ({
  avatar: {
    width: theme.spacing(4),
    height: theme.spacing(4),
  },
  boldTypo: {
    fontWeight: 'bold',
  },
  circularProgressContainer: {
    display: 'flex',
    justifyContent: 'center',
    margin: theme.spacing(2),
  },
  contextContainer: {
    alignSelf: 'flex-start',
    marginBottom: theme.spacing(2),
  },
  filterSelector: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  paginationContainer: {
    marginTop: theme.spacing(2),
    '& li': {
      listStyle: 'none',
    },
  },
  recipientName: {
    marginLeft: theme.spacing(2),
  },
  tableCell: {
    borderBottom: 'none',
  },
  tableCellRecipient: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontWeight: 'bold',
    fontSize: theme.spacing(2.5),
  },
});

export default compose<any, OwnProps>(
  withTranslation(['communication']),
  withStyles(styles),
)(CommunicationInformationModal);
