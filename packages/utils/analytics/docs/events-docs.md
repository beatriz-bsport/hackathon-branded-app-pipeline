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

## sm-navigation-sidebar

### `checkout_flow_add_footnote_button_clicked`

**Description:** When the user clicks to add a footnote

**Parameters:**
`basket_session_id`: Session UUID
`member_id`: Current member ID
`footnote_text`: Footnote text

### `checkout_flow_add_promo_code_button_clicked`

**Description:** When the user clicks to show the promo code input

**Parameters:**
`basket_session_id`: Session UUID
`member_id`: Current member ID

### `checkout_flow_apply_promo_code_button_clicked`

**Description:** When the user applies a promo code

**Parameters:**
`basket_session_id`: Session UUID
`member_id`: Current member ID
`promo_code`: The promo code entered
`promo_code_value`: Applied promo code value
`promo_code_id`: Promo code ID when applied
`promo_code_error`: Error message when the code fails

### `checkout_flow_billing_group_list_clicked`

**Description:** When the user opens the billing group list

**Parameters:**
`basket_session_id`: Session UUID
`member_id`: Current member ID
`billing_group_id_selected`: Billing group ID when list is opened

### `checkout_flow_billing_group_selected`

**Description:** When the user selects a billing group

**Parameters:**
`basket_session_id`: Session UUID
`member_id`: Current member ID
`billing_group_id_selected`: Selected billing group ID

### `checkout_flow_cancel_button_clicked`

**Description:** When the user closes the checkout flow with Cancel

**Parameters:**
`basket_session_id`: Session UUID
`member_id`: Current member ID if any
`nb_of_promo_code_applied`: Number of promo codes applied
`billing_group_id_selected`: Billing group ID selected
`service_date`: Service/pass activation date
`invoice_creation_success`: Whether invoice was created (if attempted)
`invoice_id`: Invoice ID if created
`invoice_creation_error`: Error message if invoice creation failed
`total_basket_price`: Total basket price in cents
`total_item_quantity`: Sum of all item quantities in the basket

### `checkout_flow_completion`

**Description:** When the basket is completed (confirm clicked)

**Parameters:**
`basket_session_id`: Session UUID
`basket_completion_trigger`: Button used to complete (confirm)
`member_id`: Member ID
`nb_of_promo_code_applied`: Number of promo codes applied
`total_item_quantity`: Sum of all item quantities in the basket
`billing_group_id_selected`: Billing group ID selected
`service_date`: Service/pass activation date
`invoice_creation_success`: Whether the invoice was created
`invoice_creation_error`: Error message on failure
`invoice_id`: Invoice UUID on success
`total_basket_price`: Total basket price in cents after tax and reductions
`footnote_text`: Value of the footnote

### `checkout_flow_cross_button_clicked`

**Description:** When the user closes the checkout flow with the cross button

**Parameters:**
`basket_session_id`: Session UUID
`member_id`: Current member ID if any
`nb_of_promo_code_applied`: Number of promo codes applied
`billing_group_id_selected`: Billing group ID selected
`service_date`: Service/pass activation date
`invoice_creation_success`: Whether invoice was created (if attempted)
`invoice_id`: Invoice ID if created
`invoice_creation_error`: Error message if invoice creation failed
`total_basket_price`: Total basket price in cents
`total_item_quantity`: Sum of all item quantities in the basket

### `checkout_flow_delete_promo_code_button_clicked`

**Description:** When the user removes a promo code

**Parameters:**
`basket_session_id`: Session UUID
`member_id`: Current member ID
`promo_code`: The promo code removed
`promo_code_value`: Promo code value that was applied
`promo_code_id`: Promo code ID

### `checkout_flow_escape_key_button_clicked`

**Description:** When the user closes the checkout flow with Escape

