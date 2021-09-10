import { handleRegistration } from '.';

describe('handleRegistration', () => {
  it('should return a string containing an oauth token', async () => {
    const result = await handleRegistration();
    expect(result._unsafeUnwrap()).not.toBeNull();
    expect(result._unsafeUnwrap()).not.toBeUndefined();
  });
});

export interface routeOptions {
  prefix: string;
}
