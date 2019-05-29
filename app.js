const fs = require('fs');
const chalk = require('chalk');
const yargs = require('yargs');


//load existing notes function
const loadNotes = () => {
    try {
        let notesBuffer = fs.readFileSync('notes.json');
        let notesJSON = notesBuffer.toString();
        return JSON.parse(notesJSON);
    }
    catch (e) {
        return [];
    }
}


//create add command
yargs.command({
    command: 'add',
    describe: 'Add a note',
    builder: {
        title: {
            describe: 'Note title',
            demandOption: true,
            type: 'string'
        },
        body: {
            describe: 'Note body',
            demandOption: true,
            type: 'string'
        }
    },
    handler: (argv) => {
        let notes = loadNotes();

        let duplicateNote = notes.find((note) => note.title === argv.title);

        if(!duplicateNote) {
            let note = {
                title: argv.title,
                body: argv.body
            };

            notes.push(note);

            fs.writeFileSync('notes.json', JSON.stringify(notes));
            
            console.log(chalk.green.inverse.bold("Note added successfully!"));
        } else {
            console.log(chalk.red.inverse.bold("Note title already exists!"));
        }
    }
});

//create remove command
yargs.command({
    command: 'remove',
    describe: 'Remove a note',
    builder: {
        title: {
            describe: 'Note title',
            demandOption: true,
            type: 'string'
        }
    },
    handler: (argv) => {
        let notes = loadNotes();

        let newNotes = notes.filter((note) => note.title !== argv.title);

        if(notes.length == newNotes.length) {
            console.log(chalk.red.inverse.bold("Note title not found!"));
        } else {
            fs.writeFileSync('notes.json', JSON.stringify(newNotes));
            console.log(chalk.green.inverse.bold("Note successfully removed!"));
        }
    }
});

//create list command
yargs.command({
    command: 'list',
    describe: 'List all notes',
    handler: () => {
        console.log(chalk.blue.bold("Title \t \t Body"));
        
        let notes = loadNotes();

        debugger

        notes.forEach((note) => {
            console.log(chalk.yellow.bold(note.title) + "\t \t" + note.body);
        });
    }
});

//create read command
yargs.command({
    command: 'read',
    describe: 'Read a note',
    builder: {
        title: {
            describe: 'Note title',
            demandOption: true,
            type: 'string'
        }
    },
    handler: (argv) => {
        let notes = loadNotes();

        let reqNote = notes.find((note) => note.title === argv.title);

        if(!reqNote) {
            console.log(chalk.red.inverse.bold("Note title not found!"));
        } else {
            console.log(chalk.yellow.bold(reqNote.title) + "\t" + reqNote.body);
        }
    }
});

yargs.parse();