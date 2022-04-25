import React, {
  Component, useEffect, useState, useCallback,
} from 'react';
import Layout from '../layout/layout';

function MyApp({ children, pageProps }) { 
  return <div {...pageProps}>{children}</div>
}

export default MyApp;
