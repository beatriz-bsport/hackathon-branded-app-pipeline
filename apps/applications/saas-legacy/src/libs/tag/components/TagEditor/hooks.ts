import React from 'react';

type CreateHandlerOptions = {
  setCreateMode: HandlerBooleanAction;
  onCreate: HandlerDataAction;
};

type EditHandlerOptions = {
  setEditMode: HandlerBooleanAction;
};
type HandlerBooleanAction = (bool: boolean) => void;
type HandlerDataAction = ({ name }: CreateTagData) => void;
type CreateTagData = { name: string };

export const useCreateHandler = ({
  setCreateMode,
  onCreate,
}: CreateHandlerOptions) => {
  const handleToggleCreate = React.useCallback(
    () => setCreateMode(true),
    [setCreateMode],
  );

  const handleOnCancel = React.useCallback(
    () => setCreateMode(false),
    [setCreateMode],
  );

  const handleCreateTag = React.useCallback(
    (data: CreateTagData) => {
      onCreate(data);
      setCreateMode(false);
    },
    [onCreate, setCreateMode],
  );

  return [handleCreateTag, handleToggleCreate, handleOnCancel];
};

export const useEditHandler = ({ setEditMode }: EditHandlerOptions) => {
  const handleEditTag = React.useCallback(
    () => setEditMode(true),
    [setEditMode],
  );

  const handleTagGroupFormClose = React.useCallback(
    () => setEditMode(false),
    [setEditMode],
  );

  return [handleEditTag, handleTagGroupFormClose];
};