**Parameters:**
`basket_session_id`: Session UUID
`member_id`: Current member ID if any
`nb_of_promo_code_applied`: Number of promo codes applied
`billing_group_id_selected`: Billing group ID selected
`service_date`: Service/pass activation date
`invoice_creation_success`: Whether invoice was created (if attempted)
`invoice_id`: Invoice ID if created
`invoice_creation_error`: Error message if invoice creation failed
`total_basket_price`: Total basket price in cents
`total_item_quantity`: Sum of all item quantities in the basket

### `checkout_flow_footnote_cancel_button_clicked`

**Description:** When the user cancels the footnote modal

**Parameters:**
`basket_session_id`: Session UUID
`member_id`: Current member ID
`footnote_text`: Footnote text

### `checkout_flow_footnote_cross_button_clicked`

**Description:** When the user closes the footnote modal with the cross button

**Parameters:**
`basket_session_id`: Session UUID
`member_id`: Current member ID
`footnote_text`: Footnote text

### `checkout_flow_footnote_delete_button_clicked`

**Description:** When the user deletes the footnote

**Parameters:**
`basket_session_id`: Session UUID
`member_id`: Current member ID
`footnote_text`: Footnote text

### `checkout_flow_footnote_edit_button_clicked`

**Description:** When the user clicks to edit the footnote

**Parameters:**
`basket_session_id`: Session UUID
`member_id`: Current member ID
`footnote_text`: Footnote text

### `checkout_flow_footnote_escape_key_button_clicked`

**Description:** When the user closes the footnote modal with Escape

**Parameters:**
`basket_session_id`: Session UUID
`member_id`: Current member ID
`footnote_text`: Footnote text

### `checkout_flow_footnote_save_button_clicked`

**Description:** When the user saves the footnote

**Parameters:**
`basket_session_id`: Session UUID
`member_id`: Current member ID
`footnote_text`: Footnote text

### `checkout_flow_item_add_item_button_clicked`

**Description:** When the user adds an item to the basket

**Parameters:**
`basket_session_id`: Session UUID
`member_id`: Current member ID
`item_type`: Item type
`item_id`: Item ID
`item_name`: Item name
`item_price`: Item price in cents
`item_quantity`: Item quantity
`manual_discount_percentage`: Manual discount percentage if set
`manual_discount_amount`: Manual discount amount in cents if set

### `checkout_flow_item_clear_button_clicked`

**Description:** When the user clears the add-item form before adding to basket

**Parameters:**
`basket_session_id`: Session UUID
`member_id`: Current member ID
`item_type`: Item type
`item_id`: Item ID
`item_name`: Item name
`item_price`: Item price in cents
`item_quantity`: Item quantity
`manual_discount_percentage`: Manual discount percentage if set
`manual_discount_amount`: Manual discount amount in cents if set

### `checkout_flow_item_delete_button_clicked`

**Description:** When the user deletes an item from the basket

**Parameters:**
`basket_session_id`: Session UUID
`member_id`: Current member ID
`item_type`: Item type
`item_id`: Item ID
`item_name`: Item name
`item_price`: Item price in cents
`item_quantity`: Item quantity
`manual_discount_percentage`: Manual discount percentage if set
`manual_discount_amount`: Manual discount amount in cents if set

### `checkout_flow_item_information_button_clicked`

**Description:** When the user clicks the item information button

**Parameters:**
`basket_session_id`: Session UUID
`member_id`: Current member ID
`item_type`: Item type
`item_id`: Item ID
`item_name`: Item name
`item_price`: Item price in cents
`item_quantity`: Item quantity
`manual_discount_percentage`: Manual discount percentage if set
`manual_discount_amount`: Manual discount amount in cents if set

### `checkout_flow_item_selected`

**Description:** When an item is selected in the add-item form but not yet added to basket

**Parameters:**
`basket_session_id`: Session UUID
`member_id`: Current member ID
`item_type`: Item type
`item_id`: Item ID
`item_name`: Item name
`item_price`: Item price in cents
`item_quantity`: Item quantity
`manual_discount_percentage`: Manual discount percentage if set
`manual_discount_amount`: Manual discount amount in cents if set

