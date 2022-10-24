import {describe, expect, it} from '@jest/globals';
import * as github from '../src/github';

describe('github', () => {
  it('returns latest GitHub release', async () => {
    const release = await github.getRelease('latest');
    expect(release).not.toBeNull();
    expect(release?.tag_name).not.toEqual('');
  });
});
