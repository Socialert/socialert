const webpack = require('webpack')
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true'
})


// ========================================================================== //
// Next Plugin Wrappers
// ========================================================================== //
const withPWA = require('next-pwa')

// https://nextjs.org/docs/advanced-features/using-mdx
const withMDX = require('@next/mdx')({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
    // If you use `MDXProvider`, uncomment the following line.
    // providerImportSource: "@mdx-js/react",
  },
})

//get env variables with dotenv
const { parsed: myEnv } = require('dotenv').config({ path: `${process.cwd()}/.${process.env}.env` })

// ========================================================================== //
// Main Configuration
// ========================================================================== //
module.exports = withMDX(withPWA({
  // ========================================================================== //
  //     Server Configuration
  // ========================================================================== //
  onDemandEntries: {
    // period (in ms) where the server will keep pages in the buffer
    maxInactiveAge: 25 * 1000,
    // number of pages that should be kept simultaneously without being disposed
    pagesBufferLength: 2
  },

  //handle specify mapping of request paths to page destinations
  exportPathMap: async function (defaultPathMap, { dev, dir, outDir, distDir, buildId }) {
    return {
      //   '/': { page: '/' },
      //   '/about': { page: '/about' },
      //   '/p/hello-nextjs': { page: '/post', query: { title: 'hello-nextjs' } },
      //   '/p/learn-nextjs': { page: '/post', query: { title: 'learn-nextjs' } },
      //   '/p/deploy-nextjs': { page: '/post', query: { title: 'deploy-nextjs' } },
    }
  },

  // ========================================================================== //
  // App Configuration
  // ========================================================================== //

  basePath: '',

  // distDir: 'build',

  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'mdx', 'md'],

  trailingSlash: true,

  reactStrictMode: true,

  //for a CDN hosted app, set the public path to the CDN
  assetPrefix: '', //isProd ? 'https://cdn.mydomain.com' : '',
  
  // !! WARN !!
  //ensure your modules your importing over http are safe to use
  // experimental: {
  //     urlImports: ['https://example.com/modules/'],
  //   },
  
  devIndicators: {
    buildActivity: true,
    buildActivityPosition: 'bottom-right',
  },

  // ========================================================================== //
  //handles default http header configuration
  async headers() {
    return [
      {
        source: '/*',
        has: {
          'Content-Security-Policy': [
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
            "style-src 'self' 'unsafe-inline'",
            "font-src 'self'",
            "img-src 'self' data:",
            "connect-src 'self' ws: wss:",
            "media-src 'self'",
            "frame-src 'self'",
            "object-src 'none'",
            "base-uri 'self'",
            "form-action 'self'",
            "frame-ancestors 'self'",
            'block-all-mixed-content',
            'upgrade-insecure-requests',
            'report-uri /csp-report'
          ]
        },
        headers: [
          {
            key: 'x-socialert',
            value: 'my custom header value'
          },
          {
            key: 'x-another-socialert',
            value: 'my other custom header value'
          }
        ]
      }
    ]
  },
  // ========================================================================== //
  
  // ========================================================================== //
  //handles redirects and maintaining strict url path requirements
  async redirects() {
    return [
      {
        source: '/dashboard/*',
        destination: '/login',
        permanent: false,
        locale: false
      },
      // if the header `x-redirect-me` is present,
      // this redirect will be applied
      {
        source: '/:path((?!another-page$).*)',
        has: [
          {
            type: 'header',
            key: 'x-redirect-me'
          }
        ],
        locale: false,
        permanent: false,
        destination: '/another-page'
      },
      // if the source, query, and cookie are matched,
      // this redirect will be applied
      {
        source: '/specific/:path*',
        has: [
          {
            type: 'query',
            key: 'page',
            // the page value will not be available in the
            // destination since value is provided and doesn't
            // use a named capture group e.g. (?<page>home)
            value: 'home'
          },
          {
            type: 'cookie',
            key: 'authorized',
            value: 'true'
          }
        ],
        locale: false,
        permanent: false,
        destination: '/another/:path*'
      },
      // if the header `x-authorized` is present and
      // contains a matching value, this redirect will be applied
      {
        source: '/',
        has: [
          {
            type: 'header',
            key: 'x-authorized',
            value: '(?<authorized>yes|true)'
          }
        ],
        locale: false,
        permanent: false,
        destination: '/home?authorized=:authorized'
      },
      // if the host is `example.com`,
      // this redirect will be applied
      {
        source: '/:path((?!another-page$).*)',
        has: [
          {
            type: 'host',
            value: 'example.com'
          }
        ],
        locale: false,
        permanent: false,
        destination: '/another-page'
      }
    ]
  },
  // ========================================================================== //
  
  // ========================================================================== //
  //handle consistend build id's to identify builds instanced by version
  generateBuildId: async () => {
    // You can, for example, get the latest git commit hash here
    return 'my-build-id'
  },
  // ========================================================================== //

  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true
  },

  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true
  },

  //handles runtime configuration
  // serverRuntimeConfig: {
  //     // Will only be available on the server side
  //     mySecret: 'secret',
  //     secondSecret: process.env.SECOND_SECRET, // Pass through env variables
  //   },
  publicRuntimeConfig: {
    staticFolder: '/static',
    apuUrl: process.env.NODE_ENV === "development" ? `http://${process.env.APP_DOMAIN}${process.env.API_URL}` : `http://localhost:3000${process.env.API_URL}`,
  },

  serverRuntimeConfig: {
    mySecret: process.env.JWT_SECRET,
  },
  
  publicRuntimeConfig: {
    apiUrl: process.env.NODE_ENV === 'development'
      ? 'http://localhost:3000/api' // development api
      : 'http://localhost:3000/api' // production api
  }

  // ========================================================================== //
  //     App settings
  // ========================================================================== //
  
  i18n: {
    locales: ['en', 'fr', 'de'],
    defaultLocale: 'en'
  },

  pwa: {
    dest: 'public'
  },

  webpack(config, options) {
    config.plugins.push(new webpack.EnvironmentPlugin(myEnv)) //add env variables to webpack
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack']
    })
    return config
  },

  env: {
    ...process.env
  }

}))
