import type { HTMLAttributes } from 'react';

import { cx } from '../../utils/cx';

export interface PageContainerProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Also apply `.retro-root`, which sets the page font, ink and background.
   * On by default — most pages want the full treatment. Turn it off when
   * embedding the kit inside an existing layout you do not want restyled.
   */
  asRoot?: boolean;
}

/** The centred 1200px stage every page sits on. */
export function PageContainer({
  asRoot = true,
  className,
  children,
  ...rest
}: PageContainerProps) {
  return (
    <div
      className={cx(asRoot && 'retro-root', 'retro-container', className)}
      {...rest}
    >
      {children}
    </div>
  );
}
