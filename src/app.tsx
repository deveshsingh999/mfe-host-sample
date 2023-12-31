import React, { Suspense, lazy, useRef, useEffect, useState, startTransition } from "react";
import { Routes, Route, useLocation } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import Header from './components/Header';
import Home from './components/Home';
import NotFound from './components/NotFound';
import { InitialData } from "./model/response.model";
// import { dynamicModule } from "./utils/dynamic-module";
// import mfManifest from '../config/mf.manifest.js';

const App1 = lazy(() => import('remote1/App' /* webpackPrefetch: true */));
// const App1 = dynamicModule('./App', mfManifest.remote1);
const App2 = lazy(() => import('remote2/App' /* webpackPrefetch: true */));
const App3 = lazy(() => import('remote3/App' /* webpackPrefetch: true */));


function wrapSuspense(element: React.ReactElement) {
  return (
    <Suspense fallback={'Loading..'}>
      {element}
    </Suspense>
  );
}

function App({ initialData }: AppProps) {
  const fetchData = useRef(initialData ? false : true);
  const mountPath = useRef<string | null>(null);
  const location = useLocation();

  // Case 1: first mount, first render
  // Case 2: first mount, second render (if strict mode)
  useEffect(() => {
    // Handle strict mode (double-render)
    if (fetchData.current && (!initialData || mountPath.current !== window.location.pathname)) {
    } else {
      fetchData.current = true;
    }
    mountPath.current = window.location.pathname;
  }, []);

  const cond1 = !fetchData.current || mountPath.current === location.pathname;
  const pageData = cond1 ? initialData?.pageData : undefined;
  
  return (
    <ErrorBoundary fallback={<span>Error!</span>}>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/remote1/*" element={wrapSuspense(<App1 pageData={pageData} />)} />
        <Route path="/remote2/*" element={wrapSuspense(<App2 pageData={pageData} />)} />
        <Route path="/remote3/*" element={wrapSuspense(<App3 pageData={pageData} />)} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </ErrorBoundary>
  );
}

export default App;

interface AppProps {
  initialData?: InitialData | null;
}
