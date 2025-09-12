import React from "react";

type PackAddItemsListProps = {
  fieldIdPrefix: string;
};

export const PackAddItemsList: React.FC<PackAddItemsListProps> = ({
  fieldIdPrefix,
}) => {
  return <div id={`${fieldIdPrefix}-items`}>Put the list</div>;
};
