## 42.14.0b12 (2020-11-24)

### Feat

- **payment_pack**: penalty for payment_pack
- **typescript**: implement typescript in webpack
- **video**: video detail page. Dislay views and video purchases
- **private_service**: add padding for private_booking availability slots
- **vod**: allow final users to buy video w/ credits
- **video**: buy video
- **private_booking**: restore for private bookings (only manager)
- **meta_activity**: auto_discard in MetaActivityForm and new notification rule
- **payment-packs**: add max bookings per month field
- **dashboard**: qualitative barchart and saving
- **consumer_payment_pack**: show history of modifying credit
- **exporthtml**: add button to export html file from email editor
- **platform-billing**: show max/min stage and coupon in settings
- **subscription**: auto-set subscription 0€ to credit + display flat fee
- **booking-option**: disable notification on discard booking-option when converting as booking
- **booking-option**: disable notification on discard booking-option when converting as booking
- **partial-refund**: improve pack partial refund
- **partial-refund**: improve pack partial refund
- **subscription**: scheduled stop for subscriptions
- **subscription**: scheduled stop for subscriptions
- **menu**: denser responsive drawer nested menu item
- **menu**: denser responsive drawer nested menu item
- **phone**: translate phone in other countries
- **phone**: translate phone in other countries
- **smartlist**: add attendance option for BookingsFilters and BookingsNumberFilter
- **recurrence-rule**: add establishment in recurrence rule booking
- **smartlist**: add attendance option for BookingsFilters and BookingsNumberFilter
- **recurrence-rule**: add establishment in recurrence rule booking
- **gtm**: add gtm on custom login pages
- **offer**: restore offer button
- **mass_disable**: add background task for mass disable
- **communication-dialog**: add sms and email-template email
- **rum**: disable elasticsearch RUM
- **booking**: filter on recurrence-rule-booking-isnull
- **offer**: chose default view cancelled offer (manager space)
- **offer**: background task for offer edit and offer create
- **component birthday email**: add new component to birthday celebration email
- **booking**: add filter not cancelled
- **report**: addres/birthday in reports
- **notification-rule**: add invoice notif and waiting-list kick
- **dashboard**: new dashboard page
- **recurrent-booking**: add recurrent booking on member page and fix pagination
- **report**: add nb_offer and nb_offer_cancelled
- **background-task**: background task monitoring and background task for disabling/deleting offers
- **timezone**: return timezone_name in company onboarding
- **timezone**: handle multitimezone
- **bookingstatistics**: bookingStatistics filtered by offerFilters in calendar page
- **bookingnotification**: notify every attendance / absence / cancellation ... for booking notif
- **coupon**: add to subscription
- **refund**: more explicit refund message
- **booking-revert**: notify or not client about cancellation of their booking
- **sepa**: allow oneshot sepa payment
- **offer**: add recurrence rule for booking
- **offer-card**: show if was first booking w/ ★
- **bank-account**: support spanish bank accounts for companies
- **platform-billing**: add multiple payment methods
- **report**: add on spot payment report and add a button to generate it from cashbook
- **offer-card**: back more info on card
- **theme**: add general_terms_of_use
- **marketplace**: add an appbar w/ email+basket on payment pages
- **access-code**: add access codes to company onboarding
- **platform-billing**: add payment method even if no subscription/billing-group
- **platform-billing**: add new screen platform billing
- **member**: count objects in tabs
- **gtm**: add gtm in offer payment/booking page
- **emails**: add checkbox to send emails to canceled Bookings
- **settings**: make editable the ios and adroids's urls
- **subscription**: sort the subscription in manager interface
- **platform-billing**: basic plaformbilling setting page
- **payment-method**: save payment method
- **notification-rule**: disable and/or send copy to the company
- **bookingnotification**: booking notification form reorganization
- **smartlist**: private filters
- **smartlist**: bug basket date select
- **kube**: full switch to kubernetes servers
- **voucher**: add percent selector along price selector
- **offer**: reactivate delete button on offercard
- **reset-password**: propose help if reset password twice in 4h
- **subscription**: consumer can and must pay their credit subscrtipion
- **gtm**: add basketId on some missing gtm event
- **gtm**: add checkout-items to basket event, type on add-to-card events
- **vod**: pass give access to VOD
- **offeredit**: custom offer selection for recursive edit of similar offers
- **archive**: delete and restore coach/establshment even if future offers planned
- **nf525**: upload doc in settings for NF525
- **subscription**: allow 0e subscription w/ credit payment
- **subscription**: private-pass (RDV) subscription
- **apm**: first step testing instrumentation w/ elastic RUM
- test(producttour): add/ids
- **member**: terms and conditions in Member detail
- **client**: cancel-condition
- **associated coach api**: changed endpoint for create/update/link_email coach
- **idds**: chnage some idds
- **temp-password**: increase temp password validity to 1 week
- **bookingcreationnotification**: improved tooltips and form validation
- (fix): idds
- **bookingcreationnotification**: added booking notifications for establishment and meta_activity
- (ids): add/ids

### Fix

- **email-editor**: set the maxlength property according to backend requirements
- **vod**: only show coach active in filter manager
- **vod**: ability to close the register video dialog
- **communication dialog**: visible sms option
- **language**: redirect to spanish for catalan
- **subscription**: fix stupid error
- **gtm**: add price in gtm
- **translation**: lol
- **dashboard**: correctly filter invoiceitem
- **login**: center login form
- **i18n**: import es locale for moment
- **i18n**: import es locale for moment
- **recurrence-booking**: open recurrence booking form when no booking selected
- **recurrence-booking**: open recurrence booking form when no booking selected
- **login**: center login form
- **timezone**: fix a bug when no timezone on offerlistv2
- **gtm**: add event on pre-checkout pages
- **check-in**: register on check-in app without pb
- **communication**: link smartlist commuinication to smartlist in back
- **communication**: fixes on member detail + order page
- **contract**: edit a contract to set a combo
- **subscription**: fix some modal on payment in marketplace
- **voucher**: format cts in subscription
- **timezone**: fix offer header
- **i18n**: add ireland bank account
- **timezone**: remove timezone reference in useless ref
- **timezone**: micro fix
- **quickfix**: random quickfix
- **payment-combo**: fix refresh error whenusing private-pass
- **rum**: disable rum bullshit
- **waiting-list**: register cancelled bookings on waiting-list
- **quickinvoice**: fix remove invoice item and UnevenInvoiceDialog float display
- **payment-method**: fetch payument methods only if valid member id
- **booking-revert**: set loading to false after action
- **random**: random fixes post-merge
- **random**: random fixes post-merge
- **random**: random fixes post-merge
- **payment-method**: fix some pb when registering sepa on mobile
- **offer-direct-payment**: remove abd infinite loading page
- **platform-billing**: show right price on platform invoice
- **payment-method**: disable payment-method switch on old subscription
- **offer-card**: show coach on offer-card
- **subscription**: pay on offerbooking page
- **payment-method**: better refresh of methods on subscription paymebnt form
- **subscription**: do not ask for payment on 0e subscription
- **payment-rule**: bug when 1 bonus in rules
- **payment-rule**: ability to par pallier
- **disable-offer**: show mass offer being disabled
- **booking-discard**: attempt to fix error message on refund booking
- **self-checkin**: do not show cancelled bookings in tablet
- **qf**: qffix
- **booking**: is_discardable is kind of broken
- **kube**: back to no-kube for security
- **stupidity**: so much stupidity
- **kube**: switch env
- **waitinglist**: allow 15 minutes delay
- **booking**: revert is_discardable
- **vod**: category proposed in marketplace are bounded to videos
- **sct**: localization of SCT
- **login**: change translation when email exists
- **flag**: england
- **localization**: remove la suisse from locale created
- **sentry**: fix versionning scheme on sentry
- **report**: bug
- **lint**: appbar
- **bookingnotifications**: fixed undefined
- **sentry**: change sourcemap url-prefix and version w/ sha
- **bookingstatistics**: fixed offer graph visuals in planning page

### Refactor

- **dashboard**: reorganizing graphRessources
- **ids**: add more ids
- **ids**: add more ids

### Perf

- **payment-pack**: optional check on bookings_within_month because annotation was removed on backend
- **email-tempaltes**: load templates only when dialog is open on membersummarycard
- **particlejs**: rmeove particlejs for error cleaning and perf

### feat

- **recurrent-booking**: add recurrent booking on member page and fix pagination
- **timezone**: add timezones in manager interface display
- **CashBook**: add report for cashBook
- **Member**: count objects in tabs
- **emails**: add checkbox for canceledBooking in sending emails
- **settings**: make editable the ios and adroids's urls
- **offercard**: reactivate button delete
- **subscription**: private pass (RDV) available for subscription
- **appbar**: user/menu
- (client): add-last-discard
- **change**: idds

### fix

- **cleanup**: can not unselect first offer + fix translation loading

## 42.9.0 (2020-08-18)

### Feat

- **invoice**: prompt for uneven invoices in offermanagement.component
- **widget**: share button for widget and calendar url
- **payment-pack**: limit purchase per payment-pack per member
- **payment-pack**: add day limitation
- **marketplace calendar**: added new theme settings to personalize the manager & customer calendars
- **SCT**: SCT localized

### Refactor

- **calendar**: clean a bit the UI

### Fix

- **language**: default language is english
- **payment**: block manager from payment pages

## 42.8.0 (2020-08-14)

### Feat

- **marketplace calendar**: added new theme settings to personalize the manager & customer calendars

## 42.7.0 (2020-08-13)

### Feat

- **invoice**: voucher for quick invoices

## 42.6.0 (2020-08-13)

### Feat

- **report**: add first privatebooking report

## 42.5.1 (2020-08-13)

### Fix

- **version**: fetch tag berfore running cz bump
- **version**: test bump versionning

## 42.5.0 (2020-08-13)

### Feat

- **face-id**: FaceID working on tablet interface

### feat

- **face-id**: working flow, UX to be improved (+member form)

## 42.14.0b12 (2020-11-24)

### Feat

- **payment_pack**: penalty for payment_pack
- **typescript**: implement typescript in webpack
- **video**: video detail page. Dislay views and video purchases
- **private_service**: add padding for private_booking availability slots
- **vod**: allow final users to buy video w/ credits
- **video**: buy video
- **private_booking**: restore for private bookings (only manager)
- **meta_activity**: auto_discard in MetaActivityForm and new notification rule
- **payment-packs**: add max bookings per month field
- **dashboard**: qualitative barchart and saving
- **consumer_payment_pack**: show history of modifying credit
- **exporthtml**: add button to export html file from email editor
- **platform-billing**: show max/min stage and coupon in settings
- **subscription**: auto-set subscription 0€ to credit + display flat fee
- **booking-option**: disable notification on discard booking-option when converting as booking
- **booking-option**: disable notification on discard booking-option when converting as booking
- **partial-refund**: improve pack partial refund
- **partial-refund**: improve pack partial refund
- **subscription**: scheduled stop for subscriptions
- **subscription**: scheduled stop for subscriptions
- **menu**: denser responsive drawer nested menu item
- **menu**: denser responsive drawer nested menu item
- **phone**: translate phone in other countries
- **phone**: translate phone in other countries
- **smartlist**: add attendance option for BookingsFilters and BookingsNumberFilter
- **recurrence-rule**: add establishment in recurrence rule booking
- **smartlist**: add attendance option for BookingsFilters and BookingsNumberFilter
- **recurrence-rule**: add establishment in recurrence rule booking
- **gtm**: add gtm on custom login pages
- **offer**: restore offer button
- **mass_disable**: add background task for mass disable
- **communication-dialog**: add sms and email-template email
- **rum**: disable elasticsearch RUM
- **booking**: filter on recurrence-rule-booking-isnull
- **offer**: chose default view cancelled offer (manager space)
- **offer**: background task for offer edit and offer create
- **component birthday email**: add new component to birthday celebration email
- **booking**: add filter not cancelled
- **report**: addres/birthday in reports
- **notification-rule**: add invoice notif and waiting-list kick
- **dashboard**: new dashboard page
- **recurrent-booking**: add recurrent booking on member page and fix pagination
- **report**: add nb_offer and nb_offer_cancelled
- **background-task**: background task monitoring and background task for disabling/deleting offers
- **timezone**: return timezone_name in company onboarding
- **timezone**: handle multitimezone
- **bookingstatistics**: bookingStatistics filtered by offerFilters in calendar page
- **bookingnotification**: notify every attendance / absence / cancellation ... for booking notif
- **coupon**: add to subscription
- **refund**: more explicit refund message
- **booking-revert**: notify or not client about cancellation of their booking
- **sepa**: allow oneshot sepa payment
- **offer**: add recurrence rule for booking
- **offer-card**: show if was first booking w/ ★
- **bank-account**: support spanish bank accounts for companies
- **platform-billing**: add multiple payment methods
- **report**: add on spot payment report and add a button to generate it from cashbook
- **offer-card**: back more info on card
- **theme**: add general_terms_of_use
- **marketplace**: add an appbar w/ email+basket on payment pages
- **access-code**: add access codes to company onboarding
- **platform-billing**: add payment method even if no subscription/billing-group
- **platform-billing**: add new screen platform billing
- **member**: count objects in tabs
- **gtm**: add gtm in offer payment/booking page
- **emails**: add checkbox to send emails to canceled Bookings
- **settings**: make editable the ios and adroids's urls
- **subscription**: sort the subscription in manager interface
- **platform-billing**: basic plaformbilling setting page
- **payment-method**: save payment method
- **notification-rule**: disable and/or send copy to the company
- **bookingnotification**: booking notification form reorganization
- **smartlist**: private filters
- **smartlist**: bug basket date select
- **kube**: full switch to kubernetes servers
- **voucher**: add percent selector along price selector
- **offer**: reactivate delete button on offercard
- **reset-password**: propose help if reset password twice in 4h
- **subscription**: consumer can and must pay their credit subscrtipion
- **gtm**: add basketId on some missing gtm event
- **gtm**: add checkout-items to basket event, type on add-to-card events
- **vod**: pass give access to VOD
- **offeredit**: custom offer selection for recursive edit of similar offers
- **archive**: delete and restore coach/establshment even if future offers planned
- **nf525**: upload doc in settings for NF525
- **subscription**: allow 0e subscription w/ credit payment
- **subscription**: private-pass (RDV) subscription
- **apm**: first step testing instrumentation w/ elastic RUM
- test(producttour): add/ids
- **member**: terms and conditions in Member detail
- **client**: cancel-condition
- **associated coach api**: changed endpoint for create/update/link_email coach
- **idds**: chnage some idds
- **temp-password**: increase temp password validity to 1 week
- **bookingcreationnotification**: improved tooltips and form validation
- (fix): idds
- **bookingcreationnotification**: added booking notifications for establishment and meta_activity
- (ids): add/ids

### Fix

- **email-editor**: set the maxlength property according to backend requirements
- **vod**: only show coach active in filter manager
- **vod**: ability to close the register video dialog
- **communication dialog**: visible sms option
- **language**: redirect to spanish for catalan
- **subscription**: fix stupid error
- **gtm**: add price in gtm
- **translation**: lol
- **dashboard**: correctly filter invoiceitem
- **login**: center login form
- **i18n**: import es locale for moment
- **i18n**: import es locale for moment
- **recurrence-booking**: open recurrence booking form when no booking selected
- **recurrence-booking**: open recurrence booking form when no booking selected
- **login**: center login form
- **timezone**: fix a bug when no timezone on offerlistv2
- **gtm**: add event on pre-checkout pages
- **check-in**: register on check-in app without pb
- **communication**: link smartlist commuinication to smartlist in back
- **communication**: fixes on member detail + order page
- **contract**: edit a contract to set a combo
- **subscription**: fix some modal on payment in marketplace
- **voucher**: format cts in subscription
- **timezone**: fix offer header
- **i18n**: add ireland bank account
- **timezone**: remove timezone reference in useless ref
- **timezone**: micro fix
- **quickfix**: random quickfix
- **payment-combo**: fix refresh error whenusing private-pass
- **rum**: disable rum bullshit
- **waiting-list**: register cancelled bookings on waiting-list
- **quickinvoice**: fix remove invoice item and UnevenInvoiceDialog float display
- **payment-method**: fetch payument methods only if valid member id
- **booking-revert**: set loading to false after action
- **random**: random fixes post-merge
- **random**: random fixes post-merge
- **random**: random fixes post-merge
- **payment-method**: fix some pb when registering sepa on mobile
- **offer-direct-payment**: remove abd infinite loading page
- **platform-billing**: show right price on platform invoice
- **payment-method**: disable payment-method switch on old subscription
- **offer-card**: show coach on offer-card
- **subscription**: pay on offerbooking page
- **payment-method**: better refresh of methods on subscription paymebnt form
- **subscription**: do not ask for payment on 0e subscription
- **payment-rule**: bug when 1 bonus in rules
- **payment-rule**: ability to par pallier
- **disable-offer**: show mass offer being disabled
- **booking-discard**: attempt to fix error message on refund booking
- **self-checkin**: do not show cancelled bookings in tablet
- **qf**: qffix
- **booking**: is_discardable is kind of broken
- **kube**: back to no-kube for security
- **stupidity**: so much stupidity
- **kube**: switch env
- **waitinglist**: allow 15 minutes delay
- **booking**: revert is_discardable
- **vod**: category proposed in marketplace are bounded to videos
- **sct**: localization of SCT
- **login**: change translation when email exists
- **flag**: england
- **localization**: remove la suisse from locale created
- **sentry**: fix versionning scheme on sentry
- **report**: bug
- **lint**: appbar
- **bookingnotifications**: fixed undefined
- **sentry**: change sourcemap url-prefix and version w/ sha
- **bookingstatistics**: fixed offer graph visuals in planning page

### Refactor

- **dashboard**: reorganizing graphRessources
- **ids**: add more ids
- **ids**: add more ids

### Perf

- **payment-pack**: optional check on bookings_within_month because annotation was removed on backend
- **email-tempaltes**: load templates only when dialog is open on membersummarycard
- **particlejs**: rmeove particlejs for error cleaning and perf

### feat

- **recurrent-booking**: add recurrent booking on member page and fix pagination
- **timezone**: add timezones in manager interface display
- **CashBook**: add report for cashBook
- **Member**: count objects in tabs
- **emails**: add checkbox for canceledBooking in sending emails
- **settings**: make editable the ios and adroids's urls
- **offercard**: reactivate button delete
- **subscription**: private pass (RDV) available for subscription
- **appbar**: user/menu
- (client): add-last-discard
- **change**: idds

### fix

- **cleanup**: can not unselect first offer + fix translation loading

## 42.9.0 (2020-08-18)

### Feat

- **invoice**: prompt for uneven invoices in offermanagement.component
- **widget**: share button for widget and calendar url
- **payment-pack**: limit purchase per payment-pack per member
- **payment-pack**: add day limitation
- **marketplace calendar**: added new theme settings to personalize the manager & customer calendars
- **SCT**: SCT localized

### Refactor

- **calendar**: clean a bit the UI

### Fix

- **language**: default language is english
- **payment**: block manager from payment pages

## 42.8.0 (2020-08-14)

### Feat

- **marketplace calendar**: added new theme settings to personalize the manager & customer calendars

## 42.7.0 (2020-08-13)

### Feat

- **invoice**: voucher for quick invoices

## 42.6.0 (2020-08-13)

### Feat

- **report**: add first privatebooking report

## 42.5.1 (2020-08-13)

### Fix

- **version**: fetch tag berfore running cz bump
- **version**: test bump versionning

## 42.5.0 (2020-08-13)

### Feat

- **face-id**: FaceID working on tablet interface

### feat

- **face-id**: working flow, UX to be improved (+member form)

## 42.14.0b10 (2020-11-13)

### Feat

- **vod**: allow final users to buy video w/ credits
- **video**: buy video
- **private_booking**: restore for private bookings (only manager)
- **meta_activity**: auto_discard in MetaActivityForm and new notification rule
- **payment-packs**: add max bookings per month field
- **dashboard**: qualitative barchart and saving
- **consumer_payment_pack**: show history of modifying credit
- **exporthtml**: add button to export html file from email editor
- **platform-billing**: show max/min stage and coupon in settings
- **subscription**: auto-set subscription 0€ to credit + display flat fee
- **booking-option**: disable notification on discard booking-option when converting as booking
- **booking-option**: disable notification on discard booking-option when converting as booking
- **partial-refund**: improve pack partial refund
- **partial-refund**: improve pack partial refund
- **subscription**: scheduled stop for subscriptions
- **subscription**: scheduled stop for subscriptions
- **menu**: denser responsive drawer nested menu item
- **menu**: denser responsive drawer nested menu item
- **phone**: translate phone in other countries
- **phone**: translate phone in other countries
- **smartlist**: add attendance option for BookingsFilters and BookingsNumberFilter
- **recurrence-rule**: add establishment in recurrence rule booking
- **smartlist**: add attendance option for BookingsFilters and BookingsNumberFilter
- **recurrence-rule**: add establishment in recurrence rule booking
- **gtm**: add gtm on custom login pages
- **offer**: restore offer button
- **mass_disable**: add background task for mass disable
- **communication-dialog**: add sms and email-template email
- **rum**: disable elasticsearch RUM
- **booking**: filter on recurrence-rule-booking-isnull
- **offer**: chose default view cancelled offer (manager space)
- **offer**: background task for offer edit and offer create
- **component birthday email**: add new component to birthday celebration email
- **booking**: add filter not cancelled
- **report**: addres/birthday in reports
- **notification-rule**: add invoice notif and waiting-list kick
- **dashboard**: new dashboard page
- **recurrent-booking**: add recurrent booking on member page and fix pagination
- **report**: add nb_offer and nb_offer_cancelled
- **background-task**: background task monitoring and background task for disabling/deleting offers
- **timezone**: return timezone_name in company onboarding
- **timezone**: handle multitimezone
- **bookingstatistics**: bookingStatistics filtered by offerFilters in calendar page
- **bookingnotification**: notify every attendance / absence / cancellation ... for booking notif
- **coupon**: add to subscription
- **refund**: more explicit refund message
- **booking-revert**: notify or not client about cancellation of their booking
- **sepa**: allow oneshot sepa payment
- **offer**: add recurrence rule for booking
- **offer-card**: show if was first booking w/ ★
- **bank-account**: support spanish bank accounts for companies
- **platform-billing**: add multiple payment methods
- **report**: add on spot payment report and add a button to generate it from cashbook
- **offer-card**: back more info on card
- **theme**: add general_terms_of_use
- **marketplace**: add an appbar w/ email+basket on payment pages
- **access-code**: add access codes to company onboarding
- **platform-billing**: add payment method even if no subscription/billing-group
- **platform-billing**: add new screen platform billing
- **member**: count objects in tabs
- **gtm**: add gtm in offer payment/booking page
- **emails**: add checkbox to send emails to canceled Bookings
- **settings**: make editable the ios and adroids's urls
- **subscription**: sort the subscription in manager interface
- **platform-billing**: basic plaformbilling setting page
- **payment-method**: save payment method
- **notification-rule**: disable and/or send copy to the company
- **bookingnotification**: booking notification form reorganization
- **smartlist**: private filters
- **smartlist**: bug basket date select
- **kube**: full switch to kubernetes servers
- **voucher**: add percent selector along price selector
- **offer**: reactivate delete button on offercard
- **reset-password**: propose help if reset password twice in 4h
- **subscription**: consumer can and must pay their credit subscrtipion
- **gtm**: add basketId on some missing gtm event
- **gtm**: add checkout-items to basket event, type on add-to-card events
- **vod**: pass give access to VOD
- **offeredit**: custom offer selection for recursive edit of similar offers
- **archive**: delete and restore coach/establshment even if future offers planned
- **nf525**: upload doc in settings for NF525
- **subscription**: allow 0e subscription w/ credit payment
- **subscription**: private-pass (RDV) subscription
- **apm**: first step testing instrumentation w/ elastic RUM
- test(producttour): add/ids
- **member**: terms and conditions in Member detail
- **client**: cancel-condition
- **associated coach api**: changed endpoint for create/update/link_email coach
- **idds**: chnage some idds
- **temp-password**: increase temp password validity to 1 week
- **bookingcreationnotification**: improved tooltips and form validation
- (fix): idds
- **bookingcreationnotification**: added booking notifications for establishment and meta_activity
- (ids): add/ids

### Perf

- **payment-pack**: optional check on bookings_within_month because annotation was removed on backend
- **email-tempaltes**: load templates only when dialog is open on membersummarycard
- **particlejs**: rmeove particlejs for error cleaning and perf

### Fix

- **subscription**: fix stupid error
- **gtm**: add price in gtm
- **translation**: lol
- **dashboard**: correctly filter invoiceitem
- **login**: center login form
- **i18n**: import es locale for moment
- **i18n**: import es locale for moment
- **recurrence-booking**: open recurrence booking form when no booking selected
- **recurrence-booking**: open recurrence booking form when no booking selected
- **login**: center login form
- **timezone**: fix a bug when no timezone on offerlistv2
- **gtm**: add event on pre-checkout pages
- **check-in**: register on check-in app without pb
- **communication**: link smartlist commuinication to smartlist in back
- **communication**: fixes on member detail + order page
- **contract**: edit a contract to set a combo
- **subscription**: fix some modal on payment in marketplace
- **voucher**: format cts in subscription
- **timezone**: fix offer header
- **i18n**: add ireland bank account
- **timezone**: remove timezone reference in useless ref
- **timezone**: micro fix
- **quickfix**: random quickfix
- **payment-combo**: fix refresh error whenusing private-pass
- **rum**: disable rum bullshit
- **waiting-list**: register cancelled bookings on waiting-list
- **quickinvoice**: fix remove invoice item and UnevenInvoiceDialog float display
- **payment-method**: fetch payument methods only if valid member id
- **booking-revert**: set loading to false after action
- **random**: random fixes post-merge
- **random**: random fixes post-merge
- **random**: random fixes post-merge
- **payment-method**: fix some pb when registering sepa on mobile
- **offer-direct-payment**: remove abd infinite loading page
- **platform-billing**: show right price on platform invoice
- **payment-method**: disable payment-method switch on old subscription
- **offer-card**: show coach on offer-card
- **subscription**: pay on offerbooking page
- **payment-method**: better refresh of methods on subscription paymebnt form
- **subscription**: do not ask for payment on 0e subscription
- **payment-rule**: bug when 1 bonus in rules
- **payment-rule**: ability to par pallier
- **disable-offer**: show mass offer being disabled
- **booking-discard**: attempt to fix error message on refund booking
- **self-checkin**: do not show cancelled bookings in tablet
- **qf**: qffix
- **booking**: is_discardable is kind of broken
- **kube**: back to no-kube for security
- **stupidity**: so much stupidity
- **kube**: switch env
- **waitinglist**: allow 15 minutes delay
- **booking**: revert is_discardable
- **vod**: category proposed in marketplace are bounded to videos
- **sct**: localization of SCT
- **login**: change translation when email exists
- **flag**: england
- **localization**: remove la suisse from locale created
- **sentry**: fix versionning scheme on sentry
- **report**: bug
- **lint**: appbar
- **bookingnotifications**: fixed undefined
- **sentry**: change sourcemap url-prefix and version w/ sha
- **bookingstatistics**: fixed offer graph visuals in planning page

### feat

- **recurrent-booking**: add recurrent booking on member page and fix pagination
- **timezone**: add timezones in manager interface display
- **CashBook**: add report for cashBook
- **Member**: count objects in tabs
- **emails**: add checkbox for canceledBooking in sending emails
- **settings**: make editable the ios and adroids's urls
- **offercard**: reactivate button delete
- **subscription**: private pass (RDV) available for subscription
- **appbar**: user/menu
- (client): add-last-discard
- **change**: idds

### Refactor

- **ids**: add more ids
- **ids**: add more ids

### fix

- **cleanup**: can not unselect first offer + fix translation loading

## 42.9.0 (2020-08-18)

### Feat

- **invoice**: prompt for uneven invoices in offermanagement.component
- **widget**: share button for widget and calendar url
- **payment-pack**: limit purchase per payment-pack per member
- **payment-pack**: add day limitation
- **marketplace calendar**: added new theme settings to personalize the manager & customer calendars
- **SCT**: SCT localized

### Refactor

- **calendar**: clean a bit the UI

### Fix

- **language**: default language is english
- **payment**: block manager from payment pages

## 42.8.0 (2020-08-14)

### Feat

- **marketplace calendar**: added new theme settings to personalize the manager & customer calendars

## 42.7.0 (2020-08-13)

### Feat

- **invoice**: voucher for quick invoices

## 42.6.0 (2020-08-13)

### Feat

- **report**: add first privatebooking report

## 42.5.1 (2020-08-13)

### Fix

- **version**: fetch tag berfore running cz bump
- **version**: test bump versionning

## 42.5.0 (2020-08-13)

### Feat

- **face-id**: FaceID working on tablet interface

### feat

- **face-id**: working flow, UX to be improved (+member form)

## 42.14.0b10 (2020-11-13)

### Feat

- **vod**: allow final users to buy video w/ credits
- **video**: buy video
- **private_booking**: restore for private bookings (only manager)
- **meta_activity**: auto_discard in MetaActivityForm and new notification rule
- **payment-packs**: add max bookings per month field
- **dashboard**: qualitative barchart and saving
- **consumer_payment_pack**: show history of modifying credit
- **exporthtml**: add button to export html file from email editor
- **platform-billing**: show max/min stage and coupon in settings
- **subscription**: auto-set subscription 0€ to credit + display flat fee
- **booking-option**: disable notification on discard booking-option when converting as booking
- **booking-option**: disable notification on discard booking-option when converting as booking
- **partial-refund**: improve pack partial refund
- **partial-refund**: improve pack partial refund
- **subscription**: scheduled stop for subscriptions
- **subscription**: scheduled stop for subscriptions
- **menu**: denser responsive drawer nested menu item
- **menu**: denser responsive drawer nested menu item
- **phone**: translate phone in other countries
- **phone**: translate phone in other countries
- **smartlist**: add attendance option for BookingsFilters and BookingsNumberFilter
- **recurrence-rule**: add establishment in recurrence rule booking
- **smartlist**: add attendance option for BookingsFilters and BookingsNumberFilter
- **recurrence-rule**: add establishment in recurrence rule booking
- **gtm**: add gtm on custom login pages
- **offer**: restore offer button
- **mass_disable**: add background task for mass disable
- **communication-dialog**: add sms and email-template email
- **rum**: disable elasticsearch RUM
- **booking**: filter on recurrence-rule-booking-isnull
- **offer**: chose default view cancelled offer (manager space)
- **offer**: background task for offer edit and offer create
- **component birthday email**: add new component to birthday celebration email
- **booking**: add filter not cancelled
- **report**: addres/birthday in reports
- **notification-rule**: add invoice notif and waiting-list kick
- **dashboard**: new dashboard page
- **recurrent-booking**: add recurrent booking on member page and fix pagination
- **report**: add nb_offer and nb_offer_cancelled
- **background-task**: background task monitoring and background task for disabling/deleting offers
- **timezone**: return timezone_name in company onboarding
- **timezone**: handle multitimezone
- **bookingstatistics**: bookingStatistics filtered by offerFilters in calendar page
- **bookingnotification**: notify every attendance / absence / cancellation ... for booking notif
- **coupon**: add to subscription
- **refund**: more explicit refund message
- **booking-revert**: notify or not client about cancellation of their booking
- **sepa**: allow oneshot sepa payment
- **offer**: add recurrence rule for booking
- **offer-card**: show if was first booking w/ ★
- **bank-account**: support spanish bank accounts for companies
- **platform-billing**: add multiple payment methods
- **report**: add on spot payment report and add a button to generate it from cashbook
- **offer-card**: back more info on card
- **theme**: add general_terms_of_use
- **marketplace**: add an appbar w/ email+basket on payment pages
- **access-code**: add access codes to company onboarding
- **platform-billing**: add payment method even if no subscription/billing-group
- **platform-billing**: add new screen platform billing
- **member**: count objects in tabs
- **gtm**: add gtm in offer payment/booking page
- **emails**: add checkbox to send emails to canceled Bookings
- **settings**: make editable the ios and adroids's urls
- **subscription**: sort the subscription in manager interface
- **platform-billing**: basic plaformbilling setting page
- **payment-method**: save payment method
- **notification-rule**: disable and/or send copy to the company
- **bookingnotification**: booking notification form reorganization
- **smartlist**: private filters
- **smartlist**: bug basket date select
- **kube**: full switch to kubernetes servers
- **voucher**: add percent selector along price selector
- **offer**: reactivate delete button on offercard
- **reset-password**: propose help if reset password twice in 4h
- **subscription**: consumer can and must pay their credit subscrtipion
- **gtm**: add basketId on some missing gtm event
- **gtm**: add checkout-items to basket event, type on add-to-card events
- **vod**: pass give access to VOD
- **offeredit**: custom offer selection for recursive edit of similar offers
- **archive**: delete and restore coach/establshment even if future offers planned
- **nf525**: upload doc in settings for NF525
- **subscription**: allow 0e subscription w/ credit payment
- **subscription**: private-pass (RDV) subscription
- **apm**: first step testing instrumentation w/ elastic RUM
- test(producttour): add/ids
- **member**: terms and conditions in Member detail
- **client**: cancel-condition
- **associated coach api**: changed endpoint for create/update/link_email coach
- **idds**: chnage some idds
- **temp-password**: increase temp password validity to 1 week
- **bookingcreationnotification**: improved tooltips and form validation
- (fix): idds
- **bookingcreationnotification**: added booking notifications for establishment and meta_activity
- (ids): add/ids

### Perf

- **payment-pack**: optional check on bookings_within_month because annotation was removed on backend
- **email-tempaltes**: load templates only when dialog is open on membersummarycard
- **particlejs**: rmeove particlejs for error cleaning and perf

### Fix

- **subscription**: fix stupid error
- **gtm**: add price in gtm
- **translation**: lol
- **dashboard**: correctly filter invoiceitem
- **login**: center login form
- **i18n**: import es locale for moment
- **i18n**: import es locale for moment
- **recurrence-booking**: open recurrence booking form when no booking selected
- **recurrence-booking**: open recurrence booking form when no booking selected
- **login**: center login form
- **timezone**: fix a bug when no timezone on offerlistv2
- **gtm**: add event on pre-checkout pages
- **check-in**: register on check-in app without pb
- **communication**: link smartlist commuinication to smartlist in back
- **communication**: fixes on member detail + order page
- **contract**: edit a contract to set a combo
- **subscription**: fix some modal on payment in marketplace
- **voucher**: format cts in subscription
- **timezone**: fix offer header
- **i18n**: add ireland bank account
- **timezone**: remove timezone reference in useless ref
- **timezone**: micro fix
- **quickfix**: random quickfix
- **payment-combo**: fix refresh error whenusing private-pass
- **rum**: disable rum bullshit
- **waiting-list**: register cancelled bookings on waiting-list
- **quickinvoice**: fix remove invoice item and UnevenInvoiceDialog float display
- **payment-method**: fetch payument methods only if valid member id
- **booking-revert**: set loading to false after action
- **random**: random fixes post-merge
- **random**: random fixes post-merge
- **random**: random fixes post-merge
- **payment-method**: fix some pb when registering sepa on mobile
- **offer-direct-payment**: remove abd infinite loading page
- **platform-billing**: show right price on platform invoice
- **payment-method**: disable payment-method switch on old subscription
- **offer-card**: show coach on offer-card
- **subscription**: pay on offerbooking page
- **payment-method**: better refresh of methods on subscription paymebnt form
- **subscription**: do not ask for payment on 0e subscription
- **payment-rule**: bug when 1 bonus in rules
- **payment-rule**: ability to par pallier
- **disable-offer**: show mass offer being disabled
- **booking-discard**: attempt to fix error message on refund booking
- **self-checkin**: do not show cancelled bookings in tablet
- **qf**: qffix
- **booking**: is_discardable is kind of broken
- **kube**: back to no-kube for security
- **stupidity**: so much stupidity
- **kube**: switch env
- **waitinglist**: allow 15 minutes delay
- **booking**: revert is_discardable
- **vod**: category proposed in marketplace are bounded to videos
- **sct**: localization of SCT
- **login**: change translation when email exists
- **flag**: england
- **localization**: remove la suisse from locale created
- **sentry**: fix versionning scheme on sentry
- **report**: bug
- **lint**: appbar
- **bookingnotifications**: fixed undefined
- **sentry**: change sourcemap url-prefix and version w/ sha
- **bookingstatistics**: fixed offer graph visuals in planning page

### feat

- **recurrent-booking**: add recurrent booking on member page and fix pagination
- **timezone**: add timezones in manager interface display
- **CashBook**: add report for cashBook
- **Member**: count objects in tabs
- **emails**: add checkbox for canceledBooking in sending emails
- **settings**: make editable the ios and adroids's urls
- **offercard**: reactivate button delete
- **subscription**: private pass (RDV) available for subscription
- **appbar**: user/menu
- (client): add-last-discard
- **change**: idds

### Refactor

- **ids**: add more ids
- **ids**: add more ids

### fix

- **cleanup**: can not unselect first offer + fix translation loading

## 42.9.0 (2020-08-18)

### Feat

- **invoice**: prompt for uneven invoices in offermanagement.component
- **widget**: share button for widget and calendar url
- **payment-pack**: limit purchase per payment-pack per member
- **payment-pack**: add day limitation
- **marketplace calendar**: added new theme settings to personalize the manager & customer calendars
- **SCT**: SCT localized

### Refactor

- **calendar**: clean a bit the UI

### Fix

- **language**: default language is english
- **payment**: block manager from payment pages

## 42.8.0 (2020-08-14)

### Feat

- **marketplace calendar**: added new theme settings to personalize the manager & customer calendars

## 42.7.0 (2020-08-13)

### Feat

- **invoice**: voucher for quick invoices

## 42.6.0 (2020-08-13)

### Feat

- **report**: add first privatebooking report

## 42.5.1 (2020-08-13)

### Fix

- **version**: fetch tag berfore running cz bump
- **version**: test bump versionning

## 42.5.0 (2020-08-13)

### Feat

- **face-id**: FaceID working on tablet interface

### feat

- **face-id**: working flow, UX to be improved (+member form)

## 42.14.0b8 (2020-11-12)

### Feat

- **video**: buy video
- **private_booking**: restore for private bookings (only manager)
- **meta_activity**: auto_discard in MetaActivityForm and new notification rule
- **payment-packs**: add max bookings per month field
- **dashboard**: qualitative barchart and saving
- **consumer_payment_pack**: show history of modifying credit
- **exporthtml**: add button to export html file from email editor
- **platform-billing**: show max/min stage and coupon in settings
- **subscription**: auto-set subscription 0€ to credit + display flat fee
- **booking-option**: disable notification on discard booking-option when converting as booking
- **booking-option**: disable notification on discard booking-option when converting as booking
- **partial-refund**: improve pack partial refund
- **partial-refund**: improve pack partial refund
- **subscription**: scheduled stop for subscriptions
- **subscription**: scheduled stop for subscriptions
- **menu**: denser responsive drawer nested menu item
- **menu**: denser responsive drawer nested menu item
- **phone**: translate phone in other countries
- **phone**: translate phone in other countries
- **smartlist**: add attendance option for BookingsFilters and BookingsNumberFilter
- **recurrence-rule**: add establishment in recurrence rule booking
- **smartlist**: add attendance option for BookingsFilters and BookingsNumberFilter
- **recurrence-rule**: add establishment in recurrence rule booking
- **gtm**: add gtm on custom login pages
- **offer**: restore offer button
- **mass_disable**: add background task for mass disable
- **communication-dialog**: add sms and email-template email
- **rum**: disable elasticsearch RUM
- **booking**: filter on recurrence-rule-booking-isnull
- **offer**: chose default view cancelled offer (manager space)
- **offer**: background task for offer edit and offer create
- **component birthday email**: add new component to birthday celebration email
- **booking**: add filter not cancelled
- **report**: addres/birthday in reports
- **notification-rule**: add invoice notif and waiting-list kick
- **dashboard**: new dashboard page
- **recurrent-booking**: add recurrent booking on member page and fix pagination
- **report**: add nb_offer and nb_offer_cancelled
- **background-task**: background task monitoring and background task for disabling/deleting offers
- **timezone**: return timezone_name in company onboarding
- **timezone**: handle multitimezone
- **bookingstatistics**: bookingStatistics filtered by offerFilters in calendar page
- **bookingnotification**: notify every attendance / absence / cancellation ... for booking notif
- **coupon**: add to subscription
- **refund**: more explicit refund message
- **booking-revert**: notify or not client about cancellation of their booking
- **sepa**: allow oneshot sepa payment
- **offer**: add recurrence rule for booking
- **offer-card**: show if was first booking w/ ★
- **bank-account**: support spanish bank accounts for companies
- **platform-billing**: add multiple payment methods
- **report**: add on spot payment report and add a button to generate it from cashbook
- **offer-card**: back more info on card
- **theme**: add general_terms_of_use
- **marketplace**: add an appbar w/ email+basket on payment pages
- **access-code**: add access codes to company onboarding
- **platform-billing**: add payment method even if no subscription/billing-group
- **platform-billing**: add new screen platform billing
- **member**: count objects in tabs
- **gtm**: add gtm in offer payment/booking page
- **emails**: add checkbox to send emails to canceled Bookings
- **settings**: make editable the ios and adroids's urls
- **subscription**: sort the subscription in manager interface
- **platform-billing**: basic plaformbilling setting page
- **payment-method**: save payment method
- **notification-rule**: disable and/or send copy to the company
- **bookingnotification**: booking notification form reorganization
- **smartlist**: private filters
- **smartlist**: bug basket date select
- **kube**: full switch to kubernetes servers
- **voucher**: add percent selector along price selector
- **offer**: reactivate delete button on offercard
- **reset-password**: propose help if reset password twice in 4h
- **subscription**: consumer can and must pay their credit subscrtipion
- **gtm**: add basketId on some missing gtm event
- **gtm**: add checkout-items to basket event, type on add-to-card events
- **vod**: pass give access to VOD
- **offeredit**: custom offer selection for recursive edit of similar offers
- **archive**: delete and restore coach/establshment even if future offers planned
- **nf525**: upload doc in settings for NF525
- **subscription**: allow 0e subscription w/ credit payment
- **subscription**: private-pass (RDV) subscription
- **apm**: first step testing instrumentation w/ elastic RUM
- test(producttour): add/ids
- **member**: terms and conditions in Member detail
- **client**: cancel-condition
- **associated coach api**: changed endpoint for create/update/link_email coach
- **idds**: chnage some idds
- **temp-password**: increase temp password validity to 1 week
- **bookingcreationnotification**: improved tooltips and form validation
- (fix): idds
- **bookingcreationnotification**: added booking notifications for establishment and meta_activity
- (ids): add/ids

### Perf

- **payment-pack**: optional check on bookings_within_month because annotation was removed on backend
- **email-tempaltes**: load templates only when dialog is open on membersummarycard
- **particlejs**: rmeove particlejs for error cleaning and perf

### Fix

- **subscription**: fix stupid error
- **gtm**: add price in gtm
- **translation**: lol
- **dashboard**: correctly filter invoiceitem
- **login**: center login form
- **i18n**: import es locale for moment
- **i18n**: import es locale for moment
- **recurrence-booking**: open recurrence booking form when no booking selected
- **recurrence-booking**: open recurrence booking form when no booking selected
- **login**: center login form
- **timezone**: fix a bug when no timezone on offerlistv2
- **gtm**: add event on pre-checkout pages
- **check-in**: register on check-in app without pb
- **communication**: link smartlist commuinication to smartlist in back
- **communication**: fixes on member detail + order page
- **contract**: edit a contract to set a combo
- **subscription**: fix some modal on payment in marketplace
- **voucher**: format cts in subscription
- **timezone**: fix offer header
- **i18n**: add ireland bank account
- **timezone**: remove timezone reference in useless ref
- **timezone**: micro fix
- **quickfix**: random quickfix
- **payment-combo**: fix refresh error whenusing private-pass
- **rum**: disable rum bullshit
- **waiting-list**: register cancelled bookings on waiting-list
- **quickinvoice**: fix remove invoice item and UnevenInvoiceDialog float display
- **payment-method**: fetch payument methods only if valid member id
- **booking-revert**: set loading to false after action
- **random**: random fixes post-merge
- **random**: random fixes post-merge
- **random**: random fixes post-merge
- **payment-method**: fix some pb when registering sepa on mobile
- **offer-direct-payment**: remove abd infinite loading page
- **platform-billing**: show right price on platform invoice
- **payment-method**: disable payment-method switch on old subscription
- **offer-card**: show coach on offer-card
- **subscription**: pay on offerbooking page
- **payment-method**: better refresh of methods on subscription paymebnt form
- **subscription**: do not ask for payment on 0e subscription
- **payment-rule**: bug when 1 bonus in rules
- **payment-rule**: ability to par pallier
- **disable-offer**: show mass offer being disabled
- **booking-discard**: attempt to fix error message on refund booking
- **self-checkin**: do not show cancelled bookings in tablet
- **qf**: qffix
- **booking**: is_discardable is kind of broken
- **kube**: back to no-kube for security
- **stupidity**: so much stupidity
- **kube**: switch env
- **waitinglist**: allow 15 minutes delay
- **booking**: revert is_discardable
- **vod**: category proposed in marketplace are bounded to videos
- **sct**: localization of SCT
- **login**: change translation when email exists
- **flag**: england
- **localization**: remove la suisse from locale created
- **sentry**: fix versionning scheme on sentry
- **report**: bug
- **lint**: appbar
- **bookingnotifications**: fixed undefined
- **sentry**: change sourcemap url-prefix and version w/ sha
- **bookingstatistics**: fixed offer graph visuals in planning page

### feat

- **recurrent-booking**: add recurrent booking on member page and fix pagination
- **timezone**: add timezones in manager interface display
- **CashBook**: add report for cashBook
- **Member**: count objects in tabs
- **emails**: add checkbox for canceledBooking in sending emails
- **settings**: make editable the ios and adroids's urls
- **offercard**: reactivate button delete
- **subscription**: private pass (RDV) available for subscription
- **appbar**: user/menu
- (client): add-last-discard
- **change**: idds

### Refactor

- **ids**: add more ids
- **ids**: add more ids

### fix

- **cleanup**: can not unselect first offer + fix translation loading

## 42.9.0 (2020-08-18)

### Feat

- **invoice**: prompt for uneven invoices in offermanagement.component
- **widget**: share button for widget and calendar url
- **payment-pack**: limit purchase per payment-pack per member
- **payment-pack**: add day limitation
- **marketplace calendar**: added new theme settings to personalize the manager & customer calendars
- **SCT**: SCT localized

### Refactor

- **calendar**: clean a bit the UI

### Fix

- **language**: default language is english
- **payment**: block manager from payment pages

## 42.8.0 (2020-08-14)

### Feat

- **marketplace calendar**: added new theme settings to personalize the manager & customer calendars

## 42.7.0 (2020-08-13)

### Feat

- **invoice**: voucher for quick invoices

## 42.6.0 (2020-08-13)

### Feat

- **report**: add first privatebooking report

## 42.5.1 (2020-08-13)

### Fix

- **version**: fetch tag berfore running cz bump
- **version**: test bump versionning

## 42.5.0 (2020-08-13)

### Feat

- **face-id**: FaceID working on tablet interface

### feat

- **face-id**: working flow, UX to be improved (+member form)

## 42.14.0b8 (2020-11-12)

### Feat

- **video**: buy video
- **private_booking**: restore for private bookings (only manager)
- **meta_activity**: auto_discard in MetaActivityForm and new notification rule
- **payment-packs**: add max bookings per month field
- **dashboard**: qualitative barchart and saving
- **consumer_payment_pack**: show history of modifying credit
- **exporthtml**: add button to export html file from email editor
- **platform-billing**: show max/min stage and coupon in settings
- **subscription**: auto-set subscription 0€ to credit + display flat fee
- **booking-option**: disable notification on discard booking-option when converting as booking
- **booking-option**: disable notification on discard booking-option when converting as booking
- **partial-refund**: improve pack partial refund
- **partial-refund**: improve pack partial refund
- **subscription**: scheduled stop for subscriptions
- **subscription**: scheduled stop for subscriptions
- **menu**: denser responsive drawer nested menu item
- **menu**: denser responsive drawer nested menu item
- **phone**: translate phone in other countries
- **phone**: translate phone in other countries
- **smartlist**: add attendance option for BookingsFilters and BookingsNumberFilter
- **recurrence-rule**: add establishment in recurrence rule booking
- **smartlist**: add attendance option for BookingsFilters and BookingsNumberFilter
- **recurrence-rule**: add establishment in recurrence rule booking
- **gtm**: add gtm on custom login pages
- **offer**: restore offer button
- **mass_disable**: add background task for mass disable
- **communication-dialog**: add sms and email-template email
- **rum**: disable elasticsearch RUM
- **booking**: filter on recurrence-rule-booking-isnull
- **offer**: chose default view cancelled offer (manager space)
- **offer**: background task for offer edit and offer create
- **component birthday email**: add new component to birthday celebration email
- **booking**: add filter not cancelled
- **report**: addres/birthday in reports
- **notification-rule**: add invoice notif and waiting-list kick
- **dashboard**: new dashboard page
- **recurrent-booking**: add recurrent booking on member page and fix pagination
- **report**: add nb_offer and nb_offer_cancelled
- **background-task**: background task monitoring and background task for disabling/deleting offers
- **timezone**: return timezone_name in company onboarding
- **timezone**: handle multitimezone
- **bookingstatistics**: bookingStatistics filtered by offerFilters in calendar page
- **bookingnotification**: notify every attendance / absence / cancellation ... for booking notif
- **coupon**: add to subscription
- **refund**: more explicit refund message
- **booking-revert**: notify or not client about cancellation of their booking
- **sepa**: allow oneshot sepa payment
- **offer**: add recurrence rule for booking
- **offer-card**: show if was first booking w/ ★
- **bank-account**: support spanish bank accounts for companies
- **platform-billing**: add multiple payment methods
- **report**: add on spot payment report and add a button to generate it from cashbook
- **offer-card**: back more info on card
- **theme**: add general_terms_of_use
- **marketplace**: add an appbar w/ email+basket on payment pages
- **access-code**: add access codes to company onboarding
- **platform-billing**: add payment method even if no subscription/billing-group
- **platform-billing**: add new screen platform billing
- **member**: count objects in tabs
- **gtm**: add gtm in offer payment/booking page
- **emails**: add checkbox to send emails to canceled Bookings
- **settings**: make editable the ios and adroids's urls
- **subscription**: sort the subscription in manager interface
- **platform-billing**: basic plaformbilling setting page
- **payment-method**: save payment method
- **notification-rule**: disable and/or send copy to the company
- **bookingnotification**: booking notification form reorganization
- **smartlist**: private filters
- **smartlist**: bug basket date select
- **kube**: full switch to kubernetes servers
- **voucher**: add percent selector along price selector
- **offer**: reactivate delete button on offercard
- **reset-password**: propose help if reset password twice in 4h
- **subscription**: consumer can and must pay their credit subscrtipion
- **gtm**: add basketId on some missing gtm event
- **gtm**: add checkout-items to basket event, type on add-to-card events
- **vod**: pass give access to VOD
- **offeredit**: custom offer selection for recursive edit of similar offers
- **archive**: delete and restore coach/establshment even if future offers planned
- **nf525**: upload doc in settings for NF525
- **subscription**: allow 0e subscription w/ credit payment
- **subscription**: private-pass (RDV) subscription
- **apm**: first step testing instrumentation w/ elastic RUM
- test(producttour): add/ids
- **member**: terms and conditions in Member detail
- **client**: cancel-condition
- **associated coach api**: changed endpoint for create/update/link_email coach
- **idds**: chnage some idds
- **temp-password**: increase temp password validity to 1 week
- **bookingcreationnotification**: improved tooltips and form validation
- (fix): idds
- **bookingcreationnotification**: added booking notifications for establishment and meta_activity
- (ids): add/ids

### Perf

- **payment-pack**: optional check on bookings_within_month because annotation was removed on backend
- **email-tempaltes**: load templates only when dialog is open on membersummarycard
- **particlejs**: rmeove particlejs for error cleaning and perf

### Fix

- **subscription**: fix stupid error
- **gtm**: add price in gtm
- **translation**: lol
- **dashboard**: correctly filter invoiceitem
- **login**: center login form
- **i18n**: import es locale for moment
- **i18n**: import es locale for moment
- **recurrence-booking**: open recurrence booking form when no booking selected
- **recurrence-booking**: open recurrence booking form when no booking selected
- **login**: center login form
- **timezone**: fix a bug when no timezone on offerlistv2
- **gtm**: add event on pre-checkout pages
- **check-in**: register on check-in app without pb
- **communication**: link smartlist commuinication to smartlist in back
- **communication**: fixes on member detail + order page
- **contract**: edit a contract to set a combo
- **subscription**: fix some modal on payment in marketplace
- **voucher**: format cts in subscription
- **timezone**: fix offer header
- **i18n**: add ireland bank account
- **timezone**: remove timezone reference in useless ref
- **timezone**: micro fix
- **quickfix**: random quickfix
- **payment-combo**: fix refresh error whenusing private-pass
- **rum**: disable rum bullshit
- **waiting-list**: register cancelled bookings on waiting-list
- **quickinvoice**: fix remove invoice item and UnevenInvoiceDialog float display
- **payment-method**: fetch payument methods only if valid member id
- **booking-revert**: set loading to false after action
- **random**: random fixes post-merge
- **random**: random fixes post-merge
- **random**: random fixes post-merge
- **payment-method**: fix some pb when registering sepa on mobile
- **offer-direct-payment**: remove abd infinite loading page
- **platform-billing**: show right price on platform invoice
- **payment-method**: disable payment-method switch on old subscription
- **offer-card**: show coach on offer-card
- **subscription**: pay on offerbooking page
- **payment-method**: better refresh of methods on subscription paymebnt form
- **subscription**: do not ask for payment on 0e subscription
- **payment-rule**: bug when 1 bonus in rules
- **payment-rule**: ability to par pallier
- **disable-offer**: show mass offer being disabled
- **booking-discard**: attempt to fix error message on refund booking
- **self-checkin**: do not show cancelled bookings in tablet
- **qf**: qffix
- **booking**: is_discardable is kind of broken
- **kube**: back to no-kube for security
- **stupidity**: so much stupidity
- **kube**: switch env
- **waitinglist**: allow 15 minutes delay
- **booking**: revert is_discardable
- **vod**: category proposed in marketplace are bounded to videos
- **sct**: localization of SCT
- **login**: change translation when email exists
- **flag**: england
- **localization**: remove la suisse from locale created
- **sentry**: fix versionning scheme on sentry
- **report**: bug
- **lint**: appbar
- **bookingnotifications**: fixed undefined
- **sentry**: change sourcemap url-prefix and version w/ sha
- **bookingstatistics**: fixed offer graph visuals in planning page

### feat

- **recurrent-booking**: add recurrent booking on member page and fix pagination
- **timezone**: add timezones in manager interface display
- **CashBook**: add report for cashBook
- **Member**: count objects in tabs
- **emails**: add checkbox for canceledBooking in sending emails
- **settings**: make editable the ios and adroids's urls
- **offercard**: reactivate button delete
- **subscription**: private pass (RDV) available for subscription
- **appbar**: user/menu
- (client): add-last-discard
- **change**: idds

### Refactor

- **ids**: add more ids
- **ids**: add more ids

### fix

- **cleanup**: can not unselect first offer + fix translation loading

## 42.9.0 (2020-08-18)

### Feat

- **invoice**: prompt for uneven invoices in offermanagement.component
- **widget**: share button for widget and calendar url
- **payment-pack**: limit purchase per payment-pack per member
- **payment-pack**: add day limitation
- **marketplace calendar**: added new theme settings to personalize the manager & customer calendars
- **SCT**: SCT localized

### Refactor

- **calendar**: clean a bit the UI

### Fix

- **language**: default language is english
- **payment**: block manager from payment pages

## 42.8.0 (2020-08-14)

### Feat

- **marketplace calendar**: added new theme settings to personalize the manager & customer calendars

## 42.7.0 (2020-08-13)

### Feat

- **invoice**: voucher for quick invoices

## 42.6.0 (2020-08-13)

### Feat

- **report**: add first privatebooking report

## 42.5.1 (2020-08-13)

### Fix

- **version**: fetch tag berfore running cz bump
- **version**: test bump versionning

## 42.5.0 (2020-08-13)

### Feat

- **face-id**: FaceID working on tablet interface

### feat

- **face-id**: working flow, UX to be improved (+member form)

## 42.14.0b6 (2020-11-12)

### Feat

- **video**: buy video
- **private_booking**: restore for private bookings (only manager)
- **meta_activity**: auto_discard in MetaActivityForm and new notification rule
- **payment-packs**: add max bookings per month field
- **dashboard**: qualitative barchart and saving
- **consumer_payment_pack**: show history of modifying credit
- **exporthtml**: add button to export html file from email editor
- **platform-billing**: show max/min stage and coupon in settings
- **subscription**: auto-set subscription 0€ to credit + display flat fee
- **booking-option**: disable notification on discard booking-option when converting as booking
- **booking-option**: disable notification on discard booking-option when converting as booking
- **partial-refund**: improve pack partial refund
- **partial-refund**: improve pack partial refund
- **subscription**: scheduled stop for subscriptions
- **subscription**: scheduled stop for subscriptions
- **menu**: denser responsive drawer nested menu item
- **menu**: denser responsive drawer nested menu item
- **phone**: translate phone in other countries
- **phone**: translate phone in other countries
- **smartlist**: add attendance option for BookingsFilters and BookingsNumberFilter
- **recurrence-rule**: add establishment in recurrence rule booking
- **smartlist**: add attendance option for BookingsFilters and BookingsNumberFilter
- **recurrence-rule**: add establishment in recurrence rule booking
- **gtm**: add gtm on custom login pages
- **offer**: restore offer button
- **mass_disable**: add background task for mass disable
- **communication-dialog**: add sms and email-template email
- **rum**: disable elasticsearch RUM
- **booking**: filter on recurrence-rule-booking-isnull
- **offer**: chose default view cancelled offer (manager space)
- **offer**: background task for offer edit and offer create
- **component birthday email**: add new component to birthday celebration email
- **booking**: add filter not cancelled
- **report**: addres/birthday in reports
- **notification-rule**: add invoice notif and waiting-list kick
- **dashboard**: new dashboard page
- **recurrent-booking**: add recurrent booking on member page and fix pagination
- **report**: add nb_offer and nb_offer_cancelled
- **background-task**: background task monitoring and background task for disabling/deleting offers
- **timezone**: return timezone_name in company onboarding
- **timezone**: handle multitimezone
- **bookingstatistics**: bookingStatistics filtered by offerFilters in calendar page
- **bookingnotification**: notify every attendance / absence / cancellation ... for booking notif
- **coupon**: add to subscription
- **refund**: more explicit refund message
- **booking-revert**: notify or not client about cancellation of their booking
- **sepa**: allow oneshot sepa payment
- **offer**: add recurrence rule for booking
- **offer-card**: show if was first booking w/ ★
- **bank-account**: support spanish bank accounts for companies
- **platform-billing**: add multiple payment methods
- **report**: add on spot payment report and add a button to generate it from cashbook
- **offer-card**: back more info on card
- **theme**: add general_terms_of_use
- **marketplace**: add an appbar w/ email+basket on payment pages
- **access-code**: add access codes to company onboarding
- **platform-billing**: add payment method even if no subscription/billing-group
- **platform-billing**: add new screen platform billing
- **member**: count objects in tabs
- **gtm**: add gtm in offer payment/booking page
- **emails**: add checkbox to send emails to canceled Bookings
- **settings**: make editable the ios and adroids's urls
- **subscription**: sort the subscription in manager interface
- **platform-billing**: basic plaformbilling setting page
- **payment-method**: save payment method
- **notification-rule**: disable and/or send copy to the company
- **bookingnotification**: booking notification form reorganization
- **smartlist**: private filters
- **smartlist**: bug basket date select
- **kube**: full switch to kubernetes servers
- **voucher**: add percent selector along price selector
- **offer**: reactivate delete button on offercard
- **reset-password**: propose help if reset password twice in 4h
- **subscription**: consumer can and must pay their credit subscrtipion
- **gtm**: add basketId on some missing gtm event
- **gtm**: add checkout-items to basket event, type on add-to-card events
- **vod**: pass give access to VOD
- **offeredit**: custom offer selection for recursive edit of similar offers
- **archive**: delete and restore coach/establshment even if future offers planned
- **nf525**: upload doc in settings for NF525
- **subscription**: allow 0e subscription w/ credit payment
- **subscription**: private-pass (RDV) subscription
- **apm**: first step testing instrumentation w/ elastic RUM
- test(producttour): add/ids
- **member**: terms and conditions in Member detail
- **client**: cancel-condition
- **associated coach api**: changed endpoint for create/update/link_email coach
- **idds**: chnage some idds
- **temp-password**: increase temp password validity to 1 week
- **bookingcreationnotification**: improved tooltips and form validation
- (fix): idds
- **bookingcreationnotification**: added booking notifications for establishment and meta_activity
- (ids): add/ids

### Perf

- **payment-pack**: optional check on bookings_within_month because annotation was removed on backend
- **email-tempaltes**: load templates only when dialog is open on membersummarycard
- **particlejs**: rmeove particlejs for error cleaning and perf

### Fix

- **subscription**: fix stupid error
- **gtm**: add price in gtm
- **translation**: lol
- **dashboard**: correctly filter invoiceitem
- **login**: center login form
- **i18n**: import es locale for moment
- **i18n**: import es locale for moment
- **recurrence-booking**: open recurrence booking form when no booking selected
- **recurrence-booking**: open recurrence booking form when no booking selected
- **login**: center login form
- **timezone**: fix a bug when no timezone on offerlistv2
- **gtm**: add event on pre-checkout pages
- **check-in**: register on check-in app without pb
- **communication**: link smartlist commuinication to smartlist in back
- **communication**: fixes on member detail + order page
- **contract**: edit a contract to set a combo
- **subscription**: fix some modal on payment in marketplace
- **voucher**: format cts in subscription
- **timezone**: fix offer header
- **i18n**: add ireland bank account
- **timezone**: remove timezone reference in useless ref
- **timezone**: micro fix
- **quickfix**: random quickfix
- **payment-combo**: fix refresh error whenusing private-pass
- **rum**: disable rum bullshit
- **waiting-list**: register cancelled bookings on waiting-list
- **quickinvoice**: fix remove invoice item and UnevenInvoiceDialog float display
- **payment-method**: fetch payument methods only if valid member id
- **booking-revert**: set loading to false after action
- **random**: random fixes post-merge
- **random**: random fixes post-merge
- **random**: random fixes post-merge
- **payment-method**: fix some pb when registering sepa on mobile
- **offer-direct-payment**: remove abd infinite loading page
- **platform-billing**: show right price on platform invoice
- **payment-method**: disable payment-method switch on old subscription
- **offer-card**: show coach on offer-card
- **subscription**: pay on offerbooking page
- **payment-method**: better refresh of methods on subscription paymebnt form
- **subscription**: do not ask for payment on 0e subscription
- **payment-rule**: bug when 1 bonus in rules
- **payment-rule**: ability to par pallier
- **disable-offer**: show mass offer being disabled
- **booking-discard**: attempt to fix error message on refund booking
- **self-checkin**: do not show cancelled bookings in tablet
- **qf**: qffix
- **booking**: is_discardable is kind of broken
- **kube**: back to no-kube for security
- **stupidity**: so much stupidity
- **kube**: switch env
- **waitinglist**: allow 15 minutes delay
- **booking**: revert is_discardable
- **vod**: category proposed in marketplace are bounded to videos
- **sct**: localization of SCT
- **login**: change translation when email exists
- **flag**: england
- **localization**: remove la suisse from locale created
- **sentry**: fix versionning scheme on sentry
- **report**: bug
- **lint**: appbar
- **bookingnotifications**: fixed undefined
- **sentry**: change sourcemap url-prefix and version w/ sha
- **bookingstatistics**: fixed offer graph visuals in planning page

### feat

- **recurrent-booking**: add recurrent booking on member page and fix pagination
- **timezone**: add timezones in manager interface display
- **CashBook**: add report for cashBook
- **Member**: count objects in tabs
- **emails**: add checkbox for canceledBooking in sending emails
- **settings**: make editable the ios and adroids's urls
- **offercard**: reactivate button delete
- **subscription**: private pass (RDV) available for subscription
- **appbar**: user/menu
- (client): add-last-discard
- **change**: idds

### Refactor

- **ids**: add more ids
- **ids**: add more ids

### fix

- **cleanup**: can not unselect first offer + fix translation loading

## 42.9.0 (2020-08-18)

### Feat

- **invoice**: prompt for uneven invoices in offermanagement.component
- **widget**: share button for widget and calendar url
- **payment-pack**: limit purchase per payment-pack per member
- **payment-pack**: add day limitation
- **marketplace calendar**: added new theme settings to personalize the manager & customer calendars
- **SCT**: SCT localized

### Refactor

- **calendar**: clean a bit the UI

### Fix

- **language**: default language is english
- **payment**: block manager from payment pages

## 42.8.0 (2020-08-14)

### Feat

- **marketplace calendar**: added new theme settings to personalize the manager & customer calendars

## 42.7.0 (2020-08-13)

### Feat

- **invoice**: voucher for quick invoices

## 42.6.0 (2020-08-13)

### Feat

- **report**: add first privatebooking report

## 42.5.1 (2020-08-13)

### Fix

- **version**: fetch tag berfore running cz bump
- **version**: test bump versionning

## 42.5.0 (2020-08-13)

### Feat

- **face-id**: FaceID working on tablet interface

### feat

- **face-id**: working flow, UX to be improved (+member form)

## 42.14.0b6 (2020-11-12)

### Feat

- **video**: buy video
- **private_booking**: restore for private bookings (only manager)
- **meta_activity**: auto_discard in MetaActivityForm and new notification rule
- **payment-packs**: add max bookings per month field
- **dashboard**: qualitative barchart and saving
- **consumer_payment_pack**: show history of modifying credit
- **exporthtml**: add button to export html file from email editor
- **platform-billing**: show max/min stage and coupon in settings
- **subscription**: auto-set subscription 0€ to credit + display flat fee
- **booking-option**: disable notification on discard booking-option when converting as booking
- **booking-option**: disable notification on discard booking-option when converting as booking
- **partial-refund**: improve pack partial refund
- **partial-refund**: improve pack partial refund
- **subscription**: scheduled stop for subscriptions
- **subscription**: scheduled stop for subscriptions
- **menu**: denser responsive drawer nested menu item
- **menu**: denser responsive drawer nested menu item
- **phone**: translate phone in other countries
- **phone**: translate phone in other countries
- **smartlist**: add attendance option for BookingsFilters and BookingsNumberFilter
- **recurrence-rule**: add establishment in recurrence rule booking
- **smartlist**: add attendance option for BookingsFilters and BookingsNumberFilter
- **recurrence-rule**: add establishment in recurrence rule booking
- **gtm**: add gtm on custom login pages
- **offer**: restore offer button
- **mass_disable**: add background task for mass disable
- **communication-dialog**: add sms and email-template email
- **rum**: disable elasticsearch RUM
- **booking**: filter on recurrence-rule-booking-isnull
- **offer**: chose default view cancelled offer (manager space)
- **offer**: background task for offer edit and offer create
- **component birthday email**: add new component to birthday celebration email
- **booking**: add filter not cancelled
- **report**: addres/birthday in reports
- **notification-rule**: add invoice notif and waiting-list kick
- **dashboard**: new dashboard page
- **recurrent-booking**: add recurrent booking on member page and fix pagination
- **report**: add nb_offer and nb_offer_cancelled
- **background-task**: background task monitoring and background task for disabling/deleting offers
- **timezone**: return timezone_name in company onboarding
- **timezone**: handle multitimezone
- **bookingstatistics**: bookingStatistics filtered by offerFilters in calendar page
- **bookingnotification**: notify every attendance / absence / cancellation ... for booking notif
- **coupon**: add to subscription
- **refund**: more explicit refund message
- **booking-revert**: notify or not client about cancellation of their booking
- **sepa**: allow oneshot sepa payment
- **offer**: add recurrence rule for booking
- **offer-card**: show if was first booking w/ ★
- **bank-account**: support spanish bank accounts for companies
- **platform-billing**: add multiple payment methods
- **report**: add on spot payment report and add a button to generate it from cashbook
- **offer-card**: back more info on card
- **theme**: add general_terms_of_use
- **marketplace**: add an appbar w/ email+basket on payment pages
- **access-code**: add access codes to company onboarding
- **platform-billing**: add payment method even if no subscription/billing-group
- **platform-billing**: add new screen platform billing
- **member**: count objects in tabs
- **gtm**: add gtm in offer payment/booking page
- **emails**: add checkbox to send emails to canceled Bookings
- **settings**: make editable the ios and adroids's urls
- **subscription**: sort the subscription in manager interface
- **platform-billing**: basic plaformbilling setting page
- **payment-method**: save payment method
- **notification-rule**: disable and/or send copy to the company
- **bookingnotification**: booking notification form reorganization
- **smartlist**: private filters
- **smartlist**: bug basket date select
- **kube**: full switch to kubernetes servers
- **voucher**: add percent selector along price selector
- **offer**: reactivate delete button on offercard
- **reset-password**: propose help if reset password twice in 4h
- **subscription**: consumer can and must pay their credit subscrtipion
- **gtm**: add basketId on some missing gtm event
- **gtm**: add checkout-items to basket event, type on add-to-card events
- **vod**: pass give access to VOD
- **offeredit**: custom offer selection for recursive edit of similar offers
- **archive**: delete and restore coach/establshment even if future offers planned
- **nf525**: upload doc in settings for NF525
- **subscription**: allow 0e subscription w/ credit payment
- **subscription**: private-pass (RDV) subscription
- **apm**: first step testing instrumentation w/ elastic RUM
- test(producttour): add/ids
- **member**: terms and conditions in Member detail
- **client**: cancel-condition
- **associated coach api**: changed endpoint for create/update/link_email coach
- **idds**: chnage some idds
- **temp-password**: increase temp password validity to 1 week
- **bookingcreationnotification**: improved tooltips and form validation
- (fix): idds
- **bookingcreationnotification**: added booking notifications for establishment and meta_activity
- (ids): add/ids

### Perf

- **payment-pack**: optional check on bookings_within_month because annotation was removed on backend
- **email-tempaltes**: load templates only when dialog is open on membersummarycard
- **particlejs**: rmeove particlejs for error cleaning and perf

### Fix

- **subscription**: fix stupid error
- **gtm**: add price in gtm
- **translation**: lol
- **dashboard**: correctly filter invoiceitem
- **login**: center login form
- **i18n**: import es locale for moment
- **i18n**: import es locale for moment
- **recurrence-booking**: open recurrence booking form when no booking selected
- **recurrence-booking**: open recurrence booking form when no booking selected
- **login**: center login form
- **timezone**: fix a bug when no timezone on offerlistv2
- **gtm**: add event on pre-checkout pages
- **check-in**: register on check-in app without pb
- **communication**: link smartlist commuinication to smartlist in back
- **communication**: fixes on member detail + order page
- **contract**: edit a contract to set a combo
- **subscription**: fix some modal on payment in marketplace
- **voucher**: format cts in subscription
- **timezone**: fix offer header
- **i18n**: add ireland bank account
- **timezone**: remove timezone reference in useless ref
- **timezone**: micro fix
- **quickfix**: random quickfix
- **payment-combo**: fix refresh error whenusing private-pass
- **rum**: disable rum bullshit
- **waiting-list**: register cancelled bookings on waiting-list
- **quickinvoice**: fix remove invoice item and UnevenInvoiceDialog float display
- **payment-method**: fetch payument methods only if valid member id
- **booking-revert**: set loading to false after action
- **random**: random fixes post-merge
- **random**: random fixes post-merge
- **random**: random fixes post-merge
- **payment-method**: fix some pb when registering sepa on mobile
- **offer-direct-payment**: remove abd infinite loading page
- **platform-billing**: show right price on platform invoice
- **payment-method**: disable payment-method switch on old subscription
- **offer-card**: show coach on offer-card
- **subscription**: pay on offerbooking page
- **payment-method**: better refresh of methods on subscription paymebnt form
- **subscription**: do not ask for payment on 0e subscription
- **payment-rule**: bug when 1 bonus in rules
- **payment-rule**: ability to par pallier
- **disable-offer**: show mass offer being disabled
- **booking-discard**: attempt to fix error message on refund booking
- **self-checkin**: do not show cancelled bookings in tablet
- **qf**: qffix
- **booking**: is_discardable is kind of broken
- **kube**: back to no-kube for security
- **stupidity**: so much stupidity
- **kube**: switch env
- **waitinglist**: allow 15 minutes delay
- **booking**: revert is_discardable
- **vod**: category proposed in marketplace are bounded to videos
- **sct**: localization of SCT
- **login**: change translation when email exists
- **flag**: england
- **localization**: remove la suisse from locale created
- **sentry**: fix versionning scheme on sentry
- **report**: bug
- **lint**: appbar
- **bookingnotifications**: fixed undefined
- **sentry**: change sourcemap url-prefix and version w/ sha
- **bookingstatistics**: fixed offer graph visuals in planning page

### feat

- **recurrent-booking**: add recurrent booking on member page and fix pagination
- **timezone**: add timezones in manager interface display
- **CashBook**: add report for cashBook
- **Member**: count objects in tabs
- **emails**: add checkbox for canceledBooking in sending emails
- **settings**: make editable the ios and adroids's urls
- **offercard**: reactivate button delete
- **subscription**: private pass (RDV) available for subscription
- **appbar**: user/menu
- (client): add-last-discard
- **change**: idds

### Refactor

- **ids**: add more ids
- **ids**: add more ids

### fix

- **cleanup**: can not unselect first offer + fix translation loading

## 42.9.0 (2020-08-18)

### Feat

- **invoice**: prompt for uneven invoices in offermanagement.component
- **widget**: share button for widget and calendar url
- **payment-pack**: limit purchase per payment-pack per member
- **payment-pack**: add day limitation
- **marketplace calendar**: added new theme settings to personalize the manager & customer calendars
- **SCT**: SCT localized

### Refactor

- **calendar**: clean a bit the UI

### Fix

- **language**: default language is english
- **payment**: block manager from payment pages

## 42.8.0 (2020-08-14)

### Feat

- **marketplace calendar**: added new theme settings to personalize the manager & customer calendars

## 42.7.0 (2020-08-13)

### Feat

- **invoice**: voucher for quick invoices

## 42.6.0 (2020-08-13)

### Feat

- **report**: add first privatebooking report

## 42.5.1 (2020-08-13)

### Fix

- **version**: fetch tag berfore running cz bump
- **version**: test bump versionning

## 42.5.0 (2020-08-13)

### Feat

- **face-id**: FaceID working on tablet interface

### feat

- **face-id**: working flow, UX to be improved (+member form)

## 42.14.0b4 (2020-11-11)

### Feat

- **video**: buy video
- **private_booking**: restore for private bookings (only manager)
- **meta_activity**: auto_discard in MetaActivityForm and new notification rule
- **payment-packs**: add max bookings per month field
- **dashboard**: qualitative barchart and saving
- **consumer_payment_pack**: show history of modifying credit
- **exporthtml**: add button to export html file from email editor
- **platform-billing**: show max/min stage and coupon in settings
- **subscription**: auto-set subscription 0€ to credit + display flat fee
- **booking-option**: disable notification on discard booking-option when converting as booking
- **booking-option**: disable notification on discard booking-option when converting as booking
- **partial-refund**: improve pack partial refund
- **partial-refund**: improve pack partial refund
- **subscription**: scheduled stop for subscriptions
- **subscription**: scheduled stop for subscriptions
- **menu**: denser responsive drawer nested menu item
- **menu**: denser responsive drawer nested menu item
- **phone**: translate phone in other countries
- **phone**: translate phone in other countries
- **smartlist**: add attendance option for BookingsFilters and BookingsNumberFilter
- **recurrence-rule**: add establishment in recurrence rule booking
- **smartlist**: add attendance option for BookingsFilters and BookingsNumberFilter
- **recurrence-rule**: add establishment in recurrence rule booking
- **gtm**: add gtm on custom login pages
- **offer**: restore offer button
- **mass_disable**: add background task for mass disable
- **communication-dialog**: add sms and email-template email
- **rum**: disable elasticsearch RUM
- **booking**: filter on recurrence-rule-booking-isnull
- **offer**: chose default view cancelled offer (manager space)
- **offer**: background task for offer edit and offer create
- **component birthday email**: add new component to birthday celebration email
- **booking**: add filter not cancelled
- **report**: addres/birthday in reports
- **notification-rule**: add invoice notif and waiting-list kick
- **dashboard**: new dashboard page
- **recurrent-booking**: add recurrent booking on member page and fix pagination
- **report**: add nb_offer and nb_offer_cancelled
- **background-task**: background task monitoring and background task for disabling/deleting offers
- **timezone**: return timezone_name in company onboarding
- **timezone**: handle multitimezone
- **bookingstatistics**: bookingStatistics filtered by offerFilters in calendar page
- **bookingnotification**: notify every attendance / absence / cancellation ... for booking notif
- **coupon**: add to subscription
- **refund**: more explicit refund message
- **booking-revert**: notify or not client about cancellation of their booking
- **sepa**: allow oneshot sepa payment
- **offer**: add recurrence rule for booking
- **offer-card**: show if was first booking w/ ★
- **bank-account**: support spanish bank accounts for companies
- **platform-billing**: add multiple payment methods
- **report**: add on spot payment report and add a button to generate it from cashbook
- **offer-card**: back more info on card
- **theme**: add general_terms_of_use
- **marketplace**: add an appbar w/ email+basket on payment pages
- **access-code**: add access codes to company onboarding
- **platform-billing**: add payment method even if no subscription/billing-group
- **platform-billing**: add new screen platform billing
- **member**: count objects in tabs
- **gtm**: add gtm in offer payment/booking page
- **emails**: add checkbox to send emails to canceled Bookings
- **settings**: make editable the ios and adroids's urls
- **subscription**: sort the subscription in manager interface
- **platform-billing**: basic plaformbilling setting page
- **payment-method**: save payment method
- **notification-rule**: disable and/or send copy to the company
- **bookingnotification**: booking notification form reorganization
- **smartlist**: private filters
- **smartlist**: bug basket date select
- **kube**: full switch to kubernetes servers
- **voucher**: add percent selector along price selector
- **offer**: reactivate delete button on offercard
- **reset-password**: propose help if reset password twice in 4h
- **subscription**: consumer can and must pay their credit subscrtipion
- **gtm**: add basketId on some missing gtm event
- **gtm**: add checkout-items to basket event, type on add-to-card events
- **vod**: pass give access to VOD
- **offeredit**: custom offer selection for recursive edit of similar offers
- **archive**: delete and restore coach/establshment even if future offers planned
- **nf525**: upload doc in settings for NF525
- **subscription**: allow 0e subscription w/ credit payment
- **subscription**: private-pass (RDV) subscription
- **apm**: first step testing instrumentation w/ elastic RUM
- test(producttour): add/ids
- **member**: terms and conditions in Member detail
- **client**: cancel-condition
- **associated coach api**: changed endpoint for create/update/link_email coach
- **idds**: chnage some idds
- **temp-password**: increase temp password validity to 1 week
- **bookingcreationnotification**: improved tooltips and form validation
- (fix): idds
- **bookingcreationnotification**: added booking notifications for establishment and meta_activity
- (ids): add/ids

### Perf

- **payment-pack**: optional check on bookings_within_month because annotation was removed on backend
- **email-tempaltes**: load templates only when dialog is open on membersummarycard
- **particlejs**: rmeove particlejs for error cleaning and perf

### Fix

- **subscription**: fix stupid error
- **gtm**: add price in gtm
- **translation**: lol
- **dashboard**: correctly filter invoiceitem
- **login**: center login form
- **i18n**: import es locale for moment
- **i18n**: import es locale for moment
- **recurrence-booking**: open recurrence booking form when no booking selected
- **recurrence-booking**: open recurrence booking form when no booking selected
- **login**: center login form
- **timezone**: fix a bug when no timezone on offerlistv2
- **gtm**: add event on pre-checkout pages
- **check-in**: register on check-in app without pb
- **communication**: link smartlist commuinication to smartlist in back
- **communication**: fixes on member detail + order page
- **contract**: edit a contract to set a combo
- **subscription**: fix some modal on payment in marketplace
- **voucher**: format cts in subscription
- **timezone**: fix offer header
- **i18n**: add ireland bank account
- **timezone**: remove timezone reference in useless ref
- **timezone**: micro fix
- **quickfix**: random quickfix
- **payment-combo**: fix refresh error whenusing private-pass
- **rum**: disable rum bullshit
- **waiting-list**: register cancelled bookings on waiting-list
- **quickinvoice**: fix remove invoice item and UnevenInvoiceDialog float display
- **payment-method**: fetch payument methods only if valid member id
- **booking-revert**: set loading to false after action
- **random**: random fixes post-merge
- **random**: random fixes post-merge
- **random**: random fixes post-merge
- **payment-method**: fix some pb when registering sepa on mobile
- **offer-direct-payment**: remove abd infinite loading page
- **platform-billing**: show right price on platform invoice
- **payment-method**: disable payment-method switch on old subscription
- **offer-card**: show coach on offer-card
- **subscription**: pay on offerbooking page
- **payment-method**: better refresh of methods on subscription paymebnt form
- **subscription**: do not ask for payment on 0e subscription
- **payment-rule**: bug when 1 bonus in rules
- **payment-rule**: ability to par pallier
- **disable-offer**: show mass offer being disabled
- **booking-discard**: attempt to fix error message on refund booking
- **self-checkin**: do not show cancelled bookings in tablet
- **qf**: qffix
- **booking**: is_discardable is kind of broken
- **kube**: back to no-kube for security
- **stupidity**: so much stupidity
- **kube**: switch env
- **waitinglist**: allow 15 minutes delay
- **booking**: revert is_discardable
- **vod**: category proposed in marketplace are bounded to videos
- **sct**: localization of SCT
- **login**: change translation when email exists
- **flag**: england
- **localization**: remove la suisse from locale created
- **sentry**: fix versionning scheme on sentry
- **report**: bug
- **lint**: appbar
- **bookingnotifications**: fixed undefined
- **sentry**: change sourcemap url-prefix and version w/ sha
- **bookingstatistics**: fixed offer graph visuals in planning page

### feat

- **recurrent-booking**: add recurrent booking on member page and fix pagination
- **timezone**: add timezones in manager interface display
- **CashBook**: add report for cashBook
- **Member**: count objects in tabs
- **emails**: add checkbox for canceledBooking in sending emails
- **settings**: make editable the ios and adroids's urls
- **offercard**: reactivate button delete
- **subscription**: private pass (RDV) available for subscription
- **appbar**: user/menu
- (client): add-last-discard
- **change**: idds

### Refactor

- **ids**: add more ids
- **ids**: add more ids

### fix

- **cleanup**: can not unselect first offer + fix translation loading

## 42.9.0 (2020-08-18)

### Feat

- **invoice**: prompt for uneven invoices in offermanagement.component
- **widget**: share button for widget and calendar url
- **payment-pack**: limit purchase per payment-pack per member
- **payment-pack**: add day limitation
- **marketplace calendar**: added new theme settings to personalize the manager & customer calendars
- **SCT**: SCT localized

### Refactor

- **calendar**: clean a bit the UI

### Fix

- **language**: default language is english
- **payment**: block manager from payment pages

## 42.8.0 (2020-08-14)

### Feat

- **marketplace calendar**: added new theme settings to personalize the manager & customer calendars

## 42.7.0 (2020-08-13)

### Feat

- **invoice**: voucher for quick invoices

## 42.6.0 (2020-08-13)

### Feat

- **report**: add first privatebooking report

## 42.5.1 (2020-08-13)

### Fix

- **version**: fetch tag berfore running cz bump
- **version**: test bump versionning

## 42.5.0 (2020-08-13)

### Feat

- **face-id**: FaceID working on tablet interface

### feat

- **face-id**: working flow, UX to be improved (+member form)

## 42.14.0b4 (2020-11-11)

### Feat

- **video**: buy video
- **private_booking**: restore for private bookings (only manager)
- **meta_activity**: auto_discard in MetaActivityForm and new notification rule
- **payment-packs**: add max bookings per month field
- **dashboard**: qualitative barchart and saving
- **consumer_payment_pack**: show history of modifying credit
- **exporthtml**: add button to export html file from email editor
- **platform-billing**: show max/min stage and coupon in settings
- **subscription**: auto-set subscription 0€ to credit + display flat fee
- **booking-option**: disable notification on discard booking-option when converting as booking
- **booking-option**: disable notification on discard booking-option when converting as booking
- **partial-refund**: improve pack partial refund
- **partial-refund**: improve pack partial refund
- **subscription**: scheduled stop for subscriptions
- **subscription**: scheduled stop for subscriptions
- **menu**: denser responsive drawer nested menu item
- **menu**: denser responsive drawer nested menu item
- **phone**: translate phone in other countries
- **phone**: translate phone in other countries
- **smartlist**: add attendance option for BookingsFilters and BookingsNumberFilter
- **recurrence-rule**: add establishment in recurrence rule booking
- **smartlist**: add attendance option for BookingsFilters and BookingsNumberFilter
- **recurrence-rule**: add establishment in recurrence rule booking
- **gtm**: add gtm on custom login pages
- **offer**: restore offer button
- **mass_disable**: add background task for mass disable
- **communication-dialog**: add sms and email-template email
- **rum**: disable elasticsearch RUM
- **booking**: filter on recurrence-rule-booking-isnull
- **offer**: chose default view cancelled offer (manager space)
- **offer**: background task for offer edit and offer create
- **component birthday email**: add new component to birthday celebration email
- **booking**: add filter not cancelled
- **report**: addres/birthday in reports
- **notification-rule**: add invoice notif and waiting-list kick
- **dashboard**: new dashboard page
- **recurrent-booking**: add recurrent booking on member page and fix pagination
- **report**: add nb_offer and nb_offer_cancelled
- **background-task**: background task monitoring and background task for disabling/deleting offers
- **timezone**: return timezone_name in company onboarding
- **timezone**: handle multitimezone
- **bookingstatistics**: bookingStatistics filtered by offerFilters in calendar page
- **bookingnotification**: notify every attendance / absence / cancellation ... for booking notif
- **coupon**: add to subscription
- **refund**: more explicit refund message
- **booking-revert**: notify or not client about cancellation of their booking
- **sepa**: allow oneshot sepa payment
- **offer**: add recurrence rule for booking
- **offer-card**: show if was first booking w/ ★
- **bank-account**: support spanish bank accounts for companies
- **platform-billing**: add multiple payment methods
- **report**: add on spot payment report and add a button to generate it from cashbook
- **offer-card**: back more info on card
- **theme**: add general_terms_of_use
- **marketplace**: add an appbar w/ email+basket on payment pages
- **access-code**: add access codes to company onboarding
- **platform-billing**: add payment method even if no subscription/billing-group
- **platform-billing**: add new screen platform billing
- **member**: count objects in tabs
- **gtm**: add gtm in offer payment/booking page
- **emails**: add checkbox to send emails to canceled Bookings
- **settings**: make editable the ios and adroids's urls
- **subscription**: sort the subscription in manager interface
- **platform-billing**: basic plaformbilling setting page
- **payment-method**: save payment method
- **notification-rule**: disable and/or send copy to the company
- **bookingnotification**: booking notification form reorganization
- **smartlist**: private filters
- **smartlist**: bug basket date select
- **kube**: full switch to kubernetes servers
- **voucher**: add percent selector along price selector
- **offer**: reactivate delete button on offercard
- **reset-password**: propose help if reset password twice in 4h
- **subscription**: consumer can and must pay their credit subscrtipion
- **gtm**: add basketId on some missing gtm event
- **gtm**: add checkout-items to basket event, type on add-to-card events
- **vod**: pass give access to VOD
- **offeredit**: custom offer selection for recursive edit of similar offers
- **archive**: delete and restore coach/establshment even if future offers planned
- **nf525**: upload doc in settings for NF525
- **subscription**: allow 0e subscription w/ credit payment
- **subscription**: private-pass (RDV) subscription
- **apm**: first step testing instrumentation w/ elastic RUM
- test(producttour): add/ids
- **member**: terms and conditions in Member detail
- **client**: cancel-condition
- **associated coach api**: changed endpoint for create/update/link_email coach
- **idds**: chnage some idds
- **temp-password**: increase temp password validity to 1 week
- **bookingcreationnotification**: improved tooltips and form validation
- (fix): idds
- **bookingcreationnotification**: added booking notifications for establishment and meta_activity
- (ids): add/ids

### Perf

- **payment-pack**: optional check on bookings_within_month because annotation was removed on backend
- **email-tempaltes**: load templates only when dialog is open on membersummarycard
- **particlejs**: rmeove particlejs for error cleaning and perf

### Fix

- **subscription**: fix stupid error
- **gtm**: add price in gtm
- **translation**: lol
- **dashboard**: correctly filter invoiceitem
- **login**: center login form
- **i18n**: import es locale for moment
- **i18n**: import es locale for moment
- **recurrence-booking**: open recurrence booking form when no booking selected
- **recurrence-booking**: open recurrence booking form when no booking selected
- **login**: center login form
- **timezone**: fix a bug when no timezone on offerlistv2
- **gtm**: add event on pre-checkout pages
- **check-in**: register on check-in app without pb
- **communication**: link smartlist commuinication to smartlist in back
- **communication**: fixes on member detail + order page
- **contract**: edit a contract to set a combo
- **subscription**: fix some modal on payment in marketplace
- **voucher**: format cts in subscription
- **timezone**: fix offer header
- **i18n**: add ireland bank account
- **timezone**: remove timezone reference in useless ref
- **timezone**: micro fix
- **quickfix**: random quickfix
- **payment-combo**: fix refresh error whenusing private-pass
- **rum**: disable rum bullshit
- **waiting-list**: register cancelled bookings on waiting-list
- **quickinvoice**: fix remove invoice item and UnevenInvoiceDialog float display
- **payment-method**: fetch payument methods only if valid member id
- **booking-revert**: set loading to false after action
- **random**: random fixes post-merge
- **random**: random fixes post-merge
- **random**: random fixes post-merge
- **payment-method**: fix some pb when registering sepa on mobile
- **offer-direct-payment**: remove abd infinite loading page
- **platform-billing**: show right price on platform invoice
- **payment-method**: disable payment-method switch on old subscription
- **offer-card**: show coach on offer-card
- **subscription**: pay on offerbooking page
- **payment-method**: better refresh of methods on subscription paymebnt form
- **subscription**: do not ask for payment on 0e subscription
- **payment-rule**: bug when 1 bonus in rules
- **payment-rule**: ability to par pallier
- **disable-offer**: show mass offer being disabled
- **booking-discard**: attempt to fix error message on refund booking
- **self-checkin**: do not show cancelled bookings in tablet
- **qf**: qffix
- **booking**: is_discardable is kind of broken
- **kube**: back to no-kube for security
- **stupidity**: so much stupidity
- **kube**: switch env
- **waitinglist**: allow 15 minutes delay
- **booking**: revert is_discardable
- **vod**: category proposed in marketplace are bounded to videos
- **sct**: localization of SCT
- **login**: change translation when email exists
- **flag**: england
- **localization**: remove la suisse from locale created
- **sentry**: fix versionning scheme on sentry
- **report**: bug
- **lint**: appbar
- **bookingnotifications**: fixed undefined
- **sentry**: change sourcemap url-prefix and version w/ sha
- **bookingstatistics**: fixed offer graph visuals in planning page

### feat

- **recurrent-booking**: add recurrent booking on member page and fix pagination
- **timezone**: add timezones in manager interface display
- **CashBook**: add report for cashBook
- **Member**: count objects in tabs
- **emails**: add checkbox for canceledBooking in sending emails
- **settings**: make editable the ios and adroids's urls
- **offercard**: reactivate button delete
- **subscription**: private pass (RDV) available for subscription
- **appbar**: user/menu
- (client): add-last-discard
- **change**: idds

### Refactor

- **ids**: add more ids
- **ids**: add more ids

### fix

- **cleanup**: can not unselect first offer + fix translation loading

## 42.9.0 (2020-08-18)

### Feat

- **invoice**: prompt for uneven invoices in offermanagement.component
- **widget**: share button for widget and calendar url
- **payment-pack**: limit purchase per payment-pack per member
- **payment-pack**: add day limitation
- **marketplace calendar**: added new theme settings to personalize the manager & customer calendars
- **SCT**: SCT localized

### Refactor

- **calendar**: clean a bit the UI

### Fix

- **language**: default language is english
- **payment**: block manager from payment pages

## 42.8.0 (2020-08-14)

### Feat

- **marketplace calendar**: added new theme settings to personalize the manager & customer calendars

## 42.7.0 (2020-08-13)

### Feat

- **invoice**: voucher for quick invoices

## 42.6.0 (2020-08-13)

### Feat

- **report**: add first privatebooking report

## 42.5.1 (2020-08-13)

### Fix

- **version**: fetch tag berfore running cz bump
- **version**: test bump versionning

## 42.5.0 (2020-08-13)

### Feat

- **face-id**: FaceID working on tablet interface

### feat

- **face-id**: working flow, UX to be improved (+member form)

## 42.14.0b2 (2020-11-11)

### Feat

- **video**: buy video
- **private_booking**: restore for private bookings (only manager)
- **meta_activity**: auto_discard in MetaActivityForm and new notification rule
- **payment-packs**: add max bookings per month field
- **dashboard**: qualitative barchart and saving
- **consumer_payment_pack**: show history of modifying credit
- **exporthtml**: add button to export html file from email editor
- **platform-billing**: show max/min stage and coupon in settings
- **subscription**: auto-set subscription 0€ to credit + display flat fee
- **booking-option**: disable notification on discard booking-option when converting as booking
- **booking-option**: disable notification on discard booking-option when converting as booking
- **partial-refund**: improve pack partial refund
- **partial-refund**: improve pack partial refund
- **subscription**: scheduled stop for subscriptions
- **subscription**: scheduled stop for subscriptions
- **menu**: denser responsive drawer nested menu item
- **menu**: denser responsive drawer nested menu item
- **phone**: translate phone in other countries
- **phone**: translate phone in other countries
- **smartlist**: add attendance option for BookingsFilters and BookingsNumberFilter
- **recurrence-rule**: add establishment in recurrence rule booking
- **smartlist**: add attendance option for BookingsFilters and BookingsNumberFilter
- **recurrence-rule**: add establishment in recurrence rule booking
- **gtm**: add gtm on custom login pages
- **offer**: restore offer button
- **mass_disable**: add background task for mass disable
- **communication-dialog**: add sms and email-template email
- **rum**: disable elasticsearch RUM
- **booking**: filter on recurrence-rule-booking-isnull
- **offer**: chose default view cancelled offer (manager space)
- **offer**: background task for offer edit and offer create
- **component birthday email**: add new component to birthday celebration email
- **booking**: add filter not cancelled
- **report**: addres/birthday in reports
- **notification-rule**: add invoice notif and waiting-list kick
- **dashboard**: new dashboard page
- **recurrent-booking**: add recurrent booking on member page and fix pagination
- **report**: add nb_offer and nb_offer_cancelled
- **background-task**: background task monitoring and background task for disabling/deleting offers
- **timezone**: return timezone_name in company onboarding
- **timezone**: handle multitimezone
- **bookingstatistics**: bookingStatistics filtered by offerFilters in calendar page
- **bookingnotification**: notify every attendance / absence / cancellation ... for booking notif
- **coupon**: add to subscription
- **refund**: more explicit refund message
- **booking-revert**: notify or not client about cancellation of their booking
- **sepa**: allow oneshot sepa payment
- **offer**: add recurrence rule for booking
- **offer-card**: show if was first booking w/ ★
- **bank-account**: support spanish bank accounts for companies
- **platform-billing**: add multiple payment methods
- **report**: add on spot payment report and add a button to generate it from cashbook
- **offer-card**: back more info on card
- **theme**: add general_terms_of_use
- **marketplace**: add an appbar w/ email+basket on payment pages
- **access-code**: add access codes to company onboarding
- **platform-billing**: add payment method even if no subscription/billing-group
- **platform-billing**: add new screen platform billing
- **member**: count objects in tabs
- **gtm**: add gtm in offer payment/booking page
- **emails**: add checkbox to send emails to canceled Bookings
- **settings**: make editable the ios and adroids's urls
- **subscription**: sort the subscription in manager interface
- **platform-billing**: basic plaformbilling setting page
- **payment-method**: save payment method
- **notification-rule**: disable and/or send copy to the company
- **bookingnotification**: booking notification form reorganization
- **smartlist**: private filters
- **smartlist**: bug basket date select
- **kube**: full switch to kubernetes servers
- **voucher**: add percent selector along price selector
- **offer**: reactivate delete button on offercard
- **reset-password**: propose help if reset password twice in 4h
- **subscription**: consumer can and must pay their credit subscrtipion
- **gtm**: add basketId on some missing gtm event
- **gtm**: add checkout-items to basket event, type on add-to-card events
- **vod**: pass give access to VOD
- **offeredit**: custom offer selection for recursive edit of similar offers
- **archive**: delete and restore coach/establshment even if future offers planned
- **nf525**: upload doc in settings for NF525
- **subscription**: allow 0e subscription w/ credit payment
- **subscription**: private-pass (RDV) subscription
- **apm**: first step testing instrumentation w/ elastic RUM
- test(producttour): add/ids
- **member**: terms and conditions in Member detail
- **client**: cancel-condition
- **associated coach api**: changed endpoint for create/update/link_email coach
- **idds**: chnage some idds
- **temp-password**: increase temp password validity to 1 week
- **bookingcreationnotification**: improved tooltips and form validation
- (fix): idds
- **bookingcreationnotification**: added booking notifications for establishment and meta_activity
- (ids): add/ids

### Perf

- **payment-pack**: optional check on bookings_within_month because annotation was removed on backend
- **email-tempaltes**: load templates only when dialog is open on membersummarycard
- **particlejs**: rmeove particlejs for error cleaning and perf

### Fix

- **subscription**: fix stupid error
- **gtm**: add price in gtm
- **translation**: lol
- **dashboard**: correctly filter invoiceitem
- **login**: center login form
- **i18n**: import es locale for moment
- **i18n**: import es locale for moment
- **recurrence-booking**: open recurrence booking form when no booking selected
- **recurrence-booking**: open recurrence booking form when no booking selected
- **login**: center login form
- **timezone**: fix a bug when no timezone on offerlistv2
- **gtm**: add event on pre-checkout pages
- **check-in**: register on check-in app without pb
- **communication**: link smartlist commuinication to smartlist in back
- **communication**: fixes on member detail + order page
- **contract**: edit a contract to set a combo
- **subscription**: fix some modal on payment in marketplace
- **voucher**: format cts in subscription
- **timezone**: fix offer header
- **i18n**: add ireland bank account
- **timezone**: remove timezone reference in useless ref
- **timezone**: micro fix
- **quickfix**: random quickfix
- **payment-combo**: fix refresh error whenusing private-pass
- **rum**: disable rum bullshit
- **waiting-list**: register cancelled bookings on waiting-list
- **quickinvoice**: fix remove invoice item and UnevenInvoiceDialog float display
- **payment-method**: fetch payument methods only if valid member id
- **booking-revert**: set loading to false after action
- **random**: random fixes post-merge
- **random**: random fixes post-merge
- **random**: random fixes post-merge
- **payment-method**: fix some pb when registering sepa on mobile
- **offer-direct-payment**: remove abd infinite loading page
- **platform-billing**: show right price on platform invoice
- **payment-method**: disable payment-method switch on old subscription
- **offer-card**: show coach on offer-card
- **subscription**: pay on offerbooking page
- **payment-method**: better refresh of methods on subscription paymebnt form
- **subscription**: do not ask for payment on 0e subscription
- **payment-rule**: bug when 1 bonus in rules
- **payment-rule**: ability to par pallier
- **disable-offer**: show mass offer being disabled
- **booking-discard**: attempt to fix error message on refund booking
- **self-checkin**: do not show cancelled bookings in tablet
- **qf**: qffix
- **booking**: is_discardable is kind of broken
- **kube**: back to no-kube for security
- **stupidity**: so much stupidity
- **kube**: switch env
- **waitinglist**: allow 15 minutes delay
- **booking**: revert is_discardable
- **vod**: category proposed in marketplace are bounded to videos
- **sct**: localization of SCT
- **login**: change translation when email exists
- **flag**: england
- **localization**: remove la suisse from locale created
- **sentry**: fix versionning scheme on sentry
- **report**: bug
- **lint**: appbar
- **bookingnotifications**: fixed undefined
- **sentry**: change sourcemap url-prefix and version w/ sha
- **bookingstatistics**: fixed offer graph visuals in planning page

### feat

- **recurrent-booking**: add recurrent booking on member page and fix pagination
- **timezone**: add timezones in manager interface display
- **CashBook**: add report for cashBook
- **Member**: count objects in tabs
- **emails**: add checkbox for canceledBooking in sending emails
- **settings**: make editable the ios and adroids's urls
- **offercard**: reactivate button delete
- **subscription**: private pass (RDV) available for subscription
- **appbar**: user/menu
- (client): add-last-discard
- **change**: idds

### Refactor

- **ids**: add more ids
- **ids**: add more ids

### fix

- **cleanup**: can not unselect first offer + fix translation loading

## 42.9.0 (2020-08-18)

### Feat

- **invoice**: prompt for uneven invoices in offermanagement.component
- **widget**: share button for widget and calendar url
- **payment-pack**: limit purchase per payment-pack per member
- **payment-pack**: add day limitation
- **marketplace calendar**: added new theme settings to personalize the manager & customer calendars
- **SCT**: SCT localized

### Refactor

- **calendar**: clean a bit the UI

### Fix

- **language**: default language is english
- **payment**: block manager from payment pages

## 42.8.0 (2020-08-14)

### Feat

- **marketplace calendar**: added new theme settings to personalize the manager & customer calendars

## 42.7.0 (2020-08-13)

### Feat

- **invoice**: voucher for quick invoices

## 42.6.0 (2020-08-13)

### Feat

- **report**: add first privatebooking report

## 42.5.1 (2020-08-13)

### Fix

- **version**: fetch tag berfore running cz bump
- **version**: test bump versionning

## 42.5.0 (2020-08-13)

### Feat

- **face-id**: FaceID working on tablet interface

### feat

- **face-id**: working flow, UX to be improved (+member form)

## 42.14.0b2 (2020-11-11)

### Feat

- **video**: buy video
- **private_booking**: restore for private bookings (only manager)
- **meta_activity**: auto_discard in MetaActivityForm and new notification rule
- **payment-packs**: add max bookings per month field
- **dashboard**: qualitative barchart and saving
- **consumer_payment_pack**: show history of modifying credit
- **exporthtml**: add button to export html file from email editor
- **platform-billing**: show max/min stage and coupon in settings
- **subscription**: auto-set subscription 0€ to credit + display flat fee
- **booking-option**: disable notification on discard booking-option when converting as booking
- **booking-option**: disable notification on discard booking-option when converting as booking
- **partial-refund**: improve pack partial refund
- **partial-refund**: improve pack partial refund
- **subscription**: scheduled stop for subscriptions
- **subscription**: scheduled stop for subscriptions
- **menu**: denser responsive drawer nested menu item
- **menu**: denser responsive drawer nested menu item
- **phone**: translate phone in other countries
- **phone**: translate phone in other countries
- **smartlist**: add attendance option for BookingsFilters and BookingsNumberFilter
- **recurrence-rule**: add establishment in recurrence rule booking
- **smartlist**: add attendance option for BookingsFilters and BookingsNumberFilter
- **recurrence-rule**: add establishment in recurrence rule booking
- **gtm**: add gtm on custom login pages
- **offer**: restore offer button
- **mass_disable**: add background task for mass disable
- **communication-dialog**: add sms and email-template email
- **rum**: disable elasticsearch RUM
- **booking**: filter on recurrence-rule-booking-isnull
- **offer**: chose default view cancelled offer (manager space)
- **offer**: background task for offer edit and offer create
- **component birthday email**: add new component to birthday celebration email
- **booking**: add filter not cancelled
- **report**: addres/birthday in reports
- **notification-rule**: add invoice notif and waiting-list kick
- **dashboard**: new dashboard page
- **recurrent-booking**: add recurrent booking on member page and fix pagination
- **report**: add nb_offer and nb_offer_cancelled
- **background-task**: background task monitoring and background task for disabling/deleting offers
- **timezone**: return timezone_name in company onboarding
- **timezone**: handle multitimezone
- **bookingstatistics**: bookingStatistics filtered by offerFilters in calendar page
- **bookingnotification**: notify every attendance / absence / cancellation ... for booking notif
- **coupon**: add to subscription
- **refund**: more explicit refund message
- **booking-revert**: notify or not client about cancellation of their booking
- **sepa**: allow oneshot sepa payment
- **offer**: add recurrence rule for booking
- **offer-card**: show if was first booking w/ ★
- **bank-account**: support spanish bank accounts for companies
- **platform-billing**: add multiple payment methods
- **report**: add on spot payment report and add a button to generate it from cashbook
- **offer-card**: back more info on card
- **theme**: add general_terms_of_use
- **marketplace**: add an appbar w/ email+basket on payment pages
- **access-code**: add access codes to company onboarding
- **platform-billing**: add payment method even if no subscription/billing-group
- **platform-billing**: add new screen platform billing
- **member**: count objects in tabs
- **gtm**: add gtm in offer payment/booking page
- **emails**: add checkbox to send emails to canceled Bookings
- **settings**: make editable the ios and adroids's urls
- **subscription**: sort the subscription in manager interface
- **platform-billing**: basic plaformbilling setting page
- **payment-method**: save payment method
- **notification-rule**: disable and/or send copy to the company
- **bookingnotification**: booking notification form reorganization
- **smartlist**: private filters
- **smartlist**: bug basket date select
- **kube**: full switch to kubernetes servers
- **voucher**: add percent selector along price selector
- **offer**: reactivate delete button on offercard
- **reset-password**: propose help if reset password twice in 4h
- **subscription**: consumer can and must pay their credit subscrtipion
- **gtm**: add basketId on some missing gtm event
- **gtm**: add checkout-items to basket event, type on add-to-card events
- **vod**: pass give access to VOD
- **offeredit**: custom offer selection for recursive edit of similar offers
- **archive**: delete and restore coach/establshment even if future offers planned
- **nf525**: upload doc in settings for NF525
- **subscription**: allow 0e subscription w/ credit payment
- **subscription**: private-pass (RDV) subscription
- **apm**: first step testing instrumentation w/ elastic RUM
- test(producttour): add/ids
- **member**: terms and conditions in Member detail
- **client**: cancel-condition
- **associated coach api**: changed endpoint for create/update/link_email coach
- **idds**: chnage some idds
- **temp-password**: increase temp password validity to 1 week
- **bookingcreationnotification**: improved tooltips and form validation
- (fix): idds
- **bookingcreationnotification**: added booking notifications for establishment and meta_activity
- (ids): add/ids

### Perf

- **payment-pack**: optional check on bookings_within_month because annotation was removed on backend
- **email-tempaltes**: load templates only when dialog is open on membersummarycard
- **particlejs**: rmeove particlejs for error cleaning and perf

### Fix

- **subscription**: fix stupid error
- **gtm**: add price in gtm
- **translation**: lol
- **dashboard**: correctly filter invoiceitem
- **login**: center login form
- **i18n**: import es locale for moment
- **i18n**: import es locale for moment
- **recurrence-booking**: open recurrence booking form when no booking selected
- **recurrence-booking**: open recurrence booking form when no booking selected
- **login**: center login form
- **timezone**: fix a bug when no timezone on offerlistv2
- **gtm**: add event on pre-checkout pages
- **check-in**: register on check-in app without pb
- **communication**: link smartlist commuinication to smartlist in back
- **communication**: fixes on member detail + order page
- **contract**: edit a contract to set a combo
- **subscription**: fix some modal on payment in marketplace
- **voucher**: format cts in subscription
- **timezone**: fix offer header
- **i18n**: add ireland bank account
- **timezone**: remove timezone reference in useless ref
- **timezone**: micro fix
- **quickfix**: random quickfix
- **payment-combo**: fix refresh error whenusing private-pass
- **rum**: disable rum bullshit
- **waiting-list**: register cancelled bookings on waiting-list
- **quickinvoice**: fix remove invoice item and UnevenInvoiceDialog float display
- **payment-method**: fetch payument methods only if valid member id
- **booking-revert**: set loading to false after action
- **random**: random fixes post-merge
- **random**: random fixes post-merge
- **random**: random fixes post-merge
- **payment-method**: fix some pb when registering sepa on mobile
- **offer-direct-payment**: remove abd infinite loading page
- **platform-billing**: show right price on platform invoice
- **payment-method**: disable payment-method switch on old subscription
- **offer-card**: show coach on offer-card
- **subscription**: pay on offerbooking page
- **payment-method**: better refresh of methods on subscription paymebnt form
- **subscription**: do not ask for payment on 0e subscription
- **payment-rule**: bug when 1 bonus in rules
- **payment-rule**: ability to par pallier
- **disable-offer**: show mass offer being disabled
- **booking-discard**: attempt to fix error message on refund booking
- **self-checkin**: do not show cancelled bookings in tablet
- **qf**: qffix
- **booking**: is_discardable is kind of broken
- **kube**: back to no-kube for security
- **stupidity**: so much stupidity
- **kube**: switch env
- **waitinglist**: allow 15 minutes delay
- **booking**: revert is_discardable
- **vod**: category proposed in marketplace are bounded to videos
- **sct**: localization of SCT
- **login**: change translation when email exists
- **flag**: england
- **localization**: remove la suisse from locale created
- **sentry**: fix versionning scheme on sentry
- **report**: bug
- **lint**: appbar
- **bookingnotifications**: fixed undefined
- **sentry**: change sourcemap url-prefix and version w/ sha
- **bookingstatistics**: fixed offer graph visuals in planning page

### feat

- **recurrent-booking**: add recurrent booking on member page and fix pagination
- **timezone**: add timezones in manager interface display
- **CashBook**: add report for cashBook
- **Member**: count objects in tabs
- **emails**: add checkbox for canceledBooking in sending emails
- **settings**: make editable the ios and adroids's urls
- **offercard**: reactivate button delete
- **subscription**: private pass (RDV) available for subscription
- **appbar**: user/menu
- (client): add-last-discard
- **change**: idds

### Refactor

- **ids**: add more ids
- **ids**: add more ids

### fix

- **cleanup**: can not unselect first offer + fix translation loading

## 42.9.0 (2020-08-18)

### Feat

- **invoice**: prompt for uneven invoices in offermanagement.component
- **widget**: share button for widget and calendar url
- **payment-pack**: limit purchase per payment-pack per member
- **payment-pack**: add day limitation
- **marketplace calendar**: added new theme settings to personalize the manager & customer calendars
- **SCT**: SCT localized

### Refactor

- **calendar**: clean a bit the UI

### Fix

- **language**: default language is english
- **payment**: block manager from payment pages

## 42.8.0 (2020-08-14)

### Feat

- **marketplace calendar**: added new theme settings to personalize the manager & customer calendars

## 42.7.0 (2020-08-13)

### Feat

- **invoice**: voucher for quick invoices

## 42.6.0 (2020-08-13)

### Feat

- **report**: add first privatebooking report

## 42.5.1 (2020-08-13)

### Fix

- **version**: fetch tag berfore running cz bump
- **version**: test bump versionning

## 42.5.0 (2020-08-13)

### Feat

- **face-id**: FaceID working on tablet interface

### feat

- **face-id**: working flow, UX to be improved (+member form)

## 42.14.0b0 (2020-11-09)

### Feat

- **video**: buy video
- **private_booking**: restore for private bookings (only manager)
- **meta_activity**: auto_discard in MetaActivityForm and new notification rule
- **payment-packs**: add max bookings per month field
- **dashboard**: qualitative barchart and saving
- **consumer_payment_pack**: show history of modifying credit
- **exporthtml**: add button to export html file from email editor
- **platform-billing**: show max/min stage and coupon in settings
- **subscription**: auto-set subscription 0€ to credit + display flat fee
- **booking-option**: disable notification on discard booking-option when converting as booking
- **booking-option**: disable notification on discard booking-option when converting as booking
- **partial-refund**: improve pack partial refund
- **partial-refund**: improve pack partial refund
- **subscription**: scheduled stop for subscriptions
- **subscription**: scheduled stop for subscriptions
- **menu**: denser responsive drawer nested menu item
- **menu**: denser responsive drawer nested menu item
- **phone**: translate phone in other countries
- **phone**: translate phone in other countries
- **smartlist**: add attendance option for BookingsFilters and BookingsNumberFilter
- **recurrence-rule**: add establishment in recurrence rule booking
- **smartlist**: add attendance option for BookingsFilters and BookingsNumberFilter
- **recurrence-rule**: add establishment in recurrence rule booking
- **gtm**: add gtm on custom login pages
- **offer**: restore offer button
- **mass_disable**: add background task for mass disable
- **communication-dialog**: add sms and email-template email
- **rum**: disable elasticsearch RUM
- **booking**: filter on recurrence-rule-booking-isnull
- **offer**: chose default view cancelled offer (manager space)
- **offer**: background task for offer edit and offer create
- **component birthday email**: add new component to birthday celebration email
- **booking**: add filter not cancelled
- **report**: addres/birthday in reports
- **notification-rule**: add invoice notif and waiting-list kick
- **dashboard**: new dashboard page
- **recurrent-booking**: add recurrent booking on member page and fix pagination
- **report**: add nb_offer and nb_offer_cancelled
- **background-task**: background task monitoring and background task for disabling/deleting offers
- **timezone**: return timezone_name in company onboarding
- **timezone**: handle multitimezone
- **bookingstatistics**: bookingStatistics filtered by offerFilters in calendar page
- **bookingnotification**: notify every attendance / absence / cancellation ... for booking notif
- **coupon**: add to subscription
- **refund**: more explicit refund message
- **booking-revert**: notify or not client about cancellation of their booking
- **sepa**: allow oneshot sepa payment
- **offer**: add recurrence rule for booking
- **offer-card**: show if was first booking w/ ★
- **bank-account**: support spanish bank accounts for companies
- **platform-billing**: add multiple payment methods
- **report**: add on spot payment report and add a button to generate it from cashbook
- **offer-card**: back more info on card
- **theme**: add general_terms_of_use
- **marketplace**: add an appbar w/ email+basket on payment pages
- **access-code**: add access codes to company onboarding
- **platform-billing**: add payment method even if no subscription/billing-group
- **platform-billing**: add new screen platform billing
- **member**: count objects in tabs
- **gtm**: add gtm in offer payment/booking page
- **emails**: add checkbox to send emails to canceled Bookings
- **settings**: make editable the ios and adroids's urls
- **subscription**: sort the subscription in manager interface
- **platform-billing**: basic plaformbilling setting page
- **payment-method**: save payment method
- **notification-rule**: disable and/or send copy to the company
- **bookingnotification**: booking notification form reorganization
- **smartlist**: private filters
- **smartlist**: bug basket date select
- **kube**: full switch to kubernetes servers
- **voucher**: add percent selector along price selector
- **offer**: reactivate delete button on offercard
- **reset-password**: propose help if reset password twice in 4h
- **subscription**: consumer can and must pay their credit subscrtipion
- **gtm**: add basketId on some missing gtm event
- **gtm**: add checkout-items to basket event, type on add-to-card events
- **vod**: pass give access to VOD
- **offeredit**: custom offer selection for recursive edit of similar offers
- **archive**: delete and restore coach/establshment even if future offers planned
- **nf525**: upload doc in settings for NF525
- **subscription**: allow 0e subscription w/ credit payment
- **subscription**: private-pass (RDV) subscription
- **apm**: first step testing instrumentation w/ elastic RUM
- test(producttour): add/ids
- **member**: terms and conditions in Member detail
- **client**: cancel-condition
- **associated coach api**: changed endpoint for create/update/link_email coach
- **idds**: chnage some idds
- **temp-password**: increase temp password validity to 1 week
- **bookingcreationnotification**: improved tooltips and form validation
- (fix): idds
- **bookingcreationnotification**: added booking notifications for establishment and meta_activity
- (ids): add/ids

### Perf

- **payment-pack**: optional check on bookings_within_month because annotation was removed on backend
- **email-tempaltes**: load templates only when dialog is open on membersummarycard
- **particlejs**: rmeove particlejs for error cleaning and perf

### Fix

- **subscription**: fix stupid error
- **gtm**: add price in gtm
- **translation**: lol
- **dashboard**: correctly filter invoiceitem
- **login**: center login form
- **i18n**: import es locale for moment
- **i18n**: import es locale for moment
- **recurrence-booking**: open recurrence booking form when no booking selected
- **recurrence-booking**: open recurrence booking form when no booking selected
- **login**: center login form
- **timezone**: fix a bug when no timezone on offerlistv2
- **gtm**: add event on pre-checkout pages
- **check-in**: register on check-in app without pb
- **communication**: link smartlist commuinication to smartlist in back
- **communication**: fixes on member detail + order page
- **contract**: edit a contract to set a combo
- **subscription**: fix some modal on payment in marketplace
- **voucher**: format cts in subscription
- **timezone**: fix offer header
- **i18n**: add ireland bank account
- **timezone**: remove timezone reference in useless ref
- **timezone**: micro fix
- **quickfix**: random quickfix
- **payment-combo**: fix refresh error whenusing private-pass
- **rum**: disable rum bullshit
- **waiting-list**: register cancelled bookings on waiting-list
- **quickinvoice**: fix remove invoice item and UnevenInvoiceDialog float display
- **payment-method**: fetch payument methods only if valid member id
- **booking-revert**: set loading to false after action
- **random**: random fixes post-merge
- **random**: random fixes post-merge
- **random**: random fixes post-merge
- **payment-method**: fix some pb when registering sepa on mobile
- **offer-direct-payment**: remove abd infinite loading page
- **platform-billing**: show right price on platform invoice
- **payment-method**: disable payment-method switch on old subscription
- **offer-card**: show coach on offer-card
- **subscription**: pay on offerbooking page
- **payment-method**: better refresh of methods on subscription paymebnt form
- **subscription**: do not ask for payment on 0e subscription
- **payment-rule**: bug when 1 bonus in rules
- **payment-rule**: ability to par pallier
- **disable-offer**: show mass offer being disabled
- **booking-discard**: attempt to fix error message on refund booking
- **self-checkin**: do not show cancelled bookings in tablet
- **qf**: qffix
- **booking**: is_discardable is kind of broken
- **kube**: back to no-kube for security
- **stupidity**: so much stupidity
- **kube**: switch env
- **waitinglist**: allow 15 minutes delay
- **booking**: revert is_discardable
- **vod**: category proposed in marketplace are bounded to videos
- **sct**: localization of SCT
- **login**: change translation when email exists
- **flag**: england
- **localization**: remove la suisse from locale created
- **sentry**: fix versionning scheme on sentry
- **report**: bug
- **lint**: appbar
- **bookingnotifications**: fixed undefined
- **sentry**: change sourcemap url-prefix and version w/ sha
- **bookingstatistics**: fixed offer graph visuals in planning page

### feat

- **recurrent-booking**: add recurrent booking on member page and fix pagination
- **timezone**: add timezones in manager interface display
- **CashBook**: add report for cashBook
- **Member**: count objects in tabs
- **emails**: add checkbox for canceledBooking in sending emails
- **settings**: make editable the ios and adroids's urls
- **offercard**: reactivate button delete
- **subscription**: private pass (RDV) available for subscription
- **appbar**: user/menu
- (client): add-last-discard
- **change**: idds

### Refactor

- **ids**: add more ids
- **ids**: add more ids

### fix

- **cleanup**: can not unselect first offer + fix translation loading

## 42.9.0 (2020-08-18)

### Feat

- **invoice**: prompt for uneven invoices in offermanagement.component
- **widget**: share button for widget and calendar url
- **payment-pack**: limit purchase per payment-pack per member
- **payment-pack**: add day limitation
- **marketplace calendar**: added new theme settings to personalize the manager & customer calendars
- **SCT**: SCT localized

### Refactor

- **calendar**: clean a bit the UI

### Fix

- **language**: default language is english
- **payment**: block manager from payment pages

## 42.8.0 (2020-08-14)

### Feat

- **marketplace calendar**: added new theme settings to personalize the manager & customer calendars

## 42.7.0 (2020-08-13)

### Feat

- **invoice**: voucher for quick invoices

## 42.6.0 (2020-08-13)

### Feat

- **report**: add first privatebooking report

## 42.5.1 (2020-08-13)

### Fix

- **version**: fetch tag berfore running cz bump
- **version**: test bump versionning

## 42.5.0 (2020-08-13)

### Feat

- **face-id**: FaceID working on tablet interface

### feat

- **face-id**: working flow, UX to be improved (+member form)

## 42.14.0b0 (2020-11-09)

### Feat

- **video**: buy video
- **private_booking**: restore for private bookings (only manager)
- **meta_activity**: auto_discard in MetaActivityForm and new notification rule
- **payment-packs**: add max bookings per month field
- **dashboard**: qualitative barchart and saving
- **consumer_payment_pack**: show history of modifying credit
- **exporthtml**: add button to export html file from email editor
- **platform-billing**: show max/min stage and coupon in settings
- **subscription**: auto-set subscription 0€ to credit + display flat fee
- **booking-option**: disable notification on discard booking-option when converting as booking
- **booking-option**: disable notification on discard booking-option when converting as booking
- **partial-refund**: improve pack partial refund
- **partial-refund**: improve pack partial refund
- **subscription**: scheduled stop for subscriptions
- **subscription**: scheduled stop for subscriptions
- **menu**: denser responsive drawer nested menu item
- **menu**: denser responsive drawer nested menu item
- **phone**: translate phone in other countries
- **phone**: translate phone in other countries
- **smartlist**: add attendance option for BookingsFilters and BookingsNumberFilter
- **recurrence-rule**: add establishment in recurrence rule booking
- **smartlist**: add attendance option for BookingsFilters and BookingsNumberFilter
- **recurrence-rule**: add establishment in recurrence rule booking
- **gtm**: add gtm on custom login pages
- **offer**: restore offer button
- **mass_disable**: add background task for mass disable
- **communication-dialog**: add sms and email-template email
- **rum**: disable elasticsearch RUM
- **booking**: filter on recurrence-rule-booking-isnull
- **offer**: chose default view cancelled offer (manager space)
- **offer**: background task for offer edit and offer create
- **component birthday email**: add new component to birthday celebration email
- **booking**: add filter not cancelled
- **report**: addres/birthday in reports
- **notification-rule**: add invoice notif and waiting-list kick
- **dashboard**: new dashboard page
- **recurrent-booking**: add recurrent booking on member page and fix pagination
- **report**: add nb_offer and nb_offer_cancelled
- **background-task**: background task monitoring and background task for disabling/deleting offers
- **timezone**: return timezone_name in company onboarding
- **timezone**: handle multitimezone
- **bookingstatistics**: bookingStatistics filtered by offerFilters in calendar page
- **bookingnotification**: notify every attendance / absence / cancellation ... for booking notif
- **coupon**: add to subscription
- **refund**: more explicit refund message
- **booking-revert**: notify or not client about cancellation of their booking
- **sepa**: allow oneshot sepa payment
- **offer**: add recurrence rule for booking
- **offer-card**: show if was first booking w/ ★
- **bank-account**: support spanish bank accounts for companies
- **platform-billing**: add multiple payment methods
- **report**: add on spot payment report and add a button to generate it from cashbook
- **offer-card**: back more info on card
- **theme**: add general_terms_of_use
- **marketplace**: add an appbar w/ email+basket on payment pages
- **access-code**: add access codes to company onboarding
- **platform-billing**: add payment method even if no subscription/billing-group
- **platform-billing**: add new screen platform billing
- **member**: count objects in tabs
- **gtm**: add gtm in offer payment/booking page
- **emails**: add checkbox to send emails to canceled Bookings
- **settings**: make editable the ios and adroids's urls
- **subscription**: sort the subscription in manager interface
- **platform-billing**: basic plaformbilling setting page
- **payment-method**: save payment method
- **notification-rule**: disable and/or send copy to the company
- **bookingnotification**: booking notification form reorganization
- **smartlist**: private filters
- **smartlist**: bug basket date select
- **kube**: full switch to kubernetes servers
- **voucher**: add percent selector along price selector
- **offer**: reactivate delete button on offercard
- **reset-password**: propose help if reset password twice in 4h
- **subscription**: consumer can and must pay their credit subscrtipion
- **gtm**: add basketId on some missing gtm event
- **gtm**: add checkout-items to basket event, type on add-to-card events
- **vod**: pass give access to VOD
- **offeredit**: custom offer selection for recursive edit of similar offers
- **archive**: delete and restore coach/establshment even if future offers planned
- **nf525**: upload doc in settings for NF525
- **subscription**: allow 0e subscription w/ credit payment
- **subscription**: private-pass (RDV) subscription
- **apm**: first step testing instrumentation w/ elastic RUM
- test(producttour): add/ids
- **member**: terms and conditions in Member detail
- **client**: cancel-condition
- **associated coach api**: changed endpoint for create/update/link_email coach
- **idds**: chnage some idds
- **temp-password**: increase temp password validity to 1 week
- **bookingcreationnotification**: improved tooltips and form validation
- (fix): idds
- **bookingcreationnotification**: added booking notifications for establishment and meta_activity
- (ids): add/ids

### Perf

- **payment-pack**: optional check on bookings_within_month because annotation was removed on backend
- **email-tempaltes**: load templates only when dialog is open on membersummarycard
- **particlejs**: rmeove particlejs for error cleaning and perf

### Fix

- **subscription**: fix stupid error
- **gtm**: add price in gtm
- **translation**: lol
- **dashboard**: correctly filter invoiceitem
- **login**: center login form
- **i18n**: import es locale for moment
- **i18n**: import es locale for moment
- **recurrence-booking**: open recurrence booking form when no booking selected
- **recurrence-booking**: open recurrence booking form when no booking selected
- **login**: center login form
- **timezone**: fix a bug when no timezone on offerlistv2
- **gtm**: add event on pre-checkout pages
- **check-in**: register on check-in app without pb
- **communication**: link smartlist commuinication to smartlist in back
- **communication**: fixes on member detail + order page
- **contract**: edit a contract to set a combo
- **subscription**: fix some modal on payment in marketplace
- **voucher**: format cts in subscription
- **timezone**: fix offer header
- **i18n**: add ireland bank account
- **timezone**: remove timezone reference in useless ref
- **timezone**: micro fix
- **quickfix**: random quickfix
- **payment-combo**: fix refresh error whenusing private-pass
- **rum**: disable rum bullshit
- **waiting-list**: register cancelled bookings on waiting-list
- **quickinvoice**: fix remove invoice item and UnevenInvoiceDialog float display
- **payment-method**: fetch payument methods only if valid member id
- **booking-revert**: set loading to false after action
- **random**: random fixes post-merge
- **random**: random fixes post-merge
- **random**: random fixes post-merge
- **payment-method**: fix some pb when registering sepa on mobile
- **offer-direct-payment**: remove abd infinite loading page
- **platform-billing**: show right price on platform invoice
- **payment-method**: disable payment-method switch on old subscription
- **offer-card**: show coach on offer-card
- **subscription**: pay on offerbooking page
- **payment-method**: better refresh of methods on subscription paymebnt form
- **subscription**: do not ask for payment on 0e subscription
- **payment-rule**: bug when 1 bonus in rules
- **payment-rule**: ability to par pallier
- **disable-offer**: show mass offer being disabled
- **booking-discard**: attempt to fix error message on refund booking
- **self-checkin**: do not show cancelled bookings in tablet
- **qf**: qffix
- **booking**: is_discardable is kind of broken
- **kube**: back to no-kube for security
- **stupidity**: so much stupidity
- **kube**: switch env
- **waitinglist**: allow 15 minutes delay
- **booking**: revert is_discardable
- **vod**: category proposed in marketplace are bounded to videos
- **sct**: localization of SCT
- **login**: change translation when email exists
- **flag**: england
- **localization**: remove la suisse from locale created
- **sentry**: fix versionning scheme on sentry
- **report**: bug
- **lint**: appbar
- **bookingnotifications**: fixed undefined
- **sentry**: change sourcemap url-prefix and version w/ sha
- **bookingstatistics**: fixed offer graph visuals in planning page

### feat

- **recurrent-booking**: add recurrent booking on member page and fix pagination
- **timezone**: add timezones in manager interface display
- **CashBook**: add report for cashBook
- **Member**: count objects in tabs
- **emails**: add checkbox for canceledBooking in sending emails
- **settings**: make editable the ios and adroids's urls
- **offercard**: reactivate button delete
- **subscription**: private pass (RDV) available for subscription
- **appbar**: user/menu
- (client): add-last-discard
- **change**: idds

### Refactor

- **ids**: add more ids
- **ids**: add more ids

### fix

- **cleanup**: can not unselect first offer + fix translation loading

## 42.9.0 (2020-08-18)

### Feat

- **invoice**: prompt for uneven invoices in offermanagement.component
- **widget**: share button for widget and calendar url
- **payment-pack**: limit purchase per payment-pack per member
- **payment-pack**: add day limitation
- **marketplace calendar**: added new theme settings to personalize the manager & customer calendars
- **SCT**: SCT localized

### Refactor

- **calendar**: clean a bit the UI

### Fix

- **language**: default language is english
- **payment**: block manager from payment pages

## 42.8.0 (2020-08-14)

### Feat

- **marketplace calendar**: added new theme settings to personalize the manager & customer calendars

## 42.7.0 (2020-08-13)

### Feat

- **invoice**: voucher for quick invoices

## 42.6.0 (2020-08-13)

### Feat

- **report**: add first privatebooking report

## 42.5.1 (2020-08-13)

### Fix

- **version**: fetch tag berfore running cz bump
- **version**: test bump versionning

## 42.5.0 (2020-08-13)

### Feat

- **face-id**: FaceID working on tablet interface

### feat

- **face-id**: working flow, UX to be improved (+member form)

## 42.14.0a20 (2020-11-09)

### Feat

- **meta_activity**: auto_discard in MetaActivityForm and new notification rule
- **payment-packs**: add max bookings per month field
- **dashboard**: qualitative barchart and saving
- **consumer_payment_pack**: show history of modifying credit
- **exporthtml**: add button to export html file from email editor
- **platform-billing**: show max/min stage and coupon in settings
- **subscription**: auto-set subscription 0€ to credit + display flat fee
- **booking-option**: disable notification on discard booking-option when converting as booking
- **booking-option**: disable notification on discard booking-option when converting as booking
- **partial-refund**: improve pack partial refund
- **partial-refund**: improve pack partial refund
- **subscription**: scheduled stop for subscriptions
- **subscription**: scheduled stop for subscriptions
- **menu**: denser responsive drawer nested menu item
- **menu**: denser responsive drawer nested menu item
- **phone**: translate phone in other countries
- **phone**: translate phone in other countries
- **smartlist**: add attendance option for BookingsFilters and BookingsNumberFilter
- **recurrence-rule**: add establishment in recurrence rule booking
- **smartlist**: add attendance option for BookingsFilters and BookingsNumberFilter
- **recurrence-rule**: add establishment in recurrence rule booking
- **gtm**: add gtm on custom login pages
- **offer**: restore offer button
- **mass_disable**: add background task for mass disable
- **communication-dialog**: add sms and email-template email
- **rum**: disable elasticsearch RUM
- **booking**: filter on recurrence-rule-booking-isnull
- **offer**: chose default view cancelled offer (manager space)
- **offer**: background task for offer edit and offer create
- **component birthday email**: add new component to birthday celebration email
- **booking**: add filter not cancelled
- **report**: addres/birthday in reports
- **notification-rule**: add invoice notif and waiting-list kick
- **dashboard**: new dashboard page
- **recurrent-booking**: add recurrent booking on member page and fix pagination
- **report**: add nb_offer and nb_offer_cancelled
- **background-task**: background task monitoring and background task for disabling/deleting offers
- **timezone**: return timezone_name in company onboarding
- **timezone**: handle multitimezone
- **bookingstatistics**: bookingStatistics filtered by offerFilters in calendar page
- **bookingnotification**: notify every attendance / absence / cancellation ... for booking notif
- **coupon**: add to subscription
- **refund**: more explicit refund message
- **booking-revert**: notify or not client about cancellation of their booking
- **sepa**: allow oneshot sepa payment
- **offer**: add recurrence rule for booking
- **offer-card**: show if was first booking w/ ★
- **bank-account**: support spanish bank accounts for companies
- **platform-billing**: add multiple payment methods
- **report**: add on spot payment report and add a button to generate it from cashbook
- **offer-card**: back more info on card
- **theme**: add general_terms_of_use
- **marketplace**: add an appbar w/ email+basket on payment pages
- **access-code**: add access codes to company onboarding
- **platform-billing**: add payment method even if no subscription/billing-group
- **platform-billing**: add new screen platform billing
- **member**: count objects in tabs
- **gtm**: add gtm in offer payment/booking page
- **emails**: add checkbox to send emails to canceled Bookings
- **settings**: make editable the ios and adroids's urls
- **subscription**: sort the subscription in manager interface
- **platform-billing**: basic plaformbilling setting page
- **payment-method**: save payment method
- **notification-rule**: disable and/or send copy to the company
- **bookingnotification**: booking notification form reorganization
- **smartlist**: private filters
- **smartlist**: bug basket date select
- **kube**: full switch to kubernetes servers
- **voucher**: add percent selector along price selector
- **offer**: reactivate delete button on offercard
- **reset-password**: propose help if reset password twice in 4h
- **subscription**: consumer can and must pay their credit subscrtipion
- **gtm**: add basketId on some missing gtm event
- **gtm**: add checkout-items to basket event, type on add-to-card events
- **vod**: pass give access to VOD
- **offeredit**: custom offer selection for recursive edit of similar offers
- **archive**: delete and restore coach/establshment even if future offers planned
- **nf525**: upload doc in settings for NF525
- **subscription**: allow 0e subscription w/ credit payment
- **subscription**: private-pass (RDV) subscription
- **apm**: first step testing instrumentation w/ elastic RUM
- test(producttour): add/ids
- **member**: terms and conditions in Member detail
- **client**: cancel-condition
- **associated coach api**: changed endpoint for create/update/link_email coach
- **idds**: chnage some idds
- **temp-password**: increase temp password validity to 1 week
- **bookingcreationnotification**: improved tooltips and form validation
- (fix): idds
- **bookingcreationnotification**: added booking notifications for establishment and meta_activity
- (ids): add/ids

### Perf

- **payment-pack**: optional check on bookings_within_month because annotation was removed on backend
- **email-tempaltes**: load templates only when dialog is open on membersummarycard
- **particlejs**: rmeove particlejs for error cleaning and perf

### Fix

- **subscription**: fix stupid error
- **gtm**: add price in gtm
- **translation**: lol
- **dashboard**: correctly filter invoiceitem
- **login**: center login form
- **i18n**: import es locale for moment
- **i18n**: import es locale for moment
- **recurrence-booking**: open recurrence booking form when no booking selected
- **recurrence-booking**: open recurrence booking form when no booking selected
- **login**: center login form
- **timezone**: fix a bug when no timezone on offerlistv2
- **gtm**: add event on pre-checkout pages
- **check-in**: register on check-in app without pb
- **communication**: link smartlist commuinication to smartlist in back
- **communication**: fixes on member detail + order page
- **contract**: edit a contract to set a combo
- **subscription**: fix some modal on payment in marketplace
- **voucher**: format cts in subscription
- **timezone**: fix offer header
- **i18n**: add ireland bank account
- **timezone**: remove timezone reference in useless ref
- **timezone**: micro fix
- **quickfix**: random quickfix
- **payment-combo**: fix refresh error whenusing private-pass
- **rum**: disable rum bullshit
- **waiting-list**: register cancelled bookings on waiting-list
- **quickinvoice**: fix remove invoice item and UnevenInvoiceDialog float display
- **payment-method**: fetch payument methods only if valid member id
- **booking-revert**: set loading to false after action
- **random**: random fixes post-merge
- **random**: random fixes post-merge
- **random**: random fixes post-merge
- **payment-method**: fix some pb when registering sepa on mobile
- **offer-direct-payment**: remove abd infinite loading page
- **platform-billing**: show right price on platform invoice
- **payment-method**: disable payment-method switch on old subscription
- **offer-card**: show coach on offer-card
- **subscription**: pay on offerbooking page
- **payment-method**: better refresh of methods on subscription paymebnt form
- **subscription**: do not ask for payment on 0e subscription
- **payment-rule**: bug when 1 bonus in rules
- **payment-rule**: ability to par pallier
- **disable-offer**: show mass offer being disabled
- **booking-discard**: attempt to fix error message on refund booking
- **self-checkin**: do not show cancelled bookings in tablet
- **qf**: qffix
- **booking**: is_discardable is kind of broken
- **kube**: back to no-kube for security
- **stupidity**: so much stupidity
- **kube**: switch env
- **waitinglist**: allow 15 minutes delay
- **booking**: revert is_discardable
- **vod**: category proposed in marketplace are bounded to videos
- **sct**: localization of SCT
- **login**: change translation when email exists
- **flag**: england
- **localization**: remove la suisse from locale created
- **sentry**: fix versionning scheme on sentry
- **report**: bug
- **lint**: appbar
- **bookingnotifications**: fixed undefined
- **sentry**: change sourcemap url-prefix and version w/ sha
- **bookingstatistics**: fixed offer graph visuals in planning page

### feat

- **recurrent-booking**: add recurrent booking on member page and fix pagination
- **timezone**: add timezones in manager interface display
- **CashBook**: add report for cashBook
- **Member**: count objects in tabs
- **emails**: add checkbox for canceledBooking in sending emails
- **settings**: make editable the ios and adroids's urls
- **offercard**: reactivate button delete
- **subscription**: private pass (RDV) available for subscription
- **appbar**: user/menu
- (client): add-last-discard
- **change**: idds

### Refactor

- **ids**: add more ids
- **ids**: add more ids

### fix

- **cleanup**: can not unselect first offer + fix translation loading

## 42.9.0 (2020-08-18)

### Feat

- **invoice**: prompt for uneven invoices in offermanagement.component
- **widget**: share button for widget and calendar url
- **payment-pack**: limit purchase per payment-pack per member
- **payment-pack**: add day limitation
- **marketplace calendar**: added new theme settings to personalize the manager & customer calendars
- **SCT**: SCT localized

### Refactor

- **calendar**: clean a bit the UI

### Fix

- **language**: default language is english
- **payment**: block manager from payment pages

## 42.8.0 (2020-08-14)

### Feat

- **marketplace calendar**: added new theme settings to personalize the manager & customer calendars

## 42.7.0 (2020-08-13)

### Feat

- **invoice**: voucher for quick invoices

## 42.6.0 (2020-08-13)

### Feat

- **report**: add first privatebooking report

## 42.5.1 (2020-08-13)

### Fix

- **version**: fetch tag berfore running cz bump
- **version**: test bump versionning

## 42.5.0 (2020-08-13)

### Feat

- **face-id**: FaceID working on tablet interface

### feat

- **face-id**: working flow, UX to be improved (+member form)

## 42.14.0a20 (2020-11-09)

### Feat

- **meta_activity**: auto_discard in MetaActivityForm and new notification rule
- **payment-packs**: add max bookings per month field
- **dashboard**: qualitative barchart and saving
- **consumer_payment_pack**: show history of modifying credit
- **exporthtml**: add button to export html file from email editor
- **platform-billing**: show max/min stage and coupon in settings
- **subscription**: auto-set subscription 0€ to credit + display flat fee
- **booking-option**: disable notification on discard booking-option when converting as booking
- **booking-option**: disable notification on discard booking-option when converting as booking
- **partial-refund**: improve pack partial refund
- **partial-refund**: improve pack partial refund
- **subscription**: scheduled stop for subscriptions
- **subscription**: scheduled stop for subscriptions
- **menu**: denser responsive drawer nested menu item
- **menu**: denser responsive drawer nested menu item
- **phone**: translate phone in other countries
- **phone**: translate phone in other countries
- **smartlist**: add attendance option for BookingsFilters and BookingsNumberFilter
- **recurrence-rule**: add establishment in recurrence rule booking
- **smartlist**: add attendance option for BookingsFilters and BookingsNumberFilter
- **recurrence-rule**: add establishment in recurrence rule booking
- **gtm**: add gtm on custom login pages
- **offer**: restore offer button
- **mass_disable**: add background task for mass disable
- **communication-dialog**: add sms and email-template email
- **rum**: disable elasticsearch RUM
- **booking**: filter on recurrence-rule-booking-isnull
- **offer**: chose default view cancelled offer (manager space)
- **offer**: background task for offer edit and offer create
- **component birthday email**: add new component to birthday celebration email
- **booking**: add filter not cancelled
- **report**: addres/birthday in reports
- **notification-rule**: add invoice notif and waiting-list kick
- **dashboard**: new dashboard page
- **recurrent-booking**: add recurrent booking on member page and fix pagination
- **report**: add nb_offer and nb_offer_cancelled
- **background-task**: background task monitoring and background task for disabling/deleting offers
- **timezone**: return timezone_name in company onboarding
- **timezone**: handle multitimezone
- **bookingstatistics**: bookingStatistics filtered by offerFilters in calendar page
- **bookingnotification**: notify every attendance / absence / cancellation ... for booking notif
- **coupon**: add to subscription
- **refund**: more explicit refund message
- **booking-revert**: notify or not client about cancellation of their booking
- **sepa**: allow oneshot sepa payment
- **offer**: add recurrence rule for booking
- **offer-card**: show if was first booking w/ ★
- **bank-account**: support spanish bank accounts for companies
- **platform-billing**: add multiple payment methods
- **report**: add on spot payment report and add a button to generate it from cashbook
- **offer-card**: back more info on card
- **theme**: add general_terms_of_use
- **marketplace**: add an appbar w/ email+basket on payment pages
- **access-code**: add access codes to company onboarding
- **platform-billing**: add payment method even if no subscription/billing-group
- **platform-billing**: add new screen platform billing
- **member**: count objects in tabs
- **gtm**: add gtm in offer payment/booking page
- **emails**: add checkbox to send emails to canceled Bookings
- **settings**: make editable the ios and adroids's urls
- **subscription**: sort the subscription in manager interface
- **platform-billing**: basic plaformbilling setting page
- **payment-method**: save payment method
- **notification-rule**: disable and/or send copy to the company
- **bookingnotification**: booking notification form reorganization
- **smartlist**: private filters
- **smartlist**: bug basket date select
- **kube**: full switch to kubernetes servers
- **voucher**: add percent selector along price selector
- **offer**: reactivate delete button on offercard
- **reset-password**: propose help if reset password twice in 4h
- **subscription**: consumer can and must pay their credit subscrtipion
- **gtm**: add basketId on some missing gtm event
- **gtm**: add checkout-items to basket event, type on add-to-card events
- **vod**: pass give access to VOD
- **offeredit**: custom offer selection for recursive edit of similar offers
- **archive**: delete and restore coach/establshment even if future offers planned
- **nf525**: upload doc in settings for NF525
- **subscription**: allow 0e subscription w/ credit payment
- **subscription**: private-pass (RDV) subscription
- **apm**: first step testing instrumentation w/ elastic RUM
- test(producttour): add/ids
- **member**: terms and conditions in Member detail
- **client**: cancel-condition
- **associated coach api**: changed endpoint for create/update/link_email coach
- **idds**: chnage some idds
- **temp-password**: increase temp password validity to 1 week
- **bookingcreationnotification**: improved tooltips and form validation
- (fix): idds
- **bookingcreationnotification**: added booking notifications for establishment and meta_activity
- (ids): add/ids

### Perf

- **payment-pack**: optional check on bookings_within_month because annotation was removed on backend
- **email-tempaltes**: load templates only when dialog is open on membersummarycard
- **particlejs**: rmeove particlejs for error cleaning and perf

### Fix

- **subscription**: fix stupid error
- **gtm**: add price in gtm
- **translation**: lol
- **dashboard**: correctly filter invoiceitem
- **login**: center login form
- **i18n**: import es locale for moment
- **i18n**: import es locale for moment
- **recurrence-booking**: open recurrence booking form when no booking selected
- **recurrence-booking**: open recurrence booking form when no booking selected
- **login**: center login form
- **timezone**: fix a bug when no timezone on offerlistv2
- **gtm**: add event on pre-checkout pages
- **check-in**: register on check-in app without pb
- **communication**: link smartlist commuinication to smartlist in back
- **communication**: fixes on member detail + order page
- **contract**: edit a contract to set a combo
- **subscription**: fix some modal on payment in marketplace
- **voucher**: format cts in subscription
- **timezone**: fix offer header
- **i18n**: add ireland bank account
- **timezone**: remove timezone reference in useless ref
- **timezone**: micro fix
- **quickfix**: random quickfix
- **payment-combo**: fix refresh error whenusing private-pass
- **rum**: disable rum bullshit
- **waiting-list**: register cancelled bookings on waiting-list
- **quickinvoice**: fix remove invoice item and UnevenInvoiceDialog float display
- **payment-method**: fetch payument methods only if valid member id
- **booking-revert**: set loading to false after action
- **random**: random fixes post-merge
- **random**: random fixes post-merge
- **random**: random fixes post-merge
- **payment-method**: fix some pb when registering sepa on mobile
- **offer-direct-payment**: remove abd infinite loading page
- **platform-billing**: show right price on platform invoice
- **payment-method**: disable payment-method switch on old subscription
- **offer-card**: show coach on offer-card
- **subscription**: pay on offerbooking page
- **payment-method**: better refresh of methods on subscription paymebnt form
- **subscription**: do not ask for payment on 0e subscription
- **payment-rule**: bug when 1 bonus in rules
- **payment-rule**: ability to par pallier
- **disable-offer**: show mass offer being disabled
- **booking-discard**: attempt to fix error message on refund booking
- **self-checkin**: do not show cancelled bookings in tablet
- **qf**: qffix
- **booking**: is_discardable is kind of broken
- **kube**: back to no-kube for security
- **stupidity**: so much stupidity
- **kube**: switch env
- **waitinglist**: allow 15 minutes delay
- **booking**: revert is_discardable
- **vod**: category proposed in marketplace are bounded to videos
- **sct**: localization of SCT
- **login**: change translation when email exists
- **flag**: england
- **localization**: remove la suisse from locale created
- **sentry**: fix versionning scheme on sentry
- **report**: bug
- **lint**: appbar
- **bookingnotifications**: fixed undefined
- **sentry**: change sourcemap url-prefix and version w/ sha
- **bookingstatistics**: fixed offer graph visuals in planning page

### feat

- **recurrent-booking**: add recurrent booking on member page and fix pagination
- **timezone**: add timezones in manager interface display
- **CashBook**: add report for cashBook
- **Member**: count objects in tabs
- **emails**: add checkbox for canceledBooking in sending emails
- **settings**: make editable the ios and adroids's urls
- **offercard**: reactivate button delete
- **subscription**: private pass (RDV) available for subscription
- **appbar**: user/menu
- (client): add-last-discard
- **change**: idds

### Refactor

- **ids**: add more ids
- **ids**: add more ids

### fix

- **cleanup**: can not unselect first offer + fix translation loading

## 42.9.0 (2020-08-18)

### Feat

- **invoice**: prompt for uneven invoices in offermanagement.component
- **widget**: share button for widget and calendar url
- **payment-pack**: limit purchase per payment-pack per member
- **payment-pack**: add day limitation
- **marketplace calendar**: added new theme settings to personalize the manager & customer calendars
- **SCT**: SCT localized

### Refactor

- **calendar**: clean a bit the UI

### Fix

- **language**: default language is english
- **payment**: block manager from payment pages

## 42.8.0 (2020-08-14)

### Feat

- **marketplace calendar**: added new theme settings to personalize the manager & customer calendars

## 42.7.0 (2020-08-13)

### Feat

- **invoice**: voucher for quick invoices

## 42.6.0 (2020-08-13)

### Feat

- **report**: add first privatebooking report

## 42.5.1 (2020-08-13)

### Fix

- **version**: fetch tag berfore running cz bump
- **version**: test bump versionning

## 42.5.0 (2020-08-13)

### Feat

- **face-id**: FaceID working on tablet interface

### feat

- **face-id**: working flow, UX to be improved (+member form)

## 42.14.0a18 (2020-11-09)

### Feat

- **meta_activity**: auto_discard in MetaActivityForm and new notification rule
- **payment-packs**: add max bookings per month field
- **dashboard**: qualitative barchart and saving
- **consumer_payment_pack**: show history of modifying credit
- **exporthtml**: add button to export html file from email editor
- **platform-billing**: show max/min stage and coupon in settings
- **subscription**: auto-set subscription 0€ to credit + display flat fee
- **booking-option**: disable notification on discard booking-option when converting as booking
- **booking-option**: disable notification on discard booking-option when converting as booking
- **partial-refund**: improve pack partial refund
- **partial-refund**: improve pack partial refund
- **subscription**: scheduled stop for subscriptions
- **subscription**: scheduled stop for subscriptions
- **menu**: denser responsive drawer nested menu item
- **menu**: denser responsive drawer nested menu item
- **phone**: translate phone in other countries
- **phone**: translate phone in other countries
- **smartlist**: add attendance option for BookingsFilters and BookingsNumberFilter
- **recurrence-rule**: add establishment in recurrence rule booking
- **smartlist**: add attendance option for BookingsFilters and BookingsNumberFilter
- **recurrence-rule**: add establishment in recurrence rule booking
- **gtm**: add gtm on custom login pages
- **offer**: restore offer button
- **mass_disable**: add background task for mass disable
- **communication-dialog**: add sms and email-template email
- **rum**: disable elasticsearch RUM
- **booking**: filter on recurrence-rule-booking-isnull
- **offer**: chose default view cancelled offer (manager space)
- **offer**: background task for offer edit and offer create
- **component birthday email**: add new component to birthday celebration email
- **booking**: add filter not cancelled
- **report**: addres/birthday in reports
- **notification-rule**: add invoice notif and waiting-list kick
- **dashboard**: new dashboard page
- **recurrent-booking**: add recurrent booking on member page and fix pagination
- **report**: add nb_offer and nb_offer_cancelled
- **background-task**: background task monitoring and background task for disabling/deleting offers
- **timezone**: return timezone_name in company onboarding
- **timezone**: handle multitimezone
- **bookingstatistics**: bookingStatistics filtered by offerFilters in calendar page
- **bookingnotification**: notify every attendance / absence / cancellation ... for booking notif
- **coupon**: add to subscription
- **refund**: more explicit refund message
- **booking-revert**: notify or not client about cancellation of their booking
- **sepa**: allow oneshot sepa payment
- **offer**: add recurrence rule for booking
- **offer-card**: show if was first booking w/ ★
- **bank-account**: support spanish bank accounts for companies
- **platform-billing**: add multiple payment methods
- **report**: add on spot payment report and add a button to generate it from cashbook
- **offer-card**: back more info on card
- **theme**: add general_terms_of_use
- **marketplace**: add an appbar w/ email+basket on payment pages
- **access-code**: add access codes to company onboarding
- **platform-billing**: add payment method even if no subscription/billing-group
- **platform-billing**: add new screen platform billing
- **member**: count objects in tabs
- **gtm**: add gtm in offer payment/booking page
- **emails**: add checkbox to send emails to canceled Bookings
- **settings**: make editable the ios and adroids's urls
- **subscription**: sort the subscription in manager interface
- **platform-billing**: basic plaformbilling setting page
- **payment-method**: save payment method
- **notification-rule**: disable and/or send copy to the company
- **bookingnotification**: booking notification form reorganization
- **smartlist**: private filters
- **smartlist**: bug basket date select
- **kube**: full switch to kubernetes servers
- **voucher**: add percent selector along price selector
- **offer**: reactivate delete button on offercard
- **reset-password**: propose help if reset password twice in 4h
- **subscription**: consumer can and must pay their credit subscrtipion
- **gtm**: add basketId on some missing gtm event
- **gtm**: add checkout-items to basket event, type on add-to-card events
- **vod**: pass give access to VOD
- **offeredit**: custom offer selection for recursive edit of similar offers
- **archive**: delete and restore coach/establshment even if future offers planned
- **nf525**: upload doc in settings for NF525
- **subscription**: allow 0e subscription w/ credit payment
- **subscription**: private-pass (RDV) subscription
- **apm**: first step testing instrumentation w/ elastic RUM
- test(producttour): add/ids
- **member**: terms and conditions in Member detail
- **client**: cancel-condition
- **associated coach api**: changed endpoint for create/update/link_email coach
- **idds**: chnage some idds
- **temp-password**: increase temp password validity to 1 week
- **bookingcreationnotification**: improved tooltips and form validation
- (fix): idds
- **bookingcreationnotification**: added booking notifications for establishment and meta_activity
- (ids): add/ids

### Perf

- **payment-pack**: optional check on bookings_within_month because annotation was removed on backend
- **email-tempaltes**: load templates only when dialog is open on membersummarycard
- **particlejs**: rmeove particlejs for error cleaning and perf

### Fix

- **subscription**: fix stupid error
- **gtm**: add price in gtm
- **translation**: lol
- **dashboard**: correctly filter invoiceitem
- **login**: center login form
- **i18n**: import es locale for moment
- **i18n**: import es locale for moment
- **recurrence-booking**: open recurrence booking form when no booking selected
- **recurrence-booking**: open recurrence booking form when no booking selected
- **login**: center login form
- **timezone**: fix a bug when no timezone on offerlistv2
- **gtm**: add event on pre-checkout pages
- **check-in**: register on check-in app without pb
- **communication**: link smartlist commuinication to smartlist in back
- **communication**: fixes on member detail + order page
- **contract**: edit a contract to set a combo
- **subscription**: fix some modal on payment in marketplace
- **voucher**: format cts in subscription
- **timezone**: fix offer header
- **i18n**: add ireland bank account
- **timezone**: remove timezone reference in useless ref
- **timezone**: micro fix
- **quickfix**: random quickfix
- **payment-combo**: fix refresh error whenusing private-pass
- **rum**: disable rum bullshit
- **waiting-list**: register cancelled bookings on waiting-list
- **quickinvoice**: fix remove invoice item and UnevenInvoiceDialog float display
- **payment-method**: fetch payument methods only if valid member id
- **booking-revert**: set loading to false after action
- **random**: random fixes post-merge
- **random**: random fixes post-merge
- **random**: random fixes post-merge
- **payment-method**: fix some pb when registering sepa on mobile
- **offer-direct-payment**: remove abd infinite loading page
- **platform-billing**: show right price on platform invoice
- **payment-method**: disable payment-method switch on old subscription
- **offer-card**: show coach on offer-card
- **subscription**: pay on offerbooking page
- **payment-method**: better refresh of methods on subscription paymebnt form
- **subscription**: do not ask for payment on 0e subscription
- **payment-rule**: bug when 1 bonus in rules
- **payment-rule**: ability to par pallier
- **disable-offer**: show mass offer being disabled
- **booking-discard**: attempt to fix error message on refund booking
- **self-checkin**: do not show cancelled bookings in tablet
- **qf**: qffix
- **booking**: is_discardable is kind of broken
- **kube**: back to no-kube for security
- **stupidity**: so much stupidity
- **kube**: switch env
- **waitinglist**: allow 15 minutes delay
- **booking**: revert is_discardable
- **vod**: category proposed in marketplace are bounded to videos
- **sct**: localization of SCT
- **login**: change translation when email exists
- **flag**: england
- **localization**: remove la suisse from locale created
- **sentry**: fix versionning scheme on sentry
- **report**: bug
- **lint**: appbar
- **bookingnotifications**: fixed undefined
- **sentry**: change sourcemap url-prefix and version w/ sha
- **bookingstatistics**: fixed offer graph visuals in planning page

### feat

- **recurrent-booking**: add recurrent booking on member page and fix pagination
- **timezone**: add timezones in manager interface display
- **CashBook**: add report for cashBook
- **Member**: count objects in tabs
- **emails**: add checkbox for canceledBooking in sending emails
- **settings**: make editable the ios and adroids's urls
- **offercard**: reactivate button delete
- **subscription**: private pass (RDV) available for subscription
- **appbar**: user/menu
- (client): add-last-discard
- **change**: idds

### Refactor

- **ids**: add more ids
- **ids**: add more ids

### fix

- **cleanup**: can not unselect first offer + fix translation loading

## 42.9.0 (2020-08-18)

### Feat

- **invoice**: prompt for uneven invoices in offermanagement.component
- **widget**: share button for widget and calendar url
- **payment-pack**: limit purchase per payment-pack per member
- **payment-pack**: add day limitation
- **marketplace calendar**: added new theme settings to personalize the manager & customer calendars
- **SCT**: SCT localized

### Refactor

- **calendar**: clean a bit the UI

### Fix

- **language**: default language is english
- **payment**: block manager from payment pages

## 42.8.0 (2020-08-14)

### Feat

- **marketplace calendar**: added new theme settings to personalize the manager & customer calendars

## 42.7.0 (2020-08-13)

### Feat

- **invoice**: voucher for quick invoices

## 42.6.0 (2020-08-13)

### Feat

- **report**: add first privatebooking report

## 42.5.1 (2020-08-13)

### Fix

- **version**: fetch tag berfore running cz bump
- **version**: test bump versionning

## 42.5.0 (2020-08-13)

### Feat

- **face-id**: FaceID working on tablet interface

### feat

- **face-id**: working flow, UX to be improved (+member form)

## 42.14.0a18 (2020-11-09)

### Feat

- **meta_activity**: auto_discard in MetaActivityForm and new notification rule
- **payment-packs**: add max bookings per month field
- **dashboard**: qualitative barchart and saving
- **consumer_payment_pack**: show history of modifying credit
- **exporthtml**: add button to export html file from email editor
- **platform-billing**: show max/min stage and coupon in settings
- **subscription**: auto-set subscription 0€ to credit + display flat fee
- **booking-option**: disable notification on discard booking-option when converting as booking
- **booking-option**: disable notification on discard booking-option when converting as booking
- **partial-refund**: improve pack partial refund
- **partial-refund**: improve pack partial refund
- **subscription**: scheduled stop for subscriptions
- **subscription**: scheduled stop for subscriptions
- **menu**: denser responsive drawer nested menu item
- **menu**: denser responsive drawer nested menu item
- **phone**: translate phone in other countries
- **phone**: translate phone in other countries
- **smartlist**: add attendance option for BookingsFilters and BookingsNumberFilter
- **recurrence-rule**: add establishment in recurrence rule booking
- **smartlist**: add attendance option for BookingsFilters and BookingsNumberFilter
- **recurrence-rule**: add establishment in recurrence rule booking
- **gtm**: add gtm on custom login pages
- **offer**: restore offer button
- **mass_disable**: add background task for mass disable
- **communication-dialog**: add sms and email-template email
- **rum**: disable elasticsearch RUM
- **booking**: filter on recurrence-rule-booking-isnull
- **offer**: chose default view cancelled offer (manager space)
- **offer**: background task for offer edit and offer create
- **component birthday email**: add new component to birthday celebration email
- **booking**: add filter not cancelled
- **report**: addres/birthday in reports
- **notification-rule**: add invoice notif and waiting-list kick
- **dashboard**: new dashboard page
- **recurrent-booking**: add recurrent booking on member page and fix pagination
- **report**: add nb_offer and nb_offer_cancelled
- **background-task**: background task monitoring and background task for disabling/deleting offers
- **timezone**: return timezone_name in company onboarding
- **timezone**: handle multitimezone
- **bookingstatistics**: bookingStatistics filtered by offerFilters in calendar page
- **bookingnotification**: notify every attendance / absence / cancellation ... for booking notif
- **coupon**: add to subscription
- **refund**: more explicit refund message
- **booking-revert**: notify or not client about cancellation of their booking
- **sepa**: allow oneshot sepa payment
- **offer**: add recurrence rule for booking
- **offer-card**: show if was first booking w/ ★
- **bank-account**: support spanish bank accounts for companies
- **platform-billing**: add multiple payment methods
- **report**: add on spot payment report and add a button to generate it from cashbook
- **offer-card**: back more info on card
- **theme**: add general_terms_of_use
- **marketplace**: add an appbar w/ email+basket on payment pages
- **access-code**: add access codes to company onboarding
- **platform-billing**: add payment method even if no subscription/billing-group
- **platform-billing**: add new screen platform billing
- **member**: count objects in tabs
- **gtm**: add gtm in offer payment/booking page
- **emails**: add checkbox to send emails to canceled Bookings
- **settings**: make editable the ios and adroids's urls
- **subscription**: sort the subscription in manager interface
- **platform-billing**: basic plaformbilling setting page
- **payment-method**: save payment method
- **notification-rule**: disable and/or send copy to the company
- **bookingnotification**: booking notification form reorganization
- **smartlist**: private filters
- **smartlist**: bug basket date select
- **kube**: full switch to kubernetes servers
- **voucher**: add percent selector along price selector
- **offer**: reactivate delete button on offercard
- **reset-password**: propose help if reset password twice in 4h
- **subscription**: consumer can and must pay their credit subscrtipion
- **gtm**: add basketId on some missing gtm event
- **gtm**: add checkout-items to basket event, type on add-to-card events
- **vod**: pass give access to VOD
- **offeredit**: custom offer selection for recursive edit of similar offers
- **archive**: delete and restore coach/establshment even if future offers planned
- **nf525**: upload doc in settings for NF525
- **subscription**: allow 0e subscription w/ credit payment
- **subscription**: private-pass (RDV) subscription
- **apm**: first step testing instrumentation w/ elastic RUM
- test(producttour): add/ids
- **member**: terms and conditions in Member detail
- **client**: cancel-condition
- **associated coach api**: changed endpoint for create/update/link_email coach
- **idds**: chnage some idds
- **temp-password**: increase temp password validity to 1 week
- **bookingcreationnotification**: improved tooltips and form validation
- (fix): idds
- **bookingcreationnotification**: added booking notifications for establishment and meta_activity
- (ids): add/ids

### Perf

- **payment-pack**: optional check on bookings_within_month because annotation was removed on backend
- **email-tempaltes**: load templates only when dialog is open on membersummarycard
- **particlejs**: rmeove particlejs for error cleaning and perf

### Fix

- **subscription**: fix stupid error
- **gtm**: add price in gtm
- **translation**: lol
- **dashboard**: correctly filter invoiceitem
- **login**: center login form
- **i18n**: import es locale for moment
- **i18n**: import es locale for moment
- **recurrence-booking**: open recurrence booking form when no booking selected
- **recurrence-booking**: open recurrence booking form when no booking selected
- **login**: center login form
- **timezone**: fix a bug when no timezone on offerlistv2
- **gtm**: add event on pre-checkout pages
- **check-in**: register on check-in app without pb
- **communication**: link smartlist commuinication to smartlist in back
- **communication**: fixes on member detail + order page
- **contract**: edit a contract to set a combo
- **subscription**: fix some modal on payment in marketplace
- **voucher**: format cts in subscription
- **timezone**: fix offer header
- **i18n**: add ireland bank account
- **timezone**: remove timezone reference in useless ref
- **timezone**: micro fix
- **quickfix**: random quickfix
- **payment-combo**: fix refresh error whenusing private-pass
- **rum**: disable rum bullshit
- **waiting-list**: register cancelled bookings on waiting-list
- **quickinvoice**: fix remove invoice item and UnevenInvoiceDialog float display
- **payment-method**: fetch payument methods only if valid member id
- **booking-revert**: set loading to false after action
- **random**: random fixes post-merge
- **random**: random fixes post-merge
- **random**: random fixes post-merge
- **payment-method**: fix some pb when registering sepa on mobile
- **offer-direct-payment**: remove abd infinite loading page
- **platform-billing**: show right price on platform invoice
- **payment-method**: disable payment-method switch on old subscription
- **offer-card**: show coach on offer-card
- **subscription**: pay on offerbooking page
- **payment-method**: better refresh of methods on subscription paymebnt form
- **subscription**: do not ask for payment on 0e subscription
- **payment-rule**: bug when 1 bonus in rules
- **payment-rule**: ability to par pallier
- **disable-offer**: show mass offer being disabled
- **booking-discard**: attempt to fix error message on refund booking
- **self-checkin**: do not show cancelled bookings in tablet
- **qf**: qffix
- **booking**: is_discardable is kind of broken
- **kube**: back to no-kube for security
- **stupidity**: so much stupidity
- **kube**: switch env
- **waitinglist**: allow 15 minutes delay
- **booking**: revert is_discardable
- **vod**: category proposed in marketplace are bounded to videos
- **sct**: localization of SCT
- **login**: change translation when email exists
- **flag**: england
- **localization**: remove la suisse from locale created
- **sentry**: fix versionning scheme on sentry
- **report**: bug
- **lint**: appbar
- **bookingnotifications**: fixed undefined
- **sentry**: change sourcemap url-prefix and version w/ sha
- **bookingstatistics**: fixed offer graph visuals in planning page

### feat

- **recurrent-booking**: add recurrent booking on member page and fix pagination
- **timezone**: add timezones in manager interface display
- **CashBook**: add report for cashBook
- **Member**: count objects in tabs
- **emails**: add checkbox for canceledBooking in sending emails
- **settings**: make editable the ios and adroids's urls
- **offercard**: reactivate button delete
- **subscription**: private pass (RDV) available for subscription
- **appbar**: user/menu
- (client): add-last-discard
- **change**: idds

### Refactor

- **ids**: add more ids
- **ids**: add more ids

### fix

- **cleanup**: can not unselect first offer + fix translation loading

## 42.9.0 (2020-08-18)

### Feat

- **invoice**: prompt for uneven invoices in offermanagement.component
- **widget**: share button for widget and calendar url
- **payment-pack**: limit purchase per payment-pack per member
- **payment-pack**: add day limitation
- **marketplace calendar**: added new theme settings to personalize the manager & customer calendars
- **SCT**: SCT localized

### Refactor

- **calendar**: clean a bit the UI

### Fix

- **language**: default language is english
- **payment**: block manager from payment pages

## 42.8.0 (2020-08-14)

### Feat

- **marketplace calendar**: added new theme settings to personalize the manager & customer calendars

## 42.7.0 (2020-08-13)

### Feat

- **invoice**: voucher for quick invoices

## 42.6.0 (2020-08-13)

### Feat

- **report**: add first privatebooking report

## 42.5.1 (2020-08-13)

### Fix

- **version**: fetch tag berfore running cz bump
- **version**: test bump versionning

## 42.5.0 (2020-08-13)

### Feat

- **face-id**: FaceID working on tablet interface

### feat

- **face-id**: working flow, UX to be improved (+member form)

## 42.14.0a16 (2020-11-09)

### Feat

- **meta_activity**: auto_discard in MetaActivityForm and new notification rule
- **payment-packs**: add max bookings per month field
- **dashboard**: qualitative barchart and saving
- **consumer_payment_pack**: show history of modifying credit
- **exporthtml**: add button to export html file from email editor
- **platform-billing**: show max/min stage and coupon in settings
- **subscription**: auto-set subscription 0€ to credit + display flat fee
- **booking-option**: disable notification on discard booking-option when converting as booking
- **booking-option**: disable notification on discard booking-option when converting as booking
- **partial-refund**: improve pack partial refund
- **partial-refund**: improve pack partial refund
- **subscription**: scheduled stop for subscriptions
- **subscription**: scheduled stop for subscriptions
- **menu**: denser responsive drawer nested menu item
- **menu**: denser responsive drawer nested menu item
- **phone**: translate phone in other countries
- **phone**: translate phone in other countries
- **smartlist**: add attendance option for BookingsFilters and BookingsNumberFilter
- **recurrence-rule**: add establishment in recurrence rule booking
- **smartlist**: add attendance option for BookingsFilters and BookingsNumberFilter
- **recurrence-rule**: add establishment in recurrence rule booking
- **gtm**: add gtm on custom login pages
- **offer**: restore offer button
- **mass_disable**: add background task for mass disable
- **communication-dialog**: add sms and email-template email
- **rum**: disable elasticsearch RUM
- **booking**: filter on recurrence-rule-booking-isnull
- **offer**: chose default view cancelled offer (manager space)
- **offer**: background task for offer edit and offer create
- **component birthday email**: add new component to birthday celebration email
- **booking**: add filter not cancelled
- **report**: addres/birthday in reports
- **notification-rule**: add invoice notif and waiting-list kick
- **dashboard**: new dashboard page
- **recurrent-booking**: add recurrent booking on member page and fix pagination
- **report**: add nb_offer and nb_offer_cancelled
- **background-task**: background task monitoring and background task for disabling/deleting offers
- **timezone**: return timezone_name in company onboarding
- **timezone**: handle multitimezone
- **bookingstatistics**: bookingStatistics filtered by offerFilters in calendar page
- **bookingnotification**: notify every attendance / absence / cancellation ... for booking notif
- **coupon**: add to subscription
- **refund**: more explicit refund message
- **booking-revert**: notify or not client about cancellation of their booking
- **sepa**: allow oneshot sepa payment
- **offer**: add recurrence rule for booking
- **offer-card**: show if was first booking w/ ★
- **bank-account**: support spanish bank accounts for companies
- **platform-billing**: add multiple payment methods
- **report**: add on spot payment report and add a button to generate it from cashbook
- **offer-card**: back more info on card
- **theme**: add general_terms_of_use
- **marketplace**: add an appbar w/ email+basket on payment pages
- **access-code**: add access codes to company onboarding
- **platform-billing**: add payment method even if no subscription/billing-group
- **platform-billing**: add new screen platform billing
- **member**: count objects in tabs
- **gtm**: add gtm in offer payment/booking page
- **emails**: add checkbox to send emails to canceled Bookings
- **settings**: make editable the ios and adroids's urls
- **subscription**: sort the subscription in manager interface
- **platform-billing**: basic plaformbilling setting page
- **payment-method**: save payment method
- **notification-rule**: disable and/or send copy to the company
- **bookingnotification**: booking notification form reorganization
- **smartlist**: private filters
- **smartlist**: bug basket date select
- **kube**: full switch to kubernetes servers
- **voucher**: add percent selector along price selector
- **offer**: reactivate delete button on offercard
- **reset-password**: propose help if reset password twice in 4h
- **subscription**: consumer can and must pay their credit subscrtipion
- **gtm**: add basketId on some missing gtm event
- **gtm**: add checkout-items to basket event, type on add-to-card events
- **vod**: pass give access to VOD
- **offeredit**: custom offer selection for recursive edit of similar offers
- **archive**: delete and restore coach/establshment even if future offers planned
- **nf525**: upload doc in settings for NF525
- **subscription**: allow 0e subscription w/ credit payment
- **subscription**: private-pass (RDV) subscription
- **apm**: first step testing instrumentation w/ elastic RUM
- test(producttour): add/ids
- **member**: terms and conditions in Member detail
- **client**: cancel-condition
- **associated coach api**: changed endpoint for create/update/link_email coach
- **idds**: chnage some idds
- **temp-password**: increase temp password validity to 1 week
- **bookingcreationnotification**: improved tooltips and form validation
- (fix): idds
- **bookingcreationnotification**: added booking notifications for establishment and meta_activity
- (ids): add/ids

### Perf

- **payment-pack**: optional check on bookings_within_month because annotation was removed on backend
- **email-tempaltes**: load templates only when dialog is open on membersummarycard
- **particlejs**: rmeove particlejs for error cleaning and perf

### Fix

- **subscription**: fix stupid error
- **gtm**: add price in gtm
- **translation**: lol
- **dashboard**: correctly filter invoiceitem
- **login**: center login form
- **i18n**: import es locale for moment
- **i18n**: import es locale for moment
- **recurrence-booking**: open recurrence booking form when no booking selected
- **recurrence-booking**: open recurrence booking form when no booking selected
- **login**: center login form
- **timezone**: fix a bug when no timezone on offerlistv2
- **gtm**: add event on pre-checkout pages
- **check-in**: register on check-in app without pb
- **communication**: link smartlist commuinication to smartlist in back
- **communication**: fixes on member detail + order page
- **contract**: edit a contract to set a combo
- **subscription**: fix some modal on payment in marketplace
- **voucher**: format cts in subscription
- **timezone**: fix offer header
- **i18n**: add ireland bank account
- **timezone**: remove timezone reference in useless ref
- **timezone**: micro fix
- **quickfix**: random quickfix
- **payment-combo**: fix refresh error whenusing private-pass
- **rum**: disable rum bullshit
- **waiting-list**: register cancelled bookings on waiting-list
- **quickinvoice**: fix remove invoice item and UnevenInvoiceDialog float display
- **payment-method**: fetch payument methods only if valid member id
- **booking-revert**: set loading to false after action
- **random**: random fixes post-merge
- **random**: random fixes post-merge
- **random**: random fixes post-merge
- **payment-method**: fix some pb when registering sepa on mobile
- **offer-direct-payment**: remove abd infinite loading page
- **platform-billing**: show right price on platform invoice
- **payment-method**: disable payment-method switch on old subscription
- **offer-card**: show coach on offer-card
- **subscription**: pay on offerbooking page
- **payment-method**: better refresh of methods on subscription paymebnt form
- **subscription**: do not ask for payment on 0e subscription
- **payment-rule**: bug when 1 bonus in rules
- **payment-rule**: ability to par pallier
- **disable-offer**: show mass offer being disabled
- **booking-discard**: attempt to fix error message on refund booking
- **self-checkin**: do not show cancelled bookings in tablet
- **qf**: qffix
- **booking**: is_discardable is kind of broken
- **kube**: back to no-kube for security
- **stupidity**: so much stupidity
- **kube**: switch env
- **waitinglist**: allow 15 minutes delay
- **booking**: revert is_discardable
- **vod**: category proposed in marketplace are bounded to videos
- **sct**: localization of SCT
- **login**: change translation when email exists
- **flag**: england
- **localization**: remove la suisse from locale created
- **sentry**: fix versionning scheme on sentry
- **report**: bug
- **lint**: appbar
- **bookingnotifications**: fixed undefined
- **sentry**: change sourcemap url-prefix and version w/ sha
- **bookingstatistics**: fixed offer graph visuals in planning page

### feat

- **recurrent-booking**: add recurrent booking on member page and fix pagination
- **timezone**: add timezones in manager interface display
- **CashBook**: add report for cashBook
- **Member**: count objects in tabs
- **emails**: add checkbox for canceledBooking in sending emails
- **settings**: make editable the ios and adroids's urls
- **offercard**: reactivate button delete
- **subscription**: private pass (RDV) available for subscription
- **appbar**: user/menu
- (client): add-last-discard
- **change**: idds

### Refactor

- **ids**: add more ids
- **ids**: add more ids

### fix

- **cleanup**: can not unselect first offer + fix translation loading

## 42.9.0 (2020-08-18)

### Feat

- **invoice**: prompt for uneven invoices in offermanagement.component
- **widget**: share button for widget and calendar url
- **payment-pack**: limit purchase per payment-pack per member
- **payment-pack**: add day limitation
- **marketplace calendar**: added new theme settings to personalize the manager & customer calendars
- **SCT**: SCT localized

### Refactor

- **calendar**: clean a bit the UI

### Fix

- **language**: default language is english
- **payment**: block manager from payment pages

## 42.8.0 (2020-08-14)

### Feat

- **marketplace calendar**: added new theme settings to personalize the manager & customer calendars

## 42.7.0 (2020-08-13)

### Feat

- **invoice**: voucher for quick invoices

## 42.6.0 (2020-08-13)

### Feat

- **report**: add first privatebooking report

## 42.5.1 (2020-08-13)

### Fix

- **version**: fetch tag berfore running cz bump
- **version**: test bump versionning

## 42.5.0 (2020-08-13)

### Feat

- **face-id**: FaceID working on tablet interface

### feat

- **face-id**: working flow, UX to be improved (+member form)

## 42.14.0a16 (2020-11-09)

### Feat

- **meta_activity**: auto_discard in MetaActivityForm and new notification rule
- **payment-packs**: add max bookings per month field
- **dashboard**: qualitative barchart and saving
- **consumer_payment_pack**: show history of modifying credit
- **exporthtml**: add button to export html file from email editor
- **platform-billing**: show max/min stage and coupon in settings
- **subscription**: auto-set subscription 0€ to credit + display flat fee
- **booking-option**: disable notification on discard booking-option when converting as booking
- **booking-option**: disable notification on discard booking-option when converting as booking
- **partial-refund**: improve pack partial refund
- **partial-refund**: improve pack partial refund
- **subscription**: scheduled stop for subscriptions
- **subscription**: scheduled stop for subscriptions
- **menu**: denser responsive drawer nested menu item
- **menu**: denser responsive drawer nested menu item
- **phone**: translate phone in other countries
- **phone**: translate phone in other countries
- **smartlist**: add attendance option for BookingsFilters and BookingsNumberFilter
- **recurrence-rule**: add establishment in recurrence rule booking
- **smartlist**: add attendance option for BookingsFilters and BookingsNumberFilter
- **recurrence-rule**: add establishment in recurrence rule booking
- **gtm**: add gtm on custom login pages
- **offer**: restore offer button
- **mass_disable**: add background task for mass disable
- **communication-dialog**: add sms and email-template email
- **rum**: disable elasticsearch RUM
- **booking**: filter on recurrence-rule-booking-isnull
- **offer**: chose default view cancelled offer (manager space)
- **offer**: background task for offer edit and offer create
- **component birthday email**: add new component to birthday celebration email
- **booking**: add filter not cancelled
- **report**: addres/birthday in reports
- **notification-rule**: add invoice notif and waiting-list kick
- **dashboard**: new dashboard page
- **recurrent-booking**: add recurrent booking on member page and fix pagination
- **report**: add nb_offer and nb_offer_cancelled
- **background-task**: background task monitoring and background task for disabling/deleting offers
- **timezone**: return timezone_name in company onboarding
- **timezone**: handle multitimezone
- **bookingstatistics**: bookingStatistics filtered by offerFilters in calendar page
- **bookingnotification**: notify every attendance / absence / cancellation ... for booking notif
- **coupon**: add to subscription
- **refund**: more explicit refund message
- **booking-revert**: notify or not client about cancellation of their booking
- **sepa**: allow oneshot sepa payment
- **offer**: add recurrence rule for booking
- **offer-card**: show if was first booking w/ ★
- **bank-account**: support spanish bank accounts for companies
- **platform-billing**: add multiple payment methods
- **report**: add on spot payment report and add a button to generate it from cashbook
- **offer-card**: back more info on card
- **theme**: add general_terms_of_use
- **marketplace**: add an appbar w/ email+basket on payment pages
- **access-code**: add access codes to company onboarding
- **platform-billing**: add payment method even if no subscription/billing-group
- **platform-billing**: add new screen platform billing
- **member**: count objects in tabs
- **gtm**: add gtm in offer payment/booking page
- **emails**: add checkbox to send emails to canceled Bookings
- **settings**: make editable the ios and adroids's urls
- **subscription**: sort the subscription in manager interface
- **platform-billing**: basic plaformbilling setting page
- **payment-method**: save payment method
- **notification-rule**: disable and/or send copy to the company
- **bookingnotification**: booking notification form reorganization
- **smartlist**: private filters
- **smartlist**: bug basket date select
- **kube**: full switch to kubernetes servers
- **voucher**: add percent selector along price selector
- **offer**: reactivate delete button on offercard
- **reset-password**: propose help if reset password twice in 4h
- **subscription**: consumer can and must pay their credit subscrtipion
- **gtm**: add basketId on some missing gtm event
- **gtm**: add checkout-items to basket event, type on add-to-card events
- **vod**: pass give access to VOD
- **offeredit**: custom offer selection for recursive edit of similar offers
- **archive**: delete and restore coach/establshment even if future offers planned
- **nf525**: upload doc in settings for NF525
- **subscription**: allow 0e subscription w/ credit payment
- **subscription**: private-pass (RDV) subscription
- **apm**: first step testing instrumentation w/ elastic RUM
- test(producttour): add/ids
- **member**: terms and conditions in Member detail
- **client**: cancel-condition
- **associated coach api**: changed endpoint for create/update/link_email coach
- **idds**: chnage some idds
- **temp-password**: increase temp password validity to 1 week
- **bookingcreationnotification**: improved tooltips and form validation
- (fix): idds
- **bookingcreationnotification**: added booking notifications for establishment and meta_activity
- (ids): add/ids

### Perf

- **payment-pack**: optional check on bookings_within_month because annotation was removed on backend
- **email-tempaltes**: load templates only when dialog is open on membersummarycard
- **particlejs**: rmeove particlejs for error cleaning and perf

### Fix

- **subscription**: fix stupid error
- **gtm**: add price in gtm
- **translation**: lol
- **dashboard**: correctly filter invoiceitem
- **login**: center login form
- **i18n**: import es locale for moment
- **i18n**: import es locale for moment
- **recurrence-booking**: open recurrence booking form when no booking selected
- **recurrence-booking**: open recurrence booking form when no booking selected
- **login**: center login form
- **timezone**: fix a bug when no timezone on offerlistv2
- **gtm**: add event on pre-checkout pages
- **check-in**: register on check-in app without pb
- **communication**: link smartlist commuinication to smartlist in back
- **communication**: fixes on member detail + order page
- **contract**: edit a contract to set a combo
- **subscription**: fix some modal on payment in marketplace
- **voucher**: format cts in subscription
- **timezone**: fix offer header
- **i18n**: add ireland bank account
- **timezone**: remove timezone reference in useless ref
- **timezone**: micro fix
- **quickfix**: random quickfix
- **payment-combo**: fix refresh error whenusing private-pass
- **rum**: disable rum bullshit
- **waiting-list**: register cancelled bookings on waiting-list
- **quickinvoice**: fix remove invoice item and UnevenInvoiceDialog float display
- **payment-method**: fetch payument methods only if valid member id
- **booking-revert**: set loading to false after action
- **random**: random fixes post-merge
- **random**: random fixes post-merge
- **random**: random fixes post-merge
- **payment-method**: fix some pb when registering sepa on mobile
- **offer-direct-payment**: remove abd infinite loading page
- **platform-billing**: show right price on platform invoice
- **payment-method**: disable payment-method switch on old subscription
- **offer-card**: show coach on offer-card
- **subscription**: pay on offerbooking page
- **payment-method**: better refresh of methods on subscription paymebnt form
- **subscription**: do not ask for payment on 0e subscription
- **payment-rule**: bug when 1 bonus in rules
- **payment-rule**: ability to par pallier
- **disable-offer**: show mass offer being disabled
- **booking-discard**: attempt to fix error message on refund booking
- **self-checkin**: do not show cancelled bookings in tablet
- **qf**: qffix
- **booking**: is_discardable is kind of broken
- **kube**: back to no-kube for security
- **stupidity**: so much stupidity
- **kube**: switch env
- **waitinglist**: allow 15 minutes delay
- **booking**: revert is_discardable
- **vod**: category proposed in marketplace are bounded to videos
- **sct**: localization of SCT
- **login**: change translation when email exists
- **flag**: england
- **localization**: remove la suisse from locale created
- **sentry**: fix versionning scheme on sentry
- **report**: bug
- **lint**: appbar
- **bookingnotifications**: fixed undefined
- **sentry**: change sourcemap url-prefix and version w/ sha
- **bookingstatistics**: fixed offer graph visuals in planning page

### feat

- **recurrent-booking**: add recurrent booking on member page and fix pagination
- **timezone**: add timezones in manager interface display
- **CashBook**: add report for cashBook
- **Member**: count objects in tabs
- **emails**: add checkbox for canceledBooking in sending emails
- **settings**: make editable the ios and adroids's urls
- **offercard**: reactivate button delete
- **subscription**: private pass (RDV) available for subscription
- **appbar**: user/menu
- (client): add-last-discard
- **change**: idds

### Refactor

- **ids**: add more ids
- **ids**: add more ids

### fix

- **cleanup**: can not unselect first offer + fix translation loading

## 42.9.0 (2020-08-18)

### Feat

- **invoice**: prompt for uneven invoices in offermanagement.component
- **widget**: share button for widget and calendar url
- **payment-pack**: limit purchase per payment-pack per member
- **payment-pack**: add day limitation
- **marketplace calendar**: added new theme settings to personalize the manager & customer calendars
- **SCT**: SCT localized

### Refactor

- **calendar**: clean a bit the UI

### Fix

- **language**: default language is english
- **payment**: block manager from payment pages

## 42.8.0 (2020-08-14)

### Feat

- **marketplace calendar**: added new theme settings to personalize the manager & customer calendars

## 42.7.0 (2020-08-13)

### Feat

- **invoice**: voucher for quick invoices

## 42.6.0 (2020-08-13)

### Feat

- **report**: add first privatebooking report

## 42.5.1 (2020-08-13)

### Fix

- **version**: fetch tag berfore running cz bump
- **version**: test bump versionning

## 42.5.0 (2020-08-13)

### Feat

- **face-id**: FaceID working on tablet interface

### feat

- **face-id**: working flow, UX to be improved (+member form)

## 42.14.0a14 (2020-11-08)

### Perf

- **payment-pack**: optional check on bookings_within_month because annotation was removed on backend
- **email-tempaltes**: load templates only when dialog is open on membersummarycard
- **particlejs**: rmeove particlejs for error cleaning and perf

### Feat

- **payment-packs**: add max bookings per month field
- **dashboard**: qualitative barchart and saving
- **consumer_payment_pack**: show history of modifying credit
- **exporthtml**: add button to export html file from email editor
- **platform-billing**: show max/min stage and coupon in settings
- **subscription**: auto-set subscription 0€ to credit + display flat fee
- **booking-option**: disable notification on discard booking-option when converting as booking
- **booking-option**: disable notification on discard booking-option when converting as booking
- **partial-refund**: improve pack partial refund
- **partial-refund**: improve pack partial refund
- **subscription**: scheduled stop for subscriptions
- **subscription**: scheduled stop for subscriptions
- **menu**: denser responsive drawer nested menu item
- **menu**: denser responsive drawer nested menu item
- **phone**: translate phone in other countries
- **phone**: translate phone in other countries
- **smartlist**: add attendance option for BookingsFilters and BookingsNumberFilter
- **recurrence-rule**: add establishment in recurrence rule booking
- **smartlist**: add attendance option for BookingsFilters and BookingsNumberFilter
- **recurrence-rule**: add establishment in recurrence rule booking
- **gtm**: add gtm on custom login pages
- **offer**: restore offer button
- **mass_disable**: add background task for mass disable
- **communication-dialog**: add sms and email-template email
- **rum**: disable elasticsearch RUM
- **booking**: filter on recurrence-rule-booking-isnull
- **offer**: chose default view cancelled offer (manager space)
- **offer**: background task for offer edit and offer create
- **component birthday email**: add new component to birthday celebration email
- **booking**: add filter not cancelled
- **report**: addres/birthday in reports
- **notification-rule**: add invoice notif and waiting-list kick
- **dashboard**: new dashboard page
- **recurrent-booking**: add recurrent booking on member page and fix pagination
- **report**: add nb_offer and nb_offer_cancelled
- **background-task**: background task monitoring and background task for disabling/deleting offers
- **timezone**: return timezone_name in company onboarding
- **timezone**: handle multitimezone
- **bookingstatistics**: bookingStatistics filtered by offerFilters in calendar page
- **bookingnotification**: notify every attendance / absence / cancellation ... for booking notif
- **coupon**: add to subscription
- **refund**: more explicit refund message
- **booking-revert**: notify or not client about cancellation of their booking
- **sepa**: allow oneshot sepa payment
- **offer**: add recurrence rule for booking
- **offer-card**: show if was first booking w/ ★
- **bank-account**: support spanish bank accounts for companies
- **platform-billing**: add multiple payment methods
- **report**: add on spot payment report and add a button to generate it from cashbook
- **offer-card**: back more info on card
- **theme**: add general_terms_of_use
- **marketplace**: add an appbar w/ email+basket on payment pages
- **access-code**: add access codes to company onboarding
- **platform-billing**: add payment method even if no subscription/billing-group
- **platform-billing**: add new screen platform billing
- **member**: count objects in tabs
- **gtm**: add gtm in offer payment/booking page
- **emails**: add checkbox to send emails to canceled Bookings
- **settings**: make editable the ios and adroids's urls
- **subscription**: sort the subscription in manager interface
- **platform-billing**: basic plaformbilling setting page
- **payment-method**: save payment method
- **notification-rule**: disable and/or send copy to the company
- **bookingnotification**: booking notification form reorganization
- **smartlist**: private filters
- **smartlist**: bug basket date select
- **kube**: full switch to kubernetes servers
- **voucher**: add percent selector along price selector
- **offer**: reactivate delete button on offercard
- **reset-password**: propose help if reset password twice in 4h
- **subscription**: consumer can and must pay their credit subscrtipion
- **gtm**: add basketId on some missing gtm event
- **gtm**: add checkout-items to basket event, type on add-to-card events
- **vod**: pass give access to VOD
- **offeredit**: custom offer selection for recursive edit of similar offers
- **archive**: delete and restore coach/establshment even if future offers planned
- **nf525**: upload doc in settings for NF525
- **subscription**: allow 0e subscription w/ credit payment
- **subscription**: private-pass (RDV) subscription
- **apm**: first step testing instrumentation w/ elastic RUM
- test(producttour): add/ids
- **member**: terms and conditions in Member detail
- **client**: cancel-condition
- **associated coach api**: changed endpoint for create/update/link_email coach
- **idds**: chnage some idds
- **temp-password**: increase temp password validity to 1 week
- **bookingcreationnotification**: improved tooltips and form validation
- (fix): idds
- **bookingcreationnotification**: added booking notifications for establishment and meta_activity
- (ids): add/ids

### Fix

- **subscription**: fix stupid error
- **gtm**: add price in gtm
- **translation**: lol
- **dashboard**: correctly filter invoiceitem
- **login**: center login form
- **i18n**: import es locale for moment
- **i18n**: import es locale for moment
- **recurrence-booking**: open recurrence booking form when no booking selected
- **recurrence-booking**: open recurrence booking form when no booking selected
- **login**: center login form
- **timezone**: fix a bug when no timezone on offerlistv2
- **gtm**: add event on pre-checkout pages
- **check-in**: register on check-in app without pb
- **communication**: link smartlist commuinication to smartlist in back
- **communication**: fixes on member detail + order page
- **contract**: edit a contract to set a combo
- **subscription**: fix some modal on payment in marketplace
- **voucher**: format cts in subscription
- **timezone**: fix offer header
- **i18n**: add ireland bank account
- **timezone**: remove timezone reference in useless ref
- **timezone**: micro fix
- **quickfix**: random quickfix
- **payment-combo**: fix refresh error whenusing private-pass
- **rum**: disable rum bullshit
- **waiting-list**: register cancelled bookings on waiting-list
- **quickinvoice**: fix remove invoice item and UnevenInvoiceDialog float display
- **payment-method**: fetch payument methods only if valid member id
- **booking-revert**: set loading to false after action
- **random**: random fixes post-merge
- **random**: random fixes post-merge
- **random**: random fixes post-merge
- **payment-method**: fix some pb when registering sepa on mobile
- **offer-direct-payment**: remove abd infinite loading page
- **platform-billing**: show right price on platform invoice
- **payment-method**: disable payment-method switch on old subscription
- **offer-card**: show coach on offer-card
- **subscription**: pay on offerbooking page
- **payment-method**: better refresh of methods on subscription paymebnt form
- **subscription**: do not ask for payment on 0e subscription
- **payment-rule**: bug when 1 bonus in rules
- **payment-rule**: ability to par pallier
- **disable-offer**: show mass offer being disabled
- **booking-discard**: attempt to fix error message on refund booking
- **self-checkin**: do not show cancelled bookings in tablet
- **qf**: qffix
- **booking**: is_discardable is kind of broken
- **kube**: back to no-kube for security
- **stupidity**: so much stupidity
- **kube**: switch env
- **waitinglist**: allow 15 minutes delay
- **booking**: revert is_discardable
- **vod**: category proposed in marketplace are bounded to videos
- **sct**: localization of SCT
- **login**: change translation when email exists
- **flag**: england
- **localization**: remove la suisse from locale created
- **sentry**: fix versionning scheme on sentry
- **report**: bug
- **lint**: appbar
- **bookingnotifications**: fixed undefined
- **sentry**: change sourcemap url-prefix and version w/ sha
- **bookingstatistics**: fixed offer graph visuals in planning page

### feat

- **recurrent-booking**: add recurrent booking on member page and fix pagination
- **timezone**: add timezones in manager interface display
- **CashBook**: add report for cashBook
- **Member**: count objects in tabs
- **emails**: add checkbox for canceledBooking in sending emails
- **settings**: make editable the ios and adroids's urls
- **offercard**: reactivate button delete
- **subscription**: private pass (RDV) available for subscription
- **appbar**: user/menu
- (client): add-last-discard
- **change**: idds

### Refactor

- **ids**: add more ids
- **ids**: add more ids

### fix

- **cleanup**: can not unselect first offer + fix translation loading

## 42.9.0 (2020-08-18)

### Feat

- **invoice**: prompt for uneven invoices in offermanagement.component
- **widget**: share button for widget and calendar url
- **payment-pack**: limit purchase per payment-pack per member
- **payment-pack**: add day limitation
- **marketplace calendar**: added new theme settings to personalize the manager & customer calendars
- **SCT**: SCT localized

### Refactor

- **calendar**: clean a bit the UI

### Fix

- **language**: default language is english
- **payment**: block manager from payment pages

## 42.8.0 (2020-08-14)

### Feat

- **marketplace calendar**: added new theme settings to personalize the manager & customer calendars

## 42.7.0 (2020-08-13)

### Feat

- **invoice**: voucher for quick invoices

## 42.6.0 (2020-08-13)

### Feat

- **report**: add first privatebooking report

## 42.5.1 (2020-08-13)

### Fix

- **version**: fetch tag berfore running cz bump
- **version**: test bump versionning

## 42.5.0 (2020-08-13)

### Feat

- **face-id**: FaceID working on tablet interface

### feat

- **face-id**: working flow, UX to be improved (+member form)

## 42.14.0a14 (2020-11-08)

### Perf

- **payment-pack**: optional check on bookings_within_month because annotation was removed on backend
- **email-tempaltes**: load templates only when dialog is open on membersummarycard
- **particlejs**: rmeove particlejs for error cleaning and perf

### Feat

- **payment-packs**: add max bookings per month field
- **dashboard**: qualitative barchart and saving
- **consumer_payment_pack**: show history of modifying credit
- **exporthtml**: add button to export html file from email editor
- **platform-billing**: show max/min stage and coupon in settings
- **subscription**: auto-set subscription 0€ to credit + display flat fee
- **booking-option**: disable notification on discard booking-option when converting as booking
- **booking-option**: disable notification on discard booking-option when converting as booking
- **partial-refund**: improve pack partial refund
- **partial-refund**: improve pack partial refund
- **subscription**: scheduled stop for subscriptions
- **subscription**: scheduled stop for subscriptions
- **menu**: denser responsive drawer nested menu item
- **menu**: denser responsive drawer nested menu item
- **phone**: translate phone in other countries
- **phone**: translate phone in other countries
- **smartlist**: add attendance option for BookingsFilters and BookingsNumberFilter
- **recurrence-rule**: add establishment in recurrence rule booking
- **smartlist**: add attendance option for BookingsFilters and BookingsNumberFilter
- **recurrence-rule**: add establishment in recurrence rule booking
- **gtm**: add gtm on custom login pages
- **offer**: restore offer button
- **mass_disable**: add background task for mass disable
- **communication-dialog**: add sms and email-template email
- **rum**: disable elasticsearch RUM
- **booking**: filter on recurrence-rule-booking-isnull
- **offer**: chose default view cancelled offer (manager space)
- **offer**: background task for offer edit and offer create
- **component birthday email**: add new component to birthday celebration email
- **booking**: add filter not cancelled
- **report**: addres/birthday in reports
- **notification-rule**: add invoice notif and waiting-list kick
- **dashboard**: new dashboard page
- **recurrent-booking**: add recurrent booking on member page and fix pagination
- **report**: add nb_offer and nb_offer_cancelled
- **background-task**: background task monitoring and background task for disabling/deleting offers
- **timezone**: return timezone_name in company onboarding
- **timezone**: handle multitimezone
- **bookingstatistics**: bookingStatistics filtered by offerFilters in calendar page
- **bookingnotification**: notify every attendance / absence / cancellation ... for booking notif
- **coupon**: add to subscription
- **refund**: more explicit refund message
- **booking-revert**: notify or not client about cancellation of their booking
- **sepa**: allow oneshot sepa payment
- **offer**: add recurrence rule for booking
- **offer-card**: show if was first booking w/ ★
- **bank-account**: support spanish bank accounts for companies
- **platform-billing**: add multiple payment methods
- **report**: add on spot payment report and add a button to generate it from cashbook
- **offer-card**: back more info on card
- **theme**: add general_terms_of_use
- **marketplace**: add an appbar w/ email+basket on payment pages
- **access-code**: add access codes to company onboarding
- **platform-billing**: add payment method even if no subscription/billing-group
- **platform-billing**: add new screen platform billing
- **member**: count objects in tabs
- **gtm**: add gtm in offer payment/booking page
- **emails**: add checkbox to send emails to canceled Bookings
- **settings**: make editable the ios and adroids's urls
- **subscription**: sort the subscription in manager interface
- **platform-billing**: basic plaformbilling setting page
- **payment-method**: save payment method
- **notification-rule**: disable and/or send copy to the company
- **bookingnotification**: booking notification form reorganization
- **smartlist**: private filters
- **smartlist**: bug basket date select
- **kube**: full switch to kubernetes servers
- **voucher**: add percent selector along price selector
- **offer**: reactivate delete button on offercard
- **reset-password**: propose help if reset password twice in 4h
- **subscription**: consumer can and must pay their credit subscrtipion
- **gtm**: add basketId on some missing gtm event
- **gtm**: add checkout-items to basket event, type on add-to-card events
- **vod**: pass give access to VOD
- **offeredit**: custom offer selection for recursive edit of similar offers
- **archive**: delete and restore coach/establshment even if future offers planned
- **nf525**: upload doc in settings for NF525
- **subscription**: allow 0e subscription w/ credit payment
- **subscription**: private-pass (RDV) subscription
- **apm**: first step testing instrumentation w/ elastic RUM
- test(producttour): add/ids
- **member**: terms and conditions in Member detail
- **client**: cancel-condition
- **associated coach api**: changed endpoint for create/update/link_email coach
- **idds**: chnage some idds
- **temp-password**: increase temp password validity to 1 week
- **bookingcreationnotification**: improved tooltips and form validation
- (fix): idds
- **bookingcreationnotification**: added booking notifications for establishment and meta_activity
- (ids): add/ids

### Fix

- **subscription**: fix stupid error
- **gtm**: add price in gtm
- **translation**: lol
- **dashboard**: correctly filter invoiceitem
- **login**: center login form
- **i18n**: import es locale for moment
- **i18n**: import es locale for moment
- **recurrence-booking**: open recurrence booking form when no booking selected
- **recurrence-booking**: open recurrence booking form when no booking selected
- **login**: center login form
- **timezone**: fix a bug when no timezone on offerlistv2
- **gtm**: add event on pre-checkout pages
- **check-in**: register on check-in app without pb
- **communication**: link smartlist commuinication to smartlist in back
- **communication**: fixes on member detail + order page
- **contract**: edit a contract to set a combo
- **subscription**: fix some modal on payment in marketplace
- **voucher**: format cts in subscription
- **timezone**: fix offer header
- **i18n**: add ireland bank account
- **timezone**: remove timezone reference in useless ref
- **timezone**: micro fix
- **quickfix**: random quickfix
- **payment-combo**: fix refresh error whenusing private-pass
- **rum**: disable rum bullshit
- **waiting-list**: register cancelled bookings on waiting-list
- **quickinvoice**: fix remove invoice item and UnevenInvoiceDialog float display
- **payment-method**: fetch payument methods only if valid member id
- **booking-revert**: set loading to false after action
- **random**: random fixes post-merge
- **random**: random fixes post-merge
- **random**: random fixes post-merge
- **payment-method**: fix some pb when registering sepa on mobile
- **offer-direct-payment**: remove abd infinite loading page
- **platform-billing**: show right price on platform invoice
- **payment-method**: disable payment-method switch on old subscription
- **offer-card**: show coach on offer-card
- **subscription**: pay on offerbooking page
- **payment-method**: better refresh of methods on subscription paymebnt form
- **subscription**: do not ask for payment on 0e subscription
- **payment-rule**: bug when 1 bonus in rules
- **payment-rule**: ability to par pallier
- **disable-offer**: show mass offer being disabled
- **booking-discard**: attempt to fix error message on refund booking
- **self-checkin**: do not show cancelled bookings in tablet
- **qf**: qffix
- **booking**: is_discardable is kind of broken
- **kube**: back to no-kube for security
- **stupidity**: so much stupidity
- **kube**: switch env
- **waitinglist**: allow 15 minutes delay
- **booking**: revert is_discardable
- **vod**: category proposed in marketplace are bounded to videos
- **sct**: localization of SCT
- **login**: change translation when email exists
- **flag**: england
- **localization**: remove la suisse from locale created
- **sentry**: fix versionning scheme on sentry
- **report**: bug
- **lint**: appbar
- **bookingnotifications**: fixed undefined
- **sentry**: change sourcemap url-prefix and version w/ sha
- **bookingstatistics**: fixed offer graph visuals in planning page

### feat

- **recurrent-booking**: add recurrent booking on member page and fix pagination
- **timezone**: add timezones in manager interface display
- **CashBook**: add report for cashBook
- **Member**: count objects in tabs
- **emails**: add checkbox for canceledBooking in sending emails
- **settings**: make editable the ios and adroids's urls
- **offercard**: reactivate button delete
- **subscription**: private pass (RDV) available for subscription
- **appbar**: user/menu
- (client): add-last-discard
- **change**: idds

### Refactor

- **ids**: add more ids
- **ids**: add more ids

### fix

- **cleanup**: can not unselect first offer + fix translation loading

## 42.9.0 (2020-08-18)

### Feat

- **invoice**: prompt for uneven invoices in offermanagement.component
- **widget**: share button for widget and calendar url
- **payment-pack**: limit purchase per payment-pack per member
- **payment-pack**: add day limitation
- **marketplace calendar**: added new theme settings to personalize the manager & customer calendars
- **SCT**: SCT localized

### Refactor

- **calendar**: clean a bit the UI

### Fix

- **language**: default language is english
- **payment**: block manager from payment pages

## 42.8.0 (2020-08-14)

### Feat

- **marketplace calendar**: added new theme settings to personalize the manager & customer calendars

## 42.7.0 (2020-08-13)

### Feat

- **invoice**: voucher for quick invoices

## 42.6.0 (2020-08-13)

### Feat

- **report**: add first privatebooking report

## 42.5.1 (2020-08-13)

### Fix

- **version**: fetch tag berfore running cz bump
- **version**: test bump versionning

## 42.5.0 (2020-08-13)

### Feat

- **face-id**: FaceID working on tablet interface

### feat

- **face-id**: working flow, UX to be improved (+member form)

## 42.14.0a12 (2020-11-08)

### Feat

- **payment-packs**: add max bookings per month field
- **dashboard**: qualitative barchart and saving
- **consumer_payment_pack**: show history of modifying credit
- **exporthtml**: add button to export html file from email editor
- **platform-billing**: show max/min stage and coupon in settings
- **subscription**: auto-set subscription 0€ to credit + display flat fee
- **booking-option**: disable notification on discard booking-option when converting as booking
- **booking-option**: disable notification on discard booking-option when converting as booking
- **partial-refund**: improve pack partial refund
- **partial-refund**: improve pack partial refund
- **subscription**: scheduled stop for subscriptions
- **subscription**: scheduled stop for subscriptions
- **menu**: denser responsive drawer nested menu item
- **menu**: denser responsive drawer nested menu item
- **phone**: translate phone in other countries
- **phone**: translate phone in other countries
- **smartlist**: add attendance option for BookingsFilters and BookingsNumberFilter
- **recurrence-rule**: add establishment in recurrence rule booking
- **smartlist**: add attendance option for BookingsFilters and BookingsNumberFilter
- **recurrence-rule**: add establishment in recurrence rule booking
- **gtm**: add gtm on custom login pages
- **offer**: restore offer button
- **mass_disable**: add background task for mass disable
- **communication-dialog**: add sms and email-template email
- **rum**: disable elasticsearch RUM
- **booking**: filter on recurrence-rule-booking-isnull
- **offer**: chose default view cancelled offer (manager space)
- **offer**: background task for offer edit and offer create
- **component birthday email**: add new component to birthday celebration email
- **booking**: add filter not cancelled
- **report**: addres/birthday in reports
- **notification-rule**: add invoice notif and waiting-list kick
- **dashboard**: new dashboard page
- **recurrent-booking**: add recurrent booking on member page and fix pagination
- **report**: add nb_offer and nb_offer_cancelled
- **background-task**: background task monitoring and background task for disabling/deleting offers
- **timezone**: return timezone_name in company onboarding
- **timezone**: handle multitimezone
- **bookingstatistics**: bookingStatistics filtered by offerFilters in calendar page
- **bookingnotification**: notify every attendance / absence / cancellation ... for booking notif
- **coupon**: add to subscription
- **refund**: more explicit refund message
- **booking-revert**: notify or not client about cancellation of their booking
- **sepa**: allow oneshot sepa payment
- **offer**: add recurrence rule for booking
- **offer-card**: show if was first booking w/ ★
- **bank-account**: support spanish bank accounts for companies
- **platform-billing**: add multiple payment methods
- **report**: add on spot payment report and add a button to generate it from cashbook
- **offer-card**: back more info on card
- **theme**: add general_terms_of_use
- **marketplace**: add an appbar w/ email+basket on payment pages
- **access-code**: add access codes to company onboarding
- **platform-billing**: add payment method even if no subscription/billing-group
- **platform-billing**: add new screen platform billing
- **member**: count objects in tabs
- **gtm**: add gtm in offer payment/booking page
- **emails**: add checkbox to send emails to canceled Bookings
- **settings**: make editable the ios and adroids's urls
- **subscription**: sort the subscription in manager interface
- **platform-billing**: basic plaformbilling setting page
- **payment-method**: save payment method
- **notification-rule**: disable and/or send copy to the company
- **bookingnotification**: booking notification form reorganization
- **smartlist**: private filters
- **smartlist**: bug basket date select
- **kube**: full switch to kubernetes servers
- **voucher**: add percent selector along price selector
- **offer**: reactivate delete button on offercard
- **reset-password**: propose help if reset password twice in 4h
- **subscription**: consumer can and must pay their credit subscrtipion
- **gtm**: add basketId on some missing gtm event
- **gtm**: add checkout-items to basket event, type on add-to-card events
- **vod**: pass give access to VOD
- **offeredit**: custom offer selection for recursive edit of similar offers
- **archive**: delete and restore coach/establshment even if future offers planned
- **nf525**: upload doc in settings for NF525
- **subscription**: allow 0e subscription w/ credit payment
- **subscription**: private-pass (RDV) subscription
- **apm**: first step testing instrumentation w/ elastic RUM
- test(producttour): add/ids
- **member**: terms and conditions in Member detail
- **client**: cancel-condition
- **associated coach api**: changed endpoint for create/update/link_email coach
- **idds**: chnage some idds
- **temp-password**: increase temp password validity to 1 week
- **bookingcreationnotification**: improved tooltips and form validation
- (fix): idds
- **bookingcreationnotification**: added booking notifications for establishment and meta_activity
- (ids): add/ids

### Fix

- **subscription**: fix stupid error
- **gtm**: add price in gtm
- **translation**: lol
- **dashboard**: correctly filter invoiceitem
- **login**: center login form
- **i18n**: import es locale for moment
- **i18n**: import es locale for moment
- **recurrence-booking**: open recurrence booking form when no booking selected
- **recurrence-booking**: open recurrence booking form when no booking selected
- **login**: center login form
- **timezone**: fix a bug when no timezone on offerlistv2
- **gtm**: add event on pre-checkout pages
- **check-in**: register on check-in app without pb
- **communication**: link smartlist commuinication to smartlist in back
- **communication**: fixes on member detail + order page
- **contract**: edit a contract to set a combo
- **subscription**: fix some modal on payment in marketplace
- **voucher**: format cts in subscription
- **timezone**: fix offer header
- **i18n**: add ireland bank account
- **timezone**: remove timezone reference in useless ref
- **timezone**: micro fix
- **quickfix**: random quickfix
- **payment-combo**: fix refresh error whenusing private-pass
- **rum**: disable rum bullshit
- **waiting-list**: register cancelled bookings on waiting-list
- **quickinvoice**: fix remove invoice item and UnevenInvoiceDialog float display
- **payment-method**: fetch payument methods only if valid member id
- **booking-revert**: set loading to false after action
- **random**: random fixes post-merge
- **random**: random fixes post-merge
- **random**: random fixes post-merge
- **payment-method**: fix some pb when registering sepa on mobile
- **offer-direct-payment**: remove abd infinite loading page
- **platform-billing**: show right price on platform invoice
- **payment-method**: disable payment-method switch on old subscription
- **offer-card**: show coach on offer-card
- **subscription**: pay on offerbooking page
- **payment-method**: better refresh of methods on subscription paymebnt form
- **subscription**: do not ask for payment on 0e subscription
- **payment-rule**: bug when 1 bonus in rules
- **payment-rule**: ability to par pallier
- **disable-offer**: show mass offer being disabled
- **booking-discard**: attempt to fix error message on refund booking
- **self-checkin**: do not show cancelled bookings in tablet
- **qf**: qffix
- **booking**: is_discardable is kind of broken
- **kube**: back to no-kube for security
- **stupidity**: so much stupidity
- **kube**: switch env
- **waitinglist**: allow 15 minutes delay
- **booking**: revert is_discardable
- **vod**: category proposed in marketplace are bounded to videos
- **sct**: localization of SCT
- **login**: change translation when email exists
- **flag**: england
- **localization**: remove la suisse from locale created
- **sentry**: fix versionning scheme on sentry
- **report**: bug
- **lint**: appbar
- **bookingnotifications**: fixed undefined
- **sentry**: change sourcemap url-prefix and version w/ sha
- **bookingstatistics**: fixed offer graph visuals in planning page

### Perf

- **email-tempaltes**: load templates only when dialog is open on membersummarycard
- **particlejs**: rmeove particlejs for error cleaning and perf

### feat

- **recurrent-booking**: add recurrent booking on member page and fix pagination
- **timezone**: add timezones in manager interface display
- **CashBook**: add report for cashBook
- **Member**: count objects in tabs
- **emails**: add checkbox for canceledBooking in sending emails
- **settings**: make editable the ios and adroids's urls
- **offercard**: reactivate button delete
- **subscription**: private pass (RDV) available for subscription
- **appbar**: user/menu
- (client): add-last-discard
- **change**: idds

### Refactor

- **ids**: add more ids
- **ids**: add more ids

### fix

- **cleanup**: can not unselect first offer + fix translation loading

## 42.9.0 (2020-08-18)

### Feat

- **invoice**: prompt for uneven invoices in offermanagement.component
- **widget**: share button for widget and calendar url
- **payment-pack**: limit purchase per payment-pack per member
- **payment-pack**: add day limitation
- **marketplace calendar**: added new theme settings to personalize the manager & customer calendars
- **SCT**: SCT localized

### Refactor

- **calendar**: clean a bit the UI

### Fix

- **language**: default language is english
- **payment**: block manager from payment pages

## 42.8.0 (2020-08-14)

### Feat

- **marketplace calendar**: added new theme settings to personalize the manager & customer calendars

## 42.7.0 (2020-08-13)

### Feat

- **invoice**: voucher for quick invoices

## 42.6.0 (2020-08-13)

### Feat

- **report**: add first privatebooking report

## 42.5.1 (2020-08-13)

### Fix

- **version**: fetch tag berfore running cz bump
- **version**: test bump versionning

## 42.5.0 (2020-08-13)

### Feat

- **face-id**: FaceID working on tablet interface

### feat

- **face-id**: working flow, UX to be improved (+member form)

## 42.14.0a12 (2020-11-08)

### Feat

- **payment-packs**: add max bookings per month field
- **dashboard**: qualitative barchart and saving
- **consumer_payment_pack**: show history of modifying credit
- **exporthtml**: add button to export html file from email editor
- **platform-billing**: show max/min stage and coupon in settings
- **subscription**: auto-set subscription 0€ to credit + display flat fee
- **booking-option**: disable notification on discard booking-option when converting as booking
- **booking-option**: disable notification on discard booking-option when converting as booking
- **partial-refund**: improve pack partial refund
- **partial-refund**: improve pack partial refund
- **subscription**: scheduled stop for subscriptions
- **subscription**: scheduled stop for subscriptions
- **menu**: denser responsive drawer nested menu item
- **menu**: denser responsive drawer nested menu item
- **phone**: translate phone in other countries
- **phone**: translate phone in other countries
- **smartlist**: add attendance option for BookingsFilters and BookingsNumberFilter
- **recurrence-rule**: add establishment in recurrence rule booking
- **smartlist**: add attendance option for BookingsFilters and BookingsNumberFilter
- **recurrence-rule**: add establishment in recurrence rule booking
- **gtm**: add gtm on custom login pages
- **offer**: restore offer button
- **mass_disable**: add background task for mass disable
- **communication-dialog**: add sms and email-template email
- **rum**: disable elasticsearch RUM
- **booking**: filter on recurrence-rule-booking-isnull
- **offer**: chose default view cancelled offer (manager space)
- **offer**: background task for offer edit and offer create
- **component birthday email**: add new component to birthday celebration email
- **booking**: add filter not cancelled
- **report**: addres/birthday in reports
- **notification-rule**: add invoice notif and waiting-list kick
- **dashboard**: new dashboard page
- **recurrent-booking**: add recurrent booking on member page and fix pagination
- **report**: add nb_offer and nb_offer_cancelled
- **background-task**: background task monitoring and background task for disabling/deleting offers
- **timezone**: return timezone_name in company onboarding
- **timezone**: handle multitimezone
- **bookingstatistics**: bookingStatistics filtered by offerFilters in calendar page
- **bookingnotification**: notify every attendance / absence / cancellation ... for booking notif
- **coupon**: add to subscription
- **refund**: more explicit refund message
- **booking-revert**: notify or not client about cancellation of their booking
- **sepa**: allow oneshot sepa payment
- **offer**: add recurrence rule for booking
- **offer-card**: show if was first booking w/ ★
- **bank-account**: support spanish bank accounts for companies
- **platform-billing**: add multiple payment methods
- **report**: add on spot payment report and add a button to generate it from cashbook
- **offer-card**: back more info on card
- **theme**: add general_terms_of_use
- **marketplace**: add an appbar w/ email+basket on payment pages
- **access-code**: add access codes to company onboarding
- **platform-billing**: add payment method even if no subscription/billing-group
- **platform-billing**: add new screen platform billing
- **member**: count objects in tabs
- **gtm**: add gtm in offer payment/booking page
- **emails**: add checkbox to send emails to canceled Bookings
- **settings**: make editable the ios and adroids's urls
- **subscription**: sort the subscription in manager interface
- **platform-billing**: basic plaformbilling setting page
- **payment-method**: save payment method
- **notification-rule**: disable and/or send copy to the company
- **bookingnotification**: booking notification form reorganization
- **smartlist**: private filters
- **smartlist**: bug basket date select
- **kube**: full switch to kubernetes servers
- **voucher**: add percent selector along price selector
- **offer**: reactivate delete button on offercard
- **reset-password**: propose help if reset password twice in 4h
- **subscription**: consumer can and must pay their credit subscrtipion
- **gtm**: add basketId on some missing gtm event
- **gtm**: add checkout-items to basket event, type on add-to-card events
- **vod**: pass give access to VOD
- **offeredit**: custom offer selection for recursive edit of similar offers
- **archive**: delete and restore coach/establshment even if future offers planned
- **nf525**: upload doc in settings for NF525
- **subscription**: allow 0e subscription w/ credit payment
- **subscription**: private-pass (RDV) subscription
- **apm**: first step testing instrumentation w/ elastic RUM
- test(producttour): add/ids
- **member**: terms and conditions in Member detail
- **client**: cancel-condition
- **associated coach api**: changed endpoint for create/update/link_email coach
- **idds**: chnage some idds
- **temp-password**: increase temp password validity to 1 week
- **bookingcreationnotification**: improved tooltips and form validation
- (fix): idds
- **bookingcreationnotification**: added booking notifications for establishment and meta_activity
- (ids): add/ids

### Fix

- **subscription**: fix stupid error
- **gtm**: add price in gtm
- **translation**: lol
- **dashboard**: correctly filter invoiceitem
- **login**: center login form
- **i18n**: import es locale for moment
- **i18n**: import es locale for moment
- **recurrence-booking**: open recurrence booking form when no booking selected
- **recurrence-booking**: open recurrence booking form when no booking selected
- **login**: center login form
- **timezone**: fix a bug when no timezone on offerlistv2
- **gtm**: add event on pre-checkout pages
- **check-in**: register on check-in app without pb
- **communication**: link smartlist commuinication to smartlist in back
- **communication**: fixes on member detail + order page
- **contract**: edit a contract to set a combo
- **subscription**: fix some modal on payment in marketplace
- **voucher**: format cts in subscription
- **timezone**: fix offer header
- **i18n**: add ireland bank account
- **timezone**: remove timezone reference in useless ref
- **timezone**: micro fix
- **quickfix**: random quickfix
- **payment-combo**: fix refresh error whenusing private-pass
- **rum**: disable rum bullshit
- **waiting-list**: register cancelled bookings on waiting-list
- **quickinvoice**: fix remove invoice item and UnevenInvoiceDialog float display
- **payment-method**: fetch payument methods only if valid member id
- **booking-revert**: set loading to false after action
- **random**: random fixes post-merge
- **random**: random fixes post-merge
- **random**: random fixes post-merge
- **payment-method**: fix some pb when registering sepa on mobile
- **offer-direct-payment**: remove abd infinite loading page
- **platform-billing**: show right price on platform invoice
- **payment-method**: disable payment-method switch on old subscription
- **offer-card**: show coach on offer-card
- **subscription**: pay on offerbooking page
- **payment-method**: better refresh of methods on subscription paymebnt form
- **subscription**: do not ask for payment on 0e subscription
- **payment-rule**: bug when 1 bonus in rules
- **payment-rule**: ability to par pallier
- **disable-offer**: show mass offer being disabled
- **booking-discard**: attempt to fix error message on refund booking
- **self-checkin**: do not show cancelled bookings in tablet
- **qf**: qffix
- **booking**: is_discardable is kind of broken
- **kube**: back to no-kube for security
- **stupidity**: so much stupidity
- **kube**: switch env
- **waitinglist**: allow 15 minutes delay
- **booking**: revert is_discardable
- **vod**: category proposed in marketplace are bounded to videos
- **sct**: localization of SCT
- **login**: change translation when email exists
- **flag**: england
- **localization**: remove la suisse from locale created
- **sentry**: fix versionning scheme on sentry
- **report**: bug
- **lint**: appbar
- **bookingnotifications**: fixed undefined
- **sentry**: change sourcemap url-prefix and version w/ sha
- **bookingstatistics**: fixed offer graph visuals in planning page

### Perf

- **email-tempaltes**: load templates only when dialog is open on membersummarycard
- **particlejs**: rmeove particlejs for error cleaning and perf

### feat

- **recurrent-booking**: add recurrent booking on member page and fix pagination
- **timezone**: add timezones in manager interface display
- **CashBook**: add report for cashBook
- **Member**: count objects in tabs
- **emails**: add checkbox for canceledBooking in sending emails
- **settings**: make editable the ios and adroids's urls
- **offercard**: reactivate button delete
- **subscription**: private pass (RDV) available for subscription
- **appbar**: user/menu
- (client): add-last-discard
- **change**: idds

### Refactor

- **ids**: add more ids
- **ids**: add more ids

### fix

- **cleanup**: can not unselect first offer + fix translation loading

## 42.9.0 (2020-08-18)

### Feat

- **invoice**: prompt for uneven invoices in offermanagement.component
- **widget**: share button for widget and calendar url
- **payment-pack**: limit purchase per payment-pack per member
- **payment-pack**: add day limitation
- **marketplace calendar**: added new theme settings to personalize the manager & customer calendars
- **SCT**: SCT localized

### Refactor

- **calendar**: clean a bit the UI

### Fix

- **language**: default language is english
- **payment**: block manager from payment pages

## 42.8.0 (2020-08-14)

### Feat

- **marketplace calendar**: added new theme settings to personalize the manager & customer calendars

## 42.7.0 (2020-08-13)

### Feat

- **invoice**: voucher for quick invoices

## 42.6.0 (2020-08-13)

### Feat

- **report**: add first privatebooking report

## 42.5.1 (2020-08-13)

### Fix

- **version**: fetch tag berfore running cz bump
- **version**: test bump versionning

## 42.5.0 (2020-08-13)

### Feat

- **face-id**: FaceID working on tablet interface

### feat

- **face-id**: working flow, UX to be improved (+member form)

## 42.14.0a10 (2020-11-08)

### Feat

- **dashboard**: qualitative barchart and saving
- **consumer_payment_pack**: show history of modifying credit
- **exporthtml**: add button to export html file from email editor
- **platform-billing**: show max/min stage and coupon in settings
- **subscription**: auto-set subscription 0€ to credit + display flat fee
- **booking-option**: disable notification on discard booking-option when converting as booking
- **booking-option**: disable notification on discard booking-option when converting as booking
- **partial-refund**: improve pack partial refund
- **partial-refund**: improve pack partial refund
- **subscription**: scheduled stop for subscriptions
- **subscription**: scheduled stop for subscriptions
- **menu**: denser responsive drawer nested menu item
- **menu**: denser responsive drawer nested menu item
- **phone**: translate phone in other countries
- **phone**: translate phone in other countries
- **smartlist**: add attendance option for BookingsFilters and BookingsNumberFilter
- **recurrence-rule**: add establishment in recurrence rule booking
- **smartlist**: add attendance option for BookingsFilters and BookingsNumberFilter
- **recurrence-rule**: add establishment in recurrence rule booking
- **gtm**: add gtm on custom login pages
- **offer**: restore offer button
- **mass_disable**: add background task for mass disable
- **communication-dialog**: add sms and email-template email
- **rum**: disable elasticsearch RUM
- **booking**: filter on recurrence-rule-booking-isnull
- **offer**: chose default view cancelled offer (manager space)
- **offer**: background task for offer edit and offer create
- **component birthday email**: add new component to birthday celebration email
- **booking**: add filter not cancelled
- **report**: addres/birthday in reports
- **notification-rule**: add invoice notif and waiting-list kick
- **dashboard**: new dashboard page
- **recurrent-booking**: add recurrent booking on member page and fix pagination
- **report**: add nb_offer and nb_offer_cancelled
- **background-task**: background task monitoring and background task for disabling/deleting offers
- **timezone**: return timezone_name in company onboarding
- **timezone**: handle multitimezone
- **bookingstatistics**: bookingStatistics filtered by offerFilters in calendar page
- **bookingnotification**: notify every attendance / absence / cancellation ... for booking notif
- **coupon**: add to subscription
- **refund**: more explicit refund message
- **booking-revert**: notify or not client about cancellation of their booking
- **sepa**: allow oneshot sepa payment
- **offer**: add recurrence rule for booking
- **offer-card**: show if was first booking w/ ★
- **bank-account**: support spanish bank accounts for companies
- **platform-billing**: add multiple payment methods
- **report**: add on spot payment report and add a button to generate it from cashbook
- **offer-card**: back more info on card
- **theme**: add general_terms_of_use
- **marketplace**: add an appbar w/ email+basket on payment pages
- **access-code**: add access codes to company onboarding
- **platform-billing**: add payment method even if no subscription/billing-group
- **platform-billing**: add new screen platform billing
- **member**: count objects in tabs
- **gtm**: add gtm in offer payment/booking page
- **emails**: add checkbox to send emails to canceled Bookings
- **settings**: make editable the ios and adroids's urls
- **subscription**: sort the subscription in manager interface
- **platform-billing**: basic plaformbilling setting page
- **payment-method**: save payment method
- **notification-rule**: disable and/or send copy to the company
- **bookingnotification**: booking notification form reorganization
- **smartlist**: private filters
- **smartlist**: bug basket date select
- **kube**: full switch to kubernetes servers
- **voucher**: add percent selector along price selector
- **offer**: reactivate delete button on offercard
- **reset-password**: propose help if reset password twice in 4h
- **subscription**: consumer can and must pay their credit subscrtipion
- **gtm**: add basketId on some missing gtm event
- **gtm**: add checkout-items to basket event, type on add-to-card events
- **vod**: pass give access to VOD
- **offeredit**: custom offer selection for recursive edit of similar offers
- **archive**: delete and restore coach/establshment even if future offers planned
- **nf525**: upload doc in settings for NF525
- **subscription**: allow 0e subscription w/ credit payment
- **subscription**: private-pass (RDV) subscription
- **apm**: first step testing instrumentation w/ elastic RUM
- test(producttour): add/ids
- **member**: terms and conditions in Member detail
- **client**: cancel-condition
- **associated coach api**: changed endpoint for create/update/link_email coach
- **idds**: chnage some idds
- **temp-password**: increase temp password validity to 1 week
- **bookingcreationnotification**: improved tooltips and form validation
- (fix): idds
- **bookingcreationnotification**: added booking notifications for establishment and meta_activity
- (ids): add/ids

### Fix

- **subscription**: fix stupid error
- **gtm**: add price in gtm
- **translation**: lol
- **dashboard**: correctly filter invoiceitem
- **login**: center login form
- **i18n**: import es locale for moment
- **i18n**: import es locale for moment
- **recurrence-booking**: open recurrence booking form when no booking selected
- **recurrence-booking**: open recurrence booking form when no booking selected
- **login**: center login form
- **timezone**: fix a bug when no timezone on offerlistv2
- **gtm**: add event on pre-checkout pages
- **check-in**: register on check-in app without pb
- **communication**: link smartlist commuinication to smartlist in back
- **communication**: fixes on member detail + order page
- **contract**: edit a contract to set a combo
- **subscription**: fix some modal on payment in marketplace
- **voucher**: format cts in subscription
- **timezone**: fix offer header
- **i18n**: add ireland bank account
- **timezone**: remove timezone reference in useless ref
- **timezone**: micro fix
- **quickfix**: random quickfix
- **payment-combo**: fix refresh error whenusing private-pass
- **rum**: disable rum bullshit
- **waiting-list**: register cancelled bookings on waiting-list
- **quickinvoice**: fix remove invoice item and UnevenInvoiceDialog float display
- **payment-method**: fetch payument methods only if valid member id
- **booking-revert**: set loading to false after action
- **random**: random fixes post-merge
- **random**: random fixes post-merge
- **random**: random fixes post-merge
- **payment-method**: fix some pb when registering sepa on mobile
- **offer-direct-payment**: remove abd infinite loading page
- **platform-billing**: show right price on platform invoice
- **payment-method**: disable payment-method switch on old subscription
- **offer-card**: show coach on offer-card
- **subscription**: pay on offerbooking page
- **payment-method**: better refresh of methods on subscription paymebnt form
- **subscription**: do not ask for payment on 0e subscription
- **payment-rule**: bug when 1 bonus in rules
- **payment-rule**: ability to par pallier
- **disable-offer**: show mass offer being disabled
- **booking-discard**: attempt to fix error message on refund booking
- **self-checkin**: do not show cancelled bookings in tablet
- **qf**: qffix
- **booking**: is_discardable is kind of broken
- **kube**: back to no-kube for security
- **stupidity**: so much stupidity
- **kube**: switch env
- **waitinglist**: allow 15 minutes delay
- **booking**: revert is_discardable
- **vod**: category proposed in marketplace are bounded to videos
- **sct**: localization of SCT
- **login**: change translation when email exists
- **flag**: england
- **localization**: remove la suisse from locale created
- **sentry**: fix versionning scheme on sentry
- **report**: bug
- **lint**: appbar
- **bookingnotifications**: fixed undefined
- **sentry**: change sourcemap url-prefix and version w/ sha
- **bookingstatistics**: fixed offer graph visuals in planning page

### Perf

- **email-tempaltes**: load templates only when dialog is open on membersummarycard
- **particlejs**: rmeove particlejs for error cleaning and perf

### feat

- **recurrent-booking**: add recurrent booking on member page and fix pagination
- **timezone**: add timezones in manager interface display
- **CashBook**: add report for cashBook
- **Member**: count objects in tabs
- **emails**: add checkbox for canceledBooking in sending emails
- **settings**: make editable the ios and adroids's urls
- **offercard**: reactivate button delete
- **subscription**: private pass (RDV) available for subscription
- **appbar**: user/menu
- (client): add-last-discard
- **change**: idds

### Refactor

- **ids**: add more ids
- **ids**: add more ids

### fix

- **cleanup**: can not unselect first offer + fix translation loading

## 42.9.0 (2020-08-18)

### Feat

- **invoice**: prompt for uneven invoices in offermanagement.component
- **widget**: share button for widget and calendar url
- **payment-pack**: limit purchase per payment-pack per member
- **payment-pack**: add day limitation
- **marketplace calendar**: added new theme settings to personalize the manager & customer calendars
- **SCT**: SCT localized

### Refactor

- **calendar**: clean a bit the UI

### Fix

- **language**: default language is english
- **payment**: block manager from payment pages

## 42.8.0 (2020-08-14)

### Feat

- **marketplace calendar**: added new theme settings to personalize the manager & customer calendars

## 42.7.0 (2020-08-13)

### Feat

- **invoice**: voucher for quick invoices

## 42.6.0 (2020-08-13)

### Feat

- **report**: add first privatebooking report

## 42.5.1 (2020-08-13)

### Fix

- **version**: fetch tag berfore running cz bump
- **version**: test bump versionning

## 42.5.0 (2020-08-13)

### Feat

- **face-id**: FaceID working on tablet interface

### feat

- **face-id**: working flow, UX to be improved (+member form)

## 42.14.0a10 (2020-11-08)

### Feat

- **dashboard**: qualitative barchart and saving
- **consumer_payment_pack**: show history of modifying credit
- **exporthtml**: add button to export html file from email editor
- **platform-billing**: show max/min stage and coupon in settings
- **subscription**: auto-set subscription 0€ to credit + display flat fee
- **booking-option**: disable notification on discard booking-option when converting as booking
- **booking-option**: disable notification on discard booking-option when converting as booking
- **partial-refund**: improve pack partial refund
- **partial-refund**: improve pack partial refund
- **subscription**: scheduled stop for subscriptions
- **subscription**: scheduled stop for subscriptions
- **menu**: denser responsive drawer nested menu item
- **menu**: denser responsive drawer nested menu item
- **phone**: translate phone in other countries
- **phone**: translate phone in other countries
- **smartlist**: add attendance option for BookingsFilters and BookingsNumberFilter
- **recurrence-rule**: add establishment in recurrence rule booking
- **smartlist**: add attendance option for BookingsFilters and BookingsNumberFilter
- **recurrence-rule**: add establishment in recurrence rule booking
- **gtm**: add gtm on custom login pages
- **offer**: restore offer button
- **mass_disable**: add background task for mass disable
- **communication-dialog**: add sms and email-template email
- **rum**: disable elasticsearch RUM
- **booking**: filter on recurrence-rule-booking-isnull
- **offer**: chose default view cancelled offer (manager space)
- **offer**: background task for offer edit and offer create
- **component birthday email**: add new component to birthday celebration email
- **booking**: add filter not cancelled
- **report**: addres/birthday in reports
- **notification-rule**: add invoice notif and waiting-list kick
- **dashboard**: new dashboard page
- **recurrent-booking**: add recurrent booking on member page and fix pagination
- **report**: add nb_offer and nb_offer_cancelled
- **background-task**: background task monitoring and background task for disabling/deleting offers
- **timezone**: return timezone_name in company onboarding
- **timezone**: handle multitimezone
- **bookingstatistics**: bookingStatistics filtered by offerFilters in calendar page
- **bookingnotification**: notify every attendance / absence / cancellation ... for booking notif
- **coupon**: add to subscription
- **refund**: more explicit refund message
- **booking-revert**: notify or not client about cancellation of their booking
- **sepa**: allow oneshot sepa payment
- **offer**: add recurrence rule for booking
- **offer-card**: show if was first booking w/ ★
- **bank-account**: support spanish bank accounts for companies
- **platform-billing**: add multiple payment methods
- **report**: add on spot payment report and add a button to generate it from cashbook
- **offer-card**: back more info on card
- **theme**: add general_terms_of_use
- **marketplace**: add an appbar w/ email+basket on payment pages
- **access-code**: add access codes to company onboarding
- **platform-billing**: add payment method even if no subscription/billing-group
- **platform-billing**: add new screen platform billing
- **member**: count objects in tabs
- **gtm**: add gtm in offer payment/booking page
- **emails**: add checkbox to send emails to canceled Bookings
- **settings**: make editable the ios and adroids's urls
- **subscription**: sort the subscription in manager interface
- **platform-billing**: basic plaformbilling setting page
- **payment-method**: save payment method
- **notification-rule**: disable and/or send copy to the company
- **bookingnotification**: booking notification form reorganization
- **smartlist**: private filters
- **smartlist**: bug basket date select
- **kube**: full switch to kubernetes servers
- **voucher**: add percent selector along price selector
- **offer**: reactivate delete button on offercard
- **reset-password**: propose help if reset password twice in 4h
- **subscription**: consumer can and must pay their credit subscrtipion
- **gtm**: add basketId on some missing gtm event
- **gtm**: add checkout-items to basket event, type on add-to-card events
- **vod**: pass give access to VOD
- **offeredit**: custom offer selection for recursive edit of similar offers
- **archive**: delete and restore coach/establshment even if future offers planned
- **nf525**: upload doc in settings for NF525
- **subscription**: allow 0e subscription w/ credit payment
- **subscription**: private-pass (RDV) subscription
- **apm**: first step testing instrumentation w/ elastic RUM
- test(producttour): add/ids
- **member**: terms and conditions in Member detail
- **client**: cancel-condition
- **associated coach api**: changed endpoint for create/update/link_email coach
- **idds**: chnage some idds
- **temp-password**: increase temp password validity to 1 week
- **bookingcreationnotification**: improved tooltips and form validation
- (fix): idds
- **bookingcreationnotification**: added booking notifications for establishment and meta_activity
- (ids): add/ids

### Fix

- **subscription**: fix stupid error
- **gtm**: add price in gtm
- **translation**: lol
- **dashboard**: correctly filter invoiceitem
- **login**: center login form
- **i18n**: import es locale for moment
- **i18n**: import es locale for moment
- **recurrence-booking**: open recurrence booking form when no booking selected
- **recurrence-booking**: open recurrence booking form when no booking selected
- **login**: center login form
- **timezone**: fix a bug when no timezone on offerlistv2
- **gtm**: add event on pre-checkout pages
- **check-in**: register on check-in app without pb
- **communication**: link smartlist commuinication to smartlist in back
- **communication**: fixes on member detail + order page
- **contract**: edit a contract to set a combo
- **subscription**: fix some modal on payment in marketplace
- **voucher**: format cts in subscription
- **timezone**: fix offer header
- **i18n**: add ireland bank account
- **timezone**: remove timezone reference in useless ref
- **timezone**: micro fix
- **quickfix**: random quickfix
- **payment-combo**: fix refresh error whenusing private-pass
- **rum**: disable rum bullshit
- **waiting-list**: register cancelled bookings on waiting-list
- **quickinvoice**: fix remove invoice item and UnevenInvoiceDialog float display
- **payment-method**: fetch payument methods only if valid member id
- **booking-revert**: set loading to false after action
- **random**: random fixes post-merge
- **random**: random fixes post-merge
- **random**: random fixes post-merge
- **payment-method**: fix some pb when registering sepa on mobile
- **offer-direct-payment**: remove abd infinite loading page
- **platform-billing**: show right price on platform invoice
- **payment-method**: disable payment-method switch on old subscription
- **offer-card**: show coach on offer-card
- **subscription**: pay on offerbooking page
- **payment-method**: better refresh of methods on subscription paymebnt form
- **subscription**: do not ask for payment on 0e subscription
- **payment-rule**: bug when 1 bonus in rules
- **payment-rule**: ability to par pallier
- **disable-offer**: show mass offer being disabled
- **booking-discard**: attempt to fix error message on refund booking
- **self-checkin**: do not show cancelled bookings in tablet
- **qf**: qffix
- **booking**: is_discardable is kind of broken
- **kube**: back to no-kube for security
- **stupidity**: so much stupidity
- **kube**: switch env
- **waitinglist**: allow 15 minutes delay
- **booking**: revert is_discardable
- **vod**: category proposed in marketplace are bounded to videos
- **sct**: localization of SCT
- **login**: change translation when email exists
- **flag**: england
- **localization**: remove la suisse from locale created
- **sentry**: fix versionning scheme on sentry
- **report**: bug
- **lint**: appbar
- **bookingnotifications**: fixed undefined
- **sentry**: change sourcemap url-prefix and version w/ sha
- **bookingstatistics**: fixed offer graph visuals in planning page

### Perf

- **email-tempaltes**: load templates only when dialog is open on membersummarycard
- **particlejs**: rmeove particlejs for error cleaning and perf

### feat

- **recurrent-booking**: add recurrent booking on member page and fix pagination
- **timezone**: add timezones in manager interface display
- **CashBook**: add report for cashBook
- **Member**: count objects in tabs
- **emails**: add checkbox for canceledBooking in sending emails
- **settings**: make editable the ios and adroids's urls
- **offercard**: reactivate button delete
- **subscription**: private pass (RDV) available for subscription
- **appbar**: user/menu
- (client): add-last-discard
- **change**: idds

### Refactor

- **ids**: add more ids
- **ids**: add more ids

### fix

- **cleanup**: can not unselect first offer + fix translation loading

## 42.9.0 (2020-08-18)

### Feat

- **invoice**: prompt for uneven invoices in offermanagement.component
- **widget**: share button for widget and calendar url
- **payment-pack**: limit purchase per payment-pack per member
- **payment-pack**: add day limitation
- **marketplace calendar**: added new theme settings to personalize the manager & customer calendars
- **SCT**: SCT localized

### Refactor

- **calendar**: clean a bit the UI

### Fix

- **language**: default language is english
- **payment**: block manager from payment pages

## 42.8.0 (2020-08-14)

### Feat

- **marketplace calendar**: added new theme settings to personalize the manager & customer calendars

## 42.7.0 (2020-08-13)

### Feat

- **invoice**: voucher for quick invoices

## 42.6.0 (2020-08-13)

### Feat

- **report**: add first privatebooking report

## 42.5.1 (2020-08-13)

### Fix

- **version**: fetch tag berfore running cz bump
- **version**: test bump versionning

## 42.5.0 (2020-08-13)

### Feat

- **face-id**: FaceID working on tablet interface

### feat

- **face-id**: working flow, UX to be improved (+member form)

## 42.14.0a8 (2020-11-08)

### Feat

- **consumer_payment_pack**: show history of modifying credit
- **exporthtml**: add button to export html file from email editor
- **platform-billing**: show max/min stage and coupon in settings
- **subscription**: auto-set subscription 0€ to credit + display flat fee
- **booking-option**: disable notification on discard booking-option when converting as booking
- **booking-option**: disable notification on discard booking-option when converting as booking
- **partial-refund**: improve pack partial refund
- **partial-refund**: improve pack partial refund
- **subscription**: scheduled stop for subscriptions
- **subscription**: scheduled stop for subscriptions
- **menu**: denser responsive drawer nested menu item
- **menu**: denser responsive drawer nested menu item
- **phone**: translate phone in other countries
- **phone**: translate phone in other countries
- **smartlist**: add attendance option for BookingsFilters and BookingsNumberFilter
- **recurrence-rule**: add establishment in recurrence rule booking
- **smartlist**: add attendance option for BookingsFilters and BookingsNumberFilter
- **recurrence-rule**: add establishment in recurrence rule booking
- **gtm**: add gtm on custom login pages
- **offer**: restore offer button
- **mass_disable**: add background task for mass disable
- **communication-dialog**: add sms and email-template email
- **rum**: disable elasticsearch RUM
- **booking**: filter on recurrence-rule-booking-isnull
- **offer**: chose default view cancelled offer (manager space)
- **offer**: background task for offer edit and offer create
- **component birthday email**: add new component to birthday celebration email
- **booking**: add filter not cancelled
- **report**: addres/birthday in reports
- **notification-rule**: add invoice notif and waiting-list kick
- **dashboard**: new dashboard page
- **recurrent-booking**: add recurrent booking on member page and fix pagination
- **report**: add nb_offer and nb_offer_cancelled
- **background-task**: background task monitoring and background task for disabling/deleting offers
- **timezone**: return timezone_name in company onboarding
- **timezone**: handle multitimezone
- **bookingstatistics**: bookingStatistics filtered by offerFilters in calendar page
- **bookingnotification**: notify every attendance / absence / cancellation ... for booking notif
- **coupon**: add to subscription
- **refund**: more explicit refund message
- **booking-revert**: notify or not client about cancellation of their booking
- **sepa**: allow oneshot sepa payment
- **offer**: add recurrence rule for booking
- **offer-card**: show if was first booking w/ ★
- **bank-account**: support spanish bank accounts for companies
- **platform-billing**: add multiple payment methods
- **report**: add on spot payment report and add a button to generate it from cashbook
- **offer-card**: back more info on card
- **theme**: add general_terms_of_use
- **marketplace**: add an appbar w/ email+basket on payment pages
- **access-code**: add access codes to company onboarding
- **platform-billing**: add payment method even if no subscription/billing-group
- **platform-billing**: add new screen platform billing
- **member**: count objects in tabs
- **gtm**: add gtm in offer payment/booking page
- **emails**: add checkbox to send emails to canceled Bookings
- **settings**: make editable the ios and adroids's urls
- **subscription**: sort the subscription in manager interface
- **platform-billing**: basic plaformbilling setting page
- **payment-method**: save payment method
- **notification-rule**: disable and/or send copy to the company
- **bookingnotification**: booking notification form reorganization
- **smartlist**: private filters
- **smartlist**: bug basket date select
- **kube**: full switch to kubernetes servers
- **voucher**: add percent selector along price selector
- **offer**: reactivate delete button on offercard
- **reset-password**: propose help if reset password twice in 4h
- **subscription**: consumer can and must pay their credit subscrtipion
- **gtm**: add basketId on some missing gtm event
- **gtm**: add checkout-items to basket event, type on add-to-card events
- **vod**: pass give access to VOD
- **offeredit**: custom offer selection for recursive edit of similar offers
- **archive**: delete and restore coach/establshment even if future offers planned
- **nf525**: upload doc in settings for NF525
- **subscription**: allow 0e subscription w/ credit payment
- **subscription**: private-pass (RDV) subscription
- **apm**: first step testing instrumentation w/ elastic RUM
- test(producttour): add/ids
- **member**: terms and conditions in Member detail
- **client**: cancel-condition
- **associated coach api**: changed endpoint for create/update/link_email coach
- **idds**: chnage some idds
- **temp-password**: increase temp password validity to 1 week
- **bookingcreationnotification**: improved tooltips and form validation
- (fix): idds
- **bookingcreationnotification**: added booking notifications for establishment and meta_activity
- (ids): add/ids

### Fix

- **subscription**: fix stupid error
- **gtm**: add price in gtm
- **translation**: lol
- **dashboard**: correctly filter invoiceitem
- **login**: center login form
- **i18n**: import es locale for moment
- **i18n**: import es locale for moment
- **recurrence-booking**: open recurrence booking form when no booking selected
- **recurrence-booking**: open recurrence booking form when no booking selected
- **login**: center login form
- **timezone**: fix a bug when no timezone on offerlistv2
- **gtm**: add event on pre-checkout pages
- **check-in**: register on check-in app without pb
- **communication**: link smartlist commuinication to smartlist in back
- **communication**: fixes on member detail + order page
- **contract**: edit a contract to set a combo
- **subscription**: fix some modal on payment in marketplace
- **voucher**: format cts in subscription
- **timezone**: fix offer header
- **i18n**: add ireland bank account
- **timezone**: remove timezone reference in useless ref
- **timezone**: micro fix
- **quickfix**: random quickfix
- **payment-combo**: fix refresh error whenusing private-pass
- **rum**: disable rum bullshit
- **waiting-list**: register cancelled bookings on waiting-list
- **quickinvoice**: fix remove invoice item and UnevenInvoiceDialog float display
- **payment-method**: fetch payument methods only if valid member id
- **booking-revert**: set loading to false after action
- **random**: random fixes post-merge
- **random**: random fixes post-merge
- **random**: random fixes post-merge
- **payment-method**: fix some pb when registering sepa on mobile
- **offer-direct-payment**: remove abd infinite loading page
- **platform-billing**: show right price on platform invoice
- **payment-method**: disable payment-method switch on old subscription
- **offer-card**: show coach on offer-card
- **subscription**: pay on offerbooking page
- **payment-method**: better refresh of methods on subscription paymebnt form
- **subscription**: do not ask for payment on 0e subscription
- **payment-rule**: bug when 1 bonus in rules
- **payment-rule**: ability to par pallier
- **disable-offer**: show mass offer being disabled
- **booking-discard**: attempt to fix error message on refund booking
- **self-checkin**: do not show cancelled bookings in tablet
- **qf**: qffix
- **booking**: is_discardable is kind of broken
- **kube**: back to no-kube for security
- **stupidity**: so much stupidity
- **kube**: switch env
- **waitinglist**: allow 15 minutes delay
- **booking**: revert is_discardable
- **vod**: category proposed in marketplace are bounded to videos
- **sct**: localization of SCT
- **login**: change translation when email exists
- **flag**: england
- **localization**: remove la suisse from locale created
- **sentry**: fix versionning scheme on sentry
- **report**: bug
- **lint**: appbar
- **bookingnotifications**: fixed undefined
- **sentry**: change sourcemap url-prefix and version w/ sha
- **bookingstatistics**: fixed offer graph visuals in planning page

### Perf

- **email-tempaltes**: load templates only when dialog is open on membersummarycard
- **particlejs**: rmeove particlejs for error cleaning and perf

### feat

- **recurrent-booking**: add recurrent booking on member page and fix pagination
- **timezone**: add timezones in manager interface display
- **CashBook**: add report for cashBook
- **Member**: count objects in tabs
- **emails**: add checkbox for canceledBooking in sending emails
- **settings**: make editable the ios and adroids's urls
- **offercard**: reactivate button delete
- **subscription**: private pass (RDV) available for subscription
- **appbar**: user/menu
- (client): add-last-discard
- **change**: idds

### Refactor

- **ids**: add more ids
- **ids**: add more ids

### fix

- **cleanup**: can not unselect first offer + fix translation loading

## 42.9.0 (2020-08-18)

### Feat

- **invoice**: prompt for uneven invoices in offermanagement.component
- **widget**: share button for widget and calendar url
- **payment-pack**: limit purchase per payment-pack per member
- **payment-pack**: add day limitation
- **marketplace calendar**: added new theme settings to personalize the manager & customer calendars
- **SCT**: SCT localized

### Refactor

- **calendar**: clean a bit the UI

### Fix

- **language**: default language is english
- **payment**: block manager from payment pages

## 42.8.0 (2020-08-14)

### Feat

- **marketplace calendar**: added new theme settings to personalize the manager & customer calendars

## 42.7.0 (2020-08-13)

### Feat

- **invoice**: voucher for quick invoices

## 42.6.0 (2020-08-13)

### Feat

- **report**: add first privatebooking report

## 42.5.1 (2020-08-13)

### Fix

- **version**: fetch tag berfore running cz bump
- **version**: test bump versionning

## 42.5.0 (2020-08-13)

### Feat

- **face-id**: FaceID working on tablet interface

### feat

- **face-id**: working flow, UX to be improved (+member form)

## 42.14.0a8 (2020-11-08)

### Feat

- **consumer_payment_pack**: show history of modifying credit
- **exporthtml**: add button to export html file from email editor
- **platform-billing**: show max/min stage and coupon in settings
- **subscription**: auto-set subscription 0€ to credit + display flat fee
- **booking-option**: disable notification on discard booking-option when converting as booking
- **booking-option**: disable notification on discard booking-option when converting as booking
- **partial-refund**: improve pack partial refund
- **partial-refund**: improve pack partial refund
- **subscription**: scheduled stop for subscriptions
- **subscription**: scheduled stop for subscriptions
- **menu**: denser responsive drawer nested menu item
- **menu**: denser responsive drawer nested menu item
- **phone**: translate phone in other countries
- **phone**: translate phone in other countries
- **smartlist**: add attendance option for BookingsFilters and BookingsNumberFilter
- **recurrence-rule**: add establishment in recurrence rule booking
- **smartlist**: add attendance option for BookingsFilters and BookingsNumberFilter
- **recurrence-rule**: add establishment in recurrence rule booking
- **gtm**: add gtm on custom login pages
- **offer**: restore offer button
- **mass_disable**: add background task for mass disable
- **communication-dialog**: add sms and email-template email
- **rum**: disable elasticsearch RUM
- **booking**: filter on recurrence-rule-booking-isnull
- **offer**: chose default view cancelled offer (manager space)
- **offer**: background task for offer edit and offer create
- **component birthday email**: add new component to birthday celebration email
- **booking**: add filter not cancelled
- **report**: addres/birthday in reports
- **notification-rule**: add invoice notif and waiting-list kick
- **dashboard**: new dashboard page
- **recurrent-booking**: add recurrent booking on member page and fix pagination
- **report**: add nb_offer and nb_offer_cancelled
- **background-task**: background task monitoring and background task for disabling/deleting offers
- **timezone**: return timezone_name in company onboarding
- **timezone**: handle multitimezone
- **bookingstatistics**: bookingStatistics filtered by offerFilters in calendar page
- **bookingnotification**: notify every attendance / absence / cancellation ... for booking notif
- **coupon**: add to subscription
- **refund**: more explicit refund message
- **booking-revert**: notify or not client about cancellation of their booking
- **sepa**: allow oneshot sepa payment
- **offer**: add recurrence rule for booking
- **offer-card**: show if was first booking w/ ★
- **bank-account**: support spanish bank accounts for companies
- **platform-billing**: add multiple payment methods
- **report**: add on spot payment report and add a button to generate it from cashbook
- **offer-card**: back more info on card
- **theme**: add general_terms_of_use
- **marketplace**: add an appbar w/ email+basket on payment pages
- **access-code**: add access codes to company onboarding
- **platform-billing**: add payment method even if no subscription/billing-group
- **platform-billing**: add new screen platform billing
- **member**: count objects in tabs
- **gtm**: add gtm in offer payment/booking page
- **emails**: add checkbox to send emails to canceled Bookings
- **settings**: make editable the ios and adroids's urls
- **subscription**: sort the subscription in manager interface
- **platform-billing**: basic plaformbilling setting page
- **payment-method**: save payment method
- **notification-rule**: disable and/or send copy to the company
- **bookingnotification**: booking notification form reorganization
- **smartlist**: private filters
- **smartlist**: bug basket date select
- **kube**: full switch to kubernetes servers
- **voucher**: add percent selector along price selector
- **offer**: reactivate delete button on offercard
- **reset-password**: propose help if reset password twice in 4h
- **subscription**: consumer can and must pay their credit subscrtipion
- **gtm**: add basketId on some missing gtm event
- **gtm**: add checkout-items to basket event, type on add-to-card events
- **vod**: pass give access to VOD
- **offeredit**: custom offer selection for recursive edit of similar offers
- **archive**: delete and restore coach/establshment even if future offers planned
- **nf525**: upload doc in settings for NF525
- **subscription**: allow 0e subscription w/ credit payment
- **subscription**: private-pass (RDV) subscription
- **apm**: first step testing instrumentation w/ elastic RUM
- test(producttour): add/ids
- **member**: terms and conditions in Member detail
- **client**: cancel-condition
- **associated coach api**: changed endpoint for create/update/link_email coach
- **idds**: chnage some idds
- **temp-password**: increase temp password validity to 1 week
- **bookingcreationnotification**: improved tooltips and form validation
- (fix): idds
- **bookingcreationnotification**: added booking notifications for establishment and meta_activity
- (ids): add/ids

### Fix

- **subscription**: fix stupid error
- **gtm**: add price in gtm
- **translation**: lol
- **dashboard**: correctly filter invoiceitem
- **login**: center login form
- **i18n**: import es locale for moment
- **i18n**: import es locale for moment
- **recurrence-booking**: open recurrence booking form when no booking selected
- **recurrence-booking**: open recurrence booking form when no booking selected
- **login**: center login form
- **timezone**: fix a bug when no timezone on offerlistv2
- **gtm**: add event on pre-checkout pages
- **check-in**: register on check-in app without pb
- **communication**: link smartlist commuinication to smartlist in back
- **communication**: fixes on member detail + order page
- **contract**: edit a contract to set a combo
- **subscription**: fix some modal on payment in marketplace
- **voucher**: format cts in subscription
- **timezone**: fix offer header
- **i18n**: add ireland bank account
- **timezone**: remove timezone reference in useless ref
- **timezone**: micro fix
- **quickfix**: random quickfix
- **payment-combo**: fix refresh error whenusing private-pass
- **rum**: disable rum bullshit
- **waiting-list**: register cancelled bookings on waiting-list
- **quickinvoice**: fix remove invoice item and UnevenInvoiceDialog float display
- **payment-method**: fetch payument methods only if valid member id
- **booking-revert**: set loading to false after action
- **random**: random fixes post-merge
- **random**: random fixes post-merge
- **random**: random fixes post-merge
- **payment-method**: fix some pb when registering sepa on mobile
- **offer-direct-payment**: remove abd infinite loading page
- **platform-billing**: show right price on platform invoice
- **payment-method**: disable payment-method switch on old subscription
- **offer-card**: show coach on offer-card
- **subscription**: pay on offerbooking page
- **payment-method**: better refresh of methods on subscription paymebnt form
- **subscription**: do not ask for payment on 0e subscription
- **payment-rule**: bug when 1 bonus in rules
- **payment-rule**: ability to par pallier
- **disable-offer**: show mass offer being disabled
- **booking-discard**: attempt to fix error message on refund booking
- **self-checkin**: do not show cancelled bookings in tablet
- **qf**: qffix
- **booking**: is_discardable is kind of broken
- **kube**: back to no-kube for security
- **stupidity**: so much stupidity
- **kube**: switch env
- **waitinglist**: allow 15 minutes delay
- **booking**: revert is_discardable
- **vod**: category proposed in marketplace are bounded to videos
- **sct**: localization of SCT
- **login**: change translation when email exists
- **flag**: england
- **localization**: remove la suisse from locale created
- **sentry**: fix versionning scheme on sentry
- **report**: bug
- **lint**: appbar
- **bookingnotifications**: fixed undefined
- **sentry**: change sourcemap url-prefix and version w/ sha
- **bookingstatistics**: fixed offer graph visuals in planning page

### Perf

- **email-tempaltes**: load templates only when dialog is open on membersummarycard
- **particlejs**: rmeove particlejs for error cleaning and perf

### feat

- **recurrent-booking**: add recurrent booking on member page and fix pagination
- **timezone**: add timezones in manager interface display
- **CashBook**: add report for cashBook
- **Member**: count objects in tabs
- **emails**: add checkbox for canceledBooking in sending emails
- **settings**: make editable the ios and adroids's urls
- **offercard**: reactivate button delete
- **subscription**: private pass (RDV) available for subscription
- **appbar**: user/menu
- (client): add-last-discard
- **change**: idds

### Refactor

- **ids**: add more ids
- **ids**: add more ids

### fix

- **cleanup**: can not unselect first offer + fix translation loading

## 42.9.0 (2020-08-18)

### Feat

- **invoice**: prompt for uneven invoices in offermanagement.component
- **widget**: share button for widget and calendar url
- **payment-pack**: limit purchase per payment-pack per member
- **payment-pack**: add day limitation
- **marketplace calendar**: added new theme settings to personalize the manager & customer calendars
- **SCT**: SCT localized

### Refactor

- **calendar**: clean a bit the UI

### Fix

- **language**: default language is english
- **payment**: block manager from payment pages

## 42.8.0 (2020-08-14)

### Feat

- **marketplace calendar**: added new theme settings to personalize the manager & customer calendars

## 42.7.0 (2020-08-13)

### Feat

- **invoice**: voucher for quick invoices

## 42.6.0 (2020-08-13)

### Feat

- **report**: add first privatebooking report

## 42.5.1 (2020-08-13)

### Fix

- **version**: fetch tag berfore running cz bump
- **version**: test bump versionning

## 42.5.0 (2020-08-13)

### Feat

- **face-id**: FaceID working on tablet interface

### feat

- **face-id**: working flow, UX to be improved (+member form)

## 42.14.0a6 (2020-11-08)

### Fix

- **release**: testing commit

## 42.14.0a5 (2020-11-08)

## 42.14.0a4 (2020-11-08)

### Feat

- **release**: add changelog diff

## 42.14.0a3 (2020-11-08)

## 42.14.0a2 (2020-11-08)

### Feat

- **release**: implement changelog w/ gitlab release
- **release**: create release on gitlab

### Fix

- **release**: create prerelease suffix

## 42.13.0 (2020-11-08)

### Feat

- **exporthtml**: add button to export html file from email editor
- **subscription**: auto-set subscription 0€ to credit + display flat fee
- **booking-option**: disable notification on discard booking-option when converting as booking
- **booking-option**: disable notification on discard booking-option when converting as booking
- **partial-refund**: improve pack partial refund
- **partial-refund**: improve pack partial refund
- **subscription**: scheduled stop for subscriptions
- **subscription**: scheduled stop for subscriptions
- **menu**: denser responsive drawer nested menu item
- **menu**: denser responsive drawer nested menu item
- **phone**: translate phone in other countries
- **phone**: translate phone in other countries
- **smartlist**: add attendance option for BookingsFilters and BookingsNumberFilter
- **recurrence-rule**: add establishment in recurrence rule booking
- **smartlist**: add attendance option for BookingsFilters and BookingsNumberFilter
- **recurrence-rule**: add establishment in recurrence rule booking
- **gtm**: add gtm on custom login pages
- **offer**: restore offer button
- **mass_disable**: add background task for mass disable
- **communication-dialog**: add sms and email-template email
- **rum**: disable elasticsearch RUM
- **booking**: filter on recurrence-rule-booking-isnull
- **offer**: chose default view cancelled offer (manager space)
- **offer**: background task for offer edit and offer create
- **component birthday email**: add new component to birthday celebration email
- **booking**: add filter not cancelled
- **report**: addres/birthday in reports
- **notification-rule**: add invoice notif and waiting-list kick
- **dashboard**: new dashboard page
- **recurrent-booking**: add recurrent booking on member page and fix pagination
- **report**: add nb_offer and nb_offer_cancelled
- **background-task**: background task monitoring and background task for disabling/deleting offers
- **timezone**: return timezone_name in company onboarding
- **timezone**: handle multitimezone
- **bookingstatistics**: bookingStatistics filtered by offerFilters in calendar page
- **bookingnotification**: notify every attendance / absence / cancellation ... for booking notif
- **coupon**: add to subscription
- **refund**: more explicit refund message
- **booking-revert**: notify or not client about cancellation of their booking
- **sepa**: allow oneshot sepa payment
- **offer**: add recurrence rule for booking
- **offer-card**: show if was first booking w/ ★
- **bank-account**: support spanish bank accounts for companies
- **platform-billing**: add multiple payment methods
- **report**: add on spot payment report and add a button to generate it from cashbook
- **offer-card**: back more info on card
- **theme**: add general_terms_of_use
- **marketplace**: add an appbar w/ email+basket on payment pages
- **access-code**: add access codes to company onboarding
- **platform-billing**: add payment method even if no subscription/billing-group
- **platform-billing**: add new screen platform billing
- **member**: count objects in tabs
- **gtm**: add gtm in offer payment/booking page
- **emails**: add checkbox to send emails to canceled Bookings
- **settings**: make editable the ios and adroids's urls
- **subscription**: sort the subscription in manager interface
- **platform-billing**: basic plaformbilling setting page
- **payment-method**: save payment method
- **notification-rule**: disable and/or send copy to the company
- **bookingnotification**: booking notification form reorganization
- **smartlist**: private filters
- **smartlist**: bug basket date select
- **kube**: full switch to kubernetes servers
- **voucher**: add percent selector along price selector
- **offer**: reactivate delete button on offercard
- **reset-password**: propose help if reset password twice in 4h
- **subscription**: consumer can and must pay their credit subscrtipion
- **gtm**: add basketId on some missing gtm event
- **gtm**: add checkout-items to basket event, type on add-to-card events
- **vod**: pass give access to VOD
- **offeredit**: custom offer selection for recursive edit of similar offers
- **archive**: delete and restore coach/establshment even if future offers planned
- **nf525**: upload doc in settings for NF525
- **subscription**: allow 0e subscription w/ credit payment
- **subscription**: private-pass (RDV) subscription
- **apm**: first step testing instrumentation w/ elastic RUM
- test(producttour): add/ids
- **member**: terms and conditions in Member detail
- **client**: cancel-condition
- **associated coach api**: changed endpoint for create/update/link_email coach
- **idds**: chnage some idds
- **temp-password**: increase temp password validity to 1 week
- **bookingcreationnotification**: improved tooltips and form validation
- (fix): idds
- **bookingcreationnotification**: added booking notifications for establishment and meta_activity
- (ids): add/ids

### Fix

- **subscription**: fix stupid error
- **gtm**: add price in gtm
- **translation**: lol
- **dashboard**: correctly filter invoiceitem
- **login**: center login form
- **i18n**: import es locale for moment
- **i18n**: import es locale for moment
- **recurrence-booking**: open recurrence booking form when no booking selected
- **recurrence-booking**: open recurrence booking form when no booking selected
- **login**: center login form
- **timezone**: fix a bug when no timezone on offerlistv2
- **gtm**: add event on pre-checkout pages
- **check-in**: register on check-in app without pb
- **communication**: link smartlist commuinication to smartlist in back
- **communication**: fixes on member detail + order page
- **contract**: edit a contract to set a combo
- **subscription**: fix some modal on payment in marketplace
- **voucher**: format cts in subscription
- **timezone**: fix offer header
- **i18n**: add ireland bank account
- **timezone**: remove timezone reference in useless ref
- **timezone**: micro fix
- **quickfix**: random quickfix
- **payment-combo**: fix refresh error whenusing private-pass
- **rum**: disable rum bullshit
- **waiting-list**: register cancelled bookings on waiting-list
- **quickinvoice**: fix remove invoice item and UnevenInvoiceDialog float display
- **payment-method**: fetch payument methods only if valid member id
- **booking-revert**: set loading to false after action
- **random**: random fixes post-merge
- **random**: random fixes post-merge
- **random**: random fixes post-merge
- **payment-method**: fix some pb when registering sepa on mobile
- **offer-direct-payment**: remove abd infinite loading page
- **platform-billing**: show right price on platform invoice
- **payment-method**: disable payment-method switch on old subscription
- **offer-card**: show coach on offer-card
- **subscription**: pay on offerbooking page
- **payment-method**: better refresh of methods on subscription paymebnt form
- **subscription**: do not ask for payment on 0e subscription
- **payment-rule**: bug when 1 bonus in rules
- **payment-rule**: ability to par pallier
- **disable-offer**: show mass offer being disabled
- **booking-discard**: attempt to fix error message on refund booking
- **self-checkin**: do not show cancelled bookings in tablet
- **qf**: qffix
- **booking**: is_discardable is kind of broken
- **kube**: back to no-kube for security
- **stupidity**: so much stupidity
- **kube**: switch env
- **waitinglist**: allow 15 minutes delay
- **booking**: revert is_discardable
- **vod**: category proposed in marketplace are bounded to videos
- **sct**: localization of SCT
- **login**: change translation when email exists
- **flag**: england
- **localization**: remove la suisse from locale created
- **sentry**: fix versionning scheme on sentry
- **report**: bug
- **lint**: appbar
- **bookingnotifications**: fixed undefined
- **sentry**: change sourcemap url-prefix and version w/ sha
- **bookingstatistics**: fixed offer graph visuals in planning page

### Perf

- **email-tempaltes**: load templates only when dialog is open on membersummarycard
- **particlejs**: rmeove particlejs for error cleaning and perf

### feat

- **recurrent-booking**: add recurrent booking on member page and fix pagination
- **timezone**: add timezones in manager interface display
- **CashBook**: add report for cashBook
- **Member**: count objects in tabs
- **emails**: add checkbox for canceledBooking in sending emails
- **settings**: make editable the ios and adroids's urls
- **offercard**: reactivate button delete
- **subscription**: private pass (RDV) available for subscription
- **appbar**: user/menu
- (client): add-last-discard
- **change**: idds

### Refactor

- **ids**: add more ids
- **ids**: add more ids

### fix

- **cleanup**: can not unselect first offer + fix translation loading

## 42.9.0 (2020-08-18)

### Feat

- **invoice**: prompt for uneven invoices in offermanagement.component
- **widget**: share button for widget and calendar url
- **payment-pack**: limit purchase per payment-pack per member
- **payment-pack**: add day limitation
- **marketplace calendar**: added new theme settings to personalize the manager & customer calendars
- **SCT**: SCT localized

### Refactor

- **calendar**: clean a bit the UI

### Fix

- **language**: default language is english
- **payment**: block manager from payment pages

## 42.8.0 (2020-08-14)

### Feat

- **marketplace calendar**: added new theme settings to personalize the manager & customer calendars

## 42.7.0 (2020-08-13)

### Feat

- **invoice**: voucher for quick invoices

## 42.6.0 (2020-08-13)

### Feat

- **report**: add first privatebooking report

## 42.5.1 (2020-08-13)

### Fix

- **version**: fetch tag berfore running cz bump
- **version**: test bump versionning

## 42.5.0 (2020-08-13)

### Feat

- **face-id**: FaceID working on tablet interface

### feat

- **face-id**: working flow, UX to be improved (+member form)

## 42.14.0a6 (2020-11-08)

### Fix

- **release**: testing commit

## 42.14.0a5 (2020-11-08)

## 42.14.0a4 (2020-11-08)

### Feat

- **release**: add changelog diff

## 42.14.0a3 (2020-11-08)

## 42.14.0a2 (2020-11-08)

### Feat

- **release**: implement changelog w/ gitlab release
- **release**: create release on gitlab

### Fix

- **release**: create prerelease suffix

## 42.13.0 (2020-11-08)

### Feat

- **exporthtml**: add button to export html file from email editor
- **subscription**: auto-set subscription 0€ to credit + display flat fee
- **booking-option**: disable notification on discard booking-option when converting as booking
- **booking-option**: disable notification on discard booking-option when converting as booking
- **partial-refund**: improve pack partial refund
- **partial-refund**: improve pack partial refund
- **subscription**: scheduled stop for subscriptions
- **subscription**: scheduled stop for subscriptions
- **menu**: denser responsive drawer nested menu item
- **menu**: denser responsive drawer nested menu item
- **phone**: translate phone in other countries
- **phone**: translate phone in other countries
- **smartlist**: add attendance option for BookingsFilters and BookingsNumberFilter
- **recurrence-rule**: add establishment in recurrence rule booking
- **smartlist**: add attendance option for BookingsFilters and BookingsNumberFilter
- **recurrence-rule**: add establishment in recurrence rule booking
- **gtm**: add gtm on custom login pages
- **offer**: restore offer button
- **mass_disable**: add background task for mass disable
- **communication-dialog**: add sms and email-template email
- **rum**: disable elasticsearch RUM
- **booking**: filter on recurrence-rule-booking-isnull
- **offer**: chose default view cancelled offer (manager space)
- **offer**: background task for offer edit and offer create
- **component birthday email**: add new component to birthday celebration email
- **booking**: add filter not cancelled
- **report**: addres/birthday in reports
- **notification-rule**: add invoice notif and waiting-list kick
- **dashboard**: new dashboard page
- **recurrent-booking**: add recurrent booking on member page and fix pagination
- **report**: add nb_offer and nb_offer_cancelled
- **background-task**: background task monitoring and background task for disabling/deleting offers
- **timezone**: return timezone_name in company onboarding
- **timezone**: handle multitimezone
- **bookingstatistics**: bookingStatistics filtered by offerFilters in calendar page
- **bookingnotification**: notify every attendance / absence / cancellation ... for booking notif
- **coupon**: add to subscription
- **refund**: more explicit refund message
- **booking-revert**: notify or not client about cancellation of their booking
- **sepa**: allow oneshot sepa payment
- **offer**: add recurrence rule for booking
- **offer-card**: show if was first booking w/ ★
- **bank-account**: support spanish bank accounts for companies
- **platform-billing**: add multiple payment methods
- **report**: add on spot payment report and add a button to generate it from cashbook
- **offer-card**: back more info on card
- **theme**: add general_terms_of_use
- **marketplace**: add an appbar w/ email+basket on payment pages
- **access-code**: add access codes to company onboarding
- **platform-billing**: add payment method even if no subscription/billing-group
- **platform-billing**: add new screen platform billing
- **member**: count objects in tabs
- **gtm**: add gtm in offer payment/booking page
- **emails**: add checkbox to send emails to canceled Bookings
- **settings**: make editable the ios and adroids's urls
- **subscription**: sort the subscription in manager interface
- **platform-billing**: basic plaformbilling setting page
- **payment-method**: save payment method
- **notification-rule**: disable and/or send copy to the company
- **bookingnotification**: booking notification form reorganization
- **smartlist**: private filters
- **smartlist**: bug basket date select
- **kube**: full switch to kubernetes servers
- **voucher**: add percent selector along price selector
- **offer**: reactivate delete button on offercard
- **reset-password**: propose help if reset password twice in 4h
- **subscription**: consumer can and must pay their credit subscrtipion
- **gtm**: add basketId on some missing gtm event
- **gtm**: add checkout-items to basket event, type on add-to-card events
- **vod**: pass give access to VOD
- **offeredit**: custom offer selection for recursive edit of similar offers
- **archive**: delete and restore coach/establshment even if future offers planned
- **nf525**: upload doc in settings for NF525
- **subscription**: allow 0e subscription w/ credit payment
- **subscription**: private-pass (RDV) subscription
- **apm**: first step testing instrumentation w/ elastic RUM
- test(producttour): add/ids
- **member**: terms and conditions in Member detail
- **client**: cancel-condition
- **associated coach api**: changed endpoint for create/update/link_email coach
- **idds**: chnage some idds
- **temp-password**: increase temp password validity to 1 week
- **bookingcreationnotification**: improved tooltips and form validation
- (fix): idds
- **bookingcreationnotification**: added booking notifications for establishment and meta_activity
- (ids): add/ids

### Fix

- **subscription**: fix stupid error
- **gtm**: add price in gtm
- **translation**: lol
- **dashboard**: correctly filter invoiceitem
- **login**: center login form
- **i18n**: import es locale for moment
- **i18n**: import es locale for moment
- **recurrence-booking**: open recurrence booking form when no booking selected
- **recurrence-booking**: open recurrence booking form when no booking selected
- **login**: center login form
- **timezone**: fix a bug when no timezone on offerlistv2
- **gtm**: add event on pre-checkout pages
- **check-in**: register on check-in app without pb
- **communication**: link smartlist commuinication to smartlist in back
- **communication**: fixes on member detail + order page
- **contract**: edit a contract to set a combo
- **subscription**: fix some modal on payment in marketplace
- **voucher**: format cts in subscription
- **timezone**: fix offer header
- **i18n**: add ireland bank account
- **timezone**: remove timezone reference in useless ref
- **timezone**: micro fix
- **quickfix**: random quickfix
- **payment-combo**: fix refresh error whenusing private-pass
- **rum**: disable rum bullshit
- **waiting-list**: register cancelled bookings on waiting-list
- **quickinvoice**: fix remove invoice item and UnevenInvoiceDialog float display
- **payment-method**: fetch payument methods only if valid member id
- **booking-revert**: set loading to false after action
- **random**: random fixes post-merge
- **random**: random fixes post-merge
- **random**: random fixes post-merge
- **payment-method**: fix some pb when registering sepa on mobile
- **offer-direct-payment**: remove abd infinite loading page
- **platform-billing**: show right price on platform invoice
- **payment-method**: disable payment-method switch on old subscription
- **offer-card**: show coach on offer-card
- **subscription**: pay on offerbooking page
- **payment-method**: better refresh of methods on subscription paymebnt form
- **subscription**: do not ask for payment on 0e subscription
- **payment-rule**: bug when 1 bonus in rules
- **payment-rule**: ability to par pallier
- **disable-offer**: show mass offer being disabled
- **booking-discard**: attempt to fix error message on refund booking
- **self-checkin**: do not show cancelled bookings in tablet
- **qf**: qffix
- **booking**: is_discardable is kind of broken
- **kube**: back to no-kube for security
- **stupidity**: so much stupidity
- **kube**: switch env
- **waitinglist**: allow 15 minutes delay
- **booking**: revert is_discardable
- **vod**: category proposed in marketplace are bounded to videos
- **sct**: localization of SCT
- **login**: change translation when email exists
- **flag**: england
- **localization**: remove la suisse from locale created
- **sentry**: fix versionning scheme on sentry
- **report**: bug
- **lint**: appbar
- **bookingnotifications**: fixed undefined
- **sentry**: change sourcemap url-prefix and version w/ sha
- **bookingstatistics**: fixed offer graph visuals in planning page

### Perf

- **email-tempaltes**: load templates only when dialog is open on membersummarycard
- **particlejs**: rmeove particlejs for error cleaning and perf

### feat

- **recurrent-booking**: add recurrent booking on member page and fix pagination
- **timezone**: add timezones in manager interface display
- **CashBook**: add report for cashBook
- **Member**: count objects in tabs
- **emails**: add checkbox for canceledBooking in sending emails
- **settings**: make editable the ios and adroids's urls
- **offercard**: reactivate button delete
- **subscription**: private pass (RDV) available for subscription
- **appbar**: user/menu
- (client): add-last-discard
- **change**: idds

### Refactor

- **ids**: add more ids
- **ids**: add more ids

### fix

- **cleanup**: can not unselect first offer + fix translation loading

## 42.9.0 (2020-08-18)

### Feat

- **invoice**: prompt for uneven invoices in offermanagement.component
- **widget**: share button for widget and calendar url
- **payment-pack**: limit purchase per payment-pack per member
- **payment-pack**: add day limitation
- **marketplace calendar**: added new theme settings to personalize the manager & customer calendars
- **SCT**: SCT localized

### Refactor

- **calendar**: clean a bit the UI

### Fix

- **language**: default language is english
- **payment**: block manager from payment pages

## 42.8.0 (2020-08-14)

### Feat

- **marketplace calendar**: added new theme settings to personalize the manager & customer calendars

## 42.7.0 (2020-08-13)

### Feat

- **invoice**: voucher for quick invoices

## 42.6.0 (2020-08-13)

### Feat

- **report**: add first privatebooking report

## 42.5.1 (2020-08-13)

### Fix

- **version**: fetch tag berfore running cz bump
- **version**: test bump versionning

## 42.5.0 (2020-08-13)

### Feat

- **face-id**: FaceID working on tablet interface

### feat

- **face-id**: working flow, UX to be improved (+member form)

## 42.14.0a4 (2020-11-08)

### Feat

- **release**: add changelog diff

## 42.14.0a3 (2020-11-08)

## 42.14.0a2 (2020-11-08)

### Feat

- **release**: implement changelog w/ gitlab release
- **release**: create release on gitlab

### Fix

- **release**: create prerelease suffix

## 42.13.0 (2020-11-08)

### Feat

- **exporthtml**: add button to export html file from email editor
- **subscription**: auto-set subscription 0€ to credit + display flat fee
- **booking-option**: disable notification on discard booking-option when converting as booking
- **booking-option**: disable notification on discard booking-option when converting as booking
- **partial-refund**: improve pack partial refund
- **partial-refund**: improve pack partial refund
- **subscription**: scheduled stop for subscriptions
- **subscription**: scheduled stop for subscriptions
- **menu**: denser responsive drawer nested menu item
- **menu**: denser responsive drawer nested menu item
- **phone**: translate phone in other countries
- **phone**: translate phone in other countries
- **smartlist**: add attendance option for BookingsFilters and BookingsNumberFilter
- **recurrence-rule**: add establishment in recurrence rule booking
- **smartlist**: add attendance option for BookingsFilters and BookingsNumberFilter
- **recurrence-rule**: add establishment in recurrence rule booking
- **gtm**: add gtm on custom login pages
- **offer**: restore offer button
- **mass_disable**: add background task for mass disable
- **communication-dialog**: add sms and email-template email
- **rum**: disable elasticsearch RUM
- **booking**: filter on recurrence-rule-booking-isnull
- **offer**: chose default view cancelled offer (manager space)
- **offer**: background task for offer edit and offer create
- **component birthday email**: add new component to birthday celebration email
- **booking**: add filter not cancelled
- **report**: addres/birthday in reports
- **notification-rule**: add invoice notif and waiting-list kick
- **dashboard**: new dashboard page
- **recurrent-booking**: add recurrent booking on member page and fix pagination
- **report**: add nb_offer and nb_offer_cancelled
- **background-task**: background task monitoring and background task for disabling/deleting offers
- **timezone**: return timezone_name in company onboarding
- **timezone**: handle multitimezone
- **bookingstatistics**: bookingStatistics filtered by offerFilters in calendar page
- **bookingnotification**: notify every attendance / absence / cancellation ... for booking notif
- **coupon**: add to subscription
- **refund**: more explicit refund message
- **booking-revert**: notify or not client about cancellation of their booking
- **sepa**: allow oneshot sepa payment
- **offer**: add recurrence rule for booking
- **offer-card**: show if was first booking w/ ★
- **bank-account**: support spanish bank accounts for companies
- **platform-billing**: add multiple payment methods
- **report**: add on spot payment report and add a button to generate it from cashbook
- **offer-card**: back more info on card
- **theme**: add general_terms_of_use
- **marketplace**: add an appbar w/ email+basket on payment pages
- **access-code**: add access codes to company onboarding
- **platform-billing**: add payment method even if no subscription/billing-group
- **platform-billing**: add new screen platform billing
- **member**: count objects in tabs
- **gtm**: add gtm in offer payment/booking page
- **emails**: add checkbox to send emails to canceled Bookings
- **settings**: make editable the ios and adroids's urls
- **subscription**: sort the subscription in manager interface
- **platform-billing**: basic plaformbilling setting page
- **payment-method**: save payment method
- **notification-rule**: disable and/or send copy to the company
- **bookingnotification**: booking notification form reorganization
- **smartlist**: private filters
- **smartlist**: bug basket date select
- **kube**: full switch to kubernetes servers
- **voucher**: add percent selector along price selector
- **offer**: reactivate delete button on offercard
- **reset-password**: propose help if reset password twice in 4h
- **subscription**: consumer can and must pay their credit subscrtipion
- **gtm**: add basketId on some missing gtm event
- **gtm**: add checkout-items to basket event, type on add-to-card events
- **vod**: pass give access to VOD
- **offeredit**: custom offer selection for recursive edit of similar offers
- **archive**: delete and restore coach/establshment even if future offers planned
- **nf525**: upload doc in settings for NF525
- **subscription**: allow 0e subscription w/ credit payment
- **subscription**: private-pass (RDV) subscription
- **apm**: first step testing instrumentation w/ elastic RUM
- test(producttour): add/ids
- **member**: terms and conditions in Member detail
- **client**: cancel-condition
- **associated coach api**: changed endpoint for create/update/link_email coach
- **idds**: chnage some idds
- **temp-password**: increase temp password validity to 1 week
- **bookingcreationnotification**: improved tooltips and form validation
- (fix): idds
- **bookingcreationnotification**: added booking notifications for establishment and meta_activity
- (ids): add/ids

### Fix

- **subscription**: fix stupid error
- **gtm**: add price in gtm
- **translation**: lol
- **dashboard**: correctly filter invoiceitem
- **login**: center login form
- **i18n**: import es locale for moment
- **i18n**: import es locale for moment
- **recurrence-booking**: open recurrence booking form when no booking selected
- **recurrence-booking**: open recurrence booking form when no booking selected
- **login**: center login form
- **timezone**: fix a bug when no timezone on offerlistv2
- **gtm**: add event on pre-checkout pages
- **check-in**: register on check-in app without pb
- **communication**: link smartlist commuinication to smartlist in back
- **communication**: fixes on member detail + order page
- **contract**: edit a contract to set a combo
- **subscription**: fix some modal on payment in marketplace
- **voucher**: format cts in subscription
- **timezone**: fix offer header
- **i18n**: add ireland bank account
- **timezone**: remove timezone reference in useless ref
- **timezone**: micro fix
- **quickfix**: random quickfix
- **payment-combo**: fix refresh error whenusing private-pass
- **rum**: disable rum bullshit
- **waiting-list**: register cancelled bookings on waiting-list
- **quickinvoice**: fix remove invoice item and UnevenInvoiceDialog float display
- **payment-method**: fetch payument methods only if valid member id
- **booking-revert**: set loading to false after action
- **random**: random fixes post-merge
- **random**: random fixes post-merge
- **random**: random fixes post-merge
- **payment-method**: fix some pb when registering sepa on mobile
- **offer-direct-payment**: remove abd infinite loading page
- **platform-billing**: show right price on platform invoice
- **payment-method**: disable payment-method switch on old subscription
- **offer-card**: show coach on offer-card
- **subscription**: pay on offerbooking page
- **payment-method**: better refresh of methods on subscription paymebnt form
- **subscription**: do not ask for payment on 0e subscription
- **payment-rule**: bug when 1 bonus in rules
- **payment-rule**: ability to par pallier
- **disable-offer**: show mass offer being disabled
- **booking-discard**: attempt to fix error message on refund booking
- **self-checkin**: do not show cancelled bookings in tablet
- **qf**: qffix
- **booking**: is_discardable is kind of broken
- **kube**: back to no-kube for security
- **stupidity**: so much stupidity
- **kube**: switch env
- **waitinglist**: allow 15 minutes delay
- **booking**: revert is_discardable
- **vod**: category proposed in marketplace are bounded to videos
- **sct**: localization of SCT
- **login**: change translation when email exists
- **flag**: england
- **localization**: remove la suisse from locale created
- **sentry**: fix versionning scheme on sentry
- **report**: bug
- **lint**: appbar
- **bookingnotifications**: fixed undefined
- **sentry**: change sourcemap url-prefix and version w/ sha
- **bookingstatistics**: fixed offer graph visuals in planning page

### Perf

- **email-tempaltes**: load templates only when dialog is open on membersummarycard
- **particlejs**: rmeove particlejs for error cleaning and perf

### feat

- **recurrent-booking**: add recurrent booking on member page and fix pagination
- **timezone**: add timezones in manager interface display
- **CashBook**: add report for cashBook
- **Member**: count objects in tabs
- **emails**: add checkbox for canceledBooking in sending emails
- **settings**: make editable the ios and adroids's urls
- **offercard**: reactivate button delete
- **subscription**: private pass (RDV) available for subscription
- **appbar**: user/menu
- (client): add-last-discard
- **change**: idds

### Refactor

- **ids**: add more ids
- **ids**: add more ids

### fix

- **cleanup**: can not unselect first offer + fix translation loading

## 42.9.0 (2020-08-18)

### Feat

- **invoice**: prompt for uneven invoices in offermanagement.component
- **widget**: share button for widget and calendar url
- **payment-pack**: limit purchase per payment-pack per member
- **payment-pack**: add day limitation
- **marketplace calendar**: added new theme settings to personalize the manager & customer calendars
- **SCT**: SCT localized

### Refactor

- **calendar**: clean a bit the UI

### Fix

- **language**: default language is english
- **payment**: block manager from payment pages

## 42.8.0 (2020-08-14)

### Feat

- **marketplace calendar**: added new theme settings to personalize the manager & customer calendars

## 42.7.0 (2020-08-13)

### Feat

- **invoice**: voucher for quick invoices

## 42.6.0 (2020-08-13)

### Feat

- **report**: add first privatebooking report

## 42.5.1 (2020-08-13)

### Fix

- **version**: fetch tag berfore running cz bump
- **version**: test bump versionning

## 42.5.0 (2020-08-13)

### Feat

- **face-id**: FaceID working on tablet interface

### feat

- **face-id**: working flow, UX to be improved (+member form)

## 42.14.0a4 (2020-11-08)

### Feat

- **release**: add changelog diff

## 42.14.0a3 (2020-11-08)

## 42.14.0a2 (2020-11-08)

### Feat

- **release**: implement changelog w/ gitlab release
- **release**: create release on gitlab

### Fix

- **release**: create prerelease suffix

## 42.13.0 (2020-11-08)

### Feat

- **exporthtml**: add button to export html file from email editor
- **subscription**: auto-set subscription 0€ to credit + display flat fee
- **booking-option**: disable notification on discard booking-option when converting as booking
- **booking-option**: disable notification on discard booking-option when converting as booking
- **partial-refund**: improve pack partial refund
- **partial-refund**: improve pack partial refund
- **subscription**: scheduled stop for subscriptions
- **subscription**: scheduled stop for subscriptions
- **menu**: denser responsive drawer nested menu item
- **menu**: denser responsive drawer nested menu item
- **phone**: translate phone in other countries
- **phone**: translate phone in other countries
- **smartlist**: add attendance option for BookingsFilters and BookingsNumberFilter
- **recurrence-rule**: add establishment in recurrence rule booking
- **smartlist**: add attendance option for BookingsFilters and BookingsNumberFilter
- **recurrence-rule**: add establishment in recurrence rule booking
- **gtm**: add gtm on custom login pages
- **offer**: restore offer button
- **mass_disable**: add background task for mass disable
- **communication-dialog**: add sms and email-template email
- **rum**: disable elasticsearch RUM
- **booking**: filter on recurrence-rule-booking-isnull
- **offer**: chose default view cancelled offer (manager space)
- **offer**: background task for offer edit and offer create
- **component birthday email**: add new component to birthday celebration email
- **booking**: add filter not cancelled
- **report**: addres/birthday in reports
- **notification-rule**: add invoice notif and waiting-list kick
- **dashboard**: new dashboard page
- **recurrent-booking**: add recurrent booking on member page and fix pagination
- **report**: add nb_offer and nb_offer_cancelled
- **background-task**: background task monitoring and background task for disabling/deleting offers
- **timezone**: return timezone_name in company onboarding
- **timezone**: handle multitimezone
- **bookingstatistics**: bookingStatistics filtered by offerFilters in calendar page
- **bookingnotification**: notify every attendance / absence / cancellation ... for booking notif
- **coupon**: add to subscription
- **refund**: more explicit refund message
- **booking-revert**: notify or not client about cancellation of their booking
- **sepa**: allow oneshot sepa payment
- **offer**: add recurrence rule for booking
- **offer-card**: show if was first booking w/ ★
- **bank-account**: support spanish bank accounts for companies
- **platform-billing**: add multiple payment methods
- **report**: add on spot payment report and add a button to generate it from cashbook
- **offer-card**: back more info on card
- **theme**: add general_terms_of_use
- **marketplace**: add an appbar w/ email+basket on payment pages
- **access-code**: add access codes to company onboarding
- **platform-billing**: add payment method even if no subscription/billing-group
- **platform-billing**: add new screen platform billing
- **member**: count objects in tabs
- **gtm**: add gtm in offer payment/booking page
- **emails**: add checkbox to send emails to canceled Bookings
- **settings**: make editable the ios and adroids's urls
- **subscription**: sort the subscription in manager interface
- **platform-billing**: basic plaformbilling setting page
- **payment-method**: save payment method
- **notification-rule**: disable and/or send copy to the company
- **bookingnotification**: booking notification form reorganization
- **smartlist**: private filters
- **smartlist**: bug basket date select
- **kube**: full switch to kubernetes servers
- **voucher**: add percent selector along price selector
- **offer**: reactivate delete button on offercard
- **reset-password**: propose help if reset password twice in 4h
- **subscription**: consumer can and must pay their credit subscrtipion
- **gtm**: add basketId on some missing gtm event
- **gtm**: add checkout-items to basket event, type on add-to-card events
- **vod**: pass give access to VOD
- **offeredit**: custom offer selection for recursive edit of similar offers
- **archive**: delete and restore coach/establshment even if future offers planned
- **nf525**: upload doc in settings for NF525
- **subscription**: allow 0e subscription w/ credit payment
- **subscription**: private-pass (RDV) subscription
- **apm**: first step testing instrumentation w/ elastic RUM
- test(producttour): add/ids
- **member**: terms and conditions in Member detail
- **client**: cancel-condition
- **associated coach api**: changed endpoint for create/update/link_email coach
- **idds**: chnage some idds
- **temp-password**: increase temp password validity to 1 week
- **bookingcreationnotification**: improved tooltips and form validation
- (fix): idds
- **bookingcreationnotification**: added booking notifications for establishment and meta_activity
- (ids): add/ids

### Fix

- **subscription**: fix stupid error
- **gtm**: add price in gtm
- **translation**: lol
- **dashboard**: correctly filter invoiceitem
- **login**: center login form
- **i18n**: import es locale for moment
- **i18n**: import es locale for moment
- **recurrence-booking**: open recurrence booking form when no booking selected
- **recurrence-booking**: open recurrence booking form when no booking selected
- **login**: center login form
- **timezone**: fix a bug when no timezone on offerlistv2
- **gtm**: add event on pre-checkout pages
- **check-in**: register on check-in app without pb
- **communication**: link smartlist commuinication to smartlist in back
- **communication**: fixes on member detail + order page
- **contract**: edit a contract to set a combo
- **subscription**: fix some modal on payment in marketplace
- **voucher**: format cts in subscription
- **timezone**: fix offer header
- **i18n**: add ireland bank account
- **timezone**: remove timezone reference in useless ref
- **timezone**: micro fix
- **quickfix**: random quickfix
- **payment-combo**: fix refresh error whenusing private-pass
- **rum**: disable rum bullshit
- **waiting-list**: register cancelled bookings on waiting-list
- **quickinvoice**: fix remove invoice item and UnevenInvoiceDialog float display
- **payment-method**: fetch payument methods only if valid member id
- **booking-revert**: set loading to false after action
- **random**: random fixes post-merge
- **random**: random fixes post-merge
- **random**: random fixes post-merge
- **payment-method**: fix some pb when registering sepa on mobile
- **offer-direct-payment**: remove abd infinite loading page
- **platform-billing**: show right price on platform invoice
- **payment-method**: disable payment-method switch on old subscription
- **offer-card**: show coach on offer-card
- **subscription**: pay on offerbooking page
- **payment-method**: better refresh of methods on subscription paymebnt form
- **subscription**: do not ask for payment on 0e subscription
- **payment-rule**: bug when 1 bonus in rules
- **payment-rule**: ability to par pallier
- **disable-offer**: show mass offer being disabled
- **booking-discard**: attempt to fix error message on refund booking
- **self-checkin**: do not show cancelled bookings in tablet
- **qf**: qffix
- **booking**: is_discardable is kind of broken
- **kube**: back to no-kube for security
- **stupidity**: so much stupidity
- **kube**: switch env
- **waitinglist**: allow 15 minutes delay
- **booking**: revert is_discardable
- **vod**: category proposed in marketplace are bounded to videos
- **sct**: localization of SCT
- **login**: change translation when email exists
- **flag**: england
- **localization**: remove la suisse from locale created
- **sentry**: fix versionning scheme on sentry
- **report**: bug
- **lint**: appbar
- **bookingnotifications**: fixed undefined
- **sentry**: change sourcemap url-prefix and version w/ sha
- **bookingstatistics**: fixed offer graph visuals in planning page

### Perf

- **email-tempaltes**: load templates only when dialog is open on membersummarycard
- **particlejs**: rmeove particlejs for error cleaning and perf

### feat

- **recurrent-booking**: add recurrent booking on member page and fix pagination
- **timezone**: add timezones in manager interface display
- **CashBook**: add report for cashBook
- **Member**: count objects in tabs
- **emails**: add checkbox for canceledBooking in sending emails
- **settings**: make editable the ios and adroids's urls
- **offercard**: reactivate button delete
- **subscription**: private pass (RDV) available for subscription
- **appbar**: user/menu
- (client): add-last-discard
- **change**: idds

### Refactor

- **ids**: add more ids
- **ids**: add more ids

### fix

- **cleanup**: can not unselect first offer + fix translation loading

## 42.9.0 (2020-08-18)

### Feat

- **invoice**: prompt for uneven invoices in offermanagement.component
- **widget**: share button for widget and calendar url
- **payment-pack**: limit purchase per payment-pack per member
- **payment-pack**: add day limitation
- **marketplace calendar**: added new theme settings to personalize the manager & customer calendars
- **SCT**: SCT localized

### Refactor

- **calendar**: clean a bit the UI

### Fix

- **language**: default language is english
- **payment**: block manager from payment pages

## 42.8.0 (2020-08-14)

### Feat

- **marketplace calendar**: added new theme settings to personalize the manager & customer calendars

## 42.7.0 (2020-08-13)

### Feat

- **invoice**: voucher for quick invoices

## 42.6.0 (2020-08-13)

### Feat

- **report**: add first privatebooking report

## 42.5.1 (2020-08-13)

### Fix

- **version**: fetch tag berfore running cz bump
- **version**: test bump versionning

## 42.5.0 (2020-08-13)

### Feat

- **face-id**: FaceID working on tablet interface

### feat

- **face-id**: working flow, UX to be improved (+member form)

## 42.14.0a2 (2020-11-08)

### Feat

- **release**: implement changelog w/ gitlab release
- **release**: create release on gitlab

### Fix

- **release**: create prerelease suffix

## 42.13.0 (2020-11-08)

### Feat

- **exporthtml**: add button to export html file from email editor
- **subscription**: auto-set subscription 0€ to credit + display flat fee
- **booking-option**: disable notification on discard booking-option when converting as booking
- **booking-option**: disable notification on discard booking-option when converting as booking
- **partial-refund**: improve pack partial refund
- **partial-refund**: improve pack partial refund
- **subscription**: scheduled stop for subscriptions
- **subscription**: scheduled stop for subscriptions
- **menu**: denser responsive drawer nested menu item
- **menu**: denser responsive drawer nested menu item
- **phone**: translate phone in other countries
- **phone**: translate phone in other countries
- **smartlist**: add attendance option for BookingsFilters and BookingsNumberFilter
- **recurrence-rule**: add establishment in recurrence rule booking
- **smartlist**: add attendance option for BookingsFilters and BookingsNumberFilter
- **recurrence-rule**: add establishment in recurrence rule booking
- **gtm**: add gtm on custom login pages
- **offer**: restore offer button
- **mass_disable**: add background task for mass disable
- **communication-dialog**: add sms and email-template email
- **rum**: disable elasticsearch RUM
- **booking**: filter on recurrence-rule-booking-isnull
- **offer**: chose default view cancelled offer (manager space)
- **offer**: background task for offer edit and offer create
- **component birthday email**: add new component to birthday celebration email
- **booking**: add filter not cancelled
- **report**: addres/birthday in reports
- **notification-rule**: add invoice notif and waiting-list kick
- **dashboard**: new dashboard page
- **recurrent-booking**: add recurrent booking on member page and fix pagination
- **report**: add nb_offer and nb_offer_cancelled
- **background-task**: background task monitoring and background task for disabling/deleting offers
- **timezone**: return timezone_name in company onboarding
- **timezone**: handle multitimezone
- **bookingstatistics**: bookingStatistics filtered by offerFilters in calendar page
- **bookingnotification**: notify every attendance / absence / cancellation ... for booking notif
- **coupon**: add to subscription
- **refund**: more explicit refund message
- **booking-revert**: notify or not client about cancellation of their booking
- **sepa**: allow oneshot sepa payment
- **offer**: add recurrence rule for booking
- **offer-card**: show if was first booking w/ ★
- **bank-account**: support spanish bank accounts for companies
- **platform-billing**: add multiple payment methods
- **report**: add on spot payment report and add a button to generate it from cashbook
- **offer-card**: back more info on card
- **theme**: add general_terms_of_use
- **marketplace**: add an appbar w/ email+basket on payment pages
- **access-code**: add access codes to company onboarding
- **platform-billing**: add payment method even if no subscription/billing-group
- **platform-billing**: add new screen platform billing
- **member**: count objects in tabs
- **gtm**: add gtm in offer payment/booking page
- **emails**: add checkbox to send emails to canceled Bookings
- **settings**: make editable the ios and adroids's urls
- **subscription**: sort the subscription in manager interface
- **platform-billing**: basic plaformbilling setting page
- **payment-method**: save payment method
- **notification-rule**: disable and/or send copy to the company
- **bookingnotification**: booking notification form reorganization
- **smartlist**: private filters
- **smartlist**: bug basket date select
- **kube**: full switch to kubernetes servers
- **voucher**: add percent selector along price selector
- **offer**: reactivate delete button on offercard
- **reset-password**: propose help if reset password twice in 4h
- **subscription**: consumer can and must pay their credit subscrtipion
- **gtm**: add basketId on some missing gtm event
- **gtm**: add checkout-items to basket event, type on add-to-card events
- **vod**: pass give access to VOD
- **offeredit**: custom offer selection for recursive edit of similar offers
- **archive**: delete and restore coach/establshment even if future offers planned
- **nf525**: upload doc in settings for NF525
- **subscription**: allow 0e subscription w/ credit payment
- **subscription**: private-pass (RDV) subscription
- **apm**: first step testing instrumentation w/ elastic RUM
- test(producttour): add/ids
- **member**: terms and conditions in Member detail
- **client**: cancel-condition
- **associated coach api**: changed endpoint for create/update/link_email coach
- **idds**: chnage some idds
- **temp-password**: increase temp password validity to 1 week
- **bookingcreationnotification**: improved tooltips and form validation
- (fix): idds
- **bookingcreationnotification**: added booking notifications for establishment and meta_activity
- (ids): add/ids

### Fix

- **subscription**: fix stupid error
- **gtm**: add price in gtm
- **translation**: lol
- **dashboard**: correctly filter invoiceitem
- **login**: center login form
- **i18n**: import es locale for moment
- **i18n**: import es locale for moment
- **recurrence-booking**: open recurrence booking form when no booking selected
- **recurrence-booking**: open recurrence booking form when no booking selected
- **login**: center login form
- **timezone**: fix a bug when no timezone on offerlistv2
- **gtm**: add event on pre-checkout pages
- **check-in**: register on check-in app without pb
- **communication**: link smartlist commuinication to smartlist in back
- **communication**: fixes on member detail + order page
- **contract**: edit a contract to set a combo
- **subscription**: fix some modal on payment in marketplace
- **voucher**: format cts in subscription
- **timezone**: fix offer header
- **i18n**: add ireland bank account
- **timezone**: remove timezone reference in useless ref
- **timezone**: micro fix
- **quickfix**: random quickfix
- **payment-combo**: fix refresh error whenusing private-pass
- **rum**: disable rum bullshit
- **waiting-list**: register cancelled bookings on waiting-list
- **quickinvoice**: fix remove invoice item and UnevenInvoiceDialog float display
- **payment-method**: fetch payument methods only if valid member id
- **booking-revert**: set loading to false after action
- **random**: random fixes post-merge
- **random**: random fixes post-merge
- **random**: random fixes post-merge
- **payment-method**: fix some pb when registering sepa on mobile
- **offer-direct-payment**: remove abd infinite loading page
- **platform-billing**: show right price on platform invoice
- **payment-method**: disable payment-method switch on old subscription
- **offer-card**: show coach on offer-card
- **subscription**: pay on offerbooking page
- **payment-method**: better refresh of methods on subscription paymebnt form
- **subscription**: do not ask for payment on 0e subscription
- **payment-rule**: bug when 1 bonus in rules
- **payment-rule**: ability to par pallier
- **disable-offer**: show mass offer being disabled
- **booking-discard**: attempt to fix error message on refund booking
- **self-checkin**: do not show cancelled bookings in tablet
- **qf**: qffix
- **booking**: is_discardable is kind of broken
- **kube**: back to no-kube for security
- **stupidity**: so much stupidity
- **kube**: switch env
- **waitinglist**: allow 15 minutes delay
- **booking**: revert is_discardable
- **vod**: category proposed in marketplace are bounded to videos
- **sct**: localization of SCT
- **login**: change translation when email exists
- **flag**: england
- **localization**: remove la suisse from locale created
- **sentry**: fix versionning scheme on sentry
- **report**: bug
- **lint**: appbar
- **bookingnotifications**: fixed undefined
- **sentry**: change sourcemap url-prefix and version w/ sha
- **bookingstatistics**: fixed offer graph visuals in planning page

### Perf

- **email-tempaltes**: load templates only when dialog is open on membersummarycard
- **particlejs**: rmeove particlejs for error cleaning and perf

### feat

- **recurrent-booking**: add recurrent booking on member page and fix pagination
- **timezone**: add timezones in manager interface display
- **CashBook**: add report for cashBook
- **Member**: count objects in tabs
- **emails**: add checkbox for canceledBooking in sending emails
- **settings**: make editable the ios and adroids's urls
- **offercard**: reactivate button delete
- **subscription**: private pass (RDV) available for subscription
- **appbar**: user/menu
- (client): add-last-discard
- **change**: idds

### Refactor

- **ids**: add more ids
- **ids**: add more ids

### fix

- **cleanup**: can not unselect first offer + fix translation loading

## 42.9.0 (2020-08-18)

### Feat

- **invoice**: prompt for uneven invoices in offermanagement.component
- **widget**: share button for widget and calendar url
- **payment-pack**: limit purchase per payment-pack per member
- **payment-pack**: add day limitation
- **marketplace calendar**: added new theme settings to personalize the manager & customer calendars
- **SCT**: SCT localized

### Refactor

- **calendar**: clean a bit the UI

### Fix

- **language**: default language is english
- **payment**: block manager from payment pages

## 42.8.0 (2020-08-14)

### Feat

- **marketplace calendar**: added new theme settings to personalize the manager & customer calendars

## 42.7.0 (2020-08-13)

### Feat

- **invoice**: voucher for quick invoices

## 42.6.0 (2020-08-13)

### Feat

- **report**: add first privatebooking report

## 42.5.1 (2020-08-13)

### Fix

- **version**: fetch tag berfore running cz bump
- **version**: test bump versionning

## 42.5.0 (2020-08-13)

### Feat

- **face-id**: FaceID working on tablet interface

### feat

- **face-id**: working flow, UX to be improved (+member form)

## 42.14.0a2 (2020-11-08)

### Feat

- **release**: implement changelog w/ gitlab release
- **release**: create release on gitlab

### Fix

- **release**: create prerelease suffix

## 42.13.0 (2020-11-08)

### Feat

- **exporthtml**: add button to export html file from email editor
- **subscription**: auto-set subscription 0€ to credit + display flat fee
- **booking-option**: disable notification on discard booking-option when converting as booking
- **booking-option**: disable notification on discard booking-option when converting as booking
- **partial-refund**: improve pack partial refund
- **partial-refund**: improve pack partial refund
- **subscription**: scheduled stop for subscriptions
- **subscription**: scheduled stop for subscriptions
- **menu**: denser responsive drawer nested menu item
- **menu**: denser responsive drawer nested menu item
- **phone**: translate phone in other countries
- **phone**: translate phone in other countries
- **smartlist**: add attendance option for BookingsFilters and BookingsNumberFilter
- **recurrence-rule**: add establishment in recurrence rule booking
- **smartlist**: add attendance option for BookingsFilters and BookingsNumberFilter
- **recurrence-rule**: add establishment in recurrence rule booking
- **gtm**: add gtm on custom login pages
- **offer**: restore offer button
- **mass_disable**: add background task for mass disable
- **communication-dialog**: add sms and email-template email
- **rum**: disable elasticsearch RUM
- **booking**: filter on recurrence-rule-booking-isnull
- **offer**: chose default view cancelled offer (manager space)
- **offer**: background task for offer edit and offer create
- **component birthday email**: add new component to birthday celebration email
- **booking**: add filter not cancelled
- **report**: addres/birthday in reports
- **notification-rule**: add invoice notif and waiting-list kick
- **dashboard**: new dashboard page
- **recurrent-booking**: add recurrent booking on member page and fix pagination
- **report**: add nb_offer and nb_offer_cancelled
- **background-task**: background task monitoring and background task for disabling/deleting offers
- **timezone**: return timezone_name in company onboarding
- **timezone**: handle multitimezone
- **bookingstatistics**: bookingStatistics filtered by offerFilters in calendar page
- **bookingnotification**: notify every attendance / absence / cancellation ... for booking notif
- **coupon**: add to subscription
- **refund**: more explicit refund message
- **booking-revert**: notify or not client about cancellation of their booking
- **sepa**: allow oneshot sepa payment
- **offer**: add recurrence rule for booking
- **offer-card**: show if was first booking w/ ★
- **bank-account**: support spanish bank accounts for companies
- **platform-billing**: add multiple payment methods
- **report**: add on spot payment report and add a button to generate it from cashbook
- **offer-card**: back more info on card
- **theme**: add general_terms_of_use
- **marketplace**: add an appbar w/ email+basket on payment pages
- **access-code**: add access codes to company onboarding
- **platform-billing**: add payment method even if no subscription/billing-group
- **platform-billing**: add new screen platform billing
- **member**: count objects in tabs
- **gtm**: add gtm in offer payment/booking page
- **emails**: add checkbox to send emails to canceled Bookings
- **settings**: make editable the ios and adroids's urls
- **subscription**: sort the subscription in manager interface
- **platform-billing**: basic plaformbilling setting page
- **payment-method**: save payment method
- **notification-rule**: disable and/or send copy to the company
- **bookingnotification**: booking notification form reorganization
- **smartlist**: private filters
- **smartlist**: bug basket date select
- **kube**: full switch to kubernetes servers
- **voucher**: add percent selector along price selector
- **offer**: reactivate delete button on offercard
- **reset-password**: propose help if reset password twice in 4h
- **subscription**: consumer can and must pay their credit subscrtipion
- **gtm**: add basketId on some missing gtm event
- **gtm**: add checkout-items to basket event, type on add-to-card events
- **vod**: pass give access to VOD
- **offeredit**: custom offer selection for recursive edit of similar offers
- **archive**: delete and restore coach/establshment even if future offers planned
- **nf525**: upload doc in settings for NF525
- **subscription**: allow 0e subscription w/ credit payment
- **subscription**: private-pass (RDV) subscription
- **apm**: first step testing instrumentation w/ elastic RUM
- test(producttour): add/ids
- **member**: terms and conditions in Member detail
- **client**: cancel-condition
- **associated coach api**: changed endpoint for create/update/link_email coach
- **idds**: chnage some idds
- **temp-password**: increase temp password validity to 1 week
- **bookingcreationnotification**: improved tooltips and form validation
- (fix): idds
- **bookingcreationnotification**: added booking notifications for establishment and meta_activity
- (ids): add/ids

### Fix

- **subscription**: fix stupid error
- **gtm**: add price in gtm
- **translation**: lol
- **dashboard**: correctly filter invoiceitem
- **login**: center login form
- **i18n**: import es locale for moment
- **i18n**: import es locale for moment
- **recurrence-booking**: open recurrence booking form when no booking selected
- **recurrence-booking**: open recurrence booking form when no booking selected
- **login**: center login form
- **timezone**: fix a bug when no timezone on offerlistv2
- **gtm**: add event on pre-checkout pages
- **check-in**: register on check-in app without pb
- **communication**: link smartlist commuinication to smartlist in back
- **communication**: fixes on member detail + order page
- **contract**: edit a contract to set a combo
- **subscription**: fix some modal on payment in marketplace
- **voucher**: format cts in subscription
- **timezone**: fix offer header
- **i18n**: add ireland bank account
- **timezone**: remove timezone reference in useless ref
- **timezone**: micro fix
- **quickfix**: random quickfix
- **payment-combo**: fix refresh error whenusing private-pass
- **rum**: disable rum bullshit
- **waiting-list**: register cancelled bookings on waiting-list
- **quickinvoice**: fix remove invoice item and UnevenInvoiceDialog float display
- **payment-method**: fetch payument methods only if valid member id
- **booking-revert**: set loading to false after action
- **random**: random fixes post-merge
- **random**: random fixes post-merge
- **random**: random fixes post-merge
- **payment-method**: fix some pb when registering sepa on mobile
- **offer-direct-payment**: remove abd infinite loading page
- **platform-billing**: show right price on platform invoice
- **payment-method**: disable payment-method switch on old subscription
- **offer-card**: show coach on offer-card
- **subscription**: pay on offerbooking page
- **payment-method**: better refresh of methods on subscription paymebnt form
- **subscription**: do not ask for payment on 0e subscription
- **payment-rule**: bug when 1 bonus in rules
- **payment-rule**: ability to par pallier
- **disable-offer**: show mass offer being disabled
- **booking-discard**: attempt to fix error message on refund booking
- **self-checkin**: do not show cancelled bookings in tablet
- **qf**: qffix
- **booking**: is_discardable is kind of broken
- **kube**: back to no-kube for security
- **stupidity**: so much stupidity
- **kube**: switch env
- **waitinglist**: allow 15 minutes delay
- **booking**: revert is_discardable
- **vod**: category proposed in marketplace are bounded to videos
- **sct**: localization of SCT
- **login**: change translation when email exists
- **flag**: england
- **localization**: remove la suisse from locale created
- **sentry**: fix versionning scheme on sentry
- **report**: bug
- **lint**: appbar
- **bookingnotifications**: fixed undefined
- **sentry**: change sourcemap url-prefix and version w/ sha
- **bookingstatistics**: fixed offer graph visuals in planning page

### Perf

- **email-tempaltes**: load templates only when dialog is open on membersummarycard
- **particlejs**: rmeove particlejs for error cleaning and perf

### feat

- **recurrent-booking**: add recurrent booking on member page and fix pagination
- **timezone**: add timezones in manager interface display
- **CashBook**: add report for cashBook
- **Member**: count objects in tabs
- **emails**: add checkbox for canceledBooking in sending emails
- **settings**: make editable the ios and adroids's urls
- **offercard**: reactivate button delete
- **subscription**: private pass (RDV) available for subscription
- **appbar**: user/menu
- (client): add-last-discard
- **change**: idds

### Refactor

- **ids**: add more ids
- **ids**: add more ids

### fix

- **cleanup**: can not unselect first offer + fix translation loading

## 42.9.0 (2020-08-18)

### Feat

- **invoice**: prompt for uneven invoices in offermanagement.component
- **widget**: share button for widget and calendar url
- **payment-pack**: limit purchase per payment-pack per member
- **payment-pack**: add day limitation
- **marketplace calendar**: added new theme settings to personalize the manager & customer calendars
- **SCT**: SCT localized

### Refactor

- **calendar**: clean a bit the UI

### Fix

- **language**: default language is english
- **payment**: block manager from payment pages

## 42.8.0 (2020-08-14)

### Feat

- **marketplace calendar**: added new theme settings to personalize the manager & customer calendars

## 42.7.0 (2020-08-13)

### Feat

- **invoice**: voucher for quick invoices

## 42.6.0 (2020-08-13)

### Feat

- **report**: add first privatebooking report

## 42.5.1 (2020-08-13)

### Fix

- **version**: fetch tag berfore running cz bump
- **version**: test bump versionning

## 42.5.0 (2020-08-13)

### Feat

- **face-id**: FaceID working on tablet interface

### feat

- **face-id**: working flow, UX to be improved (+member form)

## 42.14.0a1 (2020-11-08)

### Feat

- **release**: create release on gitlab

### Fix

- **release**: create prerelease suffix

## 42.13.0 (2020-11-08)

### Feat

- **exporthtml**: add button to export html file from email editor
- **subscription**: auto-set subscription 0€ to credit + display flat fee
- **booking-option**: disable notification on discard booking-option when converting as booking
- **booking-option**: disable notification on discard booking-option when converting as booking
- **partial-refund**: improve pack partial refund
- **partial-refund**: improve pack partial refund
- **subscription**: scheduled stop for subscriptions
- **subscription**: scheduled stop for subscriptions
- **menu**: denser responsive drawer nested menu item
- **menu**: denser responsive drawer nested menu item
- **phone**: translate phone in other countries
- **phone**: translate phone in other countries
- **smartlist**: add attendance option for BookingsFilters and BookingsNumberFilter
- **recurrence-rule**: add establishment in recurrence rule booking
- **smartlist**: add attendance option for BookingsFilters and BookingsNumberFilter
- **recurrence-rule**: add establishment in recurrence rule booking
- **gtm**: add gtm on custom login pages
- **offer**: restore offer button
- **mass_disable**: add background task for mass disable
- **communication-dialog**: add sms and email-template email
- **rum**: disable elasticsearch RUM
- **booking**: filter on recurrence-rule-booking-isnull
- **offer**: chose default view cancelled offer (manager space)
- **offer**: background task for offer edit and offer create
- **component birthday email**: add new component to birthday celebration email
- **booking**: add filter not cancelled
- **report**: addres/birthday in reports
- **notification-rule**: add invoice notif and waiting-list kick
- **dashboard**: new dashboard page
- **recurrent-booking**: add recurrent booking on member page and fix pagination
- **report**: add nb_offer and nb_offer_cancelled
- **background-task**: background task monitoring and background task for disabling/deleting offers
- **timezone**: return timezone_name in company onboarding
- **timezone**: handle multitimezone
- **bookingstatistics**: bookingStatistics filtered by offerFilters in calendar page
- **bookingnotification**: notify every attendance / absence / cancellation ... for booking notif
- **coupon**: add to subscription
- **refund**: more explicit refund message
- **booking-revert**: notify or not client about cancellation of their booking
- **sepa**: allow oneshot sepa payment
- **offer**: add recurrence rule for booking
- **offer-card**: show if was first booking w/ ★
- **bank-account**: support spanish bank accounts for companies
- **platform-billing**: add multiple payment methods
- **report**: add on spot payment report and add a button to generate it from cashbook
- **offer-card**: back more info on card
- **theme**: add general_terms_of_use
- **marketplace**: add an appbar w/ email+basket on payment pages
- **access-code**: add access codes to company onboarding
- **platform-billing**: add payment method even if no subscription/billing-group
- **platform-billing**: add new screen platform billing
- **member**: count objects in tabs
- **gtm**: add gtm in offer payment/booking page
- **emails**: add checkbox to send emails to canceled Bookings
- **settings**: make editable the ios and adroids's urls
- **subscription**: sort the subscription in manager interface
- **platform-billing**: basic plaformbilling setting page
- **payment-method**: save payment method
- **notification-rule**: disable and/or send copy to the company
- **bookingnotification**: booking notification form reorganization
- **smartlist**: private filters
- **smartlist**: bug basket date select
- **kube**: full switch to kubernetes servers
- **voucher**: add percent selector along price selector
- **offer**: reactivate delete button on offercard
- **reset-password**: propose help if reset password twice in 4h
- **subscription**: consumer can and must pay their credit subscrtipion
- **gtm**: add basketId on some missing gtm event
- **gtm**: add checkout-items to basket event, type on add-to-card events
- **vod**: pass give access to VOD
- **offeredit**: custom offer selection for recursive edit of similar offers
- **archive**: delete and restore coach/establshment even if future offers planned
- **nf525**: upload doc in settings for NF525
- **subscription**: allow 0e subscription w/ credit payment
- **subscription**: private-pass (RDV) subscription
- **apm**: first step testing instrumentation w/ elastic RUM
- test(producttour): add/ids
- **member**: terms and conditions in Member detail
- **client**: cancel-condition
- **associated coach api**: changed endpoint for create/update/link_email coach
- **idds**: chnage some idds
- **temp-password**: increase temp password validity to 1 week
- **bookingcreationnotification**: improved tooltips and form validation
- (fix): idds
- **bookingcreationnotification**: added booking notifications for establishment and meta_activity
- (ids): add/ids

### Fix

- **subscription**: fix stupid error
- **gtm**: add price in gtm
- **translation**: lol
- **dashboard**: correctly filter invoiceitem
- **login**: center login form
- **i18n**: import es locale for moment
- **i18n**: import es locale for moment
- **recurrence-booking**: open recurrence booking form when no booking selected
- **recurrence-booking**: open recurrence booking form when no booking selected
- **login**: center login form
- **timezone**: fix a bug when no timezone on offerlistv2
- **gtm**: add event on pre-checkout pages
- **check-in**: register on check-in app without pb
- **communication**: link smartlist commuinication to smartlist in back
- **communication**: fixes on member detail + order page
- **contract**: edit a contract to set a combo
- **subscription**: fix some modal on payment in marketplace
- **voucher**: format cts in subscription
- **timezone**: fix offer header
- **i18n**: add ireland bank account
- **timezone**: remove timezone reference in useless ref
- **timezone**: micro fix
- **quickfix**: random quickfix
- **payment-combo**: fix refresh error whenusing private-pass
- **rum**: disable rum bullshit
- **waiting-list**: register cancelled bookings on waiting-list
- **quickinvoice**: fix remove invoice item and UnevenInvoiceDialog float display
- **payment-method**: fetch payument methods only if valid member id
- **booking-revert**: set loading to false after action
- **random**: random fixes post-merge
- **random**: random fixes post-merge
- **random**: random fixes post-merge
- **payment-method**: fix some pb when registering sepa on mobile
- **offer-direct-payment**: remove abd infinite loading page
- **platform-billing**: show right price on platform invoice
- **payment-method**: disable payment-method switch on old subscription
- **offer-card**: show coach on offer-card
- **subscription**: pay on offerbooking page
- **payment-method**: better refresh of methods on subscription paymebnt form
- **subscription**: do not ask for payment on 0e subscription
- **payment-rule**: bug when 1 bonus in rules
- **payment-rule**: ability to par pallier
- **disable-offer**: show mass offer being disabled
- **booking-discard**: attempt to fix error message on refund booking
- **self-checkin**: do not show cancelled bookings in tablet
- **qf**: qffix
- **booking**: is_discardable is kind of broken
- **kube**: back to no-kube for security
- **stupidity**: so much stupidity
- **kube**: switch env
- **waitinglist**: allow 15 minutes delay
- **booking**: revert is_discardable
- **vod**: category proposed in marketplace are bounded to videos
- **sct**: localization of SCT
- **login**: change translation when email exists
- **flag**: england
- **localization**: remove la suisse from locale created
- **sentry**: fix versionning scheme on sentry
- **report**: bug
- **lint**: appbar
- **bookingnotifications**: fixed undefined
- **sentry**: change sourcemap url-prefix and version w/ sha
- **bookingstatistics**: fixed offer graph visuals in planning page

### Perf

- **email-tempaltes**: load templates only when dialog is open on membersummarycard
- **particlejs**: rmeove particlejs for error cleaning and perf

### feat

- **recurrent-booking**: add recurrent booking on member page and fix pagination
- **timezone**: add timezones in manager interface display
- **CashBook**: add report for cashBook
- **Member**: count objects in tabs
- **emails**: add checkbox for canceledBooking in sending emails
- **settings**: make editable the ios and adroids's urls
- **offercard**: reactivate button delete
- **subscription**: private pass (RDV) available for subscription
- **appbar**: user/menu
- (client): add-last-discard
- **change**: idds

### Refactor

- **ids**: add more ids
- **ids**: add more ids

### fix

- **cleanup**: can not unselect first offer + fix translation loading

## 42.9.0 (2020-08-18)

### Feat

- **invoice**: prompt for uneven invoices in offermanagement.component
- **widget**: share button for widget and calendar url
- **payment-pack**: limit purchase per payment-pack per member
- **payment-pack**: add day limitation
- **marketplace calendar**: added new theme settings to personalize the manager & customer calendars
- **SCT**: SCT localized

### Refactor

- **calendar**: clean a bit the UI

### Fix

- **language**: default language is english
- **payment**: block manager from payment pages

## 42.8.0 (2020-08-14)

### Feat

- **marketplace calendar**: added new theme settings to personalize the manager & customer calendars

## 42.7.0 (2020-08-13)

### Feat

- **invoice**: voucher for quick invoices

## 42.6.0 (2020-08-13)

### Feat

- **report**: add first privatebooking report

## 42.5.1 (2020-08-13)

### Fix

- **version**: fetch tag berfore running cz bump
- **version**: test bump versionning

## 42.5.0 (2020-08-13)

### Feat

- **face-id**: FaceID working on tablet interface

### feat

- **face-id**: working flow, UX to be improved (+member form)

## 42.14.0a0 (2020-11-08)

### Feat

- **release**: create release on gitlab

### Fix

- **release**: create prerelease suffix

## 42.13.0 (2020-11-08)

### Feat

- **exporthtml**: add button to export html file from email editor
- **subscription**: auto-set subscription 0€ to credit + display flat fee
- **booking-option**: disable notification on discard booking-option when converting as booking
- **booking-option**: disable notification on discard booking-option when converting as booking
- **partial-refund**: improve pack partial refund
- **partial-refund**: improve pack partial refund
- **subscription**: scheduled stop for subscriptions
- **subscription**: scheduled stop for subscriptions
- **menu**: denser responsive drawer nested menu item
- **menu**: denser responsive drawer nested menu item
- **phone**: translate phone in other countries
- **phone**: translate phone in other countries
- **smartlist**: add attendance option for BookingsFilters and BookingsNumberFilter
- **recurrence-rule**: add establishment in recurrence rule booking
- **smartlist**: add attendance option for BookingsFilters and BookingsNumberFilter
- **recurrence-rule**: add establishment in recurrence rule booking
- **gtm**: add gtm on custom login pages
- **offer**: restore offer button
- **mass_disable**: add background task for mass disable
- **communication-dialog**: add sms and email-template email
- **rum**: disable elasticsearch RUM
- **booking**: filter on recurrence-rule-booking-isnull
- **offer**: chose default view cancelled offer (manager space)
- **offer**: background task for offer edit and offer create
- **component birthday email**: add new component to birthday celebration email
- **booking**: add filter not cancelled
- **report**: addres/birthday in reports
- **notification-rule**: add invoice notif and waiting-list kick
- **dashboard**: new dashboard page
- **recurrent-booking**: add recurrent booking on member page and fix pagination
- **report**: add nb_offer and nb_offer_cancelled
- **background-task**: background task monitoring and background task for disabling/deleting offers
- **timezone**: return timezone_name in company onboarding
- **timezone**: handle multitimezone
- **bookingstatistics**: bookingStatistics filtered by offerFilters in calendar page
- **bookingnotification**: notify every attendance / absence / cancellation ... for booking notif
- **coupon**: add to subscription
- **refund**: more explicit refund message
- **booking-revert**: notify or not client about cancellation of their booking
- **sepa**: allow oneshot sepa payment
- **offer**: add recurrence rule for booking
- **offer-card**: show if was first booking w/ ★
- **bank-account**: support spanish bank accounts for companies
- **platform-billing**: add multiple payment methods
- **report**: add on spot payment report and add a button to generate it from cashbook
- **offer-card**: back more info on card
- **theme**: add general_terms_of_use
- **marketplace**: add an appbar w/ email+basket on payment pages
- **access-code**: add access codes to company onboarding
- **platform-billing**: add payment method even if no subscription/billing-group
- **platform-billing**: add new screen platform billing
- **member**: count objects in tabs
- **gtm**: add gtm in offer payment/booking page
- **emails**: add checkbox to send emails to canceled Bookings
- **settings**: make editable the ios and adroids's urls
- **subscription**: sort the subscription in manager interface
- **platform-billing**: basic plaformbilling setting page
- **payment-method**: save payment method
- **notification-rule**: disable and/or send copy to the company
- **bookingnotification**: booking notification form reorganization
- **smartlist**: private filters
- **smartlist**: bug basket date select
- **kube**: full switch to kubernetes servers
- **voucher**: add percent selector along price selector
- **offer**: reactivate delete button on offercard
- **reset-password**: propose help if reset password twice in 4h
- **subscription**: consumer can and must pay their credit subscrtipion
- **gtm**: add basketId on some missing gtm event
- **gtm**: add checkout-items to basket event, type on add-to-card events
- **vod**: pass give access to VOD
- **offeredit**: custom offer selection for recursive edit of similar offers
- **archive**: delete and restore coach/establshment even if future offers planned
- **nf525**: upload doc in settings for NF525
- **subscription**: allow 0e subscription w/ credit payment
- **subscription**: private-pass (RDV) subscription
- **apm**: first step testing instrumentation w/ elastic RUM
- test(producttour): add/ids
- **member**: terms and conditions in Member detail
- **client**: cancel-condition
- **associated coach api**: changed endpoint for create/update/link_email coach
- **idds**: chnage some idds
- **temp-password**: increase temp password validity to 1 week
- **bookingcreationnotification**: improved tooltips and form validation
- (fix): idds
- **bookingcreationnotification**: added booking notifications for establishment and meta_activity
- (ids): add/ids

### Fix

- **subscription**: fix stupid error
- **gtm**: add price in gtm
- **translation**: lol
- **dashboard**: correctly filter invoiceitem
- **login**: center login form
- **i18n**: import es locale for moment
- **i18n**: import es locale for moment
- **recurrence-booking**: open recurrence booking form when no booking selected
- **recurrence-booking**: open recurrence booking form when no booking selected
- **login**: center login form
- **timezone**: fix a bug when no timezone on offerlistv2
- **gtm**: add event on pre-checkout pages
- **check-in**: register on check-in app without pb
- **communication**: link smartlist commuinication to smartlist in back
- **communication**: fixes on member detail + order page
- **contract**: edit a contract to set a combo
- **subscription**: fix some modal on payment in marketplace
- **voucher**: format cts in subscription
- **timezone**: fix offer header
- **i18n**: add ireland bank account
- **timezone**: remove timezone reference in useless ref
- **timezone**: micro fix
- **quickfix**: random quickfix
- **payment-combo**: fix refresh error whenusing private-pass
- **rum**: disable rum bullshit
- **waiting-list**: register cancelled bookings on waiting-list
- **quickinvoice**: fix remove invoice item and UnevenInvoiceDialog float display
- **payment-method**: fetch payument methods only if valid member id
- **booking-revert**: set loading to false after action
- **random**: random fixes post-merge
- **random**: random fixes post-merge
- **random**: random fixes post-merge
- **payment-method**: fix some pb when registering sepa on mobile
- **offer-direct-payment**: remove abd infinite loading page
- **platform-billing**: show right price on platform invoice
- **payment-method**: disable payment-method switch on old subscription
- **offer-card**: show coach on offer-card
- **subscription**: pay on offerbooking page
- **payment-method**: better refresh of methods on subscription paymebnt form
- **subscription**: do not ask for payment on 0e subscription
- **payment-rule**: bug when 1 bonus in rules
- **payment-rule**: ability to par pallier
- **disable-offer**: show mass offer being disabled
- **booking-discard**: attempt to fix error message on refund booking
- **self-checkin**: do not show cancelled bookings in tablet
- **qf**: qffix
- **booking**: is_discardable is kind of broken
- **kube**: back to no-kube for security
- **stupidity**: so much stupidity
- **kube**: switch env
- **waitinglist**: allow 15 minutes delay
- **booking**: revert is_discardable
- **vod**: category proposed in marketplace are bounded to videos
- **sct**: localization of SCT
- **login**: change translation when email exists
- **flag**: england
- **localization**: remove la suisse from locale created
- **sentry**: fix versionning scheme on sentry
- **report**: bug
- **lint**: appbar
- **bookingnotifications**: fixed undefined
- **sentry**: change sourcemap url-prefix and version w/ sha
- **bookingstatistics**: fixed offer graph visuals in planning page

### Perf

- **email-tempaltes**: load templates only when dialog is open on membersummarycard
- **particlejs**: rmeove particlejs for error cleaning and perf

### feat

- **recurrent-booking**: add recurrent booking on member page and fix pagination
- **timezone**: add timezones in manager interface display
- **CashBook**: add report for cashBook
- **Member**: count objects in tabs
- **emails**: add checkbox for canceledBooking in sending emails
- **settings**: make editable the ios and adroids's urls
- **offercard**: reactivate button delete
- **subscription**: private pass (RDV) available for subscription
- **appbar**: user/menu
- (client): add-last-discard
- **change**: idds

### Refactor

- **ids**: add more ids
- **ids**: add more ids

### fix

- **cleanup**: can not unselect first offer + fix translation loading

## 42.9.0 (2020-08-18)

### Feat

- **invoice**: prompt for uneven invoices in offermanagement.component
- **widget**: share button for widget and calendar url
- **payment-pack**: limit purchase per payment-pack per member
- **payment-pack**: add day limitation
- **marketplace calendar**: added new theme settings to personalize the manager & customer calendars
- **SCT**: SCT localized

### Refactor

- **calendar**: clean a bit the UI

### Fix

- **language**: default language is english
- **payment**: block manager from payment pages

## 42.8.0 (2020-08-14)

### Feat

- **marketplace calendar**: added new theme settings to personalize the manager & customer calendars

## 42.7.0 (2020-08-13)

### Feat

- **invoice**: voucher for quick invoices

## 42.6.0 (2020-08-13)

### Feat

- **report**: add first privatebooking report

## 42.5.1 (2020-08-13)

### Fix

- **version**: fetch tag berfore running cz bump
- **version**: test bump versionning

## 42.5.0 (2020-08-13)

### Feat

- **face-id**: FaceID working on tablet interface
- **offer-edit**: allow single offer change of coach/establishment
- **report**: add metaactivity/privatebooking reports

### feat

- **face-id**: working flow, UX to be improved (+member form)

### Fix

- **show-more**: fix design show-more

## 2020-08-13-12-47-26 (2020-08-13)

### Fix

- **offer-edit**: fix time as not 24h but AM/PM bug
- **staging**: disabled fake feature on staging

### Feat

- **intercom**: enabled on dev environment

## 2020-08-12-17-11-52 (2020-08-12)

### Fix

- **offer-edit**: fix form in schedule

## 2020-08-12-10-47-40 (2020-08-12)

### Fix

- **subscription**: date start OK for subscritpion

## 2020-08-12-00-48-46 (2020-08-12)

### Feat

- **offer-edit**: enable metaactivity change

## 2020-08-12-00-09-40 (2020-08-11)

### Fix

- **offer**: date recurrence offer
- **changelog**: typo in script, bump minor version for testing purpose

## 2020-08-10-02-48-26 (2020-08-10)

### Fix

- **offer-form**: replace deprecated datetime input
- **changelog**: typo in script, bump minor version for testing purpose
- **offer-form**: replace deprecated datetime input
- **changelog**: typo in script, bump minor version for testing purpose
- **offer-form**: replace deprecated datetime input

## 42.12.0 (2020-11-08)

### Feat

- **exporthtml**: add button to export html file from email editor
- **subscription**: auto-set subscription 0€ to credit + display flat fee
- **booking-option**: disable notification on discard booking-option when converting as booking
- **booking-option**: disable notification on discard booking-option when converting as booking
- **partial-refund**: improve pack partial refund
- **partial-refund**: improve pack partial refund
- **subscription**: scheduled stop for subscriptions
- **subscription**: scheduled stop for subscriptions
- **menu**: denser responsive drawer nested menu item
- **menu**: denser responsive drawer nested menu item
- **phone**: translate phone in other countries
- **phone**: translate phone in other countries
- **smartlist**: add attendance option for BookingsFilters and BookingsNumberFilter
- **recurrence-rule**: add establishment in recurrence rule booking
- **smartlist**: add attendance option for BookingsFilters and BookingsNumberFilter
- **recurrence-rule**: add establishment in recurrence rule booking
- **gtm**: add gtm on custom login pages
- **offer**: restore offer button
- **mass_disable**: add background task for mass disable
- **communication-dialog**: add sms and email-template email
- **rum**: disable elasticsearch RUM
- **booking**: filter on recurrence-rule-booking-isnull
- **offer**: chose default view cancelled offer (manager space)
- **offer**: background task for offer edit and offer create
- **component birthday email**: add new component to birthday celebration email
- **booking**: add filter not cancelled
- **report**: addres/birthday in reports
- **notification-rule**: add invoice notif and waiting-list kick
- **dashboard**: new dashboard page
- **recurrent-booking**: add recurrent booking on member page and fix pagination
- **report**: add nb_offer and nb_offer_cancelled
- **background-task**: background task monitoring and background task for disabling/deleting offers
- **timezone**: return timezone_name in company onboarding
- **timezone**: handle multitimezone
- **bookingstatistics**: bookingStatistics filtered by offerFilters in calendar page
- **bookingnotification**: notify every attendance / absence / cancellation ... for booking notif
- **coupon**: add to subscription
- **refund**: more explicit refund message
- **booking-revert**: notify or not client about cancellation of their booking
- **sepa**: allow oneshot sepa payment
- **offer**: add recurrence rule for booking
- **offer-card**: show if was first booking w/ ★
- **bank-account**: support spanish bank accounts for companies
- **platform-billing**: add multiple payment methods
- **report**: add on spot payment report and add a button to generate it from cashbook
- **offer-card**: back more info on card
- **theme**: add general_terms_of_use
- **marketplace**: add an appbar w/ email+basket on payment pages
- **access-code**: add access codes to company onboarding
- **platform-billing**: add payment method even if no subscription/billing-group
- **platform-billing**: add new screen platform billing
- **member**: count objects in tabs
- **gtm**: add gtm in offer payment/booking page
- **emails**: add checkbox to send emails to canceled Bookings
- **settings**: make editable the ios and adroids's urls
- **subscription**: sort the subscription in manager interface
- **platform-billing**: basic plaformbilling setting page
- **payment-method**: save payment method
- **notification-rule**: disable and/or send copy to the company
- **bookingnotification**: booking notification form reorganization
- **smartlist**: private filters
- **smartlist**: bug basket date select
- **kube**: full switch to kubernetes servers
- **voucher**: add percent selector along price selector
- **offer**: reactivate delete button on offercard
- **reset-password**: propose help if reset password twice in 4h
- **subscription**: consumer can and must pay their credit subscrtipion
- **gtm**: add basketId on some missing gtm event
- **gtm**: add checkout-items to basket event, type on add-to-card events
- **vod**: pass give access to VOD

### Fix

- **subscription**: fix stupid error
- **gtm**: add price in gtm
- **translation**: lol
- **dashboard**: correctly filter invoiceitem
- **login**: center login form
- **i18n**: import es locale for moment
- **i18n**: import es locale for moment
- **recurrence-booking**: open recurrence booking form when no booking selected
- **recurrence-booking**: open recurrence booking form when no booking selected
- **login**: center login form
- **timezone**: fix a bug when no timezone on offerlistv2
- **gtm**: add event on pre-checkout pages
- **check-in**: register on check-in app without pb
- **communication**: link smartlist commuinication to smartlist in back
- **communication**: fixes on member detail + order page
- **contract**: edit a contract to set a combo
- **subscription**: fix some modal on payment in marketplace
- **voucher**: format cts in subscription
- **timezone**: fix offer header
- **i18n**: add ireland bank account
- **timezone**: remove timezone reference in useless ref
- **timezone**: micro fix
- **quickfix**: random quickfix
- **payment-combo**: fix refresh error whenusing private-pass
- **rum**: disable rum bullshit
- **waiting-list**: register cancelled bookings on waiting-list
- **quickinvoice**: fix remove invoice item and UnevenInvoiceDialog float display
- **payment-method**: fetch payument methods only if valid member id
- **booking-revert**: set loading to false after action
- **random**: random fixes post-merge
- **random**: random fixes post-merge
- **random**: random fixes post-merge
- **payment-method**: fix some pb when registering sepa on mobile
- **offer-direct-payment**: remove abd infinite loading page
- **platform-billing**: show right price on platform invoice
- **payment-method**: disable payment-method switch on old subscription
- **offer-card**: show coach on offer-card
- **subscription**: pay on offerbooking page
- **payment-method**: better refresh of methods on subscription paymebnt form
- **subscription**: do not ask for payment on 0e subscription
- **payment-rule**: bug when 1 bonus in rules
- **payment-rule**: ability to par pallier
- **disable-offer**: show mass offer being disabled
- **booking-discard**: attempt to fix error message on refund booking
- **self-checkin**: do not show cancelled bookings in tablet
- **qf**: qffix
- **booking**: is_discardable is kind of broken
- **kube**: back to no-kube for security
- **stupidity**: so much stupidity
- **kube**: switch env
- **waitinglist**: allow 15 minutes delay
- **booking**: revert is_discardable
- **vod**: category proposed in marketplace are bounded to videos
- **sct**: localization of SCT

### Perf

- **email-tempaltes**: load templates only when dialog is open on membersummarycard
- **particlejs**: rmeove particlejs for error cleaning and perf

### feat

- **recurrent-booking**: add recurrent booking on member page and fix pagination
- **timezone**: add timezones in manager interface display
- **CashBook**: add report for cashBook
- **Member**: count objects in tabs
- **emails**: add checkbox for canceledBooking in sending emails
- **settings**: make editable the ios and adroids's urls
- **offercard**: reactivate button delete

### Refactor

- **ids**: add more ids
- **ids**: add more ids

## 42.11.0 (2020-08-24)

### Feat

- **offeredit**: custom offer selection for recursive edit of similar offers
- **archive**: delete and restore coach/establshment even if future offers planned
- **nf525**: upload doc in settings for NF525
- **subscription**: allow 0e subscription w/ credit payment
- **subscription**: private-pass (RDV) subscription
- **apm**: first step testing instrumentation w/ elastic RUM
- test(producttour): add/ids

### fix

- **cleanup**: can not unselect first offer + fix translation loading

### Fix

- **login**: change translation when email exists
- **flag**: england
- **localization**: remove la suisse from locale created
- **sentry**: fix versionning scheme on sentry
- **report**: bug
- **lint**: appbar

### feat

- **subscription**: private pass (RDV) available for subscription
- **appbar**: user/menu

## 42.10.0 (2020-08-21)

### Fix

- **sentry**: fix versionning scheme on sentry
- **bookingnotifications**: fixed undefined
- **sentry**: change sourcemap url-prefix and version w/ sha
- **bookingstatistics**: fixed offer graph visuals in planning page

### Feat

- **apm**: first step testing instrumentation w/ elastic RUM
- **member**: terms and conditions in Member detail
- **client**: cancel-condition
- **associated coach api**: changed endpoint for create/update/link_email coach
- **idds**: chnage some idds
- **temp-password**: increase temp password validity to 1 week
- **bookingcreationnotification**: improved tooltips and form validation
- (fix): idds
- **bookingcreationnotification**: added booking notifications for establishment and meta_activity
- (ids): add/ids

### feat

- (client): add-last-discard
- **change**: idds

## 42.9.0 (2020-08-18)

### Feat

- **invoice**: prompt for uneven invoices in offermanagement.component
- **widget**: share button for widget and calendar url
- **payment-pack**: limit purchase per payment-pack per member
- **payment-pack**: add day limitation
- **marketplace calendar**: added new theme settings to personalize the manager & customer calendars
- **SCT**: SCT localized

### Refactor

- **calendar**: clean a bit the UI

### Fix

- **language**: default language is english
- **payment**: block manager from payment pages

## 42.8.0 (2020-08-14)

### Feat

- **marketplace calendar**: added new theme settings to personalize the manager & customer calendars

## 42.7.0 (2020-08-13)

### Feat

- **invoice**: voucher for quick invoices

## 42.6.0 (2020-08-13)

### Feat

- **report**: add first privatebooking report

## 42.5.1 (2020-08-13)

### Fix

- **version**: fetch tag berfore running cz bump
- **version**: test bump versionning

## 42.5.0 (2020-08-13)

### Feat

- **face-id**: FaceID working on tablet interface
- **offer-edit**: allow single offer change of coach/establishment
- **report**: add metaactivity/privatebooking reports

### feat

- **face-id**: working flow, UX to be improved (+member form)

### Fix

- **show-more**: fix design show-more

## 2020-08-13-12-47-26 (2020-08-13)

### Fix

- **offer-edit**: fix time as not 24h but AM/PM bug
- **staging**: disabled fake feature on staging

### Feat

- **intercom**: enabled on dev environment

## 2020-08-12-17-11-52 (2020-08-12)

### Fix

- **offer-edit**: fix form in schedule

## 2020-08-12-10-47-40 (2020-08-12)

### Fix

- **subscription**: date start OK for subscritpion

## 2020-08-12-00-48-46 (2020-08-12)

### Feat

- **offer-edit**: enable metaactivity change

## 2020-08-12-00-09-40 (2020-08-11)

### Fix

- **offer**: date recurrence offer
- **changelog**: typo in script, bump minor version for testing purpose

## 2020-08-10-02-48-26 (2020-08-10)

### Fix

- **offer-form**: replace deprecated datetime input
- **changelog**: typo in script, bump minor version for testing purpose
- **offer-form**: replace deprecated datetime input
- **changelog**: typo in script, bump minor version for testing purpose
- **offer-form**: replace deprecated datetime input

## 2020-07-29-10-34-09 (2020-07-29)

## 2020-07-28-16-44-23 (2020-07-28)

### Fix

- **recurrent booking**: fix recurrent booking manager when using unlimited pass

## 2020-07-28-14-47-57 (2020-07-28)

### Fix

- **role**: forgotten role type file
- **intercom**: company name/id correctly pushed to intercom API

### Feat

- **role**: define lastname nd lastname when defining roles

## 2020-07-28-14-10-48 (2020-07-28)

### Feat

- **intercom**: add company name in intercom based on theme

## 2020-07-28-10-52-47 (2020-07-28)

## 2020-07-27-16-10-33 (2020-07-27)

## 2020-07-27-12-24-02 (2020-07-27)

## 2020-07-27-10-52-47 (2020-07-27)

## 2020-07-26-18-47-23 (2020-07-26)

## 2020-07-26-16-31-38 (2020-07-26)

## 2020-07-26-04-16-19 (2020-07-26)

## 2020-07-25-22-54-58 (2020-07-25)

## 2020-07-25-03-28-59 (2020-07-25)

## 2020-07-25-02-54-35 (2020-07-25)

## 2020-07-25-02-06-27 (2020-07-24)

## 2020-07-24-23-32-57 (2020-07-24)

## 2020-07-24-13-06-05 (2020-07-24)

## 2020-07-24-03-43-48 (2020-07-24)

## 2020-07-23-16-33-17 (2020-07-23)

## 2020-07-22-15-11-47 (2020-07-22)

## 2020-07-21-16-07-31 (2020-07-21)

## 2020-07-21-11-55-15 (2020-07-20)

## 2020-07-20-03-43-53 (2020-07-20)

## 2020-07-20-03-25-45 (2020-07-20)

## 2020-07-20-02-42-42 (2020-07-19)

## 2020-07-16-19-02-24 (2020-07-16)

## 2020-07-16-17-33-32 (2020-07-16)

## 2020-07-16-02-49-41 (2020-07-16)

## 2020-07-16-02-28-15 (2020-07-16)

## 2020-07-15-18-43-52 (2020-07-15)

## 2020-07-15-17-39-12 (2020-07-15)

## 2020-07-15-16-15-34 (2020-07-15)

## 2020-07-15-15-17-32 (2020-07-15)

## 2020-07-15-00-02-58 (2020-07-14)

## 2020-07-12-03-41-22 (2020-07-12)

## 2020-07-11-20-04-47 (2020-07-11)

## 2020-07-11-19-50-25 (2020-07-11)

## 2020-07-10-04-39-48 (2020-07-10)

## 2020-07-09-04-31-00 (2020-07-09)

## 2020-07-09-03-34-54 (2020-07-09)

## 2020-07-08-16-48-39 (2020-07-08)

## 2020-07-08-16-05-03 (2020-07-08)

## 2020-07-08-14-48-29 (2020-07-08)

## 2020-07-08-12-34-25 (2020-07-08)

## 2020-07-08-03-20-12 (2020-07-08)

## 2020-07-07-12-42-26 (2020-07-07)

## 2020-07-01-16-13-58 (2020-07-01)

## 2020-06-30-20-32-25 (2020-06-30)

## 2020-06-29-13-23-09 (2020-06-29)

## 2020-06-27-20-08-37 (2020-06-27)

## 2020-06-27-04-41-33 (2020-06-27)

## 2020-06-26-16-00-55 (2020-06-26)

## 2020-06-26-11-07-26 (2020-06-25)

## 2020-06-24-16-23-23 (2020-06-24)

## 2020-06-23-16-29-27 (2020-06-23)

## 2020-06-23-02-41-16 (2020-06-23)

## 2020-06-21-12-43-25 (2020-06-21)

## 2020-06-20-21-40-11 (2020-06-20)

## 2020-06-17-10-25-01 (2020-06-17)

## 2020-06-17-02-18-25 (2020-06-17)

## 2020-06-16-01-15-42 (2020-06-16)

## 2020-06-15-19-30-13 (2020-06-15)

## 2020-06-15-16-03-35 (2020-06-15)

## 2020-06-15-11-27-01 (2020-06-15)

## 2020-06-15-10-07-38 (2020-06-15)

## 2020-06-15-03-02-48 (2020-06-15)

## 2020-06-12-02-04-19 (2020-06-11)

## 2020-06-11-14-21-33 (2020-06-11)

## 2020-06-11-02-14-14 (2020-06-11)

## 2020-06-10-21-56-32 (2020-06-10)

## 2020-06-08-20-02-43 (2020-06-08)

## 2020-06-08-19-39-44 (2020-06-08)

## 2020-06-08-12-26-52 (2020-06-08)

## 2020-06-08-11-56-09 (2020-06-08)

## 2020-06-08-01-48-19 (2020-06-08)

## 2020-06-07-05-30-29 (2020-06-07)

## 2020-06-06-20-13-27 (2020-06-06)

## 2020-06-03-18-06-13 (2020-06-03)

## 2020-06-03-03-01-02 (2020-06-03)

## 2020-06-03-02-13-18 (2020-06-03)

## 2020-06-02-18-07-08 (2020-06-02)

## 2020-06-02-16-04-03 (2020-06-02)

## 2020-06-01-23-51-20 (2020-06-01)

## 2020-06-01-23-30-35 (2020-06-01)

## 2020-06-01-02-05-25 (2020-06-01)

## 2020-05-30-04-58-18 (2020-05-30)

## 2020-05-29-03-07-40 (2020-05-29)

## 2020-05-28-21-28-06 (2020-05-28)

## 2020-05-28-00-27-05 (2020-05-28)

## 2020-05-27-13-43-12 (2020-05-27)

## 2020-05-27-13-31-28 (2020-05-27)

## 2020-05-27-00-17-38 (2020-05-26)

## 2020-05-26-11-39-04 (2020-05-26)

## 2020-05-26-01-49-45 (2020-05-26)

## 2020-05-26-01-18-29 (2020-05-26)

## 2020-05-25-03-40-08 (2020-05-25)

## 2020-05-25-02-47-38 (2020-05-25)

## 2020-05-20-02-34-01 (2020-05-19)

## 2020-05-19-00-28-43 (2020-05-19)

## 2020-05-18-14-22-18 (2020-05-18)

## 2020-05-18-14-14-08 (2020-05-18)

## 2020-05-17-13-16-50 (2020-05-17)

## 2020-05-17-00-05-49 (2020-05-17)

## 2020-05-15-16-47-29 (2020-05-13)

## 2020-05-13-10-56-59 (2020-05-13)

## 2020-05-12-14-32-11 (2020-05-12)

## 2020-05-12-12-43-18 (2020-05-12)

## 2020-05-12-04-23-15 (2020-05-12)

## 2020-05-12-00-33-54 (2020-05-12)

## 2020-05-10-00-20-47 (2020-05-10)

## 2020-05-09-23-19-28 (2020-05-09)

## 2020-05-09-19-08-11 (2020-05-09)

## 2020-05-09-17-55-51 (2020-05-09)

## 2020-05-09-16-38-31 (2020-05-09)

## 2020-05-09-03-31-02 (2020-05-09)

## 2020-05-09-02-19-29 (2020-05-09)

## 2020-05-08-17-20-22 (2020-05-08)

## 2020-05-08-02-58-15 (2020-05-08)

## 2020-05-06-11-04-04 (2020-05-06)

## 2020-05-06-00-46-56 (2020-05-06)

## 2020-05-05-01-56-08 (2020-05-05)

## 2020-05-01-13-20-04 (2020-05-01)

## 2020-05-01-02-12-23 (2020-05-01)

## 2020-04-29-14-20-16 (2020-04-28)

## 2020-04-27-22-57-35 (2020-04-27)

## 2020-04-27-00-17-24 (2020-04-27)

## 2020-04-25-00-15-12 (2020-04-25)

## 2020-04-24-02-42-02 (2020-04-24)

## 2020-04-23-02-17-46 (2020-04-23)

## 2020-04-20-01-52-03 (2020-04-20)

## 2020-04-17-14-20-22 (2020-04-17)

## 2020-04-17-01-48-21 (2020-04-17)

## 2020-04-15-20-35-47 (2020-04-15)

## 2020-04-15-19-46-54 (2020-04-15)

## 2020-04-15-17-04-58 (2020-04-15)

## 2020-04-15-14-50-32 (2020-04-15)

## 2020-04-15-02-58-00 (2020-04-15)

## 2020-04-14-02-00-03 (2020-04-13)

## 2020-04-13-00-59-58 (2020-04-13)

## 2020-04-11-02-10-44 (2020-04-11)

## 2020-04-11-01-59-22 (2020-04-11)

## 2020-04-11-01-42-00 (2020-04-10)

## 2020-04-08-01-34-09 (2020-04-08)

## 2020-03-29-23-49-12 (2020-03-29)

## 2020-03-28-12-15-32 (2020-03-28)

## 2020-03-26-01-41-32 (2020-03-25)

## 2020-03-25-12-49-18 (2020-03-25)

## 2020-03-25-12-28-52 (2020-03-25)

## 2020-03-25-01-47-41 (2020-03-25)

## 2020-03-25-01-30-32 (2020-03-25)

## 2020-03-21-00-43-00 (2020-03-21)

## 2020-03-18-17-50-02 (2020-03-18)

## 2020-03-18-17-04-11 (2020-03-18)

## 2020-03-18-15-19-00 (2020-03-18)

## 2020-03-17-20-56-22 (2020-03-17)

## 2020-03-17-18-48-32 (2020-03-17)

## 2020-03-17-18-37-32 (2020-03-17)

## 2020-03-17-16-50-46 (2020-03-17)

## 2020-03-17-11-42-17 (2020-03-17)

## 2020-03-15-14-16-18 (2020-03-15)

## 2020-03-14-13-07-05 (2020-03-14)

## 2020-03-14-02-03-42 (2020-03-13)

## 2020-03-12-02-09-17 (2020-03-12)

## 2020-03-11-00-00-38 (2020-03-10)

## 2020-03-10-23-11-16 (2020-03-10)

## 2020-03-10-01-03-02 (2020-03-10)

## 2020-03-04-01-39-14 (2020-03-03)

## 2020-02-28-03-29-01 (2020-02-28)

## 2020-02-27-04-22-04 (2020-02-26)

## 2020-02-26-13-06-46 (2020-02-26)

## 2020-02-26-01-20-17 (2020-02-26)

## 2020-02-24-02-15-17 (2020-02-24)

## 2020-02-24-02-00-12 (2020-02-24)

## 2020-02-22-16-32-21 (2020-02-22)

## 2020-02-21-17-37-56 (2020-02-21)

## 2020-02-21-17-09-29 (2020-02-21)

## 2020-02-21-16-53-25 (2020-02-21)

## 2020-02-19-15-28-54 (2020-02-19)

## 2020-02-19-04-36-18 (2020-02-19)

## 2020-02-19-04-09-30 (2020-02-19)

## 2020-02-16-21-14-27 (2020-02-16)

## 2020-02-16-14-38-31 (2020-02-16)

## 2020-02-16-13-52-25 (2020-02-16)

## 2020-02-16-02-20-30 (2020-02-16)

## 2020-02-15-13-06-27 (2020-02-15)

## 2020-02-02-14-58-16 (2020-02-02)

## 2020-01-31-16-40-37 (2020-01-31)

## 2020-01-31-03-08-07 (2020-01-31)

## 2020-01-31-02-32-52 (2020-01-31)

## 2020-01-29-18-01-40 (2020-01-29)

## 2020-01-28-13-00-18 (2020-01-28)

## 2020-01-27-13-02-09 (2020-01-27)

## 2020-01-27-11-31-30 (2020-01-27)

## 2020-01-27-04-06-40 (2020-01-27)

## 2020-01-27-01-55-24 (2020-01-27)

## 2020-01-25-01-59-15 (2020-01-25)

## 2020-01-24-14-39-55 (2020-01-24)

## 2020-01-24-02-34-49 (2020-01-24)

## 2020-01-24-02-21-29 (2020-01-24)

## 2020-01-22-14-27-49 (2020-01-22)

## 2020-01-22-13-34-35 (2020-01-22)

## 2020-01-22-05-50-25 (2020-01-22)

## 2020-01-22-04-14-24 (2020-01-22)

## 2020-01-22-03-58-05 (2020-01-22)

## 2020-01-22-03-22-33 (2020-01-22)

## 2020-01-22-03-07-37 (2020-01-22)

## 2020-01-17-00-10-34 (2020-01-16)

## 2020-01-16-04-54-34 (2020-01-16)

## 2020-01-16-04-48-33 (2020-01-16)

## 2020-01-13-15-21-20 (2020-01-13)

## 2020-01-13-13-07-09 (2020-01-13)

## 2020-01-13-12-57-10 (2020-01-13)

## 2020-01-08-04-30-07 (2020-01-08)

## 2020-01-08-04-08-16 (2020-01-08)

## 2020-01-08-03-31-18 (2020-01-08)

## 2020-01-06-03-06-50 (2020-01-06)

## 2020-01-04-13-37-04 (2020-01-04)

## 2020-01-04-13-19-53 (2020-01-04)

## 2020-01-03-12-27-09 (2020-01-03)

## 2020-01-03-00-58-23 (2020-01-03)

## 2020-01-02-11-36-17 (2020-01-01)

## 2019-12-31-19-45-40 (2019-12-31)

## 2019-12-30-04-37-56 (2019-12-30)

## 2019-12-30-03-08-16 (2019-12-30)

## 2019-12-27-08-57-01 (2019-12-27)

## 2019-12-27-04-25-39 (2019-12-27)

## 2019-12-27-04-06-55 (2019-12-27)

## 2019-12-27-03-51-03 (2019-12-26)

## 2019-12-26-01-19-05 (2019-12-24)

## 2019-12-24-00-54-38 (2019-12-24)

## 2019-12-24-00-17-14 (2019-12-24)

## 2019-12-22-02-41-47 (2019-12-22)

## 2019-12-22-02-32-58 (2019-12-22)

## 2019-12-21-10-50-30 (2019-12-21)

## 2019-12-20-16-58-13 (2019-12-20)

## 2019-12-20-13-30-15 (2019-12-20)

## 2019-12-20-12-00-01 (2019-12-20)

## 2019-12-18-06-55-58 (2019-12-18)

## 2019-12-18-06-40-41 (2019-12-18)

## 2019-12-18-05-35-53 (2019-12-18)

## 2019-12-13-14-59-23 (2019-12-13)

## 2019-12-13-10-38-36 (2019-12-13)

## 2019-12-12-09-40-43 (2019-12-12)

## 2019-12-12-03-22-12 (2019-12-12)

## 2019-12-02-17-24-08 (2019-12-02)

## 2019-12-02-11-01-15 (2019-12-02)

## 2019-11-28-02-07-28 (2019-11-28)

## 2019-11-27-05-39-05 (2019-11-27)

## 2019-11-27-04-59-42 (2019-11-27)

## 2019-11-27-04-51-12 (2019-11-27)

## 2019-11-27-02-41-48 (2019-11-27)

## 2019-11-25-02-44-42 (2019-11-25)

## 2019-11-20-11-29-02 (2019-11-20)

## 2019-11-19-02-32-28 (2019-11-19)

## 2019-11-19-01-47-17 (2019-11-19)

## 2019-11-18-03-50-53 (2019-11-17)

## 2019-11-16-06-02-17 (2019-11-16)

## 2019-11-14-13-43-49 (2019-11-14)

## 2019-11-13-13-09-05 (2019-11-13)

## 2019-11-07-02-46-26 (2019-11-07)

## 2019-11-07-02-23-25 (2019-11-07)

## 2019-11-07-01-24-13 (2019-11-06)

## 2019-11-04-11-18-12 (2019-11-04)

## 2019-11-04-03-45-12 (2019-11-04)

## 2019-10-29-01-13-46 (2019-10-29)

## 2019-10-28-03-39-06 (2019-10-28)

## 2019-10-27-04-47-17 (2019-10-27)

## 2019-10-26-17-17-30 (2019-10-26)

## 2019-10-23-14-54-11 (2019-10-23)

## 2019-10-23-09-58-55 (2019-10-23)

## 2019-10-21-12-35-57 (2019-10-21)

## 2019-10-21-02-19-29 (2019-10-21)

## 2019-10-20-05-00-57 (2019-10-20)

## 2019-10-18-17-15-29 (2019-10-18)

## 2019-10-18-03-26-16 (2019-10-18)

## 2019-10-18-00-41-34 (2019-10-18)

## 2019-10-17-08-25-13 (2019-10-17)

## 2019-10-15-12-52-25 (2019-10-15)

## 2019-10-15-12-33-51 (2019-10-15)

## 2019-10-15-02-40-02 (2019-10-15)

## 2019-10-15-02-22-53 (2019-10-15)

## 2019-10-14-15-41-12 (2019-10-14)

## 2019-10-14-04-46-31 (2019-10-14)

## 2019-10-14-01-55-10 (2019-10-13)

## 2019-10-13-06-58-32 (2019-10-13)

## 2019-10-12-17-22-29 (2019-10-12)

## 2019-10-12-17-13-10 (2019-10-12)

## 2019-10-09-01-51-22 (2019-10-08)

## 2019-10-06-02-44-45 (2019-10-06)

## 2019-10-05-01-49-00 (2019-10-04)

## 2019-10-03-17-47-10 (2019-10-03)

## 2019-10-03-17-00-56 (2019-10-03)

## 2019-10-03-15-50-54 (2019-10-03)

## 2019-10-03-13-14-25 (2019-10-03)

## 2019-10-03-01-52-48 (2019-10-02)

## 2019-09-30-02-42-41 (2019-09-30)

## 2019-09-30-00-04-40 (2019-09-29)

## 2019-09-29-01-23-36 (2019-09-29)

## 2019-09-28-21-11-11 (2019-09-28)

## 2019-09-28-04-09-39 (2019-09-28)

## 2019-09-28-03-52-49 (2019-09-28)

## 2019-09-28-03-18-16 (2019-09-28)

## 2019-09-27-15-56-50 (2019-09-27)

## 2019-09-27-14-15-11 (2019-09-27)

## 2019-09-25-14-38-54 (2019-09-25)

## 2019-09-25-13-15-08 (2019-09-25)

## 2019-09-25-02-33-40 (2019-09-25)

## 2019-09-24-02-09-16 (2019-09-24)

## 2019-09-23-02-19-31 (2019-09-23)

## 2019-09-23-01-24-07 (2019-09-23)

## 2019-09-18-11-51-20 (2019-09-18)

## 2019-09-18-02-09-14 (2019-09-18)

## 2019-09-18-02-01-13 (2019-09-18)

## 2019-09-13-11-46-40 (2019-09-13)

## 2019-09-13-00-56-01 (2019-09-12)

## 2019-09-11-03-16-25 (2019-09-11)

## 2019-09-11-02-46-46 (2019-09-11)

## 2019-09-10-12-18-07 (2019-09-10)

## 2019-09-09-03-42-41 (2019-09-09)

## 2019-09-09-03-32-01 (2019-09-09)

## 2019-09-09-02-04-57 (2019-09-09)

## 2019-09-09-00-57-21 (2019-09-08)

## 2019-09-08-02-23-14 (2019-09-08)

## 2019-09-08-01-51-20 (2019-09-08)

## 2019-09-08-01-39-45 (2019-09-08)

## 2019-09-08-01-30-45 (2019-09-08)

## 2019-09-02-03-41-39 (2019-09-02)

## 2019-08-27-02-05-40 (2019-08-27)

## 2019-08-25-02-55-27 (2019-08-25)

## 2019-08-15-18-37-06 (2019-08-15)

## 2019-08-15-17-38-21 (2019-08-15)

## 2019-04-24-15-06-39 (2019-04-24)

## 2019-04-24-14-41-52 (2019-04-24)

## 2019-04-24-12-33-59 (2019-04-24)

## 2019-04-24-09-35-04 (2019-04-24)

## 2019-04-24-03-47-09 (2019-04-24)

## 2019-04-24-03-30-22 (2019-04-24)

## 2019-04-23-19-48-06 (2019-04-23)

## 2019-04-23-19-38-12 (2019-04-23)

## 2019-04-23-16-35-07 (2019-04-23)

## 2019-04-23-14-00-08 (2019-04-23)

## 2019-04-22-23-45-17 (2019-04-22)

## 2019-04-22-21-53-49 (2019-04-22)

## 2019-04-22-18-16-55 (2019-04-22)

## 2019-04-22-16-55-56 (2019-04-22)

## 2019-04-22-16-39-19 (2019-04-22)

## 2019-04-22-16-20-31 (2019-04-22)

## 2019-04-22-14-07-19 (2019-04-22)

## 2019-04-22-11-43-48 (2019-04-22)

## 2019-04-22-11-40-20 (2019-04-22)

## 2019-04-22-11-25-30 (2019-04-22)

## 2019-04-22-05-45-39 (2019-04-22)

## 2019-04-22-03-07-01 (2019-04-22)

## 2019-04-20-01-52-42 (2019-04-20)

## 2019-04-18-05-15-00 (2019-04-18)

## 2019-04-18-04-32-00 (2019-04-18)

## 2019-04-18-04-22-32 (2019-04-18)

## 2019-04-17-16-27-13 (2019-04-17)

## 2019-04-17-15-50-32 (2019-04-17)

## 2019-04-16-20-17-17 (2019-04-16)

## 2019-04-11-16-33-02 (2019-04-11)

## 2019-04-08-17-11-57 (2019-04-08)

### Fix

- bug create offer for workshop

## 2019-04-08-17-02-36 (2019-04-08)

## 2019-04-08-16-20-52 (2019-04-08)

### Fix

- meta activity form if no images
- change attendance on member detail page

## 2019-04-08-12-20-57 (2019-04-08)

## 2019-04-04-20-31-27 (2019-04-04)

## 2019-04-04-19-05-42 (2019-04-04)

## 2019-04-01-11-47-01 (2019-04-01)

### Fix

- fix fucking disabled color on offer Timetable

## 2019-04-01-11-39-58 (2019-04-01)

### Fix

- minor bug when editing member without email
- activity/workshop form w/ images
- maaaarginally better settings page
- warning duplicated keys (react array) for responsive drawer
- move libs/members in libs/member, fix config-env for bash, fix baseUrl cypress

## 2019-02-13-23-50-55 (2019-02-13)

### Fix

- TFunction overriding in withDrawer

## 2019-02-13-23-03-03 (2019-02-13)

### Fix

- test activity
- typo breaking duration_days field in PackForm [Fix: #163944617]
- cant pay for past sessions

## 2019-02-08-19-11-37 (2019-02-08)

## 2019-02-08-18-10-48 (2019-02-08)

### Fix

- fix member note button on firefox

## 2019-02-05-04-34-59 (2019-02-05)

## 2019-02-02-16-50-27 (2019-02-02)

### Fix

- crashing pages

## 2019-02-02-14-41-09 (2019-02-02)

### Fix

- crash if no birthday on coach

## 2019-02-01-20-41-02 (2019-02-01)

### Fix

- reinsure consumer about the date of their booking
- linting

## 2019-01-25-16-23-42 (2019-01-25)

## 2019-01-25-16-07-01 (2019-01-25)

## 2019-01-25-00-12-14 (2019-01-24)

## 2019-01-21-18-52-34 (2019-01-21)

## 2019-01-21-01-40-23 (2019-01-21)

## 2019-01-11-02-11-40 (2019-01-10)

## 2019-01-08-23-31-31 (2019-01-08)

## 2019-01-07-22-50-26 (2019-01-07)

## 2018-12-19-20-22-03 (2018-12-19)

## 2018-12-19-06-15-47 (2018-12-19)

## 2018-12-19-00-16-26 (2018-12-18)
