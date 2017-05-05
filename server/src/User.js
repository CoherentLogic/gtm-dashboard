import MongoClient from 'mongodb';
import config from '../../app.config';

export default class User {

    constructor(optsOrUsername) {

        self = this;

        self.connectionString = "mongodb://" + config.db.host + ":" + config.db.port + "/" + config.db.database;
        
        MongoClient.connect(self.connectionString, (err, db) => {
            if(!err) {
                self.db = db;
                console.log("Connected to database " + self.connectionString);
            }
            else {
                throw(new Error(err));
            }
        });

        self.userRecord = {};

        if(optsOrUsername) {
            switch(typeof optsOrUsername) {
                case 'object': {
                    optsOrUsername.user ? self.userRecord = Object.assign({}, optsOrUsername.user) : optsOrUsername.user = null;                        
                    
                    break;
                }
                case 'string': {
                  
                    self.open(optsOrUsername);
                    break;
                }
            }
        }
        else {
                
        }
    }

    open(username) {
        self = this;


    }

    authenticate(password, req, res) {

    }



}
