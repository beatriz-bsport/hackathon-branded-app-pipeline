import React, { useState, useCallback, useMemo, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Select from 'react-select';
import classNames from 'classnames';
import isEqual from 'lodash/isEqual';
import omit from 'lodash/omit';

import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';

import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import type {
  ZoomMember,
  ZoomEstablishment,
  ZoomEstablishmentBulkEditData,
} from '#libs/zoom-app/types';
import type { Establishment } from '#libs/establishment/types';

const useStyles = makeStyles((theme) => ({
  row: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: theme.spacing(1),
  },
  marginRight: { marginRight: theme.spacing(1) },
  textSecondary: {
    color: theme.palette.text.secondary,
  },
  submitButton: {
    marginTop: theme.spacing(3),
  },
}));

type ZoomEstablishmentStateEntry = {
  id: string;
  establishment_id: number | null;
  zoom_user_id: string | null;
};

type EstablishmentSelectOption = {
  value: number;
  label: string;
};

type ZoomMemberSelectOption = {
  value: string;
  label: string;
};

type Props = {
  establishmentsById: Record<number, Establishment>;
  zoomMembersById: Record<string, ZoomMember>;
  zoomEstablishments: ZoomEstablishment[];
  zoomEstablishmentBulkEdit: (data: ZoomEstablishmentBulkEditData) => void;
  loading: boolean;
  disabled: boolean;
};

