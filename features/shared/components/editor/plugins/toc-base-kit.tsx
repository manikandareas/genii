import { BaseTocPlugin } from '@platejs/toc';

import { TocElementStatic } from '@/features/shared/components/ui/toc-node-static';

export const BaseTocKit = [BaseTocPlugin.withComponent(TocElementStatic)];
