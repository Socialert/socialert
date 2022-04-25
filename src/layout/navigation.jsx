import React, { useContext, useEffect } from 'react';

import { styled } from '@mui/material/styles';
// ui
import {
  List,
  Slide,
  Drawer,
  AppBar,
  Button,
  Divider,
  Toolbar,
  ListItem,
  ListItemText,
  useScrollTrigger,
  SwipeableDrawer,
  Grid,
  Typography,
  useTheme,
  Box,
} from '@mui/material';
import {
  Brightness2, Brightness5, Close, ClosedCaptionOutlined, Menu,
} from '@mui/icons-material';
// ========================================================================== //
// Page transitions
// ========================================================================== // 
import {
  RegularButton,
} from '../components/theme/buttons';
import { useStore } from '../store/store';
import { SCROLL_PROPS } from '../store/theme';
import { SignInStatus,  } from '../components/login/loginStatus';

const Navigation = ({ window }) => {
  const [drawerState, setDrawerState] = React.useState(false);
  const iOS = (typeof window !== 'undefined'
      && /iPad|iPhone|iPod/.test(navigator?.userAgent))
      || false;

  const toggleDrawer = React.useCallback(() => setDrawerState((drawerState) => !drawerState), []);
  const theme = useTheme();
  const toggleTheme = useStore((state) => state.appContext.toggleTheme);
  const type = useStore((state) => state.appContext.type);

  const scrollToElementById = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
      });
    }
  };


  const pageNavigationStyles = {
    height: '100%',
    width: '200px',
    flexDirection: 'row',
    display: 'flex',
    gap: '20px',
    alignItems: 'center',
  }
  const pageLinkStyles = {
  }

  const navigateToPage = React.useCallback((pageLink, pageIndex) => {
    // if (typeof window === 'undefined') return;
    if (pageLink[0] === '#') { 
      return;
    } 
  }, []);

