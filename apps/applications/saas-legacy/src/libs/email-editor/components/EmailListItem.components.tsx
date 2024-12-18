import React from 'react';
import { compose } from 'recompose';
import classNames from 'classnames';
import {
  Chip,
  ListItem,
  Theme,
  withStyles,
  WithStyles,
  createStyles,
  Hidden,
} from '@material-ui/core';
import { withTranslation, WithTranslation } from 'react-i18next';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import EditIcon from '@material-ui/icons/Edit';
import RestoreFromTrashIcon from '@material-ui/icons/RestoreFromTrash';
import Typography from '@material-ui/core/Typography';

import { DraggableSyntheticListeners } from '@dnd-kit/core';
import DragHandleIcon from '@material-ui/icons/DragHandle';
import { EmailTemplateSummary } from '../types';
import HighlightedText from '../../../components/HighlightedText/HighlightedText.component';
import ListItemResponsiveAction from '../../../components/button/ListItemResponsiveAction.component';
import { FranchiseCompany } from '../../franchise/types';
import CompanyChip from '../../../components/franchise/CompanyChip.component';
import FranchiseCompaniesListingTooltip from '../../franchise/components/FranchiseCompaniesListingTooltip.component';

export type OwnProps = {
  item?: EmailTemplateSummary;
  email?: EmailTemplateSummary;
  selected?: boolean;
  navigateTo?: (id: number) => void;
  onClick?: (id: number) => void;
  onEdit?: (id: number) => void;
  onDuplicate?: (id: number) => void;
  onDelete?: (id: number) => void;
  onRestore?: () => void;
  disabled?: boolean;
  search?: string;
  companies?: FranchiseCompany[];
  allCompanies?: boolean;
  draggable?: boolean;
  listeners?: DraggableSyntheticListeners;
  virtualized?: boolean;
  attributes?: {
    role: string;
    tabIndex: number;
    'aria-pressed': boolean;
    'aria-roledescription': string;
    'aria-describedby': string;
  };
  heightItem?: number;
};

type Props = OwnProps & WithStyles<typeof styles> & WithTranslation;

class EmailListItem extends React.PureComponent<Props> {
  renderChildren = (containerStyle: any, virtualized: boolean) => {
    const { companies, allCompanies, search, onRestore, item, classes, t } =
      this.props;
    const email = item || this.props.email;

    const onDelete = this.props.onDelete
      ? () => this.props.onDelete(email.id)
      : undefined;

    const onDuplicate = this.props.onDuplicate
      ? () => this.props.onDuplicate(email.id)
      : undefined;

    const onEdit = this.props.onEdit
      ? () => this.props.onEdit(email.id)
      : undefined;

    return (
      <div className={containerStyle}>
        {this.props.draggable && (
          <IconButton {...this.props.listeners} {...this.props.attributes}>
            <DragHandleIcon />
          </IconButton>
        )}
        <div className={classes.innerList}>
          <div className={classes.textAndChipsContainer}>
            <Typography
              className={classNames({ [classes.ellipsisStyle]: virtualized })}
              component="span"
              variant="subtitle1"
            >
              <HighlightedText highlight={search} text={email.title} />
            </Typography>
            <span
              className={classNames({ [classes.ellipsisStyle]: virtualized })}
            >
              <HighlightedText highlight={search} text={email.subject} />
            </span>
            {companies?.length > 0 && !allCompanies && (
              <div className={classes.chipsContainer}>
                <Hidden mdDown>
                  {companies
                    .slice(0, 2)
                    .map(
                      (company) =>
                        company && (
                          <CompanyChip
                            key={company.id}
                            className={classes.chip}
                            company={company}
                          />
                        ),
                    )}
                  {companies.length > 2 && (
                    <FranchiseCompaniesListingTooltip
                      companies={companies.slice(2)}
                    >
                      <Chip
                        className={classes.chip}
                        color="primary"
                        label={t('seeAll')}
                        variant="outlined"
                      />
                    </FranchiseCompaniesListingTooltip>
                  )}
                </Hidden>
                <Hidden lgUp>
                  <FranchiseCompaniesListingTooltip companies={companies}>
                    <Chip
                      className={classes.chip}
                      color="primary"
                      label={t('seeAll')}
                      variant="outlined"
                    />
                  </FranchiseCompaniesListingTooltip>
                </Hidden>
              </div>
            )}
            {allCompanies && (
              <FranchiseCompaniesListingTooltip companies={companies}>
                <Chip
                  className={classes.chip}
                  color="primary"
                  label={t('allCompanies')}
                />
              </FranchiseCompaniesListingTooltip>
            )}
          </div>
          <div className={classes.actionList}>
            <ListItemResponsiveAction
              actions={[
                onEdit && {
                  icon: EditIcon,
                  label: `edit-${email.id}`,
                  color: 'primary',
                  onClick: onEdit,
                },
                onDuplicate && {
                  icon: FileCopyIcon,
                  label: `duplicate-${email.id}`,
                  color: 'primary',
                  onClick: onDuplicate,
                },
                onDelete && {
                  icon: DeleteIcon,
                  label: `delete-${email.id}`,
                  onClick: onDelete,
                  color: 'secondary',
                },
                onRestore && {
                  icon: RestoreFromTrashIcon,
                  label: `restore-${email.id}`,
                  onClick: onRestore,
                },
              ]}
            />
          </div>
        </div>
      </div>
    );
  };

