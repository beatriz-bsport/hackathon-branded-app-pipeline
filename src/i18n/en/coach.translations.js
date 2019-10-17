export default {
  coach: 'Coach',
  color: 'Color code (private lessons)',
  showPerformance: 'Remunerate',
  showActivities: 'Show activities',
  showDescription: 'Show description',
  description: 'Description',
  emptyDescription: 'No description provided',
  selector: {
    coach: {
      label: 'Teacher',
    },
  },
  performance: {
    title: 'Teacher performance',
    coachName: 'Teacher',
    nbBookings: 'Bookings',
    nbOffersTotal: 'Sessions',
    nbBookingsOverThreshold: 'Bookings over threshold',
    pricePerOffer: 'Price per offer',
    pricePerAdditionalBooking: 'Price per additional booking',
    calculate: 'Calculate',
    payment: 'Remunerate',
  },
  addCoach: 'Add a coach',
  noActivity: 'This coach does not manage any activity.',
  selfNoActivity: 'You are not managing any activity.',
  card: {
    update: 'Edit',
  },
  forms: {
    error: 'Unable to save coach',
    error_email_exists:
      'A coach with this email address already exists, please use the new coach form',
    linkByEmail: {
      cancel: 'Cancel',
      submit: 'Submit',
      title: 'Teacher email address',
      success: 'Teacher successfully linked',
      emailLabel: 'Email',
      explain:
        'If the email already exists in our system, we will automatically prepare the teacher informations. If you do not have his/her email address, keep the field empty',
      emailPlaceHolder: 'teacher@bsport.io',
    },
    create: {
      success: 'Coach added',
      title: 'New coach',
    },
    update: {
      success: 'Coach details updated',
      title: 'Update coach',
    },
    delete: {
      success: 'Teacher deleted',
      error: 'Impossible to delete this teacher',
      content:
        'Are you sure you want to delete this teacher ? You will not have access to his performance anymore. You can later add him again via his email.',
      title: 'Teacher deletion',
      cancel: 'Cancel',
      confirm: 'Delete',
    },
  },
};
