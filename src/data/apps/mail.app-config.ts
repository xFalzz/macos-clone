import { createAppConfig } from '__/helpers/create-app-config';

export const mailAppConfig = createAppConfig({
  title: 'Mail',
  resizable: true,
  height: 550,
  width: 900,
  trafficLightsStyle: { top: '0.55rem', left: '0.75rem' },
});
