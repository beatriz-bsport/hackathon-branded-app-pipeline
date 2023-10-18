/**
 * @jest-environment jsdom
 */
import path from 'path';
import initStoryshots from '@storybook/addon-storyshots';
import { imageSnapshot } from '@storybook/addon-storyshots-puppeteer';

// Here is the plugin to create automatic rendering test for stoybook component
// there is a start but need more configuration and fix see below

// TODO fix bug deconnection of puppeteer
// TODO make it work by launching the storyboolk
// TODO ensure that FactoryBot is seeded and send same message
// initStoryshots({
//   test: imageSnapshot({
//     storybookUrl: `file://${path.resolve(__dirname, '../../storybook-static')}`,
//   }),
// });

describe('empty', () => {
  it('Check true', () => {
    expect(true).toBe(true);
  });
});
