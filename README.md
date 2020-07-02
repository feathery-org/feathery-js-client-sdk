# feathery-js-client-sdk

> JavaScript SDK for Feathery

[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Installation

Using NPM / Yarn

```bash
npm install feathery-js-client-sdk --save
```
OR
```
yarn add feathery-js-client-sdk
```

## Usage

Access settings from the `FeatheryClient` class.

```JavaScript
import FeatheryClient from 'feathery-js-client-sdk'
```

Initialize `FeatheryClient` with `sdkKey` and `userKey`.

```JavaScript
const client = new FeatheryClient(sdkKey, userKey);
```

`sdkKey` and `userKey` should be `string`s.
If they aren't, `SdkKeyError` and `UserKeyError` are raised.

Errors can be accessed in the following way.

```JavaScript
import { featheryErrors } from 'feathery-js-client-sdk'
```

`featheryErrors.SdkKeyError`: An invalid SDK key has been set\
`featheryErrors.UserKeyError`: An invalid user key has been set\
`featheryErrors.FetchError`: Settings are unable to be fetched

The `client` object  used to access the settings, once they are fetched in promise. If the fetching fails, approproate errors are raised, which can be caught using `.catch()`.

Settings can be accessed asynchronously by resolving an internal promise.
```JavaScript
const client = new FeatheryClient(sdkKey, userKey);

client.resolve
    .then(settings => {/* Do something with settings */})
    .catch(error => {/* Do something with the error */})
```

The loading status of the settings can be obtained via the `loaded` property on the client instance. It is `false` when settings haven't been loaded or an error has occured. If the settings are available, it is `true`.

```JavaScript
client.loaded; // can be true or false
```

Once settings have been successfully fetched, they can be accessed via the `variation` method on the client instance.
`variation` expects two arguments:

1. Setting key
2. Default value fallback if the setting can't be returned

```JavaScript
client.variation(settingKey, defaultValue);
```

### Example

```JavaScript
const defaultLanguage = client.variation('language', 'en'); // defaults to English
```

**Note**: If variation is called before settings have been loaded, the default value will always be returned.

```JavaScript

const client = new FeatheryClient(sdkKey, userKey);

doSomethingWith(client.variation('key', 'default'));

// 'default' will always be passed to doSomethingWith() since the settings
// haven't been loaded immediately after initialization.
```

The correct way:

```JavaScript
const client = new FeatheryClient(sdkKey, userKey);

client.resolve
    .then(
        () => doSomethingWith( client.variation('key', 'default') )
    ).catch(
        error => logError(error)
    )

// The correct value will be passed to doSomethingWith()
```
