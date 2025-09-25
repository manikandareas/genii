import { BaseTogglePlugin } from '@platejs/toggle';

import { ToggleElementStatic } from '@/features/shared/components/ui/toggle-node-static';

export const BaseToggleKit = [
  BaseTogglePlugin.withComponent(ToggleElementStatic),
];
