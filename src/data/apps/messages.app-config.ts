import { createAppConfig } from '__/helpers/create-app-config';

export const messagesAppConfig = createAppConfig({
  title: 'Messages',
  resizable: true,
  height: 500,
  width: 750,
  trafficLightsStyle: { top: '0.55rem', left: '0.75rem' },
});
