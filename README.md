# User-Agent Anomaly Detection

This script will analyze a URL by loading all assets on the page with different user-agents showing differences in the response sizes and payloads delivered. This uses Chrome Headless + Puppeteer to mimick a real browser so we can see how a page would normally operate. This would then catch any other assets or api requests that get loaded after a page is ready.

Useful for finding suspicous assets located on a URL.

### Install
```sh
$ npm install -g uaad
```

### Usage
```sh
$ uaad -h
usage: uaad [-h] [-v] [-c URL] [-o FILE] target

User Agent Anomaly Detector

Positional arguments:
  target                Url with protocol. Ex: https://domain.com

Optional arguments:
  -h, --help            Show this help message and exit.
  -v, --version         Show program's version number and exit.
  -c URL, --capture URL
                        Catch only this asset on the target URL
  -o FILE, --output FILE
                        Output the JSON data structure to file instead of
                        showing anonmaly information
```

### Example
Real life example showing some bad assets that included on a 'good' site.

Note the output shows the detected asset, the different user-agents that loaded those assets, along with the response size.

```sh
$ uaad hXXp://nsfwyoutube[.]com

-------------------------------
⚠️ User-Agent Anomaly Detected: http://aptantasp.site/fWyB1y7INFwnUPH2z/17740

 * Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/79.0.3945.0 Safari/537.36 => 5
 * Mozilla/5.0 (Linux; U; Android 4.4.2; en-us; SCH-I535 Build/KOT49H) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30 => 146112
 * Mozilla/5.0 (Linux; Android 9; SM-G955U) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.93 Mobile Safari/537.36 => 145818
 * Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.79 Safari/537.36 Edge/14.14393 => 5
 * Mozilla/5.0 (Windows; U; MSIE 7.0; Windows NT 6.0; en-US) => 5
 * Mozilla/5.0 (compatible, MSIE 11, Windows NT 6.3; Trident/7.0; rv:11.0) like Gecko => 5
 * Mozilla/5.0 (iPad; CPU OS 8_4_1 like Mac OS X) AppleWebKit/600.1.4 (KHTML, like Gecko) Version/8.0 Mobile/12H321 Safari/600.1.4 => 145713
 * Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_1 like Mac OS X) AppleWebKit/603.1.30 (KHTML, like Gecko) Version/10.0 Mobile/14E304 Safari/602.1 => 145980
 * Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html) => 0
 * Mozilla/5.0 (Linux; Android 7.0; HTC 10 Build/NRD90M) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.83 Mobile Safari/537.36 => 145790
 * curl/7.35.0 => 5
 * Wget/1.15 (linux-gnu) => 5
-------------------------------
⚠️ User-Agent Anomaly Detected: http://beiven.pw/tKXtIIyGjuIpQ/14956

 * Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/79.0.3945.0 Safari/537.36 => 5
 * Mozilla/5.0 (Linux; U; Android 4.4.2; en-us; SCH-I535 Build/KOT49H) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30 => 136138
 * Mozilla/5.0 (Linux; Android 9; SM-G955U) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.93 Mobile Safari/537.36 => 135967
 * Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.79 Safari/537.36 Edge/14.14393 => 5
 * Mozilla/5.0 (Windows; U; MSIE 7.0; Windows NT 6.0; en-US) => 5
 * Mozilla/5.0 (compatible, MSIE 11, Windows NT 6.3; Trident/7.0; rv:11.0) like Gecko => 5
 * Mozilla/5.0 (iPad; CPU OS 8_4_1 like Mac OS X) AppleWebKit/600.1.4 (KHTML, like Gecko) Version/8.0 Mobile/12H321 Safari/600.1.4 => 135994
 * Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_1 like Mac OS X) AppleWebKit/603.1.30 (KHTML, like Gecko) Version/10.0 Mobile/14E304 Safari/602.1 => 129418
 * Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html) => 0
 * Mozilla/5.0 (Linux; Android 7.0; HTC 10 Build/NRD90M) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.83 Mobile Safari/537.36 => 135626
 * curl/7.35.0 => 5
 * Wget/1.15 (linux-gnu) => 5
```

From this real life example we notice 2 suspicious anomalies. From the first anomaly we can see that the response size for real/mobile browsers is around 145k where as cURL/wget/google bot user-agents we get a very small response. What are they trying to hide from those user-agents?
