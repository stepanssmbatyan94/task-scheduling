export * as ArrayUtils from './arrayUtils';

export function getInitials(name: string | undefined): string {
  const parts = name?.split(' ');
  const initials = parts?.map((part) => part.charAt(0).toUpperCase()).join('');
  return initials ?? 'U';
}
