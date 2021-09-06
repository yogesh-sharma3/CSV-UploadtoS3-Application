const { uniqueNamesGenerator, adjectives, colors, animals } = require('unique-names-generator');
function getName(){
    const name = uniqueNamesGenerator({
        dictionaries: [adjectives, animals, colors],
        length: 2,
        separator: "-"
    });
    return name;
}
module.exports = getName;
