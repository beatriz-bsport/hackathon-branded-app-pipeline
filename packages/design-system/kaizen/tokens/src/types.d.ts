import type { OutputTypes, SourceTypes } from "#src/enums";

type Converter = {
  /**
   * Type of source to convert (located in SourceTypes in #src/enums)
   */
  sourceType: SourceTypes;

  /**
   * Absolute folder path where to watch for exports.
   */
  sourceFolder: string;

  /**
   * Absolute folder path where the output will be printed.
   */
  targetFolder: string;

  /**
   * Function reading the export files and converting them int the right output type.
   */
  convertToTokens: (outputType: OutputTypes) => Promise<void> | void;
};
