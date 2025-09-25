"use client";

import { CalloutPlugin } from "@platejs/callout/react";

import { CalloutElement } from "@/features/shared/components/ui/callout-node";

export const CalloutKit = [CalloutPlugin.withComponent(CalloutElement)];
