# CSS only component

## Rules

This library must contain components respecting the following rules:

### 1 - Styles

#### 1.a - CSS

- :x: No material-ui or any other css frameworks.
- :heavy_check_mark: Custom css (.css or .saas)

### 2 - Naming & Logic

#### 2.a - Files and folders naming

- Files or folders naming should ***NOT*** be inherent to "bsport business objects".
- Files or folders naming should ***NOT*** contain things such as "CssOnly", "Marketplace" since it would be unrelevant (components must be usable anywhere) and redundant (components already in ./src/components/css-only)

##### In Practice

:x: DO NOT

```ts
[FILE_NAME] : MarketPlaceCssOnlyPaymentPackListItem.component.tsx
```

:heavy_check_mark: DO

```ts
[FILE_NAME] : ListItem.component.tsx
```

#### 2.b - Components props

- At no point components naming or props should be inherent to "bsport business objects".

##### In Practice

:x: DO NOT

```ts

type PaymentPackListItemComponentProps = {
    paymentPackPrimary : string;
    paymentPackSecondary?: string;
}

```

:heavy_check_mark: DO

```ts
type Props = {
    primary: string;
    secondary?: string;
}
```

#### 3 - Usage

##### 3.a - Import

We use index.ts files to gather all components, types, properties from a module and export them. 
This is the structure of our index.ts. Let's take a component named "ListItem" as an example.

##### In Practice

```ts
/* index.ts*/

import ListItem, { Props } from './ListItem.component';

export { Props };
export default ListItem;

```

Sometimes, we need to separate the typing of our components and/or component's props. 
In that case, we would need to define our types in a type.ts and import/export it in our index.ts. 
:warning: Don't forget, the naming should not be inherent to "bsport business objects" :warning: 

:heavy_check_mark: DO

```ts
/* index.ts*/

import ListItem, { Props } from './ListItem.component';
import { Color, Size, Alignment } from './types.ts';


export { Props };
export default ListItem;

```

:x: DO NOT
```ts
/* index.ts*/

import ListItem, { Props } from './ListItem.component';
import { ListItemColorType, ListItemSizeType, ListItemAlignmentType } from './types.ts';


export { Props };
export default ListItem;

```

Importing a css-only component must be done using the alias #csscomponents

---
:heavy_check_mark: DO

```ts
/* fileWhereCssComponentIsNeeded.tsx*/

import ListItem from '#csscomponents/ListItem';

```

:x: DO NOT

```ts
/* fileWhereCssComponentIsNeeded.tsx*/

import ListItem from '../../../../../css-only/ListItem/ListItem.component';

```