### `checkout_flow_item_type_section_selected`

**Description:** When the user selects an item type section

**Parameters:**
`basket_session_id`: Session UUID
`item_type`: Selected item type
`member_id`: Current member ID

### `checkout_flow_item_unselected_cross_button_clicked`

**Description:** When the user clears the selected item with the cross button

**Parameters:**
`basket_session_id`: Session UUID
`member_id`: Current member ID
`item_type`: Item type
`item_id`: Item ID
`item_name`: Item name
`item_price`: Item price in cents
`item_quantity`: Item quantity
`manual_discount_percentage`: Manual discount percentage if set
`manual_discount_amount`: Manual discount amount in cents if set

### `checkout_flow_member_edit_button_clicked`

**Description:** When the user clicks Edit member to open the member search

**Parameters:**
`basket_session_id`: Session UUID
`member_id`: Current member ID

### `checkout_flow_member_search_cancel_button_clicked`

**Description:** When the user closes the member search modal with Cancel

**Parameters:**
`basket_session_id`: Session UUID
`member_id`: Member ID when available

### `checkout_flow_member_search_cross_button_clicked`

**Description:** When the user closes the member search modal with the cross button

**Parameters:**
`basket_session_id`: Session UUID
`member_id`: Member ID when available

### `checkout_flow_member_search_escape_key_button_clicked`

**Description:** When the user closes the member search modal with Escape

**Parameters:**
`basket_session_id`: Session UUID
`member_id`: Member ID when available

### `checkout_flow_member_search_member_information_button_clicked`

**Description:** When the user clicks the member information button in the member search modal

**Parameters:**
`basket_session_id`: Session UUID
`member_id`: Member ID when available

### `checkout_flow_member_search_member_selected`

**Description:** When a member is selected in the member search modal

**Parameters:**
`basket_session_id`: Session UUID
`member_id`: Member ID when available

### `checkout_flow_member_search_select_member_button_clicked`

**Description:** When the user clicks Select member in the member search modal

**Parameters:**
`basket_session_id`: Session UUID
`member_id`: Member ID when available

### `checkout_flow_pay_cancel`

**Description:** When the user cancels the checkout flow (aggregate)

**Parameters:**
`basket_cancel_trigger`: How the user closed the basket
`basket_session_id`: Session UUID
`member_id`: Current member ID if any
`nb_of_promo_code_applied`: Number of promo codes applied
`billing_group_id_selected`: Billing group ID selected
`service_date`: Service/pass activation date
`invoice_creation_success`: Whether invoice was created (if attempted)
`invoice_id`: Invoice ID if created
`invoice_creation_error`: Error message if invoice creation failed
`total_basket_price`: Total basket price in cents
`total_item_quantity`: Sum of all item quantities in the basket

### `checkout_flow_start`

**Description:** When the checkout flow starts

**Parameters:**
`basket_session_id`: Session UUID for this modal open
`basket_start_trigger`: Entry point that opened the checkout flow
`origin_url`: URL of the page where the flow was opened
`member_id`: Pre-selected member ID if any

### `checkout_flow_subscription_button_clicked`

**Description:** When the user clicks Go to subscriptions

**Parameters:**
`basket_session_id`: Session UUID
`member_id`: Current member ID

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
`current_step`: The step from which the user clicks on the close button.

### `session_creation_create_session_button_clicked`

**Description:** When the user clicks on the button to create the session in the session creation flow

**Parameters:**
`session_is_recurrent`: Whether the session being created is recurrent
`session_recurrence_end_date`: The end date of the session recurrence, null if the session is not recurrent
`session_recurrence_interval_selected`: The recurrence interval selected for the session when the session is recurrent
`session_recurrence_rule`: The specific recurrence rule selected by the user, e.g. every Monday and Wednesday, every 2 weeks on Tuesday, etc.

