# ExpressPassCheckout

## Overview

`ExpressPassCheckout` provides a streamlined checkout flow for purchasing passes (Payment Packs and Private Passes) without requiring users to go through the traditional authentication process. It implements a "one-click checkout" experience with light signup functionality.

## Component Location

```
/apps/applications/saas-legacy/src/pages/checkout/express-checkouts/pass/ExpressPassCheckout.page.tsx
```

## How Users Access This Page

### Routing Configuration

The ExpressPassCheckout page can be accessed through multiple routing mechanisms:

#### 1. Direct Route

```javascript
// BoutiqueFlow.router.tsx
<Route
  component={ExpressPassCheckout}
  path="/pass-express-checkout/:companyId/:passId/:passType"
/>
```

**URL Pattern**: `/pass-express-checkout/:companyId/:passId/:passType`

#### 2. Conditional Redirect from Pre-checkout Pages

Users are automatically redirected from traditional pre-checkout pages when specific conditions are met:

```javascript
// Checkout.router.js - Lines 150-155, 165-170
{
  path: '/(|customer/)checkout/:companyId/pre-checkout/payment-pack/:id',
  component: PaymentPackPreCheckout,
  redirectTo: this.getExpressCheckoutRedirect(PassTypes.PAYMENTPACK),
},
{
  path: '/(|customer/)checkout/:companyId/pre-checkout/private-pass/:id',
  component: PrivatePassPreCheckout,
  redirectTo: this.getExpressCheckoutRedirect(PassTypes.PRIVATEPASS),
}
```

**Redirect Conditions** (from `getExpressCheckoutRedirect`):

```javascript
const shouldRedirect =
  this.props.theme.one_click_checkout_enabled &&
  !this.props.theme.requires_email_confirmation_when_signing_up;
```

### Authentication Switch Logic

The component implements sophisticated authentication handling:

#### Authenticated Users

- **Condition**: `authenticated === true`
- **Behavior**: Redirected to traditional pre-checkout page
- **URL**: `/checkout/:companyId/pre-checkout/payment-pack/:passId` or `/checkout/:companyId/pre-checkout/private-pass/:passId`

#### Restricted Passes

- **Condition**: Pass has whitelist/blacklist tags
- **Behavior**: Redirected to login page with return URL
- **Implementation**:

```typescript
if (
  !!passCardData?.paymentPackData?.paymentPack?.whitelist_tags?.length ||
  !!passCardData?.paymentPackData?.paymentPack?.blacklist_tags?.length
) {
  return <Redirect to={loginToPaymentPackUrl} />;
}
```

#### Non-authenticated Users

- **Condition**: `authenticated === false` and no restrictions
- **Behavior**: Shows ExpressPassCheckout interface

## Component Architecture

### Main Components

#### 1. ExpressPassCheckout (Main Component)

- **Purpose**: Router-level component that provides context
- **Key Features**:
  - Wraps content in `PassCardDataProvider`
  - Connects to Redux store
  - Applies multiple HOCs

#### 2. ExpressPassCheckoutContent (Content Component)

- **Purpose**: Contains the main checkout logic and UI
- **Key Features**:
  - Manages checkout flow
  - Handles payment processing
  - Manages user registration

### Context System

#### PassCardDataProvider

```typescript
type PassCardDataContextType = {
  passCardData: PassCardData | null;
  setPassCardData: (data: PassCardData) => void;
  clearPassCardData: () => void;
  passId: number;
  passType: PassTypes;
  companyId: number;
};
```

**Purpose**: Provides pass-specific data throughout the component tree

### Key Hooks

#### 1. usePassCard

- **Purpose**: Renders appropriate pass card component based on pass type
- **Returns**: `{ PassCard, hasData }`
- **Implementation**: Switches between `PaymentPackCard` and `PrivatePassCard`

#### 2. useBasket

- **Purpose**: Manages shopping basket operations
- **Key Functions**:
  - `addItemToBasketAndFetch`: Adds pass to basket
  - `validateBasket`: Validates basket before checkout
  - `currentBasket`: Current basket state

#### 3. useLightSignUpOperations

- **Purpose**: Handles user registration without full authentication
- **Features**:
  - Debounced registration for paid passes
  - Immediate registration for free passes
  - Integration with basket creation

