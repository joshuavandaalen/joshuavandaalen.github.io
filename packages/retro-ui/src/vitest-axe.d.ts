import 'vitest';
import type { AxeMatchers } from 'vitest-axe/matchers';

// `vitest.setup.ts` registers these matchers at runtime via `expect.extend`;
// this teaches TypeScript that `toHaveNoViolations` exists.
declare module 'vitest' {
  interface Assertion extends AxeMatchers {}
  interface AsymmetricMatchersContaining extends AxeMatchers {}
}
