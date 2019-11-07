import { Kind } from '@/enum';

export function getRedirectPath(kind: Kind, avatar: string = ''): string {
  // updatingUser
  // const updatingUser = localStorage.getItem(`updatingUser`);
  // console.log('TCL: updatingUser', updatingUser);

  // if (updatingUser === '1' && kind === Kind.BOSS) {
  //   return '/bossInfo';
  // }
  // if (updatingUser === '1' && kind === Kind.GENIUS) {
  //   return '/geniusInfo';
  // }

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
