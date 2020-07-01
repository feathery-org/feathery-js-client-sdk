# feathery-js-client-sdk

> JavaScript SDK for Feathery

[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Installation

Using NPM / Yarn

```bash

npm imstall feathery-js-client-sdk --save
# OR
yarn add feathery-js-client-sdk

```

## Usage

The library exposes the FeatheryClient class, which is used to interact with Feathery's APIs.

```JavaScript
import FeatheryClient from 'feathery-js-client-sdk'
```

Instanciate the class with `sdkKey` and `userKey` to begin fetching of flags.

```JavaScript
const client = new FeatheryClient(sdkKey, userKey);
```

`sdkKey` and `userKey` should be `string`s, if they are not `SdkKeyError` or `UserKeyError` are raised, respectively. These errors can be imported from the library too.

```JavaScript
import { featheryErrors } from 'feathery-js-client-sdk'
```

Errors are accessible as

`featheryErrors.SdkKeyError` : Rasied when an invalid SDK Key is used\
`featheryErrors.UserKeyError` : Rasied when an invalid User Key is used\
`featheryErrors.FetchError` : Rasied when an fetching fails

The `client` object can be used to access the flags, once they are fetched in promise. If the fetching fails, approproate errors are raised, which can be caught using `.catch()`.

```JavaScript
const client = new FeatheryClient(sdkKey, userKey);

client.fetchPromise
    .then(flags => {/* Do something with flags */})
    .catch(error => {/* Do something with the error */})
```

At any point of time, the loading status of the flags can be obtained by the `.loaded` property on the client instance. It is `false` when the flags are not loaded, or an error as occured. If the flags are available, it is `true`.

```JavaScript
client.loaded; // can be true or false
```

Once the fetching is complete successfully, any flags can be obtained by calling the `varition` method on the client instance. `variation` expects to arguments:

1. A the key to fetch the flag
2. A default value to return, if the flag with the given key is not found

```JavaScript
client.variation(flagKey, defaultValue);
```

### Example

```JavaScript
const defaultLanguage = client.variation('language', 'en'); // defaultLanguage will be either obtained from a flag or 'en'
```

**Note**: If variation is called before the flags are fetched, the default value will always be returned.

```JavaScript

const client = new FeatheryClient(sdkKey, userKey);

doSomethingWith(client.variation('key', 'default'));

// The value 'default' will alway be passed to doSomethingWith() as the flags will not load just after initialization
```

The correct way:

```JavaScript
const client = new FeatheryClient(sdkKey, userKey);

client.fetchPromise
    .then(
        () => doSomethingWith( client.variation('key', 'default') )
    ).catch(
        error => logError(error)
    )

// The correct value will be passed to doSomethingWith()
```
