import { Box, Typography } from '@mui/material';
import React, {
  Component, useEffect, useState, useCallback,
} from 'react';
import { Post }  from '../components/cards'
import Masonry from '../components/custom/masonry';
import Layout from '../layout/layout';
import { useStore } from '../store/store';

//some reference
//https://stackoverflow.com/questions/60565918/you-cannot-use-different-slug-names-for-the-same-dynamic-path-nextjs
//getServerSideProps()//called on every request -> tells next to pre-render page using data returned from getServerSideProps
//getStaticPaths()//if there are dynamic routes/aka pages you need to define a list of paths to be generated ie: a post can have a seperate page to view that SPECIFIC post, therefore its dynamic and a route should be created for it
//getStaticProps()//called on every page request -> get data to pass to the page


// This function gets called at build time, it grabs the current cache, if nothing is there, it requests data from the database
// export async function getStaticProps() { 
//   // const userCache = useStore.getState((state) => state.cache.users);
//   // const updateThisCache = useStore.getState((state) => state.cache.updateThisCache);
//   // const user = useStore.getState((state) => state.user);
//   // if (userCache.length === 0) {
  //   //   const users = await getUsers();
  //   //   updateThisCache(...users);
  //   // }
  //   // return {props: {users: userCache}}
  //   const userData = await getUsers({ name: 'aiden' }).then(
    //     res => console.log(JSON.stringify(res.data)),
    //   ).catch(err => console.log(err));
    //   return {props: {users: userData}}
    // }
    function Dashboard({ users, children, pageProps }) {
      // const getUsers = useStore(state=>state.user.methods.getUsers);
      
      // useEffect(() => {
      //   const fetchData = async () => {
      //     return await getUsers('') 
      //   }
      //   fetchData();
      // }, [])
      return (
        <Box {...pageProps} sx={{
          width: '100%',
          height: '100%',
          p: 6,
      }}>
      {/* {children}
      {users && (users.map((post) => (
        <Card key={users.usersId} data={users} />
      )))} */}
          <Typography color='textPrimary' variant='h1' gutterBottom>SearchBar</Typography>
          <Typography color='textPrimary' variant='h1' gutterBottom>Dashboard</Typography>
          <Masonry CardComponent={Post}/>
          <Typography color='textPrimary' variant='h1' gutterBottom>List</Typography>
          <Typography color='textPrimary' variant='h1' gutterBottom>UserCard</Typography>
          <Typography color='textPrimary' variant='h1' gutterBottom>Comments</Typography>
          <Typography color='textPrimary' variant='h1' gutterBottom>Likes</Typography>
          <Typography color='textPrimary' variant='h1' gutterBottom>Campaigns</Typography>
          <Typography color='textPrimary' variant='h1' gutterBottom>Profile</Typography>
          <Typography color='textPrimary' variant='h1' gutterBottom>Profile</Typography>
    </Box>);
}

export default Dashboard;


//git create a new branch of a repository 
