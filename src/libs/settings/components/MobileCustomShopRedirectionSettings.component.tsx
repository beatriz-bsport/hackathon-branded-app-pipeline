import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TFunction } from 'i18next';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  useSortable,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import {
  Button,
  IconButton,
  LinearProgress,
  makeStyles,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Theme,
  Typography,
} from '@material-ui/core';
import DragHandleIcon from '@material-ui/icons/DragHandle';
import InfoIcon from '@material-ui/icons/Info';
import VisibilityIcon from '@material-ui/icons/Visibility';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';

import MuiIcon from '#src/components/MuiIcon.component';
// @ts-expect-error
import withConfirm from '#src/hocs/with-confirm.hoc';
import { MuiIconName } from '#src/components/input/muiIcon/MuiIconNameType';
import { CustomShopRedirection } from '#src/libs/settings/types';
import { SubShop } from '#src/libs/shop/types';
import { OptionCallback } from '../../../state/types';
import MobileShopPreview from './MobileShopPreview.dialog';
import MobileShopCustomShopRedirectionDialog from './MobileShopCustomShopRedirectionDialog.dialog';

type Props = {
  loading: boolean;
  shopRedirections: CustomShopRedirection[];
  paymentComboListCount: number;
  paymentPackListCount: number;
  contractListCount: number;
  vodListCount: number;
  giftcardsCount: number;
  subshopList: SubShop[];
  createCustomShopRedirection: (
    data: Omit<CustomShopRedirection, 'id'>,
    options?: OptionCallback<void>,
  ) => void;
  updateCustomShopRedirection: (
    args_0: {
      id: string;
      data: Omit<CustomShopRedirection, 'id'>;
    },
    options?: OptionCallback<void>,
  ) => void;
  deleteCustomShopRedirection: (id: string) => void;
};

const MobileCustomShopRedirectionSettings: React.FC<Props> = ({
  loading,
  shopRedirections,
  paymentComboListCount,
  paymentPackListCount,
  contractListCount,
  vodListCount,
  giftcardsCount,
  subshopList,
  createCustomShopRedirection,
  updateCustomShopRedirection,
  deleteCustomShopRedirection,
}) => {
  const classes = useStyles();
  const { t } = useTranslation(['settings']);

  const [openShopRedirectionDialog, setOpenShopRedirectionDialog] =
    useState(false);
  const [editingShopRedirection, setEditingShopRedirection] =
    useState<CustomShopRedirection | null>(null);
  const [openPopupPreviewDialog, setOpenPopupPreviewDialog] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleOpenShopRedirectionDialog = () => {
    setOpenShopRedirectionDialog(true);
  };

  const handleCloseShopRedirectionDialog = () => {
    setOpenShopRedirectionDialog(false);
  };

  const onClickEditShopRedirection = (link: CustomShopRedirection) => () => {
    setEditingShopRedirection(link);
    setOpenShopRedirectionDialog(true);
  };

  const handleSubmitShopRedirection = (param: {
    id: string;
    values: {
      name: string;
      icon: MuiIconName;
      url: string;
    };
    options: OptionCallback;
  }) => {
    if (param.id) {
      updateCustomShopRedirection(
        // @ts-expect-error
        { id: param.id, data: param.values },
        {
          onSuccess: () => {
            param.options.onSuccess();
            setOpenShopRedirectionDialog(false);
            setEditingShopRedirection(null);
          },
          onError: () => {
            param.options.onError();
            setOpenShopRedirectionDialog(false);
            setEditingShopRedirection(null);
          },
        },
      );
      return;
    }
    // @ts-expect-error
    createCustomShopRedirection(param.values, {
      onSuccess: () => {
        param.options.onSuccess();
        setOpenShopRedirectionDialog(false);
        setEditingShopRedirection(null);
      },
      onError: () => {
        param.options.onError();
        setOpenShopRedirectionDialog(false);
        setEditingShopRedirection(null);
      },
    });
  };

  const handleDelete = (id: string) => () => {
    deleteCustomShopRedirection(id);
  };

  const handleOpenPopupPreviewDialog = () => {
    setOpenPopupPreviewDialog(true);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    const redirectionToEdit =
      shopRedirections[active.data.current.sortable.index];

    if (
      active.data.current.sortable.index !== over.data.current.sortable.index
    ) {
      updateCustomShopRedirection({
        id: redirectionToEdit.id,
        data: {
          ...redirectionToEdit,
          // idx start at 0 so we need to add one
          idx: over.data.current.sortable.index + 1,
        },
      });
    }
  };

  return (
    <div>
      <Typography className={classes.title}>
        {t('mobilePersonalization.externalShopRedirection.subtitle')}
      </Typography>
      <div className={classes.row}>
        <InfoIcon className={classes.info} />
        <div className={classes.helperText}>
          {t('mobilePersonalization.externalShopRedirection.helperText')}
        </div>
      </div>

      <Paper>
        <Table aria-labelledby="tableTitle">
          <TableHead>
            <TableRow>
              <TableCell className={classes.iconCell} />
              <TableCell className={classes.iconCell} colSpan={2}>
                {t('mobilePersonalization.externalShopRedirection.icon')}
              </TableCell>
              <TableCell colSpan={8}>
                {t('mobilePersonalization.externalShopRedirection.name')}
              </TableCell>
              <TableCell colSpan={20}>
                {t('mobilePersonalization.externalShopRedirection.link')}
              </TableCell>
              <TableCell className={classes.action}>
                {t('mobilePersonalization.externalShopRedirection.action')}
              </TableCell>
            </TableRow>
          </TableHead>
          {!loading && (
            <TableBody>
              <DndContext
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
                sensors={sensors}
              >
                <SortableContext
                  items={[...shopRedirections]}
                  strategy={verticalListSortingStrategy}
                >
                  {[...shopRedirections].map((link) => (
                    <SortableTableRow key={link.id} id={link.id}>
                      <TableCell className={classes.iconCell} colSpan={2}>
                        <div>
                          <MuiIcon icon={link.icon} />
                        </div>
                      </TableCell>
                      <TableCell colSpan={8}>{link.name}</TableCell>
                      <TableCell colSpan={20}>{link.url}</TableCell>
                      <TableCell className={classes.action}>
                        <IconButton
                          color="primary"
                          onClick={onClickEditShopRedirection(link)}
                          size="small"
                        >
                          <EditIcon />
                        </IconButton>

                        <DeleteWithConfirm
                          color="secondary"
                          onClick={handleDelete(link.id)}
                        />
                      </TableCell>
                    </SortableTableRow>
                  ))}
                </SortableContext>
              </DndContext>
            </TableBody>
          )}
        </Table>
        {loading && <LinearProgress />}
      </Paper>
      <div className={classes.spacedRow}>
        <div className={classes.row}>
          <Button
            className={classes.leftButton}
            color="primary"
            onClick={handleOpenShopRedirectionDialog}
            variant="outlined"
          >
            {t('mobilePersonalization.externalShopRedirection.add')}
          </Button>
        </div>
        <Button
          className={classes.row}
          color="primary"
          onClick={handleOpenPopupPreviewDialog}
          variant="outlined"
        >
          <VisibilityIcon className={classes.iconPreview} />
          {t('mobilePersonalization.externalShopRedirection.preview')}
        </Button>
      </div>

      {/* CREATE LINK DIALOG */}
      {openShopRedirectionDialog && (
        <MobileShopCustomShopRedirectionDialog
          key={editingShopRedirection?.id}
          open
          initial={editingShopRedirection}
          onClose={handleCloseShopRedirectionDialog}
          // @ts-expect-error
          onSubmit={handleSubmitShopRedirection}
        />
      )}
      {/* CREATE PREVIEW DIALOG */}
      {openPopupPreviewDialog && (
        <MobileShopPreview
          contractListCount={contractListCount}
          giftcardsCount={giftcardsCount}
          onClose={() => {
            setOpenPopupPreviewDialog(false);
          }}
          paymentComboListCount={paymentComboListCount}
          paymentPackListCount={paymentPackListCount}
          shopRedirections={shopRedirections}
          subshopList={subshopList}
          vodListCount={vodListCount}
        />
      )}
    </div>
  );
};

