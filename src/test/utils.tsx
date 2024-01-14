import type { ReactElement } from 'react';
import type { RenderOptions } from '@testing-library/react';
import { render } from '@testing-library/react';
import { MemoryRouter, MemoryRouterProps } from 'react-router-dom';

// eslint-disable-next-line react-refresh/only-export-components
export * from '@testing-library/react';

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'> & {
    wrapperProps?: Pick<MemoryRouterProps, 'initialEntries'>
  },
) => render(ui, {
  wrapper: (props) => {
    return <MemoryRouter {...props} {...options?.wrapperProps} />;
  }, ...options,
});

export { customRender as render };

