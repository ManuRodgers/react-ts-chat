import { Kind } from '@/enum';

export function getRedirectPath(kind: Kind, avatar: string = ''): string {
  // without avatar so go to bossInfo or geniusInfo to complete information
  if (avatar === '' && kind === Kind.BOSS) {
    return '/bossInfo';
  }

  if (avatar === '' && kind === Kind.GENIUS) {
    return '/geniusInfo';
  }

  let url = kind === Kind.BOSS ? '/dashboard/boss' : '/dashboard/genius';

  return url;
}