### `session_creation_customize_name_toggle_enabled`

**Description:** When the user toggles the option to customize the session name in the session creation flow

**Parameters:**
`customize_name_toggle_enabled`: Whether the user enables the toggle to customize session name

### `session_creation_next_clicked`

**Description:** When the user clicks on the ‘Next’ button in the session creation flow

**Parameters:**
`current_step`: The step from which the user clicks next.

### `session_creation_opens`

**Description:** When the user clicks on ‘Add a session’ button

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

### `session_list_all_attendance_button_clicked`

**Description:** When the user clicks on the attendance button to validate all sessions for a specific day in the session list

**Parameters:**
`date`: The date for which the user clicks on the attendance button to validate all sessions
`number_of_sessions`: The number of sessions displayed for the day for which the user clicks on the attendance button to validate all sessions

### `session_list_all_attendance_confirm_button_clicked`

**Description:** When the user clicks on the confirm button after clicking on the attendance button to validate all sessions for a specific day in the session list

**Parameters:**
`date`: The date for which the user clicks on the confirm button to validate all sessions
`number_of_sessions`: The number of sessions displayed for the day for which the user clicks on the confirm button to validate all sessions

### `session_list_attendace_confirm_button_clicked`

**Description:** When the user clicks on the attendance confirm button

**Parameters:**
`session_id`: The id of the session for which the user clicks on the attendance confirm button
`session_name`: The name of the session for which the user clicks on the attendance confirm button
`session_date`: The date of the session for which the user clicks on the attendance confirm button
`participant_number`: The number of participants registered for the session for which the user clicks on the attendance confirm button
`teacher_name`: The name of the teacher of the session for which the user clicks on the attendance confirm button
`teacher_id`: The id of the teacher of the session for which the user clicks on the attendance confirm button
`session_type`: The type of the session for which the user clicks on the attendance confirm button (e.g. group activity, workshop)
`session_is_online`: Whether the session for which the user clicks on the attendance confirm button is an online session

### `session_list_attendance_button_clicked`

**Description:** When the user clicks on the attendance button of a session in the session list

**Parameters:**
`session_id`: The id of the session for which the user clicks on the attendance button
`session_name`: The name of the session for which the user clicks on the attendance button
`session_date`: The date of the session for which the user clicks on the attendance button
`participant_number`: The number of participants registered for the session for which the user clicks on the attendance button
`teacher_name`: The name of the teacher of the session for which the user clicks on the attendance button
`teacher_id`: The id of the teacher of the session for which the user clicks on the attendance button
`session_type`: The type of the session for which the user clicks on the attendance button (e.g. group activity, workshop)
`session_is_online`: Whether the session for which the user clicks on the attendance button is an online session

### `session_list_calendar_view_changed`

**Description:** When the user changes the calendar view to display sessions for a different time interval

**Parameters:**
`calendar_view`: The time interval for which sessions are displayed

### `session_list_cancel_button_clicked`

**Description:** When the user clicks on the cancel button

**Parameters:**
`session_id`: The id of the session for which the user clicks on the cancel button
`session_name`: The name of the session for which the user clicks on the cancel button
`session_start_date_time`: The date and time of the session for which the user clicks on the cancel button
`participant_number`: The number of participants registered for the session for which the user clicks on the cancel button
`teacher_name`: The name of the teacher of the session for which the user clicks on the cancel button
`teacher_id`: The id of the teacher of the session for which the user clicks on the cancel button
`session_type`: The type of the session for which the user clicks on the cancel button (e.g. group activity, workshop)
`session_is_online`: Whether the session for which the user clicks on the cancel button is an online session
`session_available`: Whether the session for which the user clicks on the cancel button is still available when canceling (i.e. not cancelled or already took place)
`session_duration`: The duration in minutes of the session for which the user clicks on the cancel button
`session_visibility`: The visibility of the session for which the user clicks on the cancel button

