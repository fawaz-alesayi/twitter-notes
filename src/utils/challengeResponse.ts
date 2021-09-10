import crypto from 'crypto';
/**
 * Creates a HMAC SHA-256 hash created from the app TOKEN and
 * your app Consumer Secret.
 * @param  token  the token provided by the incoming GET request
 * @return the HMAC
 */
export const getChallengeResponse = (
  crc_token: string,
  consumer_secret: string,
): string => {
  return crypto
    .createHmac('sha256', consumer_secret)
    .update(crc_token)
    .digest('base64');
};
