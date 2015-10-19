node-chainso
============

An API wrapper for chain.so, a blockchain explorer for bitcoin, litecoin and dogecoin.

## Installation

```bash
	npm install node-chainso --save
```
## Usage

```javascript
	chainso = require ('node-chainso');
	chainso.getBalance (chainso.networks.bitcoin, '13TRVwiqLMveg9aPAmZgcAix5ogKVgpe4T', 3, function (err, res) { console.log (res); });
```

## Contributing

In lieu of a formal styleguide, take care to maintain the existing coding style.


## Release History

* 0.1.0 Initial release

