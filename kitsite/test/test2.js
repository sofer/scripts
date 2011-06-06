
var myDog = {
	bark: function(){
		console.log('Woof!');
	}
};

var myCat = {
	meow: function(){
		console.log('I am a lazy cat. I will not meow for you.');
	}
};
 
function annoyThePet(petFunction){
	//let's see what the pet can do
	petFunction();
}

//annoy the dog:
annoyThePet(myDog.bark);
//annoy the cat:
annoyThePet(myCat.meow);
