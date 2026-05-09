"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { saveScrollPosition } from "@/lib/utils/scrollRestore";

type ScrollAwareLinkProps = ComponentProps<typeof Link>;

export function ScrollAwareLink(props: ScrollAwareLinkProps): React.ReactElement {
  const { onClick, ...rest } = props;

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>): void => {
    saveScrollPosition();
    onClick?.(event);
  };

  return <Link {...rest} onClick={handleClick} />;
}
