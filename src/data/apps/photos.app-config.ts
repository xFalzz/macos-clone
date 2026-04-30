import { createAppConfig } from '__/helpers/create-app-config';

export const photosAppConfig = createAppConfig({
  title: 'Photos',
  resizable: true,
  height: 550,
  width: 800,
  trafficLightsStyle: { top: '0.55rem', left: '0.75rem' },
});
