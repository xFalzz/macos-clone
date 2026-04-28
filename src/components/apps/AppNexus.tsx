import { AppID } from '__/stores/apps.store';
import { lazy } from 'react';

type AppNexusProps = {
  appID: AppID;
  isBeingDragged: boolean;
};

const Calculator = lazy(() => import('./Calculator/Calculator'));
const VSCode = lazy(() => import('./VSCode/VSCode'));
const Calendar = lazy(() => import('./Calendar/Calendar'));
const Finder = lazy(() => import('./Finder/Finder'));
const Safari = lazy(() => import('./Safari/Safari'));
const SystemPreferences = lazy(() => import('./SystemPreferences/SystemPreferences'));
const Mail = lazy(() => import('./Mail/Mail'));
const Messages = lazy(() => import('./Messages/Messages'));
const Photos = lazy(() => import('./Photos/Photos'));
const FaceTime = lazy(() => import('./FaceTime/FaceTime'));

const PlaceholderApp = lazy(() => import('./Placeholder/Placeholder'));

export const AppNexus = ({ appID, isBeingDragged }: AppNexusProps) => {
  if (appID === 'calculator') return <Calculator />;
  if (appID === 'vscode') return <VSCode isBeingDragged={isBeingDragged} />;
  if (appID === 'calendar') return <Calendar />;
  if (appID === 'finder') return <Finder />;
  if (appID === 'safari') return <Safari isBeingDragged={isBeingDragged} />;
  if (appID === 'system-preferences') return <SystemPreferences />;
  if (appID === 'mail') return <Mail />;
  if (appID === 'messages') return <Messages />;
  if (appID === 'photos') return <Photos />;
  if (appID === 'facetime') return <FaceTime />;

  return <PlaceholderApp appID={appID} />;
};
