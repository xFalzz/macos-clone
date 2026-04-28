import { createAppConfig } from '__/helpers/create-app-config';

export const notesAppConfig = createAppConfig({
  title: 'Notes',
  resizable: true,
  height: 500,
  width: 700,
  trafficLightsStyle: { top: '0.55rem', left: '0.75rem' },
});