export const ZoomEstablishmentTable: React.FC<Props> = ({
  establishmentsById,
  zoomMembersById,
  zoomEstablishments,
  zoomEstablishmentBulkEdit,
  loading,
  disabled,
}) => {
  const classes = useStyles();
  const { t } = useTranslation('settings');

  const establishmentList = useMemo(
    () => Object.values(establishmentsById),
    [establishmentsById],
  );

  const zoomMemberList = useMemo(
    () => Object.values(zoomMembersById),
    [zoomMembersById],
  );

  const initialStateValue = useRef<ZoomEstablishmentStateEntry[]>();

  const [zoomEstablishmentState, setZoomEstablishmentState] = useState<
    ZoomEstablishmentStateEntry[]
  >(() => {
    const initialValue = zoomEstablishments.map((zoomEstablishment) => ({
      id: zoomEstablishment.id.toString(),
      establishment_id: zoomEstablishment.establishment,
      zoom_user_id: zoomEstablishment.zoom_user_id,
    }));
    initialStateValue.current = initialValue;
    return initialValue;
  });

  const wasUpdated = !isEqual(
    initialStateValue.current
      ?.filter((entry) => entry.establishment_id && entry.zoom_user_id)
      .map((entry) => omit(entry, ['id'])),
    zoomEstablishmentState
      .filter((entry) => entry.establishment_id && entry.zoom_user_id)
      .map((entry) => omit(entry, ['id'])),
  );

  const addNewZoomEstablishmentEntry = useCallback(() => {
    const newEntry: ZoomEstablishmentStateEntry = {
      id: uuidv4(),
      establishment_id: null,
      zoom_user_id: null,
    };
    setZoomEstablishmentState((prevState) => [...prevState, newEntry]);
  }, []);

  const getRemoveZoomEstablishmentEntryHandler = useCallback(
    (id: string) => () => {
      setZoomEstablishmentState((prevState) =>
        prevState.filter((entry) => entry.id !== id),
      );
    },
    [],
  );

  const [availableEstablishmentList, availableZoomUserList] = useMemo(() => {
    const alreadyPickedEstablishmentIds: number[] = [];
    const alreadyPickedZoomUserIds: string[] = [];

    zoomEstablishmentState.forEach((entry) => {
      entry.establishment_id &&
        alreadyPickedEstablishmentIds.push(entry.establishment_id);
      entry.zoom_user_id && alreadyPickedZoomUserIds.push(entry.zoom_user_id);
    });

    return [
      establishmentList.filter(
        (establishment) =>
          !alreadyPickedEstablishmentIds.includes(establishment.id),
      ),
      zoomMemberList.filter(
        (zoomMember) => !alreadyPickedZoomUserIds.includes(zoomMember.id),
      ),
    ];
  }, [establishmentList, zoomMemberList, zoomEstablishmentState]);

  const getEstablishmentSelectOptionsByValue = (
    currentEstablishmentId: number | null,
  ) => {
    return [
      {
        value: currentEstablishmentId,
        label: currentEstablishmentId
          ? establishmentsById[currentEstablishmentId]?.title
          : t('broadcast.zoom.establishmentTable.emptySelect'),
      },
      ...availableEstablishmentList.map((establishment) => ({
        value: establishment.id,
        label: establishment.title,
      })),
    ].reduce<Record<number, EstablishmentSelectOption>>(
      (acc, currentOption) => ({
        ...acc,
        [currentOption.value]: currentOption,
      }),
      {},
    );
  };

  const getZoomUserSelectOptionsByValue = (
    currentZoomUserId: string | null,
  ) => {
    return [
      {
        value: currentZoomUserId,
        label: currentZoomUserId
          ? zoomMembersById[currentZoomUserId]?.email
          : t('broadcast.zoom.establishmentTable.emptySelect'),
      },
      ...availableZoomUserList.map((zoomMember) => ({
        value: zoomMember.id,
        label: zoomMember.email,
      })),
    ].reduce<Record<string, ZoomMemberSelectOption>>(
      (acc, currentOption) => ({
        ...acc,
        [currentOption.value]: currentOption,
      }),
      {},
    );
  };

  const getEstablishmentChangeHandler = useCallback(
    (entryId: string) => (item: { value: number; label: string }) => {
      setZoomEstablishmentState((prevState) =>
        prevState.map((entry) =>
          entry.id === entryId
            ? { ...entry, establishment_id: item.value }
            : entry,
        ),
      );
    },
    [],
  );

  const getZoomUserChangeHandler = useCallback(
    (entryId: string) => (item: { value: string; label: string }) => {
      setZoomEstablishmentState((prevState) =>
        prevState.map((entry) =>
          entry.id === entryId ? { ...entry, zoom_user_id: item.value } : entry,
        ),
      );
    },
    [],
  );

  const submitZoomEstablishments = useCallback(() => {
    const cleanState = zoomEstablishmentState.filter(
      (entry) => entry.establishment_id && entry.zoom_user_id,
    );
    zoomEstablishmentBulkEdit({ zoom_establishments: cleanState });
  }, [zoomEstablishmentState, zoomEstablishmentBulkEdit]);

  return (
    <div>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              {t('broadcast.zoom.establishmentTable.headers.establishment')}
            </TableCell>
            <TableCell>
              {t('broadcast.zoom.establishmentTable.headers.user')}
            </TableCell>
            <TableCell>
              {t('broadcast.zoom.establishmentTable.headers.type')}
            </TableCell>
            <TableCell>
              <Button
                className={classes.row}
                color="primary"
                disabled={
                  disabled ||
                  availableEstablishmentList.length === 0 ||
                  availableZoomUserList.length === 0
                }
                onClick={addNewZoomEstablishmentEntry}
                variant="outlined"
              >
                <AddIcon className={classes.marginRight} />
                <div>{t('broadcast.zoom.establishmentTable.headers.add')}</div>
              </Button>
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {zoomEstablishmentState.map((entry) => {
            const establishmentSelectionOptionsByValue =
              getEstablishmentSelectOptionsByValue(entry.establishment_id);

            const zoomUserSelectOptionsByValue =
              getZoomUserSelectOptionsByValue(entry.zoom_user_id);

            return (
              <TableRow key={entry.id}>
                <TableCell>
                  <Select
                    hideSelectedOptions
                    isDisabled={disabled}
                    onChange={getEstablishmentChangeHandler(entry.id)}
                    options={Object.values(
                      establishmentSelectionOptionsByValue,
                    )}
                    value={
                      establishmentSelectionOptionsByValue[
                        entry.establishment_id
                      ]
                    }
                  />
                </TableCell>
                <TableCell>
                  <Select
                    hideSelectedOptions
                    isDisabled={disabled}
                    onChange={getZoomUserChangeHandler(entry.id)}
                    options={Object.values(zoomUserSelectOptionsByValue)}
                    value={zoomUserSelectOptionsByValue[entry.zoom_user_id]}
                  />
                </TableCell>
                <TableCell>
                  {entry.zoom_user_id && (
                    <span className={classes.textSecondary}>
                      {t(
                        `broadcast.zoom.memberType.${
                          zoomMembersById[entry.zoom_user_id].type
                        }`,
                      )}
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  <Button
                    className={classNames(classes.row, classes.textSecondary)}
                    disabled={disabled}
                    onClick={getRemoveZoomEstablishmentEntryHandler(entry.id)}
                    variant="outlined"
                  >
                    <DeleteIcon className={classes.marginRight} />
                    <div>
                      {t('broadcast.zoom.establishmentTable.removeAction')}
                    </div>
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <Button
        className={classes.submitButton}
        color="primary"
        disabled={disabled || loading || !wasUpdated}
        onClick={submitZoomEstablishments}
        variant="contained"
      >
        {t('broadcast.zoom.save')}
      </Button>
    </div>
  );
};

export default React.memo(ZoomEstablishmentTable);
