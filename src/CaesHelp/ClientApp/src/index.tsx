import './css/site.scss';
import * as React from 'react';
import ReactDOM from 'react-dom/client';
import Ticket, { ITicketProps } from './components/Ticket';

declare let window: any;

const appRoot = document.getElementById('react-app');

if (appRoot && window.App?.model) {
  const props = {
    appName: window.App.model.appName,
    teamName: window.App.model.teamName,
    subject: window.App.model.subject,
    onlyShowAppSupport: window.App.model.onlyShowAppSupport,
    submitterEmail: window.App.model.submitterEmail,
    antiForgeryToken: window.App.antiForgeryToken,
    services: window.App.model.services
  } as ITicketProps;

  const root = ReactDOM.createRoot(appRoot);
  root.render(
    <React.StrictMode>
      <Ticket {...props} />
    </React.StrictMode>
  );
}
