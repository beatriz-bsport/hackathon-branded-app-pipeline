const InfoButtonSeverity = ['info', 'warning', 'error'] as const;

export type InfoButtonSeverityType = (typeof InfoButtonSeverity)[number];
