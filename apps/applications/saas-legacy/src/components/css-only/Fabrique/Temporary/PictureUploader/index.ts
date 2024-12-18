import React from 'react';

import PictureUploader from './PictureUploader.component';

import type { ActionType } from './type';

import { ActionTypeEnum } from './constants';

export type Props = React.ComponentProps<typeof PictureUploader>;
export { ActionTypeEnum };
export type { ActionType };
export default PictureUploader;
