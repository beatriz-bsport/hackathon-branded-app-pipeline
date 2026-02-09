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

### `barcode_scan_success`

**Description:** When a barcode scan successfully identifies a member during tablet check-in

**Parameters:**
`member_id`: The unique identifier of the member found via barcode scan
`barcode`: The scanned barcode value

### `barcode_scan_toggled`

**Description:** When a user toggles the barcode scanner on/off during tablet check-in

**Parameters:**

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

### `next_session_clicked`

**Description:** When the user clicks on a next session from the session management page

**Parameters:**
`session_type`: The type of session being viewed
`is_grouped_session`: Indicates if the session being viewed is a grouped session or not
`meta_activity_id`: The unique identifier for the meta_activity
`offer_id`: The unique identifier for the session

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

### `previous_session_clicked`

**Description:** When the user clicks on a previous session from the session management page

**Parameters:**
`session_type`: The type of session being viewed
`is_grouped_session`: Indicates if the session being viewed is a grouped session or not
`meta_activity_id`: The unique identifier for the meta activity
`offer_id`: The unique identifier for the session

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

### `tablet_check_in_checkin_button_clicked`

**Description:** When the user clicks on the check-in button from the session management page

**Parameters:**
`offer_id`: The unique identifier for the session

### `tablet_check_in_session_clicked`

**Description:** When the user clicks on a session from the session management page

**Parameters:**
`nb_attendants`: The number of attendants to check in
`nb_bookings`: The number of bookings for the session
`nb_non_attendants`: The number of non-attendants for the session
`offer_id`: The unique identifier for the session

### `tablet_check_in_sign_up_started`

**Description:** When a user starts the sign-up process during tablet check-in by clicking the Create Member button

**Parameters:**

---

## sm-session

### `session_creation_activity_selected`

**Description:** When the user selects an activity in the session creation flow

**Parameters:**
`search_value`: The search query used to find the activity
`activity_type`: The type of activity selected
`activity_id`: The id of the activity selected
`activity_name`: The name of the activity selected

### `session_creation_back_clicked`

**Description:** When the user clicks on the ‘Back’ button in the session creation flow

**Parameters:**
`current_step`: The step from which the user clicks back.

### `session_creation_close_button_clicked`

**Description:** When the user clicks on the close button in the session creation flow

**Parameters:**
`current_step`: The step from which the user clicks back.

### `session_creation_create_session_button_clicked`

**Description:** When the user clicks on the button to create the session in the session creation flow

**Parameters:**
`session_is_recurrent`: Whether the session being created is recurrent
`session_recurrence_end_date`: The end date of the session recurrence, null if the session is not recurrent

### `session_creation_customize_name_toggle_enabled`

**Description:** When the user toggles the option to customize the session name in the session creation flow

**Parameters:**
`customize_name_toggle_enabled`: Whether the user enables the toggle to customize session name

### `session_creation_next_clicked`

**Description:** When the user clicks on the ‘Next’ button in the session creation flow

**Parameters:**
`current_step`: The step from which the user clicks next.

### `session_creation_opens`

**Description:** When the clicks on ‘Add a session’ button

**Parameters:**

### `session_creation_recurrence_interval_select`

**Description:** When the user selects a recurrence interval for the session in the session creation flow

**Parameters:**
`session_recurrence_interval_selected`: The recurrence interval selected for the session when the session is recurrent

### `session_creation_recurrence_rule_selected`

**Description:** When the user selects a specific recurrence rule for the session in the session creation flow

**Parameters:**
`session_recurrence_rule`: The specific recurrence rule selected by the user, e.g. every Monday and Wednesday, every 2 weeks on Tuesday, etc.

### `session_creation_recurrence_toggle_enabled`

**Description:** When the user toggles the option to make the session recurrent in the session creation flow

**Parameters:**
`session_is_recurrent`: Whether the session being created is recurrent

### `session_creation_visibility_select`

**Description:** When the user selects a visibility option for the session in the session creation flow

**Parameters:**
`session_visibility`: The visibility option selected for the session
