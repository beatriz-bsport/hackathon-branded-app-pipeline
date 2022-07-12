import React from 'react';
import classNames from 'classnames';
import { WithTranslation, useTranslation } from 'react-i18next';
import chroma from 'chroma-js';
import type { Theme } from '@material-ui/core/styles';
import makeStyles from '@material-ui/styles/makeStyles';
import Collapse from '@material-ui/core/Collapse';
import ButtonBase from '@material-ui/core/ButtonBase';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import DoubleArrowIcon from '@material-ui/icons/DoubleArrow';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import ListItemText from '@material-ui/core/ListItemText';
import MailIcon from '@material-ui/icons/Mail';
import ChatIcon from '@material-ui/icons/Chat';
import NotificationsIcon from '@material-ui/icons/Notifications';
import {
  COMMUNICATION_KIND_EMAIL,
  COMMUNICATION_KIND_SMS,
  COMMUNICATION_KIND_PUSH_NOTIFICATION,
} from '@bsport/common/lib/master-data/communication-kind';
import {
  SEND_COMMUNICATION_ON_JOIN,
  SEND_COMMUNICATION_ON_LEFT,
} from '@bsport/common/lib/master-data/smart-list';
import type { AutomatedCampaign as AutomatedCampaignType } from '#libs/smart-list/types';
import { MaterialStyleType } from '../../../../utils/types';
import { formatAsDate } from '../../../../utils/datetime';

type AutoCompaignItemProps = {
  campaign: AutomatedCampaignType;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
};

type CommunicationChipProps = {
  kind: number;
};

const chipStyles = makeStyles((theme: Theme) => ({
  leftIcon: {
    marginRight: theme.spacing(1),
  },
  container: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    padding: theme.spacing(1),
    borderRadius: theme.spacing(0.5),
    backgroundColor: chroma(theme.palette.primary.main).alpha(0.2).hex(),
  },
}));

const CommunicationChip: React.FC<CommunicationChipProps> = ({ kind }) => {
  const classes = chipStyles();
  const { t } = useTranslation('communication');
  if (kind === COMMUNICATION_KIND_EMAIL) {
    return (
      <div className={classes.container}>
        <MailIcon className={classes.leftIcon} />
        <Typography>
          {t(`campaign.kind.${COMMUNICATION_KIND_EMAIL}`)}
        </Typography>
      </div>
    );
  }
  if (kind === COMMUNICATION_KIND_SMS) {
    return (
      <div className={classes.container}>
        <ChatIcon className={classes.leftIcon} />
        <Typography>{t(`campaign.kind.${COMMUNICATION_KIND_SMS}`)}</Typography>
      </div>
    );
  }
  if (kind === COMMUNICATION_KIND_PUSH_NOTIFICATION) {
    return (
      <div className={classes.container}>
        <NotificationsIcon className={classes.leftIcon} />
        <Typography>
          {t(`campaign.kind.${COMMUNICATION_KIND_PUSH_NOTIFICATION}`)}
        </Typography>
      </div>
    );
  }
  return <div />;
};

const useListItemStyles = makeStyles((theme: Theme) => ({
  listItemOutter: {
    backgroundColor: 'white',
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  leftItem: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    flex: 2,
  },
  listItemIcon: {
    flex: 1,
  },
  listItemText: {
    flex: 1,
    [theme.breakpoints.down('md')]: {
      flex: '1 0 100%',
      justifyContent: 'flex-start',
      paddingTop: theme.spacing(1),
    },
  },
  listItemAction: {
    display: 'flex',
    justifyContent: 'flex-end',
    flex: 1,
  },
}));

const AutoCompaignItem: React.FC<AutoCompaignItemProps> = ({
  campaign,
  onEdit,
  onDelete,
}) => {
  const { t } = useTranslation('communication');
  const classes = useListItemStyles();
  return (
    <ListItem classes={{ root: classes.listItemOutter }}>
      <div className={classes.leftItem}>
        <div className={classes.listItemIcon}>
          <ListItemIcon>
            <CommunicationChip kind={campaign?.communication_kind} />
          </ListItemIcon>
        </div>
        <div className={classes.listItemText}>
          <ListItemText
            secondary={t('campaign.automated.activeSince', {
              date: formatAsDate(campaign?.date_created),
            })}
          />
        </div>
      </div>
      <div className={classes.listItemAction}>
        <IconButton onClick={() => onEdit(campaign.id)}>
          <EditIcon color="primary" />
        </IconButton>
        <IconButton onClick={() => onDelete(campaign.id)}>
          <DeleteIcon />
        </IconButton>
      </div>
    </ListItem>
  );
};

type OwnProps = {
  onAdd: (event_kind: number) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  smartListAutomatedCampaigns: AutomatedCampaignType[];
  loading?: boolean;
};

