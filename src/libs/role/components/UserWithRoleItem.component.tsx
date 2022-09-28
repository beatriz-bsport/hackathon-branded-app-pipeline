import React from 'react';
import { TFunction } from 'i18next';
import { WithTranslation, withTranslation } from 'react-i18next';
import { compose } from 'recompose';
import {
  FormControl,
  MenuItem,
  Select,
  TextField,
  Theme,
  withStyles,
} from '@material-ui/core';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';
import IconButton from '@material-ui/core/IconButton';

// @ts-ignore
import withConfirm from '../../../hocs/with-confirm.hoc';
import { Role, UserRole, CoachOption } from '../types';
import { MaterialStyleType } from '../../../utils/types';
import { getRoleName, getCoachOptionsFromCoachIds } from '../utils';
import COMMON_ROLES, { OWNER_ROLE, CHECKIN_APP_ROLE } from '../role-types';
import { Coach } from '#libs/associated-coach/types';
import MaterialUISelector from '#components/Selector/MaterialUISelector.component';

const DeleteButton = withConfirm(
  (props: { deleteUser: () => void }) => (
    <IconButton onClick={props.deleteUser}>
      <RemoveCircleIcon color="error" />
    </IconButton>
  ),
  'deleteUser',
  {
    title: 'role:forms.user.delete.title',
    cancel: 'role:forms.user.delete.cancel',
    confirm: 'role:forms.user.delete.confirm',
    Content: ({ t }: { t: TFunction }) => (
      <p>{t('role:forms.user.delete.content')}</p>
    ),
  },
);

type OwnProps = {
  handleRoleChange: (roleId: number) => void;
  user: UserRole;
  roles: Role[];
  deleteUser: (id: number) => void;
  coachList: Array<Coach>;
  coachListLoading: boolean;
  editUserSelectedCoaches: (coachIds: number[]) => void;
};

type Props = OwnProps &
  MaterialStyleType<ReturnType<typeof styles>> &
  WithTranslation;

type State = {
  selectedCoaches: CoachOption[];
};

class UserWithRole extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      selectedCoaches: null,
    };
  }

  handleCoachesChange = () => {
    const coachIds =
      this.state.selectedCoaches?.map((coach: CoachOption) => coach.value) ??
      [];
    this.props.editUserSelectedCoaches(coachIds);
  };

  render() {
    const {
      classes,
      t,
      handleRoleChange,
      user,
      roles,
      deleteUser,
      coachList,
      coachListLoading,
    } = this.props;

    const selectedCoachesInitial =
      this.props.user.coaches_selected_in_role && this.props.coachList
        ? getCoachOptionsFromCoachIds(
            this.props.user.coaches_selected_in_role || [],
            this.props.coachList || [],
          )
        : [];

    return (
      <div className={classes.roleFieldContainer}>
        <TextField className={classes.roleField} disabled value={user.email} />
        <TextField
          className={classes.roleField}
          disabled
          value={`${user.first_name} ${user.last_name}`}
        />
        <FormControl>
          <Select
            className={classes.roleField}
            disabled={
              user.role === OWNER_ROLE || user.role === CHECKIN_APP_ROLE
            }
            value={user.role || 0}
            onChange={(ev: any) => {
              handleRoleChange(parseInt(ev.target.value, 10));
            }}
            name="role"
          >
            {roles.map((role) => (
              <MenuItem
                disabled={
                  role.id === OWNER_ROLE || role.id === CHECKIN_APP_ROLE
                }
                key={role.id}
                value={role.id}
              >
                {getRoleName(role, t)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {user.role !== OWNER_ROLE ? (
          <DeleteButton t={t} deleteUser={deleteUser} />
        ) : null}
        {!Object.values(COMMON_ROLES).includes(user.role) && (
          <div className={classes.selectorField}>
            <MaterialUISelector
              placeholder={t('forms.user.selectCoach')}
              isLoading={coachListLoading}
              name="coaches"
              menuPlacement="bottom"
              value={this.state.selectedCoaches ?? selectedCoachesInitial}
              onChange={(values: CoachOption[]) => {
                this.setState(
                  { selectedCoaches: values },
                  this.handleCoachesChange,
                );
              }}
              options={[...coachList]?.map((coach: Coach) => ({
                value: coach.id,
                label: coach.name,
              }))}
              isMulti
            />
          </div>
        )}
      </div>
    );
  }
}

const styles = (theme: Theme) => ({
  roleFieldContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  roleField: {
    marginRight: theme.spacing(1),
    minWidth: 200,
  },
  selectorField: {
    marginRight: theme.spacing(1),
    minWidth: 280,
  },
});

export default compose<any, OwnProps>(
  // @ts-ignore
  withStyles(styles),
  withTranslation('role'),
)(UserWithRole);
