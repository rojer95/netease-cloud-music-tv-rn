import React from 'react';
import PageContext from '../contexts/page';

export const usePage = () => {
  return React.useContext(PageContext);
};
