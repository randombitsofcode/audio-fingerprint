Audio Fingerprinting
====================

I needed a module implementation of this fantastic function, so here it is.

Usage:
```
import AFP from "./audioFingerprint.module.js"
```

```
AFP.run( ( fp ) => { console.log( fp ); } );
```

Based on the [Princeton's AudioContext Fingerprint project](https://audiofingerprint.openwpm.com/)
