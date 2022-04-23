import React from 'react';

type GlobalContextType = {
  page?: string;
  setPage?: (p: string) => void;
  songs?: Record<string, any>;
  pageLastFocus?: Record<string, string>;
  setPageLastFocus?: (page: string, uuid: string) => void;
  cruteria?: any[];
  setCruteria?: any;
};

const GlobalContext = React.createContext<GlobalContextType>({});

export default GlobalContext;
