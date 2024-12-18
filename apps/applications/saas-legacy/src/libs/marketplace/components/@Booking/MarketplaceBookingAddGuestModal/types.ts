enum AddGuestFormStep {
  INITIAL = 1,
  EMAIL_WARNING = 2,
}

type AddGuestFormValues = {
  firstName: string;
  lastName?: string;
  email?: string;
};

export { AddGuestFormStep, type AddGuestFormValues };
