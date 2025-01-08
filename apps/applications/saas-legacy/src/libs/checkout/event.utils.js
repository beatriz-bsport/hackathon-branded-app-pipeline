// @flow

import React from 'react';

import { BASKET_EVENTS } from '@bsport/common/master-data/events.js';

import PauseIcon from '@material-ui/icons/Pause';
import ExposureNeg1Icon from '@material-ui/icons/ExposureNeg1';
import ExposurePlus1Icon from '@material-ui/icons/ExposurePlus1';
import CheckIcon from '@material-ui/icons/Check';
import AddIcon from '@material-ui/icons/Add';

const getPrimaryText = (event, t) => t(`checkout:events.${event.event_type}`);

export const COMPANY_EVENTS = {
  [BASKET_EVENTS.created]: {
    icon: <AddIcon />,
    getPrimaryText,
    i18nText: `checkout:events.${BASKET_EVENTS.created}`,
  },
  [BASKET_EVENTS.finalize]: {
    icon: <CheckIcon color="primary" />,
    getPrimaryText,
    i18nText: `checkout:events.${BASKET_EVENTS.finalize}`,
  },
  [BASKET_EVENTS.additem]: {
    icon: <ExposurePlus1Icon color="primary" />,
    titlePrefix: (event) => ` ${event.data.item} - `,
    getPrimaryText,
    i18nText: `checkout:events.${BASKET_EVENTS.additem}`,
  },
  [BASKET_EVENTS.removeitem]: {
    icon: <ExposureNeg1Icon color="error" />,
    titlePrefix: (event) => ` ${event.data.item} - `,
    getPrimaryText,
    i18nText: `checkout:events.${BASKET_EVENTS.removeitem}`,
  },
  [BASKET_EVENTS.automaticclean]: {
    icon: <PauseIcon />,
    getPrimaryText,
    i18nText: `checkout:events.${BASKET_EVENTS.automaticclean}`,
  },
};
