bsport-saas is the core of our frontend. It is both our manager interface (so-called backoffice) the pages where the customers book, explore the calendar, pay (called marketplace), and the user/coach userspace (profile page).

It is completed by bsport-mobile which is the repo of our mobile app, and bsport-widget which basically import a lot of stuff from bsport-saas (the marketplace part) and bundle this code to make a reusable widget that can be implemented on our clients websites.

# INSTALLATION

First install the dependencies :

```sh
yarn # shortcut to yarn install
```

You can now run the frontend cf next section

## Running with a local backend server

To bootstrap the local backend, follow instructions in the README of https://gitlab.com/bsport/bsport-django

When you are ready you can start with :

```sh
yarn start
```

## Running with the staging backend

```sh
yarn start-staging
```

Under the hood what it does is basically :

```sh
yarn start
cp envs/staging public/env.js
```

# GENERATE TRANSLATIONS

When developping with frontend you will often create new string that must be translated with react-i18next (the `t(...)` function)

Add your key (argument of `t`) in the right i18n/af/ file (file ~ t namespace, see the doc of react-i18next for more info of what is a namespace).

You now want to update the translation of other language (dont worry you dont have to translate it) with :

```sh
yarn updateTranslation
```

It will add uncommited changes to some "built" files

# Use the backoffice

## LOGIN

You can use the following user

```sh
username: contact@classdiggers.com
password: demo
```

Dont forget you can pick any user and change his password locally with the `shell` container.

# Developing with bsport-saas

## Tooling

You probably want to have two chrome/firefox extensions installed :

- redux devtool : adds a new panel to introspect the redux store and actions
- react devtool : adds a new panel to introspect react component instead of hjust raw HTML in the console, there you can notably see the props of a component

## Code Structure

There basically 3 main folders

### pages/

You will find here all the routing and the page

A page is something at the "root" level that is correlated to a specific URL, a router is basically a "switch" component which, based on the URL, will chose to display one page or another one.

The pages are the only component allowed to dispatch redux actions, and allowed to connect to the redux store to get there some data. ** This is important, dont forget!**

Each folder here is, more or less, a root url. There are a few "master-router-page" :

- `coach-userspace/` : the interface for the teachers
- `checkout/` all the payment/booking page (final customer, the members)
- `rn-webview/` some special pages to handle the payment of the bsport-mobile app
- `franchise/` all the pages of the franchise interface
- `marketplace/` the only page, except login, accessible without (and with) being logged-in, they are the public pages of the company (the studios, our clients). There you can buy stuff and book sessions.
- `login/` where you default to, if logged-off (except on marketplace)
- `consumer/` where the final-user (member) have their interface (history of booking, invoices...)
- `check-in/` a special interface for tablet check-in (see product doc). Some studio have a tablet at the entrydoor where user can check-in or register, this is the code.

All other folders have router/page imported by the main interface : the Backoffice (`pages/Backoffice.component.js`)

### components/

The "dumbest components", that does not mean there are the simplest ones code-wise, but that they have no business logic (e.g: a booking is "business-logic" but a button or a table has not). You can think of them as our UI-library.

### libs/

These folders follow globally the same structure :

- `components/` : a folder with the base components, as "dumb" as possible. E.g : an item displayed in a list
- `actions.ts` the redux actions
- `reducers.ts` the redux reducer, stuff that handle the action result and possibly mutate the redux store
- `selectors.ts` the redux getter function that extract (maybe transform) the data from the redux store
- `api.ts` the api call function that interacts directly with the backend. **In general you will use them in actions.ts and not bare-handed!**

## Tests

The tests are if not the most important tool for continous integration and continous developoment it give the security that the software is behaving properly at any time and new development doesn't create regression or unwanted behavior. That's why the test are run by the ci on each merge request and new one should be added in all merge request

> “More than the act of testing, the act of designing tests is one of the best bug preventers known. The thinking that must be done to create a useful test can discover and eliminate bugs before they are coded – indeed, test-design thinking can discover and eliminate bugs at every stage in the creation of software, from conception to specification, to design, coding and the rest.” – Boris Beizer

### There are 4 existing types of test:

### - Unit testing:

**definition**: type of software testing where individual units or components of a software are tested. To put it shortly we are testing if the functions are behaving consistently in sucess and fail cases for a suite of params

example: `util.test.ts`

```ts
import {
  myFirstFunction,
  mySecondFunction,
} from '../utils';

// "Describe" is the function to tell that it represent a suite of test
describe('Utils: MyFirstFunction', () => {
  // "it" describe a single test
  it('Check if the function send true on empty', () => {
    const result = myFirstFunction()

    expect(result).toBe(true);
  })

  // another test in the suite
  it('Check if the function send false on string param', () => {
    const result = myFirstFunction("toto")

    expect(result).toBe(false);
  })
});

// A file
describe('Utils: MySecondFunction', () => {
  // "it" describe a single test
  it('Check if the function send array on empty', () => {
    const results = myFirstFunction()

    // We have multiple test available
    // to see the complete list: https://jestjs.io/fr/docs/expect
    expect(results).toBeGreaterThan(1);

    // We can have multiple check on one test
    // if one failed test will failed
    expect(results[0]).toBe(42);
});
```

