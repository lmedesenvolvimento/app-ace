import ShortUniqueId from 'short-unique-id';

const uid = new ShortUniqueId();

export function genSecureHex(){
    return uid.randomUUID(13)
}