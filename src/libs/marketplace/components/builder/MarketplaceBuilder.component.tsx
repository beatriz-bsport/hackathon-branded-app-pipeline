import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import { isEqual } from 'lodash';
import { Link } from 'react-router-dom';
import {
  Button,
  ListItem,
  ListItemText,
  Paper,
  Typography,
  Theme,
} from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import ShareIcon from '@material-ui/icons/Share';
import DragHandleIcon from '@material-ui/icons/DragHandle';
import SaveIcon from '@material-ui/icons/Save';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';

import {
  SortableContainer,
  SortableElement,
  SortableHandle,
} from 'react-sortable-hoc';

import { getMarketplaceRoute } from '../../routing-utils';

import ListItemResponsiveAction from '../../../../components/button/ListItemResponsiveAction.component';
import { Theme as CompanyTheme } from '../../../theme/types';
import { WIDGET_SUPPORTED_EXPORTABLE_COMPONENTS } from '../../../widget/constants';

const DragHandle = SortableHandle(() => <DragHandleIcon color="action" />);
const SortableItem = SortableElement((props: any) => (
  <div style={{ display: 'flex', opacity: '1', zIndex: 99999, width: '100%' }}>
    {props.children}
  </div>
));
const Container = SortableContainer((props: any) => {
  return <div>{props.children}</div>;
});

type Props = {
  theme: CompanyTheme;
  config: any;
  settings: any;
  onEditTab: (idx: number) => void;
  onDeleteTab: (idx: number) => void;
  setOpenWidgetDialog: (open: boolean) => void;
  setCurrentTab: (idx: number) => void;
  onSaveConfig: (config: any) => void;
  setConfig: (config: any) => void;
};

const MarketplaceBuilder = (props: Props) => {
  const { t } = useTranslation(['settings']);
  const classes = useStyles();
  const { config, theme, settings, setConfig } = props;

  const onSortEnd = React.useCallback(
    (e: { oldIndex: number; newIndex: number }) => {
      if (e.oldIndex > e.newIndex) {
        setConfig([
          ...config.slice(0, e.newIndex),
          config[e.oldIndex],
          config[e.newIndex],
          ...config.slice(e.newIndex + 1, e.oldIndex),
          ...config.slice(e.oldIndex + 1),
        ]);
      } else if (e.oldIndex < e.newIndex) {
        setConfig([
          ...config.slice(0, e.oldIndex),
          ...config.slice(e.oldIndex + 1, e.newIndex),
          config[e.newIndex],
          config[e.oldIndex],
          ...config.slice(e.newIndex + 1),
        ]);
      }
    },
    [config, setConfig],
  );

  return (
    <div>
      <div className={classes.marginTop} />
      <div className={classes.explain}>
        <div className={classes.row}>
          <InfoOutlinedIcon className={classes.iconLeft} />
          <Typography>{t('marketplaceSettings.explainMarketplace')}</Typography>
        </div>
        <Link
          style={{ textDecoration: 'none' }}
          to={getMarketplaceRoute(theme.company_name, theme.company, '')}
        >
          <Button
            color="secondary"
            style={{
              marginTop: 16,
            }}
            variant="outlined"
          >
            {t('marketplaceSettings.link')}
          </Button>
        </Link>
      </div>
      <Container useDragHandle onSortEnd={onSortEnd}>
        {config.map((tab: any, i: number) => (
          <SortableItem index={i} key={i}>
            <Paper className={classes.paperItem}>
              <ListItem divider alignItems="center" dense>
                <DragHandle />

                <ListItemText
                  className={classes.listText}
                  primary={tab.title}
                  secondary={t(
                    `marketplaceSettings.componentType.${tab.component_type}`,
                  )}
                />

                <ListItemResponsiveAction
                  actions={[
                    WIDGET_SUPPORTED_EXPORTABLE_COMPONENTS.includes(
                      tab.component_type,
                    )
                      ? {
                          icon: ShareIcon,
                          label: t('serviceGroup.delete'),
                          onClick: () => {
                            props.setCurrentTab(i);
                            props.setOpenWidgetDialog(true);
                          },
                        }
                      : undefined,
                    {
                      icon: EditIcon,
                      label: t('serviceGroup.edit'),
                      color: 'primary',
                      onClick: () => props.onEditTab(i),
                    },
                    {
                      icon: DeleteIcon,
                      label: t('serviceGroup.delete'),
                      onClick: () => props.onDeleteTab(i),
                    },
                  ]}
                />
              </ListItem>
            </Paper>
          </SortableItem>
        ))}
      </Container>

      <div className={classes.saveContainer}>
        <Button
          color="primary"
          onClick={props.onSaveConfig}
          variant="contained"
          disabled={isEqual(config, settings.config)}
        >
          <SaveIcon className={classes.addIcon} />
          {t('marketplaceSettings.saveButton')}
        </Button>
      </div>
    </div>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  saveContainer: {
    display: 'flex',
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'flex-end',
    marginTop: theme.spacing(2),
  },
  addIcon: {
    marginRight: theme.spacing(1),
  },
  listText: {
    marginLeft: theme.spacing(2),
  },
  marginTop: {
    marginTop: theme.spacing(2),
  },
  paperItem: {
    width: '100%',
  },
  explain: {
    padding: theme.spacing(2),
    borderRadius: 8,
    border: '1px solid #DEDEDE',
    maxWidth: 580,
    marginBottom: theme.spacing(3),
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconLeft: {
    marginRight: theme.spacing(2),
  },
}));

export default MarketplaceBuilder;
