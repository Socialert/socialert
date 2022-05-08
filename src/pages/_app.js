import App, { Container } from 'next/app'
import axios from 'axios'
import Layout from '../layout/layout'
import React, { Component, useEffect, useState, useCallback } from 'react'

import { SessionProvider } from 'next-auth/react'
import { unstable_useWebVitalsReport,unstable_useRefreshRoot } from 'next/streaming'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { userService } from 'services';

//the entire app will have layout wrapped around it now
function MyApp({ Component, pageProps: { session, ...pageProps } }) {

  unstable_useWebVitalsReport((data) => {
    console.log(data)
  })

  const router = useRouter();
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        // run auth check on initial load
        authCheck(router.asPath);

        // set authorized to false to hide page content while changing routes
        const hideContent = () => setAuthorized(false);
        router.events.on('routeChangeStart', hideContent);

        // run auth check on route change
        router.events.on('routeChangeComplete', authCheck)

        // unsubscribe from events in useEffect return function
        return () => {
            router.events.off('routeChangeStart', hideContent);
            router.events.off('routeChangeComplete', authCheck);
        }
    }, []);

    function authCheck(url) {
        // redirect to login page if accessing a private page and not logged in 
        const publicPaths = ['/login'];
        const path = url.split('?')[0];
        if (!userService.userValue && !publicPaths.includes(path)) {
            setAuthorized(false);
            router.push({
                pathname: '/login',
                query: { returnUrl: router.asPath }
            });
        } else {
            setAuthorized(true);
        }
    }

  return (
    <SessionProvider session={session}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </SessionProvider>
  )
}

export default MyApp