// ========================================================================== //
//   page config
// ========================================================================== //
  const pages = [
    { name: 'Dashboard', url: '#projects', slideIndex: 5 },
    { name: 'Services', url: '#services', slideIndex: 0 },
    { name: 'Skills', url: '#skills', slideIndex: 2 },
    { name: 'Blog', url: '#blog', slideIndex: 4 },
  ];
 

  const boldCurrentPage = React.useCallback((name, i) => {
    if (typeof window !== 'undefined') { if (pages[i].url === document.location.hash) return <b>{name}</b>; }
    return <>{name}</>;
  }, []);

  const logo = React.useCallback(
    () => (
      <>
        <Box
          onClick={() => navigateToPage('/', 0)}
          sx={{
            // ...menuIconStyles,
          }}
            // {...SCROLL_PROPS}
          style={{
            fill: 'currentColor',
          }}
          dangerouslySetInnerHTML={{
            __html: `
            <svg width="44" height="51" viewBox="0 0 44 51" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.2715 0.927979C22.5709 0.927979 22.8636 1.01057 23.1128 1.16539C28.8459 4.77314 35.3811 7.11991 42.2265 8.02903C42.5887 8.07685 42.9203 8.24515 43.1603 8.50298C43.4003 8.76081 43.5324 9.09085 43.5325 9.43238V18.6359C43.5325 33.6624 37.3522 41.0662 23.0473 47.6376C22.5735 47.8552 22.0087 47.7213 21.6828 47.3143L17.8195 42.4889C17.4408 42.0159 16.759 41.9199 16.2645 42.27L9.19024 47.2779C8.20494 47.9754 6.9507 46.8701 7.51877 45.8049L11.5544 38.2377C15.7903 29.506 1.0105 49.8449 1.0105 18.6359V9.43238C1.01045 9.09127 1.14218 8.76158 1.38152 8.50381C1.62086 8.24604 1.95176 8.07747 2.3135 8.02903C9.1599 7.12032 15.6962 4.77353 21.4302 1.16539C21.6794 1.01057 21.9721 0.927979 22.2715 0.927979Z" fill="#029C65"/>
            <path d="M20.7578 38.0361C22.1362 36.3927 21.9057 33.9298 20.2429 32.5351C18.5801 31.1404 16.1147 31.342 14.7363 32.9854" stroke="white" stroke-width="1.48827" stroke-linecap="round"/>
            <path d="M1.00011 22.1857C8.71766 12.9848 22.3497 11.2878 31.662 19.0988C36.6418 23.2757 39.0297 28.9565 39.2715 34.9371" stroke="white" stroke-width="1.48827" stroke-linecap="round"/>
            <path d="M28.2037 44.8383C32.9519 39.1774 32.1565 30.6926 26.427 25.8868C20.6976 21.0811 12.2038 21.7744 7.45554 27.4352" stroke="white" stroke-width="1.48827" stroke-linecap="round"/>
            </svg>
            `,
          }}
        />
        {/*  
          <svg width="148" height="27" viewBox="0 0 148 27" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7.43947 17.4012C6.36496 17.0349 5.38813 16.6686 4.50898 16.3022C3.62984 15.9115 2.87279 15.4475 2.23785 14.9103C1.60292 14.373 1.10229 13.7381 0.73598 13.0054C0.39409 12.2484 0.223145 11.3326 0.223145 10.2581C0.223145 8.18236 1.01682 6.52175 2.60417 5.27629C4.21593 4.03083 6.46264 3.40811 9.34429 3.40811C10.3944 3.40811 11.3712 3.48137 12.2748 3.62789C13.1783 3.77442 13.9476 4.00641 14.5825 4.32388C15.2419 4.61693 15.7547 5.00766 16.121 5.49608C16.4873 5.96007 16.6705 6.50954 16.6705 7.14448C16.6705 7.77942 16.524 8.32888 16.2309 8.79288C15.9379 9.23245 15.5838 9.61097 15.1686 9.92844C14.6314 9.58655 13.911 9.2935 13.0074 9.04929C12.1038 8.78067 11.1148 8.64635 10.0403 8.64635C8.94134 8.64635 8.13546 8.80509 7.62262 9.12256C7.10979 9.4156 6.85337 9.79412 6.85337 10.2581C6.85337 10.6244 7.01211 10.9297 7.32958 11.1739C7.64704 11.3937 8.12325 11.6013 8.75819 11.7966L10.6996 12.4194C12.9952 13.152 14.7535 14.0922 15.9745 15.2399C17.22 16.3633 17.8427 17.9018 17.8427 19.8555C17.8427 21.9312 17.0246 23.6163 15.3884 24.9106C13.7522 26.1804 11.3468 26.8154 8.17209 26.8154C7.04874 26.8154 5.99865 26.7177 5.02182 26.5223C4.06941 26.3514 3.22689 26.095 2.49427 25.7531C1.78607 25.3868 1.22439 24.9472 0.809242 24.4343C0.41851 23.8971 0.223145 23.2866 0.223145 22.6028C0.223145 21.8946 0.430721 21.2963 0.845873 20.8079C1.26103 20.295 1.71281 19.9043 2.20122 19.6357C2.885 20.1729 3.71531 20.6369 4.69214 21.0277C5.69339 21.4184 6.78011 21.6138 7.9523 21.6138C9.14892 21.6138 9.99143 21.4306 10.4798 21.0643C10.9683 20.698 11.2125 20.2706 11.2125 19.7822C11.2125 19.2938 11.0171 18.9275 10.6264 18.6833C10.2356 18.4146 9.68618 18.1582 8.97797 17.914L7.43947 17.4012Z" fill="#029C65"/>
            <path d="M39.3354 17.3279C39.3354 18.842 39.1034 20.1974 38.6394 21.394C38.1754 22.5662 37.5161 23.5552 36.6613 24.3611C35.831 25.167 34.8298 25.7775 33.6576 26.1926C32.4854 26.6078 31.1789 26.8154 29.7381 26.8154C28.2972 26.8154 26.9907 26.5956 25.8185 26.156C24.6463 25.7164 23.6329 25.0937 22.7782 24.2878C21.9479 23.4575 21.3007 22.4563 20.8367 21.2841C20.3727 20.1119 20.1407 18.7932 20.1407 17.3279C20.1407 15.8871 20.3727 14.5806 20.8367 13.4084C21.3007 12.2362 21.9479 11.2472 22.7782 10.4413C23.6329 9.61097 24.6463 8.97603 25.8185 8.53646C26.9907 8.09688 28.2972 7.8771 29.7381 7.8771C31.1789 7.8771 32.4854 8.10909 33.6576 8.57309C34.8298 9.01266 35.831 9.6476 36.6613 10.4779C37.5161 11.2838 38.1754 12.2728 38.6394 13.445C39.1034 14.6172 39.3354 15.9115 39.3354 17.3279ZM26.5145 17.3279C26.5145 18.8176 26.7954 19.9654 27.357 20.7712C27.9431 21.5527 28.749 21.9434 29.7747 21.9434C30.8004 21.9434 31.5818 21.5405 32.1191 20.7346C32.6808 19.9287 32.9616 18.7932 32.9616 17.3279C32.9616 15.8627 32.6808 14.7393 32.1191 13.9579C31.5574 13.152 30.7637 12.749 29.7381 12.749C28.7124 12.749 27.9187 13.152 27.357 13.9579C26.7954 14.7393 26.5145 15.8627 26.5145 17.3279Z" fill="#029C65"/>
            <path d="M52.4104 12.7857C51.7999 12.7857 51.2138 12.8833 50.6521 13.0787C50.1149 13.2741 49.6387 13.5671 49.2235 13.9579C48.8328 14.3242 48.5153 14.7882 48.2711 15.3498C48.0269 15.9115 47.9048 16.5709 47.9048 17.3279C47.9048 18.842 48.3322 19.9776 49.1869 20.7346C50.066 21.4917 51.1283 21.8702 52.3738 21.8702C53.1064 21.8702 53.7414 21.7847 54.2786 21.6138C54.8159 21.4428 55.2921 21.2597 55.7072 21.0643C56.1956 21.4062 56.5619 21.7847 56.8061 22.1999C57.0504 22.5906 57.1725 23.0668 57.1725 23.6285C57.1725 24.6297 56.6963 25.4112 55.7439 25.9729C54.7914 26.5101 53.4727 26.7787 51.7877 26.7787C50.2492 26.7787 48.8572 26.559 47.6117 26.1194C46.3663 25.6554 45.2918 25.0204 44.3882 24.2146C43.5091 23.3843 42.8253 22.3952 42.3369 21.2474C41.8485 20.0997 41.6042 18.8298 41.6042 17.4378C41.6042 15.826 41.8607 14.4219 42.3735 13.2252C42.9108 12.0042 43.6312 11.003 44.5347 10.2215C45.4383 9.44002 46.4762 8.85393 47.6484 8.4632C48.845 8.07246 50.1027 7.8771 51.4214 7.8771C53.1797 7.8771 54.535 8.19457 55.4874 8.82951C56.4398 9.46444 56.916 10.2825 56.916 11.2838C56.916 11.7478 56.8062 12.1874 56.5864 12.6025C56.3666 12.9932 56.1102 13.3351 55.8171 13.6282C55.402 13.4328 54.9013 13.2497 54.3152 13.0787C53.7291 12.8833 53.0942 12.7857 52.4104 12.7857Z" fill="#029C65"/>
            <path d="M60.149 3.48137C60.149 2.55338 60.4543 1.77192 61.0648 1.13698C61.6997 0.502039 62.53 0.18457 63.5557 0.18457C64.5814 0.18457 65.3995 0.502039 66.01 1.13698C66.6449 1.77192 66.9624 2.55338 66.9624 3.48137C66.9624 4.40936 66.6449 5.19082 66.01 5.82576C65.3995 6.4607 64.5814 6.77817 63.5557 6.77817C62.53 6.77817 61.6997 6.4607 61.0648 5.82576C60.4543 5.19082 60.149 4.40936 60.149 3.48137ZM66.6694 26.1926C66.4007 26.2415 65.9978 26.3025 65.4605 26.3758C64.9477 26.4735 64.4226 26.5223 63.8854 26.5223C63.3481 26.5223 62.8597 26.4857 62.4201 26.4124C62.005 26.3392 61.6509 26.1926 61.3578 25.9729C61.0648 25.7531 60.8328 25.46 60.6619 25.0937C60.5153 24.703 60.4421 24.2024 60.4421 23.5918V8.68298C60.7107 8.63414 61.1014 8.57309 61.6143 8.49983C62.1515 8.40214 62.6888 8.3533 63.226 8.3533C63.7633 8.3533 64.2395 8.38993 64.6546 8.4632C65.0942 8.53646 65.4605 8.68298 65.7536 8.90277C66.0466 9.12255 66.2664 9.42781 66.4129 9.81855C66.5839 10.1849 66.6694 10.6733 66.6694 11.2838V26.1926Z" fill="#029C65"/>
            <path d="M78.4608 22.2731C78.876 22.2731 79.3278 22.2365 79.8162 22.1632C80.329 22.0655 80.7075 21.9434 80.9517 21.7969V18.8664L78.3143 19.0862C77.6305 19.135 77.0688 19.2816 76.6293 19.5258C76.1897 19.77 75.9699 20.1363 75.9699 20.6247C75.9699 21.1131 76.1531 21.5161 76.5194 21.8335C76.9101 22.1266 77.5572 22.2731 78.4608 22.2731ZM78.1678 7.87709C79.4865 7.87709 80.6831 8.0114 81.7576 8.28003C82.8565 8.54866 83.7845 8.96381 84.5416 9.52549C85.323 10.0627 85.9213 10.7587 86.3365 11.6135C86.7516 12.4438 86.9592 13.4328 86.9592 14.5806V22.7859C86.9592 23.4209 86.7761 23.9459 86.4098 24.3611C86.0679 24.7518 85.6527 25.0937 85.1643 25.3867C83.577 26.3392 81.3425 26.8154 78.4608 26.8154C77.1665 26.8154 75.9943 26.6933 74.9442 26.449C73.9186 26.2048 73.0272 25.8385 72.2702 25.3501C71.5375 24.8617 70.9637 24.239 70.5485 23.4819C70.1578 22.7249 69.9624 21.8457 69.9624 20.8445C69.9624 19.1595 70.463 17.8652 71.4643 16.9616C72.4655 16.058 74.0162 15.4964 76.1164 15.2766L80.9151 14.7637V14.5073C80.9151 13.7991 80.5976 13.2985 79.9627 13.0054C79.3522 12.688 78.4608 12.5292 77.2886 12.5292C76.3606 12.5292 75.4571 12.6269 74.5779 12.8223C73.6988 13.0176 72.9051 13.2619 72.1969 13.5549C71.8794 13.3351 71.6108 13.0054 71.391 12.5659C71.1712 12.1019 71.0613 11.6257 71.0613 11.1373C71.0613 10.5023 71.2079 10.0017 71.5009 9.63538C71.8184 9.24465 72.2946 8.91497 72.9295 8.64634C73.6377 8.37771 74.468 8.18235 75.4204 8.06024C76.3973 7.93814 77.313 7.87709 78.1678 7.87709Z" fill="#F66F6F"/>
            <path d="M97.104 26.1926C96.8354 26.2415 96.4325 26.3025 95.8952 26.3758C95.3824 26.4735 94.8573 26.5223 94.3201 26.5223C93.7828 26.5223 93.2944 26.4857 92.8548 26.4124C92.4397 26.3392 92.0856 26.1926 91.7925 25.9728C91.4995 25.7531 91.2675 25.46 91.0965 25.0937C90.95 24.703 90.8767 24.2023 90.8767 23.5918V2.34579C91.1454 2.29695 91.5361 2.2359 92.0489 2.16264C92.5862 2.06495 93.1235 2.01611 93.6607 2.01611C94.198 2.01611 94.6742 2.05274 95.0893 2.12601C95.5289 2.19927 95.8952 2.34579 96.1883 2.56558C96.4813 2.78537 96.7011 3.09062 96.8476 3.48136C97.0186 3.84767 97.104 4.33608 97.104 4.9466V26.1926Z" fill="#F66F6F"/>
            <path d="M110.448 26.8154C109.007 26.8154 107.664 26.62 106.418 26.2293C105.197 25.8141 104.123 25.2036 103.195 24.3977C102.291 23.5918 101.571 22.5784 101.034 21.3573C100.521 20.1363 100.264 18.7077 100.264 17.0715C100.264 15.4597 100.521 14.08 101.034 12.9322C101.571 11.76 102.267 10.8076 103.122 10.075C103.976 9.31791 104.953 8.76844 106.052 8.42655C107.151 8.06024 108.274 7.87709 109.422 7.87709C110.716 7.87709 111.889 8.07245 112.939 8.46318C114.013 8.85392 114.929 9.39117 115.686 10.075C116.467 10.7587 117.066 11.5768 117.481 12.5292C117.921 13.4816 118.14 14.5195 118.14 15.6429C118.14 16.4732 117.908 17.1081 117.444 17.5477C116.98 17.9873 116.333 18.2681 115.503 18.3902L106.455 19.7456C106.724 20.5514 107.273 21.162 108.103 21.5771C108.934 21.9678 109.886 22.1632 110.961 22.1632C111.962 22.1632 112.902 22.0411 113.781 21.7969C114.685 21.5283 115.417 21.223 115.979 20.8811C116.37 21.1253 116.699 21.4672 116.968 21.9068C117.237 22.3464 117.371 22.8104 117.371 23.2988C117.371 24.3977 116.858 25.2158 115.833 25.7531C115.051 26.1682 114.172 26.449 113.195 26.5956C112.218 26.7421 111.302 26.8154 110.448 26.8154ZM109.422 12.4193C108.836 12.4193 108.323 12.517 107.884 12.7124C107.468 12.9078 107.127 13.1642 106.858 13.4816C106.589 13.7747 106.382 14.1166 106.235 14.5073C106.113 14.8736 106.04 15.2521 106.015 15.6429L112.279 14.6172C112.206 14.1288 111.937 13.6404 111.473 13.152C111.009 12.6635 110.326 12.4193 109.422 12.4193Z" fill="#F66F6F"/>
            <path d="M127.365 26.1926C127.121 26.2659 126.73 26.3392 126.193 26.4124C125.68 26.4857 125.143 26.5223 124.581 26.5223C124.044 26.5223 123.555 26.4857 123.116 26.4124C122.701 26.3392 122.347 26.1926 122.054 25.9728C121.76 25.7531 121.528 25.46 121.358 25.0937C121.211 24.703 121.138 24.2023 121.138 23.5918V12.6025C121.138 12.0408 121.235 11.5646 121.431 11.1739C121.651 10.7587 121.956 10.3924 122.347 10.075C122.737 9.75748 123.214 9.47664 123.775 9.23244C124.361 8.96381 124.984 8.73181 125.643 8.53645C126.303 8.34108 126.987 8.19456 127.695 8.09687C128.403 7.97477 129.111 7.91372 129.819 7.91372C130.992 7.91372 131.919 8.14571 132.603 8.60971C133.287 9.04928 133.629 9.7819 133.629 10.8076C133.629 11.1495 133.58 11.4914 133.482 11.8332C133.385 12.1507 133.263 12.4438 133.116 12.7124C132.603 12.7124 132.078 12.7368 131.541 12.7857C131.004 12.8345 130.479 12.9078 129.966 13.0054C129.453 13.1031 128.965 13.213 128.501 13.3351C128.061 13.4328 127.682 13.5549 127.365 13.7014V26.1926Z" fill="#F66F6F"/>
            <path d="M142.425 20.1119C142.425 20.7468 142.621 21.1986 143.011 21.4672C143.427 21.7358 144 21.8702 144.733 21.8702C145.099 21.8702 145.478 21.8457 145.869 21.7969C146.259 21.7236 146.601 21.6382 146.894 21.5405C147.114 21.8091 147.297 22.1144 147.444 22.4563C147.615 22.7737 147.7 23.1645 147.7 23.6285C147.7 24.5564 147.346 25.3135 146.638 25.8996C145.954 26.4857 144.733 26.7787 142.975 26.7787C140.826 26.7787 139.165 26.2903 137.993 25.3135C136.845 24.3367 136.271 22.7493 136.271 20.5514V4.87334C136.54 4.80008 136.918 4.72681 137.407 4.65355C137.92 4.55587 138.457 4.50703 139.019 4.50703C140.093 4.50703 140.923 4.70239 141.509 5.09312C142.12 5.45943 142.425 6.25311 142.425 7.47414V9.81853H147.224C147.37 10.0872 147.505 10.4291 147.627 10.8442C147.773 11.2349 147.847 11.6745 147.847 12.1629C147.847 13.0176 147.651 13.6404 147.261 14.0311C146.894 14.3974 146.394 14.5806 145.759 14.5806H142.425V20.1119Z" fill="#F66F6F"/>
          </svg> 
        */}
      </>
    ),
    [type],
  );

  const processPages = React.useCallback(
    () => pages.map(({ url, name, slideIndex }, i) => {
      switch (url[0]) {
        case '/':// for page navs use buttons
          return (
            <Box
              key={name}
              onClick={() => navigateToPage(url, slideIndex)}
              sx={{
                transform: { xs: 'scale(.75)' },
                pointer: 'cursor',
              }}
            >
              <RegularButton
                size="small"
                style={{ fontSize: '.5rem !important' }}
              >
                {boldCurrentPage(name.toUpperCase(), i)}
              </RegularButton>
            </Box>
          );
        case '#':// for internal links use anchors
          return (
            <Box
              key={name}
              onClick={() => navigateToPage(url, slideIndex)}
              sx={{ ...pageLinkStyles }}
            >
              {boldCurrentPage(name.toUpperCase(), i)}
            </Box>
          );
        default:
          return null;
      }
    }),
    [],
  );
 

  const trigger = useScrollTrigger({
    target: window ? window() : undefined,
    threshold: 6000,
    disableHysteresis: true,
  });

  // contains drawer for the menu
  // ========================================================================== //
  // Popup drawer Menu
  // ========================================================================== //
  const drawerMenu = React.useCallback(() => (
    <Box
      role="presentation"
      onClick={(e) => toggleDrawer(e)}
      onKeyDown={(e) => toggleDrawer(e)}
      sx={{
        height: '100vh',
        width: { sm: '100vw', xs: '100vw' },
        display: 'inline-flex',
        flexDirection: 'column',
      }}
    >

      <div
        id="menu-header"
        style={{
          display: 'inline-flex',
          padding: 30,
          justifyContent: 'center',
          width: '100%',
          height: '23.5%',
        }}
      >
        <RegularButton
          type="icon"
          icon={{ type: 'close', enabled: true }}
          onClick={() => setDrawerState(true)}
        />
      </div>

      <List
        sx={{
          flexDirection: { sm: 'row', xs: 'column' },
          overflow: 'hidden',
          height: '61.72%',
          width: '100%',
          border: theme.custom.borders.brandBorder,
          color: theme.palette.text.secondary,
          background: theme.palette.text.primary,
          alignItems: 'center',
          display: 'inline-flex',
        }}
      >
        {pages.map(({ name, url, slideIndex }, index) => (
          <ListItem
            button
            style={{ justifyContent: 'center', maxWidth: '300' }}
            key={name}
            onClick={() => {
              navigateToPage(url);
              toggleDrawer();
            }}
          >
            <Typography
              variant="h2"
              sx={{
                ...pageLinkStyles,
                color: 'currentColor',
                // fontSize: '2rem',
                textTransform: 'capitalize',
                display: 'inline-flex',
                justifyContent: 'center',
              }}
              onClick={() => navigateToPage(url, slideIndex)}
            >
              {boldCurrentPage(name, index)}
            </Typography>
          </ListItem>
        ))} 
      </List>

      <div
        id="menu-footer"
        style={{
          height: '27.1%',
          width: '100%',
          gap: 60,
          display: 'inline-flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 30,
          color: theme.palette.text.primary,
        }}
      >

        <div
          id="theme-switch"
          style={{
            display: 'inline-flex',
            height: 100,
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 10,
            color: theme.palette.text.primary,
          }}
        >
          <Typography width="100%" gutterBottom variant="body1" color="currentColor" align="center">{`${type} theme`}</Typography>
          <div
            id="social-media"
            style={{
              display: 'inline-flex', width: '100%', flexDirection: 'row', alignItems: 'center', gap: 10,
            }}
          >
            <button
              type="button"
              onClick={() => toggleTheme()}
              style={{
                background: theme.palette.text.primary,
                width: 50,
                height: 50,
                position: 'relative',
                border: '1px solid black',
                borderRadius: '100%',
                display: 'inline-flex',
                justifyContent: 'center',
                alignItems: 'center',
                color: theme.palette.text.secondary,
                border: theme.custom.borders.brandBorder,
              }}
              aria-label="change theme"
            >
              {(type === 'light' && <Brightness5 />) || <Brightness2 />}
            </button>
          </div>
        </div>

        <div
          id="social-media-container"
          style={{
            display: 'inline-flex',
            width: '100%',
            height: 100,
            flexDirection: 'column',
            maxWidth: 250,
            alignItems: 'center',
            gap: 10,
            color: theme.palette.text.primary,
          }}
        >
          <Typography width="100%" gutterBottom variant="body1" color="currentColor" align="center">Follow me</Typography>
          <div
            id="social-media"
            style={{
              display: 'inline-flex', width: '100%', flexDirection: 'row', alignItems: 'center', gap: 10,
            }}
          >
            <RegularButton
              type="icon"
              icon={{ enabled: true, type: 'instagram' }}
              onClick={() => navigateToPage('./instagram')}
            />
            <RegularButton
              type="icon"
              icon={{ enabled: true, type: 'linkedin' }}
              onClick={() => navigateToPage('./linkedin')}
            />
            <RegularButton
              type="icon"
              icon={{ enabled: true, type: 'github' }}
              onClick={() => navigateToPage('./github')}
            />
            <RegularButton
              type="icon"
              icon={{ enabled: true, type: 'facebook' }}
              onClick={() => navigateToPage('./facebook')}
            />
            <div />
          </div>

        </div>

      </div>
    </Box>
  ), [drawerState]);
    // ========================================================================== //
    //     Drawer
    // ========================================================================== //
  const drawerSwitch = React.useCallback(() => (
    <React.Fragment key="drawer">
      <Button
        // sx={{ ...menuIconStyles }}
        onClick={(e) => { toggleDrawer(e); }}
      >
        {menuIcon()}
      </Button>
      <SwipeableDrawer
          // isableBackdropTransition={!iOS}
        onOpen={() => setDrawerState(true)}
        onClose={() => setDrawerState(false)}
        disableDiscovery={iOS}
        anchor="bottom"
        open={drawerState}
        sx={{}}
      >
        {drawerMenu()}
      </SwipeableDrawer>
    </React.Fragment>
  ),
  [drawerState]);

  // ========================================================================== //
  //     app bar
  // ========================================================================== //
  return (
    <>
      <div style={{ height: 100 }} />
      <Slide appear direction="down" in={!trigger}>
        <AppBar
          elevation={!trigger ? 6 : 0}
          position="fixed"
          sx={{
            boxShadow: (theme) => theme.custom.shadows.brand,
            zIndex: 30, // hidhest
            minHeight: 85,
            height: 100,
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            color: 'text.secondary',
            borderBottom: (theme) => theme.custom.borders.brandBorder,
            padding: {
              xs: 2,
              sm: 2,
              md: [2, 0],
            },
          }}
        >

          <Grid item sm={false} md={10} style={{ width: '100%' }}>
            <Toolbar disableGutters style={{ height: '100%', display: 'flex', justifyContent: 'space-between' }}> 
              <Box sx={{ ...pageNavigationStyles }} style={{ zIndex: 30 }}>
                {logo()}
                {processPages(pages)} 
                <SignInStatus/>
              </Box>
            </Toolbar>
          </Grid>

        </AppBar>
      </Slide>
    </>
  );
};
 

export default Navigation;
