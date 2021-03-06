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
			if (data.status == 'success') 
				handler (null, data.data);
			else
				handler (data.data, null);
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
			if (data.status == 'success') 
				handler (null, data.data);
			else
				handler (data.data, null);
		});
	}

	var req = https.request(options, callback);
	req.on('error', function(e) { handler (e, null); });
	req.end(body);
}

// GET /api/v2/get_address_balance/{NETWORK}/{ADDRESS}[/{MINIMUM CONFIRMATIONS}]
var getBalance = function (network, address, minconf, handler) {
	try {
		api_get ('/api/v2/get_address_balance/' + network + '/' + address + '/' + minconf, handler);
	} catch (e) {
		handler (true, null);
	}
};

// GET /api/v2/get_tx_unspent/{NETWORK}/{ADDRESS}
var getUnspent = function (network, address, handler) {
	try {
		api_get ('/api/v2/get_tx_unspent/' + network + '/' + address, handler);
	} catch (e) {
		handler (true, null);
	}
};


// GET /api/v2/get_tx/{NETWORK}/{TXID}
var getTransaction = function (network, txid, handler) {
	try {
		api_get ('/api/v2/get_tx/' + network + '/' + txid, handler);
	} catch (e) {
		handler (true, null);
	}
};


// POST /api/v2/send_tx/{NETWORK} (d = tx_hex)
var sendTransaction = function (network, tx_hex, handler) {
	try {
		api_post ('/api/v2/send_tx/' + network, {tx_hex: tx_hex}, handler);
	} catch (e) {
		handler (true, null);
	}
};


module.exports = {
	networks: networks,
	getBalance: getBalance,
	getUnspent: getUnspent,
	getTransaction: getTransaction,
	sendTransaction: sendTransaction
};