### `session_list_cancel_multiple_sessions_button_clicked`

**Description:** When the user clicks on the confirm button to cancel multiple sessions in the session list

**Parameters:**
`time_period_value`: missing description

### `session_list_cancel_multiple_sessions_time_period_selected`

**Description:** When the user selects a time period to cancel multiple sessions in the session list

**Parameters:**
`time_period_value`: missing description

### `session_list_copy_link_button_clicked`

**Description:** When the user clicks on the copy link button

**Parameters:**
`session_id`: The id of the session for which the user clicks on the copy link button
`session_name`: The name of the session for which the user clicks on the copy link button
`session_start_date_time`: The date and time of the session for which the user clicks on the copy link button
`participant_number`: The number of participants registered for the session for which the user clicks on the copy link button
`teacher_name`: The name of the teacher of the session for which the user clicks on the copy link button
`teacher_id`: The id of the teacher of the session for which the user clicks on the copy link button
`session_type`: The type of the session for which the user clicks on the copy link button (e.g. group activity, workshop)
`session_is_online`: Whether the session for which the user clicks on the copy link button is an online session
`session_available`: Whether the session for which the user clicks on the copy link button is still available when copying the link (i.e. not cancelled or already took place)
`session_duration`: The duration in minutes of the session for which the user clicks on the copy link button
`session_visibility`: The visibility of the session for which the user clicks on the copy link button

### `session_list_dashboard_button_clicked`

**Description:** When the user clicks on the button to go to the dashboard from the session list page

**Parameters:**

### `session_list_delete_button_clicked`

**Description:** When the user clicks on the delete button

**Parameters:**
`session_id`: The id of the session for which the user clicks on the delete button
`session_name`: The name of the session for which the user clicks on the delete button
`session_start_date_time`: The date and time of the session for which the user clicks on the delete button
`participant_number`: The number of participants registered for the session for which the user clicks on the delete button
`teacher_name`: The name of the teacher of the session for which the user clicks on the delete button
`teacher_id`: The id of the teacher of the session for which the user clicks on the delete button
`session_type`: The type of the session for which the user clicks on the delete button (e.g. group activity, workshop)
`session_is_online`: Whether the session for which the user clicks on the delete button is an online session
`session_available`: Whether the session for which the user clicks on the delete button is still available when restoring (i.e. not cancelled or already took place)
`session_duration`: The duration in minutes of the session for which the user clicks on the delete button
`session_visibility`: The visibility of the session for which the user clicks on the delete button

### `session_list_display_cancelled_sessions_clicked`

**Description:** When the user clicks on the setting to show or hide cancelled sessions in the session list

**Parameters:**
`cancelled_sessions_displayed`: Whether the user chooses to show or hide cancelled sessions in the session list

### `session_list_duplicate_button_clicked`

**Description:** When the user clicks on the duplicate button

**Parameters:**
`session_id`: The id of the session for which the user clicks on the duplicate button
`session_name`: The name of the session for which the user clicks on the duplicate button
`session_start_date_time`: The date and time of the session for which the user clicks on the duplicate button
`participant_number`: The number of participants registered for the session for which the user clicks on the duplicate button
`teacher_name`: The name of the teacher of the session for which the user clicks on the duplicate button
`teacher_id`: The id of the teacher of the session for which the user clicks on the duplicate button
`session_type`: The type of the session for which the user clicks on the duplicate button (e.g. group activity, workshop)
`session_is_online`: Whether the session for which the user clicks on the duplicate button is an online session
`session_available`: Whether the session for which the user clicks on the duplicate button is still available when duplicating (i.e. not cancelled or already took place)
`session_duration`: The duration in minutes of the session for which the user clicks on the duplicate button
`session_visibility`: The visibility of the session for which the user clicks on the duplicate button

### `session_list_edit_button_clicked`