type Props = OwnProps &
  MaterialStyleType<ReturnType<typeof useStyles>> &
  WithTranslation;

export const AutomatedCampaignPanel = (props: Props) => {
  const { onAdd, smartListAutomatedCampaigns, loading, onEdit, onDelete } =
    props;
  const { t } = useTranslation('communication');
  const classes = useStyles();
  const [openedSection, setopenedSection] = React.useState(false);

  const onJoinSmartListAutomatedCampaigns = smartListAutomatedCampaigns?.filter(
    (camp: AutomatedCampaignType) =>
      camp?.event_kind === SEND_COMMUNICATION_ON_JOIN,
  );
  const onLeftSmartListAutomatedCampaigns = smartListAutomatedCampaigns?.filter(
    (camp: AutomatedCampaignType) =>
      camp?.event_kind === SEND_COMMUNICATION_ON_LEFT,
  );
  const handleOpenCloseSection = () => setopenedSection(!openedSection);
  const handleAddCommunicationOnJoin = () => onAdd(SEND_COMMUNICATION_ON_JOIN);
  const handleAddCommunicationOnLeft = () => onAdd(SEND_COMMUNICATION_ON_LEFT);
  return (
    <div className={classes.outterSection}>
      <ButtonBase
        onClick={handleOpenCloseSection}
        className={classes.flexHeader}
      >
        <div className={classes.title}>
          <Typography
            variant="h6"
            color={openedSection ? 'inherit' : 'textSecondary'}
          >
            {`${t('campaign.automated.panel.title')} (${
              smartListAutomatedCampaigns?.length || 0
            })`}
          </Typography>
        </div>

        <>{openedSection ? <ExpandLessIcon /> : <ExpandMoreIcon />}</>
      </ButtonBase>
      <Divider className={classes.divider} />
      <Collapse
        in={openedSection}
        className={classNames({ [classes.collapseInner]: openedSection })}
      >
        <Grid container spacing={2}>
          <Grid item md={6} xs={12}>
            <div className={classes.panelHeader}>
              <DoubleArrowIcon
                className={classNames(classes.leftIcon, classes.joinIcon)}
              />
              <Typography variant="h6">
                {t('campaign.automated.panel.subtitle.onJoin')}
              </Typography>
            </div>
            {onJoinSmartListAutomatedCampaigns &&
            onJoinSmartListAutomatedCampaigns?.length !== 0 ? (
              <List component="nav">
                {onJoinSmartListAutomatedCampaigns?.map(
                  (auto_camp: AutomatedCampaignType) => (
                    <AutoCompaignItem
                      key={`automated_campaign_item${auto_camp?.id}`}
                      campaign={auto_camp}
                      onEdit={onEdit}
                      onDelete={onDelete}
                    />
                  ),
                )}
              </List>
            ) : null}
            <Button
              variant="outlined"
              color="primary"
              onClick={handleAddCommunicationOnJoin}
              disabled={
                loading || onJoinSmartListAutomatedCampaigns?.length >= 3
              }
            >
              <AddIcon />
              {t('campaign.automated.panel.add')}
            </Button>
          </Grid>
          <Grid item md={6} xs={12}>
            <div className={classes.panelHeader}>
              <DoubleArrowIcon
                className={classNames(classes.leftIcon, classes.leavingIcon)}
              />
              <Typography variant="h6">
                {t('campaign.automated.panel.subtitle.onLeft')}
              </Typography>
            </div>
            {onLeftSmartListAutomatedCampaigns &&
            onLeftSmartListAutomatedCampaigns?.length !== 0 ? (
              <List>
                {onLeftSmartListAutomatedCampaigns?.map(
                  (auto_camp: AutomatedCampaignType) => (
                    <AutoCompaignItem
                      key={`automated_campaign_item${auto_camp?.id}`}
                      campaign={auto_camp}
                      onEdit={onEdit}
                      onDelete={onDelete}
                    />
                  ),
                )}
              </List>
            ) : null}
            <Button
              variant="outlined"
              color="primary"
              onClick={handleAddCommunicationOnLeft}
              disabled={
                loading || onLeftSmartListAutomatedCampaigns?.length >= 3
              }
            >
              <AddIcon />
              {t('campaign.automated.panel.add')}
            </Button>
          </Grid>
        </Grid>
      </Collapse>
    </div>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  flexHeader: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    gap: theme.spacing(2),
  },
  title: {
    display: 'flex',
  },
  outterSection: {
    paddingTop: theme.spacing(2),
  },
  divider: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  panelHeader: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  collapseInner: {
    padding: theme.spacing(2),
  },
  leftIcon: {
    marginRight: theme.spacing(2),
  },
  joinIcon: {
    color: '#00c853',
  },
  leavingIcon: {
    color: '#ff3d00',
    transform: 'rotate(180deg)',
  },
}));

export default AutomatedCampaignPanel;
