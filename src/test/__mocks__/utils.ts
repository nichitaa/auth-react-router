import { lazy } from 'react';

export const getLazyLoadedPageA = (timeout: number) =>
  lazy(() => {
    return new Promise((resolve) => {
      setTimeout(() => {
        import('./page-a').then((module) => {
          resolve({ default: module.default as never });
        });
      }, timeout);
    });
  });
