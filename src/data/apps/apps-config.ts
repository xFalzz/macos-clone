import { aboutThisMacAppConfig } from './about-this-mac.app-config';
import { calculatorAppConfig } from './calculator.app-config';
import { calendarAppConfig } from './calendar.app-config';
import { contactsAppConfig } from './contacts.app-config';
import { facetimeAppConfig } from './facetime.app-config';
import { finderAppConfig } from './finder.app-config';
import { launchpadAppConfig } from './launchpad.app-config';
import { mailAppConfig } from './mail.app-config';
import { mapsAppConfig } from './maps.app-config';
import { messagesAppConfig } from './messages.app-config';
import { musicAppConfig } from './music.app-config';
import { notesAppConfig } from './notes.app-config';
import { photosAppConfig } from './photos.app-config';
import { purusTwitterAppConfig } from './purus-twitter.app-config';
import { remindersAppConfig } from './reminders.app-config';
import { safariAppConfig } from './safari.app-config';
import { systemPreferencesAppConfig } from './system-preferences.app-config';
import { terminalAppConfig } from './terminal.app-config';
import { viewSourceAppConfig } from './view-source.app-config';
import { vscodeAppConfig } from './vscode.app-config';

export const appsConfig = {
  finder: finderAppConfig,
  calculator: calculatorAppConfig,
  calendar: calendarAppConfig,
  vscode: vscodeAppConfig,
  safari: safariAppConfig,
  messages: messagesAppConfig,
  mail: mailAppConfig,
  photos: photosAppConfig,
  facetime: facetimeAppConfig,
  'system-preferences': systemPreferencesAppConfig,
  terminal: terminalAppConfig,
  notes: notesAppConfig,
  maps: mapsAppConfig,
  music: musicAppConfig,
  contacts: contactsAppConfig,
  reminders: remindersAppConfig,

  'about-this-mac': aboutThisMacAppConfig,

  launchpad: launchpadAppConfig,

  'purus-twitter': purusTwitterAppConfig,
  'view-source': viewSourceAppConfig,
};
