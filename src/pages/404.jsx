import React, {
  Component, useEffect, useState, useCallback,
} from 'react';
import Card from '../components/theme/cards';

function FourOFour({ children, pageProps }) {
  return <>
    <h1>
    hello this is the 404 page
    </h1>
    {children}
    <Card text="hello world"/>
  </>;
}

export default FourOFour;
