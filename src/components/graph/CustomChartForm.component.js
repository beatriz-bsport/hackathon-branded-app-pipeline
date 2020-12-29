// @flow
import React from 'react';
import type { TFunction } from 'react-i18next';
import { withTranslation } from 'react-i18next';
import { compose } from 'recompose';
import { Form } from 'formik';
import { v4 as uuidv4 } from 'uuid';
import {
  Button,
  TextField,
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  FormControlLabel,
  Checkbox,
  Typography,
  withStyles,
} from '@material-ui/core';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';

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
  chartTypeList: Array<string>,
  chartIconList: { [string]: any },
  objectSelected: string,
  ressourceIdentifierSelected: string,
  aggregate: boolean,
};

export class CustomChartForm extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      titleChart: '',
      ressourceIdentifierList: [],
      chartTypeList: [],
      chartIconList: {},

      objectSelected: null,
      ressourceIdentifierSelected: null,
      chartTypeSelected: null,
      aggregate: false,
    };
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    const { graphRessources } = this.props;
    if (
      this.state.objectSelected !== prevState.objectSelected ||
      prevProps.graphRessources !== graphRessources
    ) {
      const ressourceIdentifierList = [];
      const ressourceIconList = {};

      if (this.state.objectSelected && graphRessources) {
        for (const key in graphRessources) {
          if (graphRessources[key].object.type === this.state.objectSelected) {
            ressourceIdentifierList.push(key);
            ressourceIconList[key] = graphRessources[key].iconResource;
          }
        }
      }
      this.setState({
        ressourceIdentifierList,
        ressourceIdentifierSelected: null,
      });
    }
    const { ressourceIdentifierSelected } = this.state;

    if (
      (ressourceIdentifierSelected &&
        prevState.ressourceIdentifierSelected !==
          ressourceIdentifierSelected) ||
      prevProps.graphRessources !== graphRessources
    ) {
      const { chartComponents } = graphRessources[ressourceIdentifierSelected];

      let iconList = {};
      for (const key in chartComponents) {
        if (Object.prototype.hasOwnProperty.call(chartComponents, key)) {
          iconList = {
            ...iconList,
            [key]: ICONS_CHART[key],
          };
        }
      }
      const { allowAggregate } = graphRessources[ressourceIdentifierSelected];

      const chartList = Object.keys(chartComponents);

      this.setState((prevS) => ({
        chartTypeList: chartList,

        chartIconList: iconList,
        chartTypeSelected: chartList.length === 1 ? chartList[0] : null,
        aggregate: allowAggregate && prevS.aggregate,
      }));
    }
  }

  handleClick = () => {
    const { graphRessources } = this.props;
    const { ressourceIdentifierSelected } = this.state;

    const { dateFiltersName, choices } = graphRessources[
      ressourceIdentifierSelected
    ];

    const baseFilters = {};
    for (const key in choices) {
      if (Array.isArray(choices[key])) {
        baseFilters[key] = choices[key];
      } else if (choices[key] instanceof Object) {
        for (const sub_key in choices[key]) {
          if (choices[key][sub_key]) {
            baseFilters[key] = choices[key][sub_key];
          }
        }
      }
    }

    const aggregate =
      graphRessources[ressourceIdentifierSelected].allowAggregate &&
      this.state.aggregate;

    const uuid = uuidv4();
    this.props.addGraph({
      name: `chart_${uuid}`,
      ressourceIdentifier: ressourceIdentifierSelected,

      chart: this.state.chartTypeSelected,
      baseFilters,
      dateFiltersName,
      dateRange: {
        start: null,
        end: null,
        kind: 'current_year',
      },
      title: this.state.titleChart,
      dataFilters: {},
      aggregate,
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
            {this.state.objectSelected && (
              <FormControl component="fieldset">
                <FormLabel>{t('customChart.form.datatype')}</FormLabel>
                <RadioGroup
                  aria-label="datatype"
                  name="datatype"
                  value={this.state.ressourceIdentifierSelected}
                  onChange={(ev) =>
                    this.setState({
                      ressourceIdentifierSelected: ev.target.value,
                      chartTypeSelected: null,
                    })
                  }
                >
                  {this.state.ressourceIdentifierList.map((r) => (
                    <FormControlLabel
                      value={r}
                      control={<Radio />}
                      label={t(`customChart.form.radio.${r}`)}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            )}
            {this.state.ressourceIdentifierSelected && (
              <div className={classes.marginTop}>
                <FormLabel>{t('customChart.form.graphComponent')}</FormLabel>
                <CustomChartRadio
                  itemList={this.state.chartTypeList}
                  itemSelected={this.state.chartTypeSelected}
                  setItemSelected={(item) =>
                    this.setState({ chartTypeSelected: item })
                  }
                  iconList={this.state.chartIconList}
                />
              </div>
            )}

            {this.state.objectSelected &&
              this.state.ressourceIdentifierSelected &&
              this.props.graphRessources[this.state.ressourceIdentifierSelected]
                .allowAggregate && (
                <div className={classes.aggregateWrapper}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={this.state.aggregate}
                        onChange={() =>
                          this.setState((prevState) => ({
                            aggregate: !prevState.aggregate,
                          }))
                        }
                        name="checkedB"
                        color="primary"
                      />
                    }
                    label={t('customChart.form.aggregate')}
                  />
                  <Typography color="textSecondary" variant="caption">
                    {t('customChart.form.aggregateHelper')}
                  </Typography>
                </div>
              )}
            <div className={classes.marginTop}>
              <TextField
                value={this.state.titleChart}
                placeholder={this.props.t('customChart.form.name')}
                variant="outlined"
                required
                fullWidth
                onChange={(ev) =>
                  this.setState({ titleChart: ev.target.value })
                }
                className={classes.field}
              />
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => this.props.setFormOpen(false)}>
              {t('customChart.form.cancel')}
            </Button>
            <Button
              disabled={
                !this.state.titleChart ||
                !this.state.ressourceIdentifierSelected ||
                !this.state.chartTypeSelected
              }
              onClick={this.handleClick}
            >
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
  aggregateWrapper: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    marginTop: theme.spacing(1),
  },
  marginTop: {
    marginTop: theme.spacing(2),
  },
});

export default compose(
  withTranslation(['dashboard']),
  withStyles(styles),
)(CustomChartForm);
