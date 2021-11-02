import React, { useRef } from 'react';
import { compose } from 'recompose';
import { withTranslation, WithTranslation } from 'react-i18next';

import withStyles from '@material-ui/core/styles/withStyles';
import ButtonBase from '@material-ui/core/ButtonBase';
import Paper from '@material-ui/core/Paper';
import { Theme, createStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Popover from '@material-ui/core/Popover';

import withTheme from '@material-ui/styles/withTheme';
import Clear from '@material-ui/icons/Clear';

import { MaterialStyleType } from '../../utils/types';
import FuzzySearchIcon from '../search/FuzzySearchIcon.component';
import MuiIcon from '../MuiIcon.component';
import muiIconNames from './muiIcon/muiIconNames';

type OwnProps = {
  onChange: (icon: string) => void;
  icon: string;
};

type Props = OwnProps &
  WithTranslation &
  MaterialStyleType<ReturnType<typeof styles>>;

export function IconInput(props: Props) {
  const { classes, t, onChange } = props;
  const [openPopup, setOpenPopup] = React.useState(false);
  const buttonRef = useRef(null);
  const itemRenderer = (data: { icon: string }) => {
    return (
      <>
        {data?.icon ? (
          <ButtonBase
            onClick={() => {
              onChange(data?.icon);
              setOpenPopup(false);
            }}
          >
            <div>
              <MuiIcon icon={data?.icon} className={classes.icon} />
            </div>
          </ButtonBase>
        ) : (
          <div />
        )}
      </>
    );
  };

  return (
    <>
      <Typography color="textSecondary" className={classes.title}>
        {t('form.tag.icon')}
      </Typography>

      {props.icon?.length !== 0 ? (
        <div className={classes.icons}>
          <ButtonBase onClick={() => setOpenPopup(!openPopup)} ref={buttonRef}>
            <MuiIcon icon={props.icon} />
          </ButtonBase>
          <ButtonBase onClick={() => onChange('')}>
            <Clear />
          </ButtonBase>
        </div>
      ) : (
        <ButtonBase
          onClick={() => setOpenPopup(!openPopup)}
          className={classes.button}
          ref={buttonRef}
        >
          <Typography color="textSecondary">
            {t('form.tag.selectIcon')}
          </Typography>
        </ButtonBase>
      )}
      <Popover
        open={openPopup}
        anchorEl={buttonRef.current}
        onClose={() => setOpenPopup(false)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <Paper>
          <FuzzySearchIcon
            iconRender
            itemRenderer={itemRenderer}
            startWithAll
            items={Object.keys(muiIconNames).map((icon) => ({
              icon,
              key: icon,
            }))}
            placeholder={t('form.tag.searchIcon')}
            searchFields={['icon']}
          />
        </Paper>
      </Popover>
    </>
  );
}

const styles = (theme: Theme) =>
  createStyles({
    deleteButton: {
      marginRight: theme.spacing(2),
    },
    delete: {
      display: 'flex',
      justifyContent: 'flex-end',
    },
    button: {
      borderRadius: theme.spacing(1),
      border: '1px solid #C1C1C1',
      padding: theme.spacing(1),
      backgroundColor: '#F8F8F8',
    },
    paperPopover: {
      overflow: 'auto',
      width: theme.spacing(50),
      maxHeight: theme.spacing(50),
    },
    iconButton: {
      padding: theme.spacing(3),
    },
    typo: {
      color: '#E8E8E8',
    },
    icons: {
      display: 'flex',
      flexDirection: 'row',
      borderRadius: theme.spacing(1),
      border: '1px solid #C1C1C1',
      padding: theme.spacing(1),
      backgroundColor: '#F8F8F8',
      maxWidth: theme.spacing(8),
    },
    icon: {
      height: theme.spacing(5),
      width: theme.spacing(5),
    },
    title: {
      position: 'relative',
      bottom: theme.spacing(0.5),
    },
  });

export default compose<any, Props>(
  withStyles(styles),
  withTheme,
  withTranslation('tag'),
)(IconInput);
