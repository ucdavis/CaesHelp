//import './css/site.scss';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import Ticket, { ITicketProps } from "./components/Ticket";


declare var window: any;

const props = {
    appName: window.App.model.appName,
    subject: window.App.model.subject,
    onlyShowAppSupport: window.App.model.onlyShowAppSupport,
    submitterEmail: window.App.model.submitterEmail,
    antiForgeryToken: window.App.antiForgeryToken,
} as ITicketProps;


function renderApp() {


  // This code starts up the React app when it runs in a browser. It sets up the routing
  // configuration and injects the app into a DOM element.
  ReactDOM.render(
    <AppContainer>
        <Ticket {...props}/>
    </AppContainer>,
    document.getElementById('react-app')
  );
}

renderApp();

// Allow Hot Module Replacement
if (module.hot) {
  module.hot.accept(() => {
    renderApp();
  });
}
