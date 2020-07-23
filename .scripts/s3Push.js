const cmd = require('node-cmd')

// const cliCmds = [
//   'aws s3 sync --delete dist "s3://gccawana.com" --cache-control "public, max-age=3600, must-revalidate" --content-type "text/html; charset=utf-8" --exclude "*" --include "*.html"',
//   'aws s3 sync --delete dist "s3://gccawana.com" --cache-control "public, max-age=604800, immutable" --exclude "*" --include "*.js"',
//   'aws s3 sync --delete dist "s3://gccawana.com" --cache-control "public, max-age=14400, must-revalidate" --exclude "*.html" --exclude "*.js"'
// ]

const cliCmds = [
  'aws s3 sync --delete dist "s3://gccawana.com" --cache-control "no-cache, max-age=0" --content-type "text/html; charset=utf-8" --exclude "*" --include "*.html"',
  'aws s3 sync --delete dist "s3://gccawana.com" --cache-control "no-cache, max-age=0" --exclude "*.html" --include "*"',
]

cliCmds.forEach(cliCmd => {
  cmd.get(cliCmd, (error, data, stderr) => {
    console.log(data)
    if (error) throw error
  })
})