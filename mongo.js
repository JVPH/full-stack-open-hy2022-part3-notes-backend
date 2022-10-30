const mongoose = require('mongoose');

if (process.argv.length < 3) {
    console.log('Please provide the password as an argument: node mongo.js <password>');
    process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://fullstack:${password}@cluster0.udvmgn5.mongodb.net/phonebookApp?retryWrites=true&w=majority`;

const phonebookEntrySchema = new mongoose.Schema({
    name: String,
    phone: String,
});

const PhonebookEntry = mongoose.model('PhonebookEntry', phonebookEntrySchema);

if (process.argv.length < 4){
    mongoose
        .connect(url)
        .then(result => {
            PhonebookEntry
                .find({})  
                .then(result => {
                    result.forEach(phonebookEntry => {
                        console.log(phonebookEntry);
                    });
                    mongoose.connection.close();
                })
        });
}

const name = process.argv[3];
const phone = process.argv[4];

mongoose
    .connect(url)
    .then(result => {
        console.log('connected');

        const phonebookEntry = new PhonebookEntry({
            name,
            phone,
        });

        return phonebookEntry.save();
    })
    .then(() => {
        console.log('Phonebook entry saved');
        return mongoose.connection.close();
    })
    .catch((error) => console.log(error));
