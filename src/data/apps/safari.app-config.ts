import { createAppConfig } from '__/helpers/create-app-config';

export const safariAppConfig = createAppConfig({
  title: 'Safari',
  resizable: true,

  height: 600,
  width: 900,

  trafficLightsStyle: {
    top: '0.55rem',
    left: '0.75rem',
  },
});
