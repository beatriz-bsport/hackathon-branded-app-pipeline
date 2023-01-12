/**
 * @jest-environment jsdom
 */

import { FORCE_DISPLAY_FOR_TESTING } from '../Intercom.component';

describe('Intercom not disabled manually', () => {
  it('Check constant for display is activated', () => {
    expect(FORCE_DISPLAY_FOR_TESTING).toBe(false);
  });
});
