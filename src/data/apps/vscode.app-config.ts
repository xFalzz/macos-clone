import { createAppConfig } from '__/helpers/create-app-config';

export const vscodeAppConfig = createAppConfig({
  showInDock: false,
  title: 'VSCode',
  resizable: true,

  height: 600,
  width: 800,

  trafficLightsStyle: {
    top: '0.6rem',
    left: '0.6rem',
  },
});
