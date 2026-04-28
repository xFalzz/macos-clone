import { createAppConfig } from '__/helpers/create-app-config';

export const finderAppConfig = createAppConfig({
  title: 'Finder',
  resizable: true,

  height: 550,
  width: 850,

  trafficLightsStyle: {
    top: '0.55rem',
    left: '0.75rem',
  },
});
