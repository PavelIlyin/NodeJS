const fs = require('fs')

const ACCESS_LOG = './access.log'
const IP_1 = '89.123.1.41'
const IP_2 = '34.48.240.111'
const regIP = /\d+\.\d+\.\d+\.\d+/g
let n = 0;
const lineReader = require('readline').createInterface({
    input: fs.createReadStream(ACCESS_LOG)
});


lineReader.on('line', function (line) {
    let ip = line.match(regIP)
    if (line) {

        if (ip[0] === IP_1) {
            const writeStreamIP_1 = fs.createWriteStream(`${IP_1}_request.log`, { encoding: 'utf-8', flags: 'a' })
            writeStreamIP_1.write(`${line}\n`)
            writeStreamIP_1.on('finish', () => { console.log('all done') })
            writeStreamIP_1.on('error', (error) => { console.log(error) })
        }

        else if (ip[0] === IP_2) {
            const writeStreamIP_2 = fs.createWriteStream(`${IP_2}_request.log`, { encoding: 'utf-8', flags: 'a' })
            writeStreamIP_2.write(`${line}\n`)
            writeStreamIP_2.on('finish', () => { console.log('all done') })
            writeStreamIP_2.on('error', (error) => { console.log(error) })
        }
        n++
    }
    console.log(`Прочитано: ${n} строк`)
});