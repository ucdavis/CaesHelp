import './css/site.scss';
import * as React from 'react';
import ReactDOM from 'react-dom/client';
import Ticket, { ITicketProps } from './components/Ticket';

declare let window: any;

const reactApp = document.getElementById('react-app');

if (reactApp) {
  const props = {
    appName: window.App.model.appName,
    teamName: window.App.model.teamName,
    subject: window.App.model.subject,
    onlyShowAppSupport: window.App.model.onlyShowAppSupport,
    submitterEmail: window.App.model.submitterEmail,
    antiForgeryToken: window.App.antiForgeryToken,
    services: window.App.model.services
  } as ITicketProps;

  const root = ReactDOM.createRoot(reactApp);
  root.render(
    <React.StrictMode>
      <Ticket {...props} />
    </React.StrictMode>
  );
}
