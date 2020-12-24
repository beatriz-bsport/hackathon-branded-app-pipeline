// @flow
import React from 'react';
import type { TFunction } from 'react-i18next';
import { withTranslation } from 'react-i18next';
import { compose } from 'recompose';
import { Form } from 'formik';
import { v4 as uuidv4 } from 'uuid';

import withStyles from '@material-ui/core/styles/withStyles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import BarChartIcon from '@material-ui/icons/BarChart';
import PieChartIcon from '@material-ui/icons/PieChart';
import ShowChartIcon from '@material-ui/icons/ShowChart';
import TableChartIcon from '@material-ui/icons/TableChart';

import type { Graph } from '../../libs/dashboard/types';
import CustomChartSelector from './CustomChartSelector.component';
import CustomChartRadio from './CustomChartRadio.component';

const ICONS_CHART = {
  pie: PieChartIcon,
  bar: BarChartIcon,
  grid: TableChartIcon,
  area: ShowChartIcon,
};

type Props = {
  t: TFunction,
  classes: Object,

  addGraph: (graph: Graph) => void,
  graphRessources: { [string]: any },
  formOpen: boolean,
  setFormOpen: (formOpen: boolean) => void,
};

type State = {
  titleChart: string,
  ressourceIdentifierList: Array<string>,
  ressourceIconList: { [string]: any },
  chartTypeList: Array<string>,
  chartIconList: { [string]: any },
  objectSelected: string,
  ressourceIdentifierSelected: string,
  chartTypeSelected: string,
};

export class CustomChartForm extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      titleChart: '',
      ressourceIdentifierList: [],
      ressourceIconList: {},
      chartTypeList: [],
      chartIconList: {},
      objectSelected: '',
      ressourceIdentifierSelected: '',
      chartTypeSelected: '',
    };
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    const { graphRessources } = this.props;
    if (
      this.state.objectSelected !== prevState.objectSelected ||
      prevProps.graphRessources !== graphRessources
    ) {
      if (this.state.objectSelected && graphRessources) {
        let ressourceList = [];
        let ressourceIconList = {};
        for (const key in graphRessources) {
          if (Object.prototype.hasOwnProperty.call(graphRessources, key)) {
            if (
              graphRessources[key].object.type === this.state.objectSelected
            ) {
              ressourceList = [...ressourceList, key];
              ressourceIconList = {
                ...ressourceIconList,
                [key]: graphRessources[key].iconResource,
              };
            }
          }
        }
        this.setState({
          ressourceIdentifierList: ressourceList,
          ressourceIconList,
          ressourceIdentifierSelected: ressourceList[0],
        });
      } else {
        this.setState({
          ressourceIdentifierList: [],
          ressourceIconList: {},
          ressourceIdentifierSelected: '',
        });
      }
    }
    const ressourceIdentifier = this.state.ressourceIdentifierSelected;
    if (
      prevState.ressourceIdentifierSelected !== ressourceIdentifier ||
      prevProps.graphRessources !== this.props.graphRessources
    ) {
      const chartList = this.props.graphRessources[ressourceIdentifier]
        .chartComponents;
      let iconList = {};
      for (const key in chartList) {
        if (Object.prototype.hasOwnProperty.call(chartList, key)) {
          iconList = {
            ...iconList,
            [key]: ICONS_CHART[key],
          };
        }
      }
      this.setState({
        chartTypeList: chartList ? Object.keys(chartList) : [],
        chartIconList: iconList,
        chartTypeSelected: chartList ? Object.keys(chartList)[0] : '',
      });
    }
  }

  handleClick = () => {
    const ressourceIdentifier = this.state.ressourceIdentifierSelected;
    if (!ressourceIdentifier) {
      alert(this.props.t('customChart.form.noResource'));
      return;
    }
    const date_name = this.props.graphRessources[ressourceIdentifier]
      .dateFiltersName;
    const base_filter = this.props.graphRessources[ressourceIdentifier].choices;
    const baseFilters = {};
    for (const key in base_filter) {
      if (Object.prototype.hasOwnProperty.call(base_filter, key)) {
        if (Array.isArray(base_filter[key])) {
          [baseFilters[key]] = base_filter[key];
        } else if (base_filter[key] instanceof Object) {
          for (const sub_key in base_filter[key]) {
            if (
              Object.prototype.hasOwnProperty.call(base_filter[key], sub_key)
            ) {
              [baseFilters[key]] = base_filter[key][sub_key];
            }
          }
        }
      }
    }
    const uuid = uuidv4();
    this.props.addGraph({
      name: `chart_${uuid}`,
      ressourceIdentifier,
      chart: this.state.chartTypeSelected,
      baseFilters,
      dateFiltersName: date_name,
      dateRange: {
        start: null,
        end: null,
        kind: 'current_year',
      },
      title: this.state.titleChart,
      dataFilters: {},
    });
    this.props.setFormOpen(false);
  };

  render() {
    const { t, classes, graphRessources } = this.props;
    const all_objectType = Object.keys(graphRessources).map((identifier) => {
      return graphRessources[identifier].object.type;
    });
    const objectList = Array.from(new Set(all_objectType));
    let objectIcons = {};
    for (const key in graphRessources) {
      if (Object.prototype.hasOwnProperty.call(graphRessources, key)) {
        objectIcons = {
          ...objectIcons,
          [graphRessources[key].object.type]: graphRessources[key].object.icon,
        };
      }
    }
    return (
      <Dialog open={this.props.formOpen}>
        <Form>
          <DialogTitle>{t('customChart.form.title')}</DialogTitle>
          <DialogContent>
            <CustomChartSelector
              itemList={objectList}
              itemSelected={this.state.objectSelected}
              setItemSelected={(item) =>
                this.setState({ objectSelected: item })
              }
              iconList={objectIcons}
            />
            {this.state.objectSelected ? (
              <>
                <CustomChartRadio
                  itemList={this.state.ressourceIdentifierList}
                  itemSelected={this.state.ressourceIdentifierSelected}
                  setItemSelected={(item) =>
                    this.setState({ ressourceIdentifierSelected: item })
                  }
                  iconList={this.state.ressourceIconList}
                />
              </>
            ) : null}
            {this.state.ressourceIdentifierSelected ? (
              <>
                <CustomChartRadio
                  itemList={this.state.chartTypeList}
                  itemSelected={this.state.chartTypeSelected}
                  setItemSelected={(item) =>
                    this.setState({ chartTypeSelected: item })
                  }
                  iconList={this.state.chartIconList}
                />
              </>
            ) : null}
            <TextField
              value={this.state.titleChart}
              placeholder={this.props.t('customChart.form.name')}
              required
              fullWidth
              onChange={(ev) => this.setState({ titleChart: ev.target.value })}
              className={classes.field}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => this.props.setFormOpen(false)}>
              {t('customChart.form.cancel')}
            </Button>
            <Button onClick={this.handleClick}>
              {t('customChart.form.submit')}
            </Button>
          </DialogActions>
        </Form>
      </Dialog>
    );
  }
}

const styles = (theme) => ({
  field: {
    marginBottom: theme.spacing(2),
  },
});

export default compose(
  withTranslation(['dashboard']),
  withStyles(styles),
)(CustomChartForm);
