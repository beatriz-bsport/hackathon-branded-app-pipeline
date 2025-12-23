export enum SessionFilterTypes {
  ACTIVITY_TYPE = "activity-type",
  ACTIVITY_CATEGORY = "activity-category",
  ESTABLISHMENT = "establishment",
  LOCATION = "location",
  LEVEL = "level",
  TEACHER = "teacher",
  TEACHER_SUBSTITUTION = "teacher-substitution",
  VISIBILITY = "visibility",
}

export enum SessionFilters {
  FILTER_IS = "is",
  FILTER_NOT = "not",
}

export enum ActivityTypeFilterValues {
  GROUP_ACTIVITY = "group-activity",
  WORKSHOP = "workshop",
}

export enum VisibilityFilterValues {
  AGGREGATORS = "aggregators",
  MEMBERS = "members",
}

export enum TeacherSubstitutionFilterValues {
  CONFIRMED = "confirmed",
  PENDING = "pending",
}
