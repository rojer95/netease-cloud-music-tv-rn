import React from 'react';

import PlayerStore from '../mobx/player';
import UserStore from '../mobx/user';

export const PlayerStoresContext = React.createContext(PlayerStore);
export const UserStoresContext = React.createContext(UserStore);

export const usePlayer = () => React.useContext(PlayerStoresContext);
export const useUser = () => React.useContext(UserStoresContext);
