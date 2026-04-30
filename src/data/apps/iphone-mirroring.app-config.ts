import { createAppConfig } from '__/helpers/create-app-config';

export const iphoneMirroringAppConfig = createAppConfig({
  title: 'iPhone Mirroring',
  resizable: false,
  expandable: false,
  height: 700,
  width: 340,
  trafficLightsStyle: {
    top: '1rem',
    left: '1rem',
  },
});
