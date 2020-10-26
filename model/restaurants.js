const mongoose = require('mongoose')

const whishListRestaurantSchema = mongoose.Schema({
    name : String,
    streetName : String,
    city : String,
    zipCode : String,
    pricing : String,
    typeOfRestaurant : String,
    TypeOfFood : String
})

const restaurantSchema = mongoose.Schema({
		name: String,
		email : String,
		salt:String,
		password:String,
		token :String,
		siret : String,
		website : String,
		phone: String,
		streetName:String,
		city:String,
		zipCode:String,
		clientele:Array,
		pricing:Number,
		typeOfRestaurant:Array,
		typeOfFood:Array,
		wishlistRestaurant:[whishListRestaurantSchema],
    
})

const restaurantModel = mongoose.model('restaurant', restaurantSchema)

module.exports = restaurantModel