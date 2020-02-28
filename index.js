#!/usr/bin/env node
// ɢ⃤
const _ = require('lodash');
const colors = require('colors');
const process = require('process');
const argparse = require('argparse');
const puppeteer = require('puppeteer');

const package = require('./package.json')

const userAgents = [
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/79.0.3945.0 Safari/537.36',
  'Mozilla/5.0 (Linux; U; Android 4.4.2; en-us; SCH-I535 Build/KOT49H) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30',
  'Mozilla/5.0 (Linux; Android 9; SM-G955U) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.93 Mobile Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.79 Safari/537.36 Edge/14.14393',
  'Mozilla/5.0 (Windows; U; MSIE 7.0; Windows NT 6.0; en-US)',
  'Mozilla/5.0 (compatible, MSIE 11, Windows NT 6.3; Trident/7.0; rv:11.0) like Gecko',
  'Mozilla/5.0 (iPad; CPU OS 8_4_1 like Mac OS X) AppleWebKit/600.1.4 (KHTML, like Gecko) Version/8.0 Mobile/12H321 Safari/600.1.4',
  'Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_1 like Mac OS X) AppleWebKit/603.1.30 (KHTML, like Gecko) Version/10.0 Mobile/14E304 Safari/602.1',
  'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
  'Mozilla/5.0 (Linux; Android 7.0; HTC 10 Build/NRD90M) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.83 Mobile Safari/537.36',
  'curl/7.35.0',
  'Wget/1.15 (linux-gnu)',
];

const ap = new argparse.ArgumentParser({
  version: package.version,
  addHelp: true,
  description: package.description,
});

ap.addArgument('target', {
  help: 'Url with protocol. Ex: https://domain.com'
});
ap.addArgument(['-c', '--capture'], {
  help: 'Catch only this asset on the target URL',
  defaultValue: false,
});

const args = ap.parseArgs();

let whitelist = [
    args.target,   // The main target always needs to be in the whitelist.
    `${args.target}/`,  // Add ad extra / to the main target url
    args.capture,
];

/**
 * JSON Structure:
 *
 * {
 *   [User-Agent]: {
 *     [url] : {
 *       body: <String>,
 *       length: <Number>,
 *       status: <Number>,
 *       headers: {
 *         req: <Puppeteer Request>
 *         res: <Puppeteer Response>
 *       }
 *     }, ...
 *   }, ...
 * }
 */
const data = {};

const detectAnomaly = (data) => {
  const zip = {};
  for (let ua in data) {
    for (let url in data[ua]) {
      if (zip[url]) {
        zip[url].push(data[ua][url].length);
      } else {
        zip[url] = [data[ua][url].length];
      }
    }
  }

  for (let url in zip) {
    if (_.uniq(zip[url]).length > 1) {
      console.log(`${'-'.repeat(31)}`);
      console.log(`${'⚠️'.yellow} User-Agent Anomaly Detected: ${url.red}\n`);
      userAgents.forEach((ua, indx) => {
        const value = zip[url][indx];
        console.log(` * ${ua} => ${value ? value.toString().green : '0'.green}`);
      });
    }
  }
}

puppeteer.launch({
  args: [
    '--disable-gpu',
    '--disable-dev-shm-usage',
    '--disable-setuid-sandbox',
    '--no-first-run',
    '--no-sandbox',
    '--no-zygote',
    '--single-process',
  ],
}).then(async browser => {
  const promises = [];

  for (let i = 0; i < userAgents.length; i++) {
    promises.push(browser.newPage().then(async page => {
      const ua = userAgents[i];
      data[ua] = {};

      await page.setUserAgent(ua);
      await page.setRequestInterception(true);

      page.on('response', async res => {
        if (res.status() === 200) {
          res.text().then(body => {
            data[ua][res.url()] = {
              'body': body,
              'length': body.length,
              'status': res.status(),
              'headers': {
                'req': res.request().headers(),
                'res': res.headers(),
              },
            };

          }).catch(err => {});
        }
      });

      page.on('request', req => {
        if (args.capture) {
          if (whitelist.indexOf(req.url()) > -1) {
            return req.continue();
          }

          return req.abort();
        }

        return req.continue();
      });

      page.on('error', err => {});

      await page.goto(args.target, {
        waitUntil: 'networkidle0'
      });
    }));
  };

  await Promise.all(promises);
  await browser.close();

  detectAnomaly(data);

}).catch(err => {
  detectAnomaly(data);
  process.exit();
});
