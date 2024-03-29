const express = require('express')
const router = express.Router()

const options = {
	clientId: process.env.K2_CLIENT_ID,
	clientSecret: process.env.K2_CLIENT_SECRET
}

//Including the kopokopo module
var K2 = require('kopokopo-node')(options)
var Webhooks = K2.Webhooks
var tokens = K2.TokenService
var buyGoodsResource
var customerResource
var reversalResource
var token_details

tokens
	.getTokens()
	.then(response => {
		//Developer can decide to store the token_details and track expiry
		token_details = response
	})
	.catch(error => {
		console.log(error)
	})

router.post('/', function (req, res, next) {
	Webhooks
		.webhookHandler(req, res)
		.then(response => {
			buyGoodsResource = response.event.resource
		})
		.catch(error => {
			console.log(error)
		})
})

router.post('/customercreated', function (req, res, next) {
	Webhooks
		.webhookHandler(req, res)
		.then(response => {
			customerResource = response.event.resource
		})
		.catch(error => {
			console.log(error)
		})
})

router.post('/transactionreversed', function (req, res, next) {
	Webhooks
		.webhookHandler(req, res)
		.then(response => {
			reversalResource = response.event.resource
		})
		.catch(error => {
			console.log(error)
		})
})

router.get('/customerresource', function (req, res, next) {
	let resource = customerResource

	if (resource != null) {
		res.render('customerresource', {
			sender_msisdn: resource.msisdn,
			name: resource.first_name
		})
	} else {
		console.log('Resource not yet created')
		res.render('customerresource', { error: 'Resource not yet created' })
	}
})

router.get('/reversalresource', function (req, res, next) {
	let resource = reversalResource

	if (resource != null) {
		res.render('reversalresource', {
			origination_time: resource.origination_time,
			sender_msisdn: resource.sender_msisdn,
			amount: resource.amount,
			currency: resource.currency,
			till_number: resource.till_number,
			name: resource.sender_first_name,
			status: resource.status,
			system: resource.system
		})
	} else {
		console.log('Resource not yet created')
		res.render('reversalresource', { error: 'Resource not yet created' })
	}
})

router.get('/resource', function (req, res, next) {
	let resource = buyGoodsResource

	if (resource != null) {
		res.render('resource', {
			origination_time: resource.origination_time,
			sender_msisdn: resource.sender_msisdn,
			amount: resource.amount,
			currency: resource.currency,
			till_number: resource.till_number,
			name: resource.sender_first_name,
			status: resource.status,
			system: resource.system
		})
	} else {
		console.log('Resource not yet created')
		res.render('resource', { error: 'Resource not yet created' })
	}
})

router.get('/subscribe', function (req, res, next) {
	res.render('subscribe', res.locals.commonData)
})


router.post('/subscribe', function (req, res, next) {
    const subscribeOptions = {
        eventType: req.body.event_type,
        url: req.body.url,
        webhookSecret: process.env.BUYGOODS_WEBHOOK_SECRET,
        accessToken: token_details.access_token
    }

	Webhooks
		.subscribe(subscribeOptions)
		.then(response => {
			console.log(response)
			return res.render('subscribe', { message: 'Subscribe successful resource id is: ' + response.resourceId })
		})
		.catch(error => {
			console.log(error)
			return res.render('subscribe', { message: error.error.message })
		})
})


module.exports = router