// @ts-expect-error
const SortableTableRow = (props) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: props.id });

  const classes = useStyles();

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    backgrondColor: 'white',
  };

  return (
    <TableRow ref={setNodeRef} style={style}>
      <TableCell className={classes.iconCell}>
        <IconButton {...listeners} {...attributes}>
          <DragHandleIcon />
        </IconButton>
      </TableCell>
      {props.children}
    </TableRow>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  title: {
    fontSize: 20,
    fontWeight: 500,
    marginBottom: theme.spacing(2),
  },
  helperText: {
    padding: theme.spacing(1),
    backgroundColor: theme.palette.grey[300],
    marginLeft: theme.spacing(1),
    borderRadius: 4,
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(2),
  },
  spacedRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: theme.spacing(2),
  },
  info: {
    fill: theme.palette.grey[500],
  },
  iconPreview: {
    fill: theme.palette.primary.main,
    marginRight: theme.spacing(2),
  },
  leftButton: {
    marginRight: theme.spacing(2),
  },
  iconCell: {
    width: 40,
  },
  action: {
    width: 100,
  },
}));

const DeleteWithConfirm = withConfirm(
  ({ onClick }: { onClick: () => void }) => (
    <IconButton onClick={onClick} size="small">
      <DeleteIcon />
    </IconButton>
  ),
  'onClick',
  {
    title:
      'settings:mobilePersonalization.externalShopRedirection.deleteModal.title',
    cancel:
      'settings:mobilePersonalization.externalShopRedirection.deleteModal.cancel',
    confirm:
      'settings:mobilePersonalization.externalShopRedirection.deleteModal.confirm',
    Content: ({ t }: { t: TFunction }) => (
      <p>
        {t(
          'settings:mobilePersonalization.externalShopRedirection.deleteModal.content',
        )}
      </p>
    ),
    isDeletion: true,
  },
);

export default MobileCustomShopRedirectionSettings;