  render() {
    const { selected, disabled, classes, virtualized, heightItem } = this.props;
    const email = this.props.email ? this.props.email : this.props.item;

    let navigationTo;
    if (this.props.navigateTo) {
      navigationTo = () => this.props.navigateTo(email.id);
    } else if (this.props.onClick) {
      navigationTo = () => this.props.onClick(email.id);
    } else {
      navigationTo = undefined;
    }

    if (!email) return null;
    if (!virtualized) {
      return (
        <ListItem
          divider
          // @ts-expect-error
          button={!disabled}
          className={classes.listItem}
          onClick={navigationTo}
          selected={selected}
        >
          {this.renderChildren(classes.flexBox, virtualized)}
        </ListItem>
      );
    }
    return (
      <div
        className={classes.listVirtualizedItem}
        onClick={!disabled ? navigationTo : undefined}
        onKeyUp={navigationTo}
        role="button"
        style={{
          height: heightItem || 120,
        }}
        tabIndex={0}
      >
        {this.renderChildren({}, virtualized)}
      </div>
    );
  }
}

const styles = (theme: Theme) =>
  createStyles({
    innerList: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flex: 1,
    },
    chip: {
      marginRight: theme.spacing(1),
      width: 'fit-content',
      marginTop: 5,
    },
    chipsContainer: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'flex-start',
      flexWrap: 'wrap',
    },
    listItem: {
      padding: theme.spacing(1),
      display: 'flex',
      flex: 1,
    },
    listVirtualizedItem: {
      padding: theme.spacing(1),
      minHeight: 120,
      justifyContent: 'center',
      display: 'flex',
      borderBottom: '1px solid #DDD',
      flexDirection: 'column',
      cursor: 'pointer',
      backgroundColor: '#fff',
      '&:hover': { backgroundColor: '#eee' },
    },
    actionList: {
      display: 'flex',
      alignItems: 'center',
      flex: '0 1',
    },
    textAndChipsContainer: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'left',
      padding: 8,
      minWidth: 0,
      flex: 1,
    },
    ellipsisStyle: {
      textOverflow: 'ellipsis',
      overflow: 'hidden',
      whiteSpace: 'nowrap',
    },
    flexBox: {
      display: 'flex',
      flex: 1,
    },
  });

export default compose<any, OwnProps>(
  withStyles(styles),
  withTranslation(['emailTemplate']),
)(EmailListItem);
