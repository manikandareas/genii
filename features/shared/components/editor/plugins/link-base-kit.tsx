import { BaseLinkPlugin } from '@platejs/link';

import { LinkElementStatic } from '@/features/shared/components/ui/link-node-static';

export const BaseLinkKit = [BaseLinkPlugin.withComponent(LinkElementStatic)];
