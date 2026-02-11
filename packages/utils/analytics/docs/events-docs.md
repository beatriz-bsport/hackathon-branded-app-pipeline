# Events List

---

## saas-legacy

### `add_to_cart`

**Description:** When the user adds a product to their cart

**Parameters:**
`product_type`: The type of product being added to the cart
`product_name`: The name of the product being added to the cart
`cart_value`: The total value of the cart after adding the product
`product_price`: The price of the product being added to the cart

### `appointment_slot_viewed`

**Description:** When the user views the appointment slot details

**Parameters:**
`activity_id`: The unique identifier for the appointment
`activity_name`: The name of the appointment

### `appointment_viewed`

**Description:** When the user views the appointment details

**Parameters:**
`activity_id`: The unique identifier for the appointment
`activity_name`: The name of the appointment

### `booking_cancelled`

**Description:** When the user successfully completes a booking cancellation

**Parameters:**
`offer_id`: The unique identifier for the session
`activity_id`: The unique identifier for the activity (group activity, workshop or appointment)
`activity_name`: The name of the activity (group activity, workshop or appointment)
`session_type`: The type of session being cancelled

### `booking_confirmed`

**Description:** When the user successfully completes a booking

**Parameters:**
`offer_id`: The unique identifier for the session
`activity_id`: The unique identifier for the activity (group activity, workshop or appointment)
`activity_name`: The name of the activity (group activity, workshop or appointment)
`session_type`: The type of session being booked

### `calendar_viewed`

**Description:** When the calendar page is displayed to the user

**Parameters:**

### `cart_viewed`

**Description:** When the user views their cart

**Parameters:**
`cart_value`: The total value of the cart when the user views it
`product_quantity`: The number of items in the cart when the user views it

### `group_activity_session_viewed`

**Description:** When the user views the group activity details

**Parameters:**
`activity_id`: The unique identifier for the group activity
`activity_name`: The name of the group activity
`offer_id`: The unique identifier for the session
`is_waiting_list`: Indicates if the session that the user is viewing is on the waiting list or not
`session_type`: The type of session being viewed

### `login`

**Description:** When the user logs in

**Parameters:**

### `login_viewed`

**Description:** When the login form is displayed to the user

**Parameters:**

### `member_profile_viewed`

**Description:** When the user views their member profile page

**Parameters:**
`page_type`: The type of member profile page being viewed

### `pass_selection_viewed`

**Description:** When the user views the pass selection for an appointment

**Parameters:**
`offer_id`: The unique identifier for the session
`activity_id`: The unique identifier for the appointment
`activity_name`: The name of the appointment
`session_type`: The type of session being booked

### `pass_selection_viewed`

**Description:** When the user views the pass selection for an offer (workshop or group activity)

**Parameters:**
`offer_id`: The unique identifier for the session
`activity_id`: The unique identifier for the group activity
`activity_name`: The name of the group activity
`is_waiting_list`: Indicates if the session that the user is viewing is on the waiting list or not
`session_type`: The type of session being booked

### `payment_viewed`

**Description:** When the user views the payment module

**Parameters:**
`offer_id`: The unique identifier for the session
`activity_id`: The unique identifier for the group activity
`activity_name`: The name of the group activity
`session_type`: The type of session being booked
`product_type`: The type of product being purchased. Can be a pass, a subscription or a pack

### `purchase_confirmation`

**Description:** When the user completes a purchase

**Parameters:**
`cart_value`: The total value of the cart at the time of purchase
`product_quantity`: The number of items in the cart at the time of purchase

### `purchase_item`

**Description:** When the user purchases an item. One event for each item in the cart

**Parameters:**
`product_name`: The name of the product being purchased
`product_type`: The type of product being purchased
`product_price`: The price of the product being purchased
`product_quantity`: The quantity of the product being purchased

### `reset_password_viewed`

**Description:** When the user lands on the reset password page

**Parameters:**

### `signup`

**Description:** When the user signs up

**Parameters:**

### `signup_viewed`

**Description:** When the signup form is displayed to the user

**Parameters:**

### `spot_scheduling_viewed`

**Description:** When the user views the spot scheduling

**Parameters:**
`offer_id`: The unique identifier for the session
`activity_id`: The unique identifier for the group activity
`activity_name`: The name of the group activity
