export const MESSAGE_ROLES = {
  AGENT: 'agent',
  MEMBER: 'member',
  STUDIO_MANAGER: 'studio_manager',
} as const;

export type MessageRole = (typeof MESSAGE_ROLES)[keyof typeof MESSAGE_ROLES];

export type MessagePayload = {
  role: MessageRole;
  message: string;
};
