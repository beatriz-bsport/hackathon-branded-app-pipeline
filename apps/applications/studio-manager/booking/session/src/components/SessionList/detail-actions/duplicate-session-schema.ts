import {
  useDateTimeSchemaObject,
  useRefineDateTimeSchema,
} from "#src/components/SessionForm/schemas";

export const useDuplicateSessionSchema = () => {
  const duplicateSessionSchemaObject = useDateTimeSchemaObject();
  return useRefineDateTimeSchema(duplicateSessionSchemaObject);
};
