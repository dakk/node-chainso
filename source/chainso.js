'use strict';

var http = require('http');
var https = require('https');


var networks = {
	litecoin: 'LTC',
	litecoin_testnet: 'LTCTEST',
	bitcoin: 'BTC',
	bitcoin_testnet: 'BTCTEST',
	dogecoin: 'DOGE',
	dogecoin_testnet: 'DOGETEST'
};

var host = 'chain.so';


var api_get = function (endpoint, handler) {
	var options = {
		host: host,
		path: endpoint
	}

	var callback = function (response) {
		var str = '';
		response.on('data', function (chunk) { str += chunk; });
		response.on('end', function () { 
			var data = JSON.parse (str);
			handler (null, data);
		});
	}

	var req = https.request(options, callback);
	req.on('error', function(e) { handler (e, null); });
	req.end();
};

var api_post = function (endpoint, data, handler) {
	var body = JSON.stringify(data);

	var options = {
		host: host,
		path: endpoint,
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Content-Length': Buffer.byteLength(body)
		}
	}

	var callback = function (response) {
		var str = '';
		response.on('data', function (chunk) { str += chunk; });
		response.on('end', function () { 
			var data = JSON.parse (str);
			handler (null, data);
		});
	}

	var req = https.request(options, callback);
	req.on('error', function(e) { handler (e, null); });
	req.end(body);
}

// GET /api/v2/get_address_balance/{NETWORK}/{ADDRESS}[/{MINIMUM CONFIRMATIONS}]
var getBalance = function (network, address, minconf, handler) {
	api_get ('/api/v2/get_address_balance/' + network + '/' + address + '/' + minconf, handler);
};

// GET /api/v2/get_tx_unspent/{NETWORK}/{ADDRESS}
var getUnspent = function (network, address, handler) {
	api_get ('/api/v2/get_tx_unspent/' + network + '/' + address, handler);
};


// GET /api/v2/get_tx/{NETWORK}/{TXID}
var getTransaction = function (network, txid, handler) {
	api_get ('/api/v2/get_tx/' + network + '/' + txid, handler);
};


// POST /api/v2/send_tx/{NETWORK} (d = tx_hex)
var sendTransaction = function (network, tx_hex, handler) {
	api_post ('/api/v2/send_tx/' + network, {tx_hex: tx_hex}, handler);
};


module.exports = {
	networks: networks,
	getBalance: getBalance,
	getUnspent: getUnspent,
	getTransaction: getTransaction,
	sendTransaction: sendTransaction
};
