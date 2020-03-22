// @flow

/**
 * Returns serialized signature as a string
 */
export default function serializeSignature(array: Array<string>): string {
  return array.map((_, index) => `_${index}`).join(',');
}