**Description:** When the user clicks on the edit button

**Parameters:**
`session_id`: The id of the session for which the user clicks on the edit button
`session_name`: The name of the session for which the user clicks on the edit button
`session_start_date_time`: The date and time of the session for which the user clicks on the edit button
`participant_number`: The number of participants registered for the session for which the user clicks on the edit button
`teacher_name`: The name of the teacher of the session for which the user clicks on the edit button
`teacher_id`: The id of the teacher of the session for which the user clicks on the edit button
`session_type`: The type of the session for which the user clicks on the edit button (e.g. group activity, workshop)
`session_is_online`: Whether the session for which the user clicks on the edit button is an online session
`session_available`: Whether the session for which the user clicks on the edit button is still available when editing (i.e. not cancelled or already took place)
`session_duration`: The duration in minutes of the session for which the user clicks on the edit button
`session_visibility`: The visibility of the session for which the user clicks on the edit button

### `session_list_export_participant_confirm_button_clicked`

**Description:** When the user clicks on the confirm button to export participants of a session in the session list

**Parameters:**
`day_selected`: The day for which the user clicks to export participants of a session
`calendar_filters_toggle_value`: Whether the user has toggled on the calendar filters when exporting participants of a session

### `session_list_filters_changed`

**Description:** When the user applies, changes or removes filters on the session list

**Parameters:**
`filters`: The list of filters currently applied on the session list

### `session_list_restore_button_clicked`

**Description:** When the user clicks on the restore button

**Parameters:**
`session_id`: The id of the session for which the user clicks on the restore button
`session_name`: The name of the session for which the user clicks on the restore button
`session_start_date_time`: The date and time of the session for which the user clicks on the restore button
`participant_number`: The number of participants registered for the session for which the user clicks on the restore button
`teacher_name`: The name of the teacher of the session for which the user clicks on the restore button
`teacher_id`: The id of the teacher of the session for which the user clicks on the restore button
`session_type`: The type of the session for which the user clicks on the restore button (e.g. group activity, workshop)
`session_is_online`: Whether the session for which the user clicks on the restore button is an online session
`session_available`: Whether the session for which the user clicks on the restore button is still available when restoring (i.e. not cancelled or already took place)
`session_duration`: The duration in minutes of the session for which the user clicks on the restore button
`session_visibility`: The visibility of the session for which the user clicks on the restore button

### `session_list_search_changed`

**Description:** When the user input a value in the session list search bar

**Parameters:**
`search_value`: The search query that the user input

### `session_list_search_cleared`

**Description:** When the user clears the search input in the session list

**Parameters:**
`search_value`: The search query that the user cleared
`source`: The source from which the user cleared the search query

### `session_list_session_clicked`

**Description:** When the user clicks on a session in the session list

**Parameters:**
`session_id`: The id of the session that the user clicks on
`session_name`: The name of the session that the user clicks on
`session_date`: The date of the session that the user clicks on
`participant_number`: The number of participants registered for the session that the user clicks on
`teacher_name`: The name of the teacher of the session that the user clicks on
`teacher_id`: The id of the teacher of the session that the user clicks on
`session_type`: The type of the session that the user clicks on (e.g. group activity, workshop)
`session_is_online`: Whether the session that the user clicks on is an online session

### `session_list_viewed`

**Description:** When the user views the session list page

**Parameters:**
`calendar_view`: The time interval for which sessions are displayed
`cancelled_sessions_displayed`: Whether cancelled sessions are displayed in the session list
`displayed_columns`: The columns displayed in the session list
`filters`: The list of filters currently applied on the session list

### `session_list_visible_columns_clicked`

**Description:** When the user clicks on the visible columns settings for a specific column, whether to show or hide it

**Parameters:**
`calendar_column_name`: The column for which the user clicks on the visible columns settings
`calendar_column_visibility`: Whether the column is currently visible or hidden when the user clicks on the visible columns settings
