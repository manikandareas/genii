'use client';

import { LinkPlugin } from '@platejs/link/react';

import { LinkElement } from '@/features/shared/components/ui/link-node';
import { LinkFloatingToolbar } from '@/features/shared/components/ui/link-toolbar';

export const LinkKit = [
  LinkPlugin.configure({
    render: {
      node: LinkElement,
      afterEditable: () => <LinkFloatingToolbar />,
    },
  }),
];
