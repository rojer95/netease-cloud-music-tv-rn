import React from 'react';

type PageContextType = {
  page?: string;
  fid?: string;
  setFid?: any;
  shouldRefreshFocus?: boolean;
};
const PageContext = React.createContext<PageContextType>({});

export default PageContext;
