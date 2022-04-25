import { Box } from '@mui/material'
import { signIn, signOut, useSession } from 'next-auth/react'
import { RegularButton } from '../theme/buttons'

export const SignInStatus = () => {
  const { data: session, status } = useSession()
  const loading = status === 'loading'
  return (
    <div>
      {loading && <>Loading...</>}
      {session && (
        <Box sx={{display:'flex',alignItems:'left',gap: 4}}>
          Signed in as <img src={session.user.image} height={'20px'} />{' '}
          {session.user.name}{' '} 
          <RegularButton
            onClick={() => {
              signOut()
            }}
          >
            Sign out
          </RegularButton>
        </Box>
      )}
      {!session && !loading && (
        <Box sx={{display:'flex',alignItems:'left',gap: 4}}>
          Not signed in{' '}
          <RegularButton
            onClick={() => {
              signIn()
            }}
          >
            Sign in
          </RegularButton>
        </Box>
      )}
    </div>
  )
}