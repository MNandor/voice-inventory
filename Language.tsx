type Language = {
    languageCode: string,
    commandCode: string,
    commandCount: string,
    commandBack: string,
    commandReset: string,
    digitsFrom0: string[]
}

let english:Language  = {
    languageCode: "en-US",
    commandCode: "code",
    commandCount: "count",
    commandBack: "back",
    commandReset: "reset",
    digitsFrom0: ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"]
}


let german:Language  = {
    languageCode: "de-DE",
    commandCode: "code",
    commandCount: "anzahl",
    commandBack: "zurück",
    commandReset: "zurücksetzen",
    digitsFrom0: ["null", "eins", "zwei", "drei", "vier", "fünf", "sechs", "sieben", "acht", "neun"]
}
let currentLanguage = english

export default currentLanguage