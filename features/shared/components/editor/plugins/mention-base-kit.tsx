import { BaseMentionPlugin } from '@platejs/mention';

import { MentionElementStatic } from '@/features/shared/components/ui/mention-node-static';

export const BaseMentionKit = [
  BaseMentionPlugin.withComponent(MentionElementStatic),
];
