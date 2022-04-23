import React from 'react';
import GlobalContext from '../contexts/global';

export const useGlobal = () => {
  return React.useContext(GlobalContext);
};
