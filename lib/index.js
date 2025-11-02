const { args, hasFlag } = require('zrgs')
const exit = require('zeelib/lib/exit')
const pup = require('puppeteer')
const lh = require('lighthouse')
const generateHtml = require('lighthouse/lighthouse-core/report/report-generator').generateReportHtml

const usage = () => {
  console.log('litepup [url]')
  console.log('example: litepup http://example.com')
  console.log('html output example: litepup --html http://example.com')
  exit(0)
}

const config = {
  viewport: {
    width: 1920,
    height: 1080
  }
}

const run = async (url, html) => {
  try {
    const browser = await pup.launch({
      args: [ '--remote-debugging-port=9222', '--no-sandbox' ]
    })
    const page = await browser.newPage()
    await page.setViewport(config.viewport)
    const { lhr } = await lh(url)
    if (html) {
      console.log(generateHtml(lhr))
    } else {
      console.log(JSON.stringify(lhr, null, 2))
    }
    await browser.close()
  } catch (e) {
    console.trace(e)
  }
}

const handleArgs = () => {
  let html = false
  if (!args.length || hasFlag('help')) {
    usage()
  }
  if (hasFlag('html')) {
    html = true
  }
  const url = args[args.length - 1]
  run(url, html)
}

module.exports = handleArgs()
