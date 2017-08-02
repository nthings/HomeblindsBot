'use strict'

const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const app = express();

app.set('port', (process.env.PORT || 5000));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));

// parse application/json
app.use(bodyParser.json());

// index
app.get('/', function (req, res) {
	res.send('hello world i am a secret bot');
})

// for facebook verification
app.get('/webhook/', function (req, res) {
	if (req.query['hub.verify_token'] === 'my_voice_is_my_password_verify_me') {
		res.send(req.query['hub.challenge']);
	} else {
		res.send('Error, wrong token');
	}
})

// to post data
var getAlto = false, getAncho = false, alto = 0, ancho = 0, persiana = "", precio=100;
app.post('/webhook/', function (req, res) {
	let messaging_events = req.body.entry[0].messaging;
	for (let i = 0; i < messaging_events.length; i++) {
		let event = req.body.entry[0].messaging[i];
		let sender = event.sender.id;
		if (event.message && event.message.text) {
			let text = event.message.text;
			if (text.toUpperCase().match(/(COT)|(PRE)+/g)){ 
				console.log("MATCH");
				sendTextMessage(sender, "Claro!, aqui puedes ver nuestro catalogo de persianas. Elige la que mas te guste 😀");
				sendPersianas(sender);
				continue;
			}

			console.log(text);
			if(getAlto && alto == 0 && text.substring(0, 10) !="Necesitamos"){
				console.log("IM IN ALTO");
				alto = medidaToCm(text);
				getAlto = false;

				getAncho = true;
				sendTextMessage(sender, "Excelente!, ahora ingresa el ancho ↔️ de tu ventana. No olvides indicarnos que unidad estas utilizando 🤔 (centimetros o metros)");			
			}

			if(getAncho && ancho == 0){
				console.log("IM IN ANCHO");
				ancho = medidaToCm(text);
				getAncho = false;
				sendTextMessage(sender, "Precio del metro cuadrado de la persiana " + persiana + ": $" + precio + 
					" . Segun las medidas que nos diste (" + alto + " cm. X " + ancho + " cm) Tu persiana costaria: $"+(precio*(alto*ancho)));
			}
			//sendTextMessage(sender, "Text received, echo: "+text.substring(0, 200));
		}
		if (event.postback) {
			// let text = JSON.stringify(event.postback);
			if(event.postback.title === "COTIZAR"){
				persiana = event.postback.payload;
				sendTextMessage(sender, "Necesitamos las medidas de tu ventana 📐. Ingresa el alto ↕️ de tu ventana. No olvides indicarnos que unidad estas utilizando 🤔 (centimetros o metros)");
				getAlto = true;
			}
			// sendTextMessage(sender, "Postback received: "+text.substring(0, 200), token);
			continue;
		}
	}
	res.sendStatus(200);
});


// recommended to inject access tokens as environmental variables, e.g.
// const token = process.env.FB_PAGE_ACCESS_TOKEN
// TOKEN FOR MAIN PAGE
//const token = "EAACB3xHMg7cBAIcAH11IZBbuQvI3CgZCMEhqR4sGNqmGvWqMVbTQ9JfS4ss1pwCMIU3GNVLUzDNmbZCczd6qy0ZCAykLfwftdZBKu0fT5OdNMIGqv5ZBoHjZArMMigthadQbTMYZAmXKK5vUY4NRj79EDP3p5twqGNdzYv3m7uiw7wZDZD"

//TOKEN FOR TEST PAGE
const token = "EAACB3xHMg7cBABc2XfWiKBpqvwZCSDgdLHIjKlLFHYfzv9XcXumWJs0RnXn7pgMZA3WEXmEw04IrSuxg9UBn48Sr6fSCenAdZBRokmsRwSu1wd8ic508b0XJwR3hWZBlQuhWm6thxw5MXYi49gRaUjXag4K9LZARoSd2ylFrrGwZDZD"
function sendTextMessage(sender, text) {
	let messageData = { text:text }
	
	request({
		url: 'https://graph.facebook.com/v2.6/me/messages',
		qs: {access_token:token},
		method: 'POST',
		json: {
			recipient: {id:sender},
			message: messageData,
		}
	}, function(error, response, body) {
		if (error) {
			console.log('Error sending messages: ', error)
		} else if (response.body.error) {
			console.log('Error: ', response.body.error)
		}
	})
};

function sendPersianas(sender) {
	let messageData = {
		"attachment": {
			"type": "template",
			"payload": {
				"template_type": "list",
				"top_element_style": "compact",
				"elements": [{
					"title": "Enrollable",
					"subtitle": "Element #1 of an hscroll",
					"image_url": "http://www.persianastannah.com.mx/images/persianas-enrollables-en-monterrey-1.jpg",
					"default_action":{
						"type": "web_url",
						"url": "https://www.google.com",
						"webview_height_ratio": "tall",
						"fallback_url":"https://www.google.com",
						"messenger_extensions": true
					},
					"buttons": [{
						"title": "COTIZAR",
						"type": "postback",
						"payload": "enrollable"
					}],
				}, {
					"title": "Sheer",
					"subtitle": "Element #1 of an hscroll",
					"image_url": "http://www.servipersianas.com.mx/sheerelegance04.jpg",
					"default_action":{
						"type": "web_url",
						"url": "https://www.google.com",
						"webview_height_ratio": "tall",
						"fallback_url":"https://www.google.com",
						"messenger_extensions": true
					},
					"buttons": [{
						"type": "postback",
						"title": "COTIZAR",
						"payload": "sheer"
					}],
				},{
					"title": "Vertical",
					"subtitle": "Element #1 of an hscroll",
					"image_url": "http://espacioflex.com/wp-content/uploads/2015/09/04-persiana-vertical.jpg",
					"default_action":{
						"type": "web_url",
						"url": "https://www.google.com",
						"webview_height_ratio": "tall",
						"fallback_url":"https://www.google.com",
						"messenger_extensions": true
					},
					"buttons": [{
						"type": "postback",
						"title": "COTIZAR",
						"payload": "sheer"
					}],
				}]
			}
		}
	};
	request({
		url: 'https://graph.facebook.com/v2.6/me/messages',
		qs: {access_token:token},
		method: 'POST',
		json: {
			recipient: {id:sender},
			message: messageData,
		}
	}, function(error, response, body) {
		if (error) {
			console.log('Error sending messages: ', error);
		} else if (response.body.error) {
			console.log('Error: ', response.body.error);
		}
	});
};

function medidaToCm(text) {
	var medida = text.match(/^[0-9]{1,}([,.][0-9]{1,})?\w/);
	console.log("MEDIDA " + medida)
	console.log("MEDIDA TYPE " + typeof(medida))
	// Si la medida dada son metros convertir a centimentros
	if(!/[a-zA-Z]*c[a-zA-Z]*\w/g.test(text)){
		// Convertir los metros a centimetros
		medida = medida * 100;
		console.log("MEDIDA CONVERTIDA" + medida)
	}

	return medida;
}

// spin spin sugar
app.listen(app.get('port'), function() {
	console.log('running on port', app.get('port'));
})
