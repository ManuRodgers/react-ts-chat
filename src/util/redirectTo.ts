import { Kind } from '@/enum';

export function getRedirectPath(kind: Kind, avatar: string = '') {
  let url = '';
  url = kind === Kind.BOSS ? '/boss' : '/genius';
  // without avatar so go to bossInfo or geniusInfo to complete information
  if (!avatar) {
    url = `${url}Info`;
  }
  return url;
}
