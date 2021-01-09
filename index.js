const fs = require("fs");

class WebServerHandler{
	constructor(debugError=0){
		this.routes = new Object();
		this.routes.get = new Object();
		this.routes.post = new Object();
		this.debugError = debugError;


		this.get = (path, requestResponseCallBack) => {
			try{
				this.routes.get[path] = requestResponseCallBack;
			}catch(err){
				console.log(`Não foi possível construir a rota ${path} !`)
			}
		};

		this.post = (path, requestResponseCallBack) => {
			try{
				this.routes.post[path] = requestResponseCallBack;
			}catch(err){
				console.log(`Não foi possível construir a rota ${path} !`)
			}
		};



		this.run = (req, res) => {
			res.sendFile = (file) => {
				res.write(
					String(
						fs.readFileSync(file)
					)
				)
			};

			res.send = res.write;
			res.json = (json) => {
				res.write(JSON.stringify(json))
			};


			try{
				switch(req.method){
					case 'GET': {
						this.routes.get[req.url](req, res);
						break;
					}
					case 'POST': {
						this.routes.post[req.url](req, res);
					}
					
					default: {
						res.write("Método Incompatível!");
					}
				}
			}catch(err){
				switch(this.debugError){
					case 1: {
						console.log(err);
						break;
					}
					case 0:{
						break;
					}
				}
				res.write("Erro interno!");
			}
	
			
			res.end()
		}
	}
	
}

module.exports = WebServerHandler;