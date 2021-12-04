import { lazier } from 'eth-hooks/helpers';

// the components and pages are lazy loaded for performance and bundle size reasons
// code is in the component file

export const Home = lazier(() => import('./home/Home'), 'Home');
export const Create = lazier(() => import('./create/Create'), 'Create');
