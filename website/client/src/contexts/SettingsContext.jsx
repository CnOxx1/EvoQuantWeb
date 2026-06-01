import { createContext, useContext, useState, useEffect } from 'react';
import { getPublicSettings } from '../api/endpoints';

const SettingsContext = createContext({});

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState({});

  useEffect(() => {
    getPublicSettings()
      .then(res => setSettings(res.data))
      .catch(() => {});
  }, []);

  return (
    <SettingsContext.Provider value={settings}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}
