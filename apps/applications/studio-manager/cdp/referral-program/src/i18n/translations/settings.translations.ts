exports.default = {
  title: "Referrals",
  referralProgramHelper: {
    title: "Activate Referrals",
    description:
      "Set up a referral link for your members to invite others to your studio. Offer an incentive, set a time limit for the referral, and provide a reward for the referring member.",
    button: {
      activated: {
        label: "Deactivate",
        errors: {
          couldNotToggle: "Failed to deactivate the referral program",
        },
      },
      deactivated: {
        label: "Activate",
        errors: {
          couldNotToggle: "Failed to activate the referral program",
        },
      },
    },
  },
  inactive: {
    header: {
      chip: "Inactive",
    },
  },
  active: {
    header: {
      chip: "Active",
    },
    form: {
      basketMinimalAmount: {
        label: "Minimum value of shopping cart",
        helper: "Amount to be eligible for the referral discount",
        errors: {
          tooManyDecimalPoints:
            "The amount cannot have more than 2 decimal points",
          invalidFormat: "The amount format is not valid",
        },
      },
      referringReward: {
        title: "Reward for referring a member",
        amountOff: {
          label: "How much you want to reward the member",
        },
        maxReferringNumber: {
          label: "Max. use per member",
          errors: {
            tooSmall: "The number of uses must be between 1 and 5",
            tooBig: "You cannot give more than 5 referrals",
            noFloat: "You can only use whole numbers",
          },
        },
        alerts: {
          equalToZero:
            "By choosing this value, no discount will be applied to the purchase of the referred member",
        },
        errors: {
          tooManyDecimalPoints:
            "The amount cannot have more than 2 decimal points",
          invalidFormat: "The amount format is not valid",
        },
      },
      referralReward: {
        title: "Discount for new customer",
        label: "Discount total",
        percentage: "Percentage",
        amount: "Amount",
        errors: {
          onlyWholePercentage:
            "The percentage should be a whole number, the nearest integer are {{ wholeNumberUnder }} or {{ wholeNumberAbove }}",
          percentageTooHigh: "The percentage cannot be greater than 100",
          invalidFormat: "The amount format is not valid",
          tooManyDecimalPoints:
            "The amount cannot have more than 2 decimal points",
        },
        alerts: {
          equalToZero:
            "Choosing '0' will remove the discount for the person who is referred",
        },
      },
      timeLimitForUsage: {
        unit: {
          label: "Select interval of time limit",
          choices: {
            day_one: "Day",
            week_one: "Week",
            month_one: "Month",
            day_other: "Days",
            week_other: "Weeks",
            month_other: "Months",
          },
          errors: {},
        },
        interval: {
          label: "Time limit for applying the discount after registration",
          errors: {
            lowerThanOne: "The time limit must be 1 {{ timeUnit }} or longer",
          },
        },
      },
      tagSelector: {
        label: "Apply a tag when new customers use the referral link",
        placeholder: "Select a tag",
        helper: "Tip: Tag new customers to target them later.",
        errors: {
          notProvided: "Select a tag or deactivate this option to continue",
        },
      },
      redirectLink: {
        switch: {
          label: "Add a redirect link",
          helper:
            "Add a link to redirect new customers to a custom URL after registering. If left blank, they'll be taken to the Calendar page.",
        },
        textfield: {
          label: "Redirect link",
          placeholder: "Enter URL",
        },
        errors: {
          notProvided: "Add a URL or deactivate this option to continue",
          invalidFormat: "The URL format is not valid",
        },
      },
      saveSettings: {
        buttonLabel: "Save",
        onSuccess: {
          title: "Changes saved",
        },
        onFailure: {
          title: "Could not save changes",
        },
        errors: {
          invalidVoucherType: "The voucher type is not valid",
          invalidTimeUnit: "The time unit is not valid",
        },
      },
    },
    deactivateReferralModal: {
      title: "Deactivate referrals?",
      description:
        "We'll save your setup so that you can easily reactivate referrals in the future.",
      cancelButton: {
        label: "Cancel",
      },
      confirmButton: {
        label: "Deactivate",
      },
    },
  },
};
