import ShortUniqueId from 'short-unique-id';

const uid = new ShortUniqueId();

export function genSecureHex(limit=13){
  return uid.randomUUID(limit);
}
