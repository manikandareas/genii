'use client';

import { TogglePlugin } from '@platejs/toggle/react';

import { IndentKit } from '@/features/shared/components/editor/plugins/indent-kit';
import { ToggleElement } from '@/features/shared/components/ui/toggle-node';

export const ToggleKit = [
  ...IndentKit,
  TogglePlugin.withComponent(ToggleElement),
];
