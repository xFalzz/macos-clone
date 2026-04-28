import { createAppConfig } from '__/helpers/create-app-config';

export const terminalAppConfig = createAppConfig({
  title: 'Terminal',
  resizable: true,
  height: 400,
  width: 600,
  trafficLightsStyle: { top: '0.55rem', left: '0.75rem' },
});
