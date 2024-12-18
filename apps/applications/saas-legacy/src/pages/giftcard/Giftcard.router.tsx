import React from 'react';

import { Route, Switch } from 'react-router';
// @ts-expect-error
import asyncComponent from '../../AsyncComponent';

const GiftcardDetail = asyncComponent(() => import('./GiftcardDetail.page'));
const GiftcardList = asyncComponent(() => import('./GiftcardList.page'));

export const GiftcardRouter = () => {
  return (
    <Switch>
      <Route exact component={GiftcardDetail} path="/giftcard/:id/" />
      <Route exact component={GiftcardList} path="/giftcard/" />
    </Switch>
  );
};

export default GiftcardRouter;
