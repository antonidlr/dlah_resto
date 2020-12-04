
const bcrypt = require('bcrypt');


const plainPass = '12345Acamica';
/*
var encrypted = 0;

bcrypt.hash(plainPass, 10, (err, hash) => {
    console.log(hash);
    encrypted = hash;
})

console.log(encrypted);
*/
const hashPassword = async (password, saltRounds = 10) => {
    try {
        // Generate a salt
        const salt = await bcrypt.genSalt(saltRounds);

        // Hash password
        return await bcrypt.hash(password, 10);

    } catch (error) {
        console.log(error);
    }

    // Return null if error
    return null;
};

async function validatePass(pass1, pass2) {
    let hash1 = await hashPassword(pass1);
    let hash2 = await hashPassword(pass2);

    let result = await bcrypt.compare(pass1, hash2);

    if(result) {
        console.log('Iguales');
    } else {
        console.log('Diferentes');
    }
}

validatePass('acamic', 'acamica');

/*
hashPassword(plainPass).then((hash) => {
    console.log(hash);
    

    bcrypt.compare('acamica', hash).then((result) => {
        console.log('compare:'+ result);
    })
 
})

*/


