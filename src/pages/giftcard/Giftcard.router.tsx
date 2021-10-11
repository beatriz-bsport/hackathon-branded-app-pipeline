import React from 'react';

import { Route, Switch } from 'react-router';
import asyncComponent from '../../AsyncComponent';

const GiftcardDetail = asyncComponent(() => import('./GiftcardDetail.page'));
const GiftcardList = asyncComponent(() => import('./GiftcardList.page'));

export const GiftcardRouter = () => {
  return (
    <Switch>
      <Route exact path="/giftcard/:id/" component={GiftcardDetail} />
      <Route exact path="/giftcard/" component={GiftcardList} />
    </Switch>
  );
};

export default GiftcardRouter;
