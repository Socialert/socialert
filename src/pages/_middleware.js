import { redirect } from "next/dist/server/api-utils"
//fetchEvent
//response
//request
//redirect
//nextmiddleware
//access server side functionality from next
export function middleware(req) {
//   const res = redirect('./') // creates an actual instance
//   res.cookie('hello', 'world') // can be called on an instance
//   return res
}

// export function middleware(req)  {
//     // if the request is coming from New York, redirect to the home page
//     if (req.geo.city === 'New York') {
//       return redirect('/home')
//       // if the request is coming from London, rewrite to a special page
//     } else if (req.geo.city === 'London') {
//       return rewrite('/not-home')
//     }
  
//     return NextResponse.json({ message: 'Hello World!' })
//   }