### - Rendering test:

**definition**: type of software testing where we compare the visual output of the software view

We are not currently using it but a draft to implement it with storybook is present in the file `initStore.test.ts` and need some tweaking to function properly

### - Integration testing

**definition**: type of software testing where individual software modules are combined and tested as a group. Integration testing is conducted to evaluate the compliance of a system or component with specified functional requirements. To put it shortly when we are testing that the interaction from semi-complex component are interacting well between them

example: `FuzzySearch.test.tsx`

```ts
// Here mandatory for jsx element we tell jest to require a dom
/**
 * @jest-environment jsdom
 */
import React from 'react';
import { fireEvent, render, act } from '@testing-library/react';

import FuzzySearch from '../search/FuzzySearch.component';

// Fuze search is base on delay text field we mock it to use it in a syncrhonous way
jest.mock('../DelayedTextField.component.tsx');

const items = [
  { label: 'First', id: 1 },
  { label: 'Second', id: 2 },
  { label: 'Third', id: 3 },
];

describe('FuzeSearch: <FuzeSearch />', () => {
  let component: any;
  // We mock the function with jest.fn as it will be usefull later to have test on it
  const itemRenderer = jest.fn(
    ({ label, id }: { label: any; id: number }, search: string) => (
      <div data-testid="row-fuze" key={id}>{`${label} / ${search}`}</div>
    ),
  );

  // This function will be called before each test
  beforeEach(() => {
    // The act function let us ensure that the componet have been rerendercontinuing
    act(() => {
      component = render(
        <FuzzySearch
          placeholder="Search"
          items={items}
          searchFields={['label']}
          itemRenderer={itemRenderer}
        />,
      );
    });
  });

  it('on input change the value', () => {
    // We get the dom element by a testing id set by the property data-testid added in the jsx
    const input = component.getByTestId('input-fuze-search');
    // Create a Dom event here typing in the field
    fireEvent.change(input, { target: { value: 'First' } });

    expect(input.value).toBe('First');
  });

  it('check if the item renderer is not call to many time', () => {
    const input = component.getByTestId('input-fuze-search');

    act(() => {
      fireEvent.change(input, { target: { value: 's' } });
    });

    // Here we take the mocked jest function and verify we are not overcalling it
    expect(itemRenderer).toHaveBeenCalledTimes(2);
  });

  it('on input display a similar results', () => {
    const input = component.getByTestId('input-fuze-search');

    act(() => {
      fireEvent.change(input, { target: { value: 'First' } });
    });

    const results = component.getAllByTestId('row-fuze');

    expect(results.length).toBe(1);
  });
});
```

#### - End to end testing

**definition**: End-to-end testing is a technique that tests the entire software product from beginning to end to ensure the application flow behaves as expected. To put it shortly we test if the all website is behaving like expected for a flow

Currently we are not implementing end to end testing for the moment

## Tracking Event

All the forms and the pages are tracked. When a new form is implemented it is necessary to add the event trackers. To track events we are using rudderstack, see the documentation for the <a href="https://www.rudderstack.com/docs/sources/event-streams/sdks/rudderstack-javascript-sdk/">JS SDK</a>.

### Events to track for a Form

The 4 events that are tracked when dealing with forms are :

- **add** when a user want to add _or_ edit a form => add or edit button
- **cancel** when a user cancel the creation of a form => cancel or cross button
- **submitIntent** when a user click on the 'save' button (but it's useless if the 'save' button is block when the the user fill not correclty, for exemple if the user forgot to fill a field and the button save is blocked) => save button
- **submitSuccess** when a user successfully submit a form => after the event **onSuccess**

### Implementation

To track these events, 4 functions have been created in the files _.../src/components/analytics/utils_. The generic shape of these functions are :

```js
function trackEvent(id, additional_data) => void
```

The first argument _id_ is the id of the object you are tracking (for exemple if the user wants to edit a form related to a member, _id_ will be the id of the member), it can be empty if the object is not created yet. The second argument _additional_data_ is any data you think is important.

To initialize the use of tracking functions you first need to add a constant name in the file _src/components/analytics/segment/constants_. Then at the top of a component file that contains a form, enter the following code :

```js
import { rudderStackFormTrackingFunctionsRegistry } from '#src/components/analytics/rudderstack/utils';
import { SegmentAnalyticsFormObjectIdentifier } from '#src/components/analytics/segment';

const {
  trackFormAdd,
  trackFormSubmitIntent,
  trackFormSuccess,
  trackFormCancel,
} = rudderStackFormTrackingFunctionsRegistry(
  SegmentAnalyticsFormObjectIdentifier.Exemple,
);
```

### Example

See the exemple for the integration of the tracking functions :

```js
import { rudderStackFormTrackingFunctionsRegistry } from '#src/components/analytics/rudderstack/utils';
import { SegmentAnalyticsFormObjectIdentifier } from '#src/components/analytics/segment';

const { trackFormAdd, trackFormSubmitIntent, trackFormSuccess, trackFormCancel } =
  rudderStackFormTrackingFunctionsRegistry(
    SegmentAnalyticsFormObjectIdentifier.Example,
  );

type Props = yourProps;

const handleSubmit = () => {
  ...
  onSuccess: () => trackFormSuccess(object?.id);
}

export const ExampleForm = (props: Props) => {
  yourConst;
  React.useEffect(() => trackFormAdd(object?.id), []);
  return (
    THE_FORM ...
    <Actions>
      <Button
        onClick={() => {
          trackFormCancel(object?.id);
          closeFunction()
        }}
      >
      {t('form.actions.cancel')}
      <Button
        onClick={() => {
          trackFormSubmitIntent(object?.id);
          handleSubmit()
        }}

      >
    </Actions>
  )
}
```

## CREATE NEW ALIAS

Aliases are a cool way to simplify the imports e.g `#src/libs/` instead of `../../libs/`

To create a new alias you need to add them at multiple places

### .babelrc

```
  "alias": {
    ...
    "#newAlias": "PATH TO NEW ALIAS FROM THE BABELRC FILE",
  }
```

### .eslintrc

```
  "alias": {
    ...
    "#newAlias": "PATH TO NEW ALIAS FROM THE ESLINTRC FILE",
  }
```

### .tsconfig.json

```
  "paths": {
    ...
    "#newAlias/*": ["PATH TO NEW ALIAS FROM THE TSCONFIG FILE"/*],
  }
```

### config/webpack.config.dev.js and config/webpack.config.js


the alias need to respect some convention use a # as a prefix to make it clear it's not a path and can't have a / inside to avoid resolving problems

> :warning: **Don t break the widget**: Until better bundling for the widget we also need to add the alias configuration in the widget's webpack otherwise it will break the build

## Access the react app running locally on another device

1. Install ngrok: [https://ngrok.com/download](https://ngrok.com/download)
2. Expose your port 8000 where your api runs with ngrok: `ngrok http 8000`.

   ```
   $ ngrok http 8000

   Session Status                online
   Account                       Sofian Medbouhi (Plan: Pro)
   Version                       3.1.1
   Region                        Europe (eu)
   Latency                       44ms
   Web Interface                 http://127.0.0.1:4041
   Forwarding                    https://354ff7984fcc.eu.ngrok.io -> http://localhost:8000

   Connections                   ttl     opn     rt1     rt5     p50     p90
                                 164     2       0.05    0.13    1.91    22.56
   ```

   In this example, your django application running locally on port 8000 is accessible through the internet via `https://354ff7984fcc.eu.ngrok.io`

3. Open the `envs/local` file and update the following values:

   ```
   env.REACT_APP_BASE_URI = '<your_ngrok_url>';
   env.REACT_APP_API_URI = '<your_ngrok_url>/api-v0';
   ```

4. You will also need an IP address to navigate to the backoffice and load the react app. There are two possible ways to do so:
   a. If you have the pro version of ngrok (you’ll need to provide an auth token), you can run `ngrok http 3000`to expose your port 3000, and get an url.
   b. Otherwise, you can just use the local network. To do so you will need your current IP address:

   ```
   $ ip a s

   1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN group default qlen 1000
       link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
       inet 127.0.0.1/8 scope host lo
         valid_lft forever preferred_lft forever
       inet6 ::1/128 scope host
         valid_lft forever preferred_lft forever
   2: wlp0s20f3: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc noqueue state UP group default qlen 1000
       link/ether 58:6c:25:13:4f:a7 brd ff:ff:ff:ff:ff:ff
       inet 192.168.1.49/24 brd 192.168.1.255 scope global dynamic noprefixroute wlp0s20f3
         valid_lft 40675sec preferred_lft 40675sec
       inet6 fe80::3d9:aa8b:61cd:507f/64 scope link noprefixroute
         valid_lft forever preferred_lft forever
   ```

   `ip a s` is short for `ip address show`.

   In this example, the IP address is `192.168.0.129`and your url will be `http://192.168.0.129:3000`.

   **NB: your phone needs to be connected to the SAME network than your host machine.**

5. In `envs/local`, update the following value with the url of the previous step:

   ```
   env.I18N_TRANSLATION_DOMAIN = '<step_4_url>';
   ```

6. Restart yarn, and navigate to step 4 url on your device. You’re all set !
