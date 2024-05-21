import React from 'react';
import { useTranslation } from 'react-i18next';

import Menu from '@material-ui/core/Menu';
import IconButton from '@material-ui/core/IconButton';
import Collapse from '@material-ui/core/Collapse';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import FilterListIcon from '@material-ui/icons/FilterList';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ExpandMoreSharpIcon from '@material-ui/icons/ExpandMoreSharp';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Chip from '@material-ui/core/Chip';
import SvgIcon from '@material-ui/core/SvgIcon';

import CoachSelector from '#libs/associated-coach/components/coach-selector/CoachSelector.component';
import CoachGroupChip from '#libs/associated-coach/components/CoachGroupChip.component';

import type { Coach } from '#libs/associated-coach/types';
import type { Company } from '#libs/company/types';
import CompanyFilterChipPreview from '#src/libs/franchise/components/CompanyFilterChipPreview.component';
import FranchiseCompaniesSelector from '#libs/franchise/components/FranchiseCompaniesSelector.component';
import type {
  CompanyGroup,
  CompanyOptionTypeBase,
} from '#libs/franchise/types';
import FranchiseCompanyGroupsSelector from '#libs/franchise/components/FranchiseCompanyGroupsSelector.component';

type SubMenuProps = {
  onClick: () => void;
  onDelete: () => void;
  label: string;
  icon: typeof SvgIcon;
  show: boolean;
};

type MenuProps = {
  openFunction: () => void;
  label: string;
  open: boolean;
  onChange?: (field?: string, value?: any) => void;
  onClick?: () => void;
  onDelete?: () => void;
  icon?: typeof SvgIcon;
  show?: boolean;
  subMenu?: Array<SubMenuProps>;
  type?: string;

  coaches?: Array<Coach>;
  selectedCoaches?: Array<number>;

  companies?: Company[];
  selectedCompanies?: CompanyOptionTypeBase[];
  companyGroups?: CompanyGroup[];
  selectedCompanyGroups?: CompanyOptionTypeBase[];
  onChangeCompany?: (optionTypeBase: CompanyOptionTypeBase[]) => void;
};

type Props = {
  menu: Array<MenuProps>;
  emptyLabel?: string;
};

const ITEM_HEIGHT = 48;

const getCoachesById = (coaches: Array<Coach>, coaches_id: Array<number>) =>
  coaches.filter((c) => coaches_id.includes(c.id));

