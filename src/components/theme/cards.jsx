import { Box } from '@mui/material'
import { a } from '@react-spring/web'
import React from 'react'
import {
  RegularButton,
} from "./buttons" 


export const ParentToCard = (props) => {
  const { children, window } = props
  // if (typeof window === "undefined") return
  return <Post text='hello world'>pass your other content into card here</Post>
}

const mockData = {
  post: {
    userName: 'John Doe',
    userId: '12345',
    userImage: 'https://randomuser.me/api/portraits/',
    postId: '12345',
  },
  metrics: {
    likes: '2,000',
    comments: '2,000',
    campaigns: '2,000',
    shares: '2,000',
    profile: '2,000',
    publicOrPrivate: 'Public',
  },
  methods: {
    // edit/delete
    // like/share/comment
    // view profile
    // view campaign
  }
}

export const Comment = ({ text, children, data = mockData }) => {
  return (
    <Box sx={{
      width: '100%',
      height: '100%',
      p: 6,
    }}>
      <Typography color='textPrimary' variant='h1' gutterBottom>Comment</Typography>
      <Typography color='textPrimary' variant='h1' gutterBottom>{text}</Typography>
    </Box>
  )
}

export const Post = ({ text, children, data=mockData,img,style }) => {
  const postStyles = {
    container: {
      position: `absolute`,
      willChange: `transform, width, height, opacity`,
      padding: `15px`,
    },
    content: {
      position: `relative`,
      backgroundSize: `cover`,
      backgroundPosition: `center center`,
      width: `100%`,
      height: `100%`,
      overflow: `hidden`,
      textTransform: `uppercase`,
      fontSize: `10px`,
      lineHeight: `10px`,
      borderRadius: `4px`,
      boxShadow: `0px 10px 50px -10px rgba(0, 0, 0, 0.2)`,
    }
  }
  return ( 
    <a.div style={{...style,...postStyles.container}}>
      <Box
        sx={{
          ...postStyles.content,
          width: {
            xs: 200,
            md: 500,
            lg: 500,
            xl: 1000,
          },
          height: 469,
          flexGrow: 0,
          m: 4,
          p: 4,
          color: (theme) => theme.palette.text.secondary,
          borderRadius: 3,
          boxShadow:
            '1px 0 5px 0 rgba(0, 0, 0, 0.43), inset 0 -4.5px 0 0 var(--style-secondary-color), inset 0 -1px 0 0 rgba(0, 0, 0, 0.52)',
          backgroundColor: (theme) => theme.palette.text.primary
        }}
      >
        <div style={{backgroundImage: `url(${img}?auto-compress&dpr=2&h=500&w=500)`}} />
        {text}
        {children}
        <RegularButton
          icon={{enabled: true, type:'close'}}
        >
            Hello world
        </RegularButton>
      </Box>
    </a.div> 
  )
} 

{/* <Box>Share Post</Box>
<Box>Make Comment</Box>
<Box>Like</Box>
<Box>Media</Box>
<Box>Profile</Box>
<Box>Date</Box>
<Box>Message</Box>
<Box></Box> */}