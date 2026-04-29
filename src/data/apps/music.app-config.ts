import { createAppConfig } from '__/helpers/create-app-config';

export const musicAppConfig = createAppConfig({
  showInDock: false,
  title: 'Music',
  resizable: true,
  height: 600,
  width: 800,
  trafficLightsStyle: {
    top: '0.9rem',
    left: '0.9rem',
  },
});
