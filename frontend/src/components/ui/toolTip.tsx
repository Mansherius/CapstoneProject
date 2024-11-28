"use client";

import * as TooltipPrimitive from "@radix-ui/react-tooltip";

export const Tooltip = ({ children, content }: { children: React.ReactNode; content: string }) => (
  <TooltipPrimitive.Root>
    <TooltipPrimitive.Trigger asChild>
      {children}
    </TooltipPrimitive.Trigger>
    <TooltipPrimitive.Content
      className="rounded bg-gray-800 text-white px-2 py-1 text-sm shadow-md"
      side="top"
      sideOffset={5}
    >
      {content}
      <TooltipPrimitive.Arrow className="fill-gray-800" />
    </TooltipPrimitive.Content>
  </TooltipPrimitive.Root>
);
