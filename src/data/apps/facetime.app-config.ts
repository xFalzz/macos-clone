import { createAppConfig } from '__/helpers/create-app-config';

export const facetimeAppConfig = createAppConfig({
  title: 'FaceTime',
  resizable: true,
  height: 500,
  width: 650,
  trafficLightsStyle: { top: '0.55rem', left: '0.75rem' },
});
