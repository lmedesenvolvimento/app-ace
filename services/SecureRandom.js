import { generate } from 'shortid';

export function genSecureHex(limit=13){
  return limit ? generate().slice(0, limit) : generate();
}
