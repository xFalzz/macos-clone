import { createAppConfig } from '__/helpers/create-app-config';

export const aboutThisMacAppConfig = createAppConfig({
  title: 'About This Mac',
  resizable: false,
  height: 400,
  width: 550,
  showInDock: false,
  trafficLightsStyle: {
    top: '0.9rem',
    left: '0.9rem',
  },
});
