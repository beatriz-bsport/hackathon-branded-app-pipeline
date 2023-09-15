exports.default = {
  coach: 'Teacher',
  color: 'Color code (appointments)',
  search: 'Search a teacher',
  coach_override: 'Substitute',
  baseCoach: 'Default',
  overrider: 'Substitute',
  overrideSelectorTitle: 'Teacher',
  showPerformance: 'Show payroll',
  showActivities: 'Show activities',
  showDescription: 'Show description',
  description: 'Description',
  pleaseFill: 'Please enter a teacher',
  emptyDescription: "There's no description available.",
  selector: {
    coach: {
      label: 'Teacher',
    },
    label: 'Teacher',
    disabled: 'Archived teachers',
    enabled: 'Active teachers',
  },
  performance: {
    title: 'Teacher performance',
    coachName: 'Teacher',
    nbBookings: 'Bookings',
    nbOffersTotal: 'Sessions',
    nbBookingsOverThreshold: 'Bookings over threshold',
    pricePerOffer: 'Amount per session',
    pricePerAdditionalBooking: 'Amount per booking',
    calculate: 'Calculate',
    payment: 'Payroll',
    durationBookings: 'Number of hours',
    totalNetGain: 'Net gain (total)',
  },
  addCoach: 'Add a teacher',
  noActivity: 'This teacher does not manage any activity.',
  selfNoActivity: 'You are not managing any activity.',
  card: {
    update: 'Edit',
  },
  forms: {
    error: 'Unable to save coach',
    error_email_exists:
      'A teacher with this email address already exists, please use the new teacher form',
    linkByEmail: {
      cancel: 'Cancel',
      submit: 'Confirm',
      title: "Teacher's email address",
      success: 'Teacher successfully linked',
      emailLabel: 'Email',
      explain:
        "If this email already exists in our database, we'll automatically create the teacher's account.",
      emailPlaceHolder: 'teacher@bsport.io',
    },
    create: {
      success: 'Teacher added',
      title: 'New teacher',
    },
    update: {
      success: 'Teacher details updated',
      title: 'Update teacher',
      errors: {
        emailAlreadyInUse:
          'The email entered already exists in the database. You can only associate this email with a teacher by creating a new teacher.',
      },
    },
    delete: {
      success: 'Teacher deleted',
      error: 'Impossible to delete this teacher',
      content: {
        cannotDelete:
          'This teacher is booked in for upcoming sessions and can therefore not be deleted!',
        canDelete:
          'Are you sure you want to delete this teacher ? You will not have access to his previous performance. You will still be able to add him again with his email.',
      },
      title: 'Teacher deletion',
      cancel: 'Cancel',
      confirm: 'Delete',
      actions: {
        confirm: 'Delete',
        cancel: 'Cancel',
      },
    },
  },
  detail: {
    tab: {
      calendar: 'Schedule',
      general: 'Profile',
    },
    coachSpaceInfo:
      'Teachers will be able to see their payroll per session, view their schedule, and manage their availabilities in this area.',
    coachSpace: 'Teacher View',
    noPaymentRule: 'Warning, no payroll has been set for this teacher.',
  },
  noCoach: 'No teachers is registered yet',
  noCoachs:
    'This module allows you to add, manage, edit, and delete instructors.',
  inactiveCoaches: 'Archived teachers',
  paymentRule: 'Payroll',
  coachAccess: {
    teacher: 'Teacher',
    student: 'Member',
    info: "We've detected that you're also an Teacher at this studio. Would you like to access the Member View or the Teacher View?",
    access: 'Access',
  },
  numberCoaches: '{{ number }} teachers',
  emptyNotes: 'No notes',
  dateLeftCompany: 'End date',
  dateJoinedCompany: 'Start date',
  workingDateSection: 'Studio activity period',
};