export const FilterMenu: React.FC<Props> = ({ menu, emptyLabel }) => {
  const classes = useStyles();
  const { t } = useTranslation(['booking', 'paymentPack']);

  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null,
  );
  const open = Boolean(anchorEl);

  // handling the open and close of the the main Menu
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setAnchorEl(null);
  };

  const noFilter = menu.reduce(
    (acc, m) =>
      acc &&
      ((m.type === 'coach' && m.selectedCoaches.length === 0) ||
        (m.type === 'company' && m.selectedCompanies.length === 0) ||
        (m.type === 'company_group' && m.selectedCompanyGroups.length === 0) ||
        (!['coach', 'company', 'company_group'].includes(m.type) &&
          m.subMenu?.filter((s) => s.show).length === 0)),
    true,
  );

  const handleCoachDelete =
    (
      selectedCoaches: number[],
      onChange: (field?: string, value?: any) => void,
    ) =>
    (coach: Coach) =>
      onChange(
        'coaches',
        [...selectedCoaches].filter((c) => c !== coach.id),
      );

  const handleCompanyDelete =
    (
      selectedCompanies: CompanyOptionTypeBase[],
      onChange: (newCompanies: CompanyOptionTypeBase[]) => void,
    ) =>
    (companyToDelete: Company) =>
      onChange(
        [...selectedCompanies].filter(
          (company) => parseInt(company.value) !== companyToDelete.id,
        ),
      );

  const handleCompanyGroupDelete =
    (
      selectedCompanyGroups: CompanyOptionTypeBase[],
      onChange: (newCompanyGroups: CompanyOptionTypeBase[]) => void,
    ) =>
    (companyGroupToDelete: CompanyGroup) =>
      onChange(
        [...selectedCompanyGroups].filter(
          (companyGroup) =>
            parseInt(companyGroup.value) !== companyGroupToDelete.id,
        ),
      );

  const getCompanyDic = React.useCallback(
    (companies: Company[]) =>
      (companies ?? [])?.reduce<Record<number, Company>>((acc, company) => {
        acc[company.id] = company;
        return acc;
      }, {}),
    [],
  );

  const handleChange = React.useCallback(
    (onChangeCompany: (optionTypeBase: CompanyOptionTypeBase[]) => void) =>
      (companyOptions: CompanyOptionTypeBase[]) => {
        onChangeCompany(companyOptions);
      },
    [],
  );

  const getSelectedCompanies = React.useCallback(
    (
      companies: Company[],
      selectedCompaniesOptions: CompanyOptionTypeBase[],
    ) => {
      const selectedCompanyIds = selectedCompaniesOptions
        .filter((companyOption) => !!companyOption?.value)
        .map((companyOption) => parseInt(companyOption.value));

      return companies.filter((company) =>
        selectedCompanyIds.includes(company.id),
      );
    },
    [],
  );

  const getSelectedCompanyGroups = React.useCallback(
    (
      companyGroups: CompanyGroup[],
      selectedCompanyGroupsOptions: CompanyOptionTypeBase[],
    ) => {
      const selectedCompanyGroupIds = selectedCompanyGroupsOptions
        .filter((companyGroupOption) => !!companyGroupOption?.value)
        .map((companyGroupOption) => parseInt(companyGroupOption.value));

      return companyGroups.filter((companyGroup) =>
        selectedCompanyGroupIds.includes(companyGroup.id),
      );
    },
    [],
  );

  return (
    <div className={classes.row}>
      <div>
        <IconButton
          aria-controls="long-menu"
          aria-haspopup="true"
          aria-label="more"
          onClick={handleClick}
        >
          <FilterListIcon />
        </IconButton>
        {noFilter && emptyLabel && (
          <Typography
            className={classes.emptyText}
            color="textSecondary"
            variant="caption"
          >
            {emptyLabel}
          </Typography>
        )}
        <Menu
          keepMounted
          anchorEl={anchorEl}
          getContentAnchorEl={null}
          id="short-menu"
          onClose={handleClose}
          open={open}
          PaperProps={{
            style: {
              maxHeight: ITEM_HEIGHT * 6.5,
              width: '33ch',
            },
          }}
        >
          {menu.map((m) => (
            <div key={m.label}>
              <MenuItem
                dense
                className={m.openFunction && classes.subMenu}
                onClick={
                  m.openFunction
                    ? (ev) => {
                        ev.stopPropagation();
                        ev.preventDefault();
                        m.openFunction();
                      }
                    : (ev) => {
                        ev.stopPropagation();
                        ev.preventDefault();
                        m.onClick();
                        setAnchorEl(null);
                      }
                }
              >
                {!m.openFunction && (
                  <ListItemIcon>
                    <m.icon color="primary" />
                  </ListItemIcon>
                )}
                <Typography variant="inherit">{m.label}</Typography>
                {m.openFunction && !m.open && (
                  // @ts-expect-error
                  <ListItemIcon button>
                    <ExpandMoreSharpIcon color="primary" />
                  </ListItemIcon>
                )}
                {m.openFunction && m.open && (
                  // @ts-expect-error
                  <ListItemIcon button>
                    <ExpandLessIcon color="primary" />
                  </ListItemIcon>
                )}
              </MenuItem>
              <Collapse in={m.open}>
                {m.type === 'coach' && (
                  <div className={classes.marginSelector}>
                    <CoachSelector
                      isClearable
                      coaches={m.coaches}
                      placeholder={t('bookings:filters.pickCoach')}
                      selectedCoaches={m.selectedCoaches}
                      selectOption={(
                        ev: { value: number; label: string }[],
                      ) => {
                        m.onChange(
                          'coaches',
                          ev.map((e) => e.value),
                        );
                      }}
                    />
                  </div>
                )}
                {m.type === 'company' && (
                  <div className={classes.marginSelector}>
                    <FranchiseCompaniesSelector
                      // @ts-expect-error
                      companies={m.companies}
                      // @ts-expect-error
                      companyDic={getCompanyDic(m.companies)}
                      onChange={handleChange(m.onChangeCompany)}
                      selectedCompanies={m.selectedCompanies}
                    />
                  </div>
                )}
                {m.type === 'company_group' && (
                  <div className={classes.marginSelector}>
                    <FranchiseCompanyGroupsSelector
                      companyGroups={m.companyGroups}
                      onChange={handleChange(m.onChangeCompany)}
                      selectedCompanyGroups={m.selectedCompanyGroups}
                    />
                  </div>
                )}
                {!['coach', 'company', 'company_group'].includes(m.type) && (
                  <List subheader={<li />}>
                    <Divider color="primary" />
                    {m.subMenu.map((s) => (
                      <ListItem
                        key={s.label}
                        button
                        onClick={(ev) => {
                          ev.stopPropagation();
                          ev.preventDefault();
                          s.onClick();
                          setAnchorEl(null);
                          m.openFunction();
                        }}
                      >
                        <ListItemIcon>
                          <s.icon color="primary" />
                        </ListItemIcon>
                        <Typography variant="inherit">{s.label}</Typography>
                      </ListItem>
                    ))}
                    <Divider color="primary" />
                  </List>
                )}
              </Collapse>
            </div>
          ))}
        </Menu>
      </div>
      <div className={classes.actionFilterList}>
        {menu.map((m) =>
          m.onClick ? (
            <div key={m.label}>
              {m.show && (
                <Chip
                  icon={<m.icon />}
                  label={m.label}
                  onDelete={m.onDelete}
                  size="small"
                  variant="outlined"
                />
              )}
            </div>
          ) : (
            <>
              {m.label === t('booking:filters.coach') && (
                <div key={m.label} className={classes.filters}>
                  <CoachGroupChip
                    coaches={getCoachesById(m.coaches, m.selectedCoaches)}
                    onDelete={handleCoachDelete(m.selectedCoaches, m.onChange)}
                  />
                </div>
              )}
              {m.label === t('paymentPack:filters.company') && (
                <div key={m.label} className={classes.filters}>
                  <CompanyFilterChipPreview
                    companies={getSelectedCompanies(
                      m.companies,
                      m.selectedCompanies,
                    )}
                    onDelete={handleCompanyDelete(
                      m.selectedCompanies,
                      m.onChangeCompany,
                    )}
                  />
                </div>
              )}
              {m.label === t('paymentPack:filters.companyGroup') && (
                <div key={m.label} className={classes.filters}>
                  <CompanyFilterChipPreview
                    companies={getSelectedCompanyGroups(
                      m.companyGroups,
                      m.selectedCompanyGroups,
                    )}
                    onDelete={handleCompanyGroupDelete(
                      m.selectedCompanyGroups,
                      m.onChangeCompany,
                    )}
                  />
                </div>
              )}
              {![
                t('booking:filters.coach'),
                t('paymentPack:filters.company'),
                t('paymentPack:filters.companyGroup'),
              ].includes(m.label) &&
                m.subMenu.reduce(
                  (previous, s) => previous || s.show,
                  false,
                ) && (
                  <div key={m.label} className={classes.filters}>
                    {m.subMenu?.map(
                      (s) =>
                        s.show && (
                          <div key={s.label}>
                            <Chip
                              icon={<s.icon />}
                              label={s.label}
                              onDelete={s.onDelete}
                              size="small"
                              variant="outlined"
                            />
                          </div>
                        ),
                    )}
                  </div>
                )}
            </>
          ),
        )}
      </div>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  emptyText: {
    marginLeft: theme.spacing(0.5),
    marginRight: theme.spacing(0.5),
  },
  subMenu: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingRight: theme.spacing(0),
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  filters: {
    flexWrap: 'wrap',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  actionFilterList: {
    flexWrap: 'wrap',
    display: 'flex',
    padding: theme.spacing(1),
    alignItems: 'center',
    justifyContent: 'flex-start',
    maxWidth: '100%',
    '& > *': {
      margin: theme.spacing(1) / 2,
    },
  },
  marginSelector: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(3),
  },
}));

export default FilterMenu;
