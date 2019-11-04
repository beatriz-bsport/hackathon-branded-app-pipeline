// @flow

import React, { Component } from 'react';

import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { compose } from 'recompose';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import EditIcon from '@material-ui/icons/Edit';
import Divider from '@material-ui/core/Divider';
import withStyles from '@material-ui/core/styles/withStyles';
import { PieChart, Pie, Cell } from 'recharts';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import { getAllSmartList } from '../../../libs/smart-list/selectors';
import BottomActionButtons from '../../../components/button/BottomActionsButton.component';
import routerParamsToProps from '../../../hocs/router-params-to-props.hoc';
import withTitle from '../../../hocs/with-title.hoc';

import {
  smartListDelete,
  fetchAllSmartLists,
  smartListCreate,
  smartListUpdate,
} from '../../../libs/smart-list/actions';

import type SmartList from '../../../libs/smart-list/types';
import SmartListCard from '../../../libs/smart-list/components/SmartListListItem.component';
import { fetchDetails } from '../../../libs/smart-list/api';
import SmartListEditDialog from '../../../libs/smart-list/components/SmartListFormDialog.component';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  label,
}: {
  cx: number,
  cy: number,
  midAngle: number,
  innerRadius: number,
  outerRadius: number,
  percent: number,
  label: string,
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN) * 2.8;
  const y = cy + radius * Math.sin(-midAngle * RADIAN) * 2.8;
  return (
    <text
      x={x}
      y={y}
      fill="black"
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
    >
      {`${(percent * 100).toFixed(0)}% ${label}`}
    </text>
  );
};

type Props = {
  smartlists: Array<SmartList>,
  t: TFunction,
  fetchAllSmartLists: () => void,
  smartListCreate: (data: SmartList) => void,
  company_id: number,
  classes: Object,
  goToEdit: (id: number) => void,
  smartListDelete: (id: number) => void,
  selectedId: number,
  goToSelected: (id: number) => void,
  smartListUpdate: (id: number) => void,
};

export class SmartListList extends Component<Props, state> {
  constructor(props) {
    super(props);
    this.state = {
      selected_list: false,
      openCreateDialog: false,
      selected_list_data: false,
      openEditDialog: false,
    };
  }

  componentDidMount() {
    this.props.fetchAllSmartLists();
    this.setState({
      selected_list: this.props.smartlists.filter(
        (listId) => listId.id === this.props.selectedId,
      )[0],
    });
  }

  componentDidUpdate = async (prevProps) => {
    if (
      this.props.selectedId !== prevProps.selectedId ||
      this.props.smartlists !== prevProps.smartlists
    ) {
      const response = await fetchDetails(this.props.selectedId);
      this.setState({ selected_list_data: response.data });
      this.setState({
        selected_list: this.props.smartlists.filter(
          (listId) => listId.id === this.props.selectedId,
        )[0],
      });
    }
  };

  addNewSmartList = (data) => {
    const smartlist = data;
    smartlist.company = this.props.company_id;
    this.props.smartListCreate(data);
    this.setState({ openCreateDialog: false });
  };

  updateSmartList = (smartlist) => {
    this.setState({ openEditDialog: false });
    this.props.smartListUpdate(this.props.selectedId, smartlist);
  };

  selected = async (id) => {
    this.props.goToSelected(id);
  };

  render() {
    const { smartlists, t, classes } = this.props;
    return (
      <div>
        <Grid container direction="row" spacing={24}>
          <Grid item xs={12} md={6}>
            <Paper>
              <List component="nav" disablePadding className={classes.list}>
                {smartlists.map((smartlist) => (
                  <SmartListCard
                    key={smartlist.id}
                    onClick={(id) => {
                      this.selected(id);
                    }}
                    onClickEdit={this.props.goToEdit}
                    onClickDelete={this.props.smartListDelete}
                    selected={smartlist === this.state.selected_list}
                    smartlist={smartlist}
                  />
                ))}
              </List>
            </Paper>
          </Grid>
          {this.state.selected_list && this.state.selected_list_data ? (
            <Grid item xs={12} md={6}>
              <Typography
                variant="h5"
                component="h2"
                className={classes.panelTitle}
              >
                {t('smart_list.list.detailTitle')}
              </Typography>
              <Paper>
                <List className={classes.detailList}>
                  <ListItem>
                    <ListItemText
                      primary={`Nom: ${this.state.selected_list.name}`}
                    />
                    <ListItemSecondaryAction>
                      <EditIcon
                        color="primary"
                        onClick={() => this.setState({ openEditDialog: true })}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary={`A propos: ${this.state.selected_list.description}`}
                    />
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <ListItemText
                      primary={
                        this.state.selected_list_data.count > 1
                          ? `${this.state.selected_list_data.count} membres dans la liste`
                          : `${this.state.selected_list_data.count} membre dans la liste`
                      }
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary={`Part de la liste ayant effectué un achat le mois dernier : ${Math.trunc(
                        (this.state.selected_list_data
                          .last_month_bookings_count /
                          this.state.selected_list_data.count) *
                          100,
                      )} %`}
                    />
                  </ListItem>
                </List>
                <PieChart width={400} height={200}>
                  <Pie
                    data={[
                      {
                        name: 'Hommes',
                        value: this.state.selected_list_data.male,
                      },
                      {
                        name: 'Femmes',
                        value: this.state.selected_list_data.female,
                      },
                    ]}
                    cx={200}
                    cy={100}
                    outerRadius={50}
                    labelLine
                    label={renderCustomizedLabel}
                    fill="#8884d8"
                    dataKey="value"
                    animationDuration={700}
                  >
                    {[
                      {
                        name: 'Hommes',
                        value: this.state.selected_list_data.male,
                      },
                      {
                        name: 'Femmes',
                        value: this.state.selected_list_data.female,
                      },
                    ].map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        label={entry.name}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </Paper>
            </Grid>
          ) : null}
        </Grid>
        <SmartListEditDialog
          open={this.state.openEditDialog || this.state.openCreateDialog}
          smartlist={
            this.state.openEditDialog ? this.state.selected_list : null
          }
          updateSmartList={
            this.state.openEditDialog
              ? this.updateSmartList
              : this.addNewSmartList
          }
          onCancel={() =>
            this.setState({ openEditDialog: false, openCreateDialog: false })
          }
          fullScreen
        />
        <BottomActionButtons
          onCreateLabel={this.props.t('smart_list.add')}
          onCreate={() => this.setState({ openCreateDialog: true })}
        />
      </div>
    );
  }
}

const styles = (theme) => ({
  detailList: {
    display: 'flex',
    flexDirection: 'column',
    marginRight: theme.spacing.unit * 2,
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
  },
  panelTitle: {
    marginBottom: theme.spacing.unit,
  },
});

export default compose(
  withNamespaces(['smartList']),
  withStyles(styles),
  routerParamsToProps({ id: 'selectedId:number' }),
  withTitle(({ t }) => t('smart_list.list.title')),

  connect(
    (state) => ({
      smartlists: getAllSmartList(state),
      loading: state.smartList.isLoading,
      company_id: state.theme.theme.company,
    }),
    {
      fetchAllSmartLists,
      smartListUpdate,
      smartListDelete,
      smartListCreate,
      goToEdit: (id) => push(`/smart-list/${id}/detail`),
      goToSelected: (id) => push(`/smart-list/${id}`),
    },
  ),
)(SmartListList);
