import { createAppConfig } from '__/helpers/create-app-config';

export const remindersAppConfig = createAppConfig({
  showInDock: false,
  title: 'Reminders',
  resizable: true,
  height: 500,
  width: 400,
});
