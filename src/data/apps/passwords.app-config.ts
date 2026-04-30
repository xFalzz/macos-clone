import { createAppConfig } from '__/helpers/create-app-config';

export const passwordsAppConfig = createAppConfig({
  title: 'Passwords',
  resizable: true,
  height: 600,
  width: 800,
  trafficLightsStyle: {
    top: '1rem',
    left: '1rem',
  },
});