#### 4. useCheckPassValidity

- **Purpose**: Validates pass availability and purchasability
- **Returns**: `{ isValid, errorCode }`

#### 5. useNavigation

- **Purpose**: Provides navigation utilities
- **Key Function**: `goToPassesPage`: Returns to passes listing

#### 6. useRedirectOnSuccess

- **Purpose**: Handles post-purchase redirection
- **Features**: Cleans local storage and redirects to confirmation page

### Payment Flow

#### Free Passes

1. User fills light signup form
2. Immediate registration triggered -> a user and a member are created
3. Pass validity checked
4. Basket created and validated (validate unpaid)
5. Automatic redirect to confirmation page, the newly created member is logged in

#### Paid Passes

1. User fills light signup form (debounced registration) -> a user and a member are created, the memberId and the token are saved in the local storage
2. Pass validity checked
3. Basket created
4. Payment component rendered
5. Payment processing
6. Redirect to confirmation on success

### Payment Integration

#### Online Payment Component

```typescript
<OnlinePaymentBasket
  ref={paymentRef}
  hideConfirmPaymentButton
  basketId={currentBasket.id}
  companyId={companyId}
  onConfirmPaymentSuccess={redirectOnSuccess()}
  payerContext={{
    memberId: Number(memberId),
    termsAndConditionsAccepted: lightSignupValues.acceptTermsAndConditions,
  }}
  stripePaymentElementConfig={{
    isDefaultForRegion: companyTheme.is_default_for_region,
    stripeId: companyTheme.stripe_id,
  }}
/>
```

#### Payment Buttons Component

```typescript
<PaymentButtons
  enforceDisabled={isBookButtonDisable}
  label={t('checkout:passExpressCheckout.payNow')}
  paymentBasketRef={paymentRef}
  paymentContext={{
    basketId: currentBasket?.id ?? '',
    companyId,
    memberId: Number(memberId),
  }}
  submitButtons={{
    PAYPAL_BUTTON: SUBMIT_BUTTONS.PAYPAL_BUTTON,
    PAY_NOW_BUTTON: SUBMIT_BUTTONS.PAY_NOW_BUTTON,
  }}
/>
```

### Error Handling

#### Pass Validity Errors

- **Component**: `ErrorMessage`
- **Trigger**: Invalid pass or basket errors
- **Features**: Displays specific error codes and provides navigation back

#### Payment Status Checking

- **Component**: `CheckPaymentStatus`
- **Purpose**: Handles payment intent verification (for payment methods that imply redirection, like iDeal for example)
- **Triggers**: Query parameters `check_payment_intent` or `payment_intent`

#### Redirect Failures

- **Detection**: `hasRedirectionFailed(queryParams)`
- **Handling**: Shows snackbar error message
- **Types**: PayPal errors, basket inconsistencies

### Query Parameters

The component handles multiple query parameters for different scenarios:

```typescript
queryParams: {
  check_payment_intent?: CheckPaymentIntent;
  payment_intent?: string;
  user_registration_response?: string;
  redirect_status?: RedirectStatus;
  get_user_registration_from_storage?: string;
  basket_redirection?: string;
  paypalError?: string;
}
```

### Storage Integration

#### Local Storage Keys

- `STORAGE_KEY_LIGHT_SIGNUP_MEMBER_ID`: Stores member ID after light signup

### Responsive Design

#### Mobile Layout

- Single column layout
- Mobile-specific navigation elements
- Stacked form and payment sections

#### Desktop Layout (> 950px)

- Two-column layout (40% pass details, 60% form)
- Side-by-side form sections
- Desktop-specific "Already a member?" section

### HOC Chain

The component is wrapped with multiple Higher-Order Components:

```typescript
export default compose<any, Props>(
  routerParamsToProps({
    companyId: 'companyId:number',
    passId: 'passId:number',
    passType: 'passType:string',
  }),
  withQueryParams([...]),
  connector, // Redux connection
  marketplaceCssHoc(),
  WithCustomCssProvider,
  consumerAppBarHOC(),
  lightSignupFormWrapper,
)(ExpressPassCheckout);
```
