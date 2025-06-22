import { createAppConfig } from '__/helpers/create-app-config';

export const purusTwitterAppConfig = createAppConfig({
  title: `Nawfal Website`,
  resizable: true,

  shouldOpenWindow: false,
  externalAction: () => window.open('https://nawfal.vercel.app', '_blank'),

  dockBreaksBefore: true,
});
