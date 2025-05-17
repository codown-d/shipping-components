import {AppProvider} from '@shopify/polaris';
import translations from '@shopify/polaris/locales/en.json';
import React from 'react';
import '@shopify/polaris/dist/styles.css';
import {AuthProvider} from '@aftership/automizely-product-auth';
import {Switch, Route, Router} from 'react-router-dom';

import CarrierManagerProvider from './CarrierManagerProvider';

import TrackingNumber from '@/container/TrackingNumber/TrackingNumber';
import AccountInformationExample from '@/examples/AccountInformationExample';
import EnabledCarrierServicesExample from '@/examples/EnabledCarrierServicesExample';

import {createBrowserHistory} from 'history';

const history = createBrowserHistory();

const authConfig = {
    flow: 'standard',
    realm: 'business',
    clientId: 'postmen',
    forceLogin: true,
    appConfig: {
        name: 'postmen',
    },
    refreshPageAtOrganizationSwitched: true,
} as const;

const THEME = {
    colors: {
        primary: '#5A67CB',
    },
};

const App = () => {
	console.log(authConfig)
    return (
        <AuthProvider config={authConfig} enabledAppSwitcher={false}>
            {/*@ts-ignore*/}
            <AppProvider i18n={translations} theme={THEME}>
                <Router history={history}>
                    <Switch>
                        <Route exact path="/">
                            <CarrierManagerProvider />
                        </Route>
                        <Route path="/tracking-number">
                            <TrackingNumber />
                        </Route>
                        <Route path="/account-info">
                            <AccountInformationExample />
                        </Route>
                        <Route path="/carrier-services">
                            <EnabledCarrierServicesExample />
                        </Route>
                    </Switch>
                </Router>
            </AppProvider>
        </AuthProvider>
    );
};

export default App;
