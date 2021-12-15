import { lazier } from 'eth-hooks/helpers';

export const View = lazier(() => import('./View'), 'View');
export const Vote = lazier(() => import('./Vote'), 'Vote');
export const Distrbute = lazier(() => import('./Distribute'), 'Distribute');
