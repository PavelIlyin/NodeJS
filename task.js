#!/usr/bin/node

import fs from 'fs'
import path from 'path'
import inquirer from 'inquirer';

const executor = process.cwd()

inquirer.prompt([
    {
        name: 'enterPath',
        type: 'list',
        message: 'Do you want enter path to folder or continue in this directory?',
        choices: ['Enter path', 'Continue']
    }
]).then(answer => answer.enterPath)
    .then(enterPath => {
        if (enterPath === 'Continue') {
            reader(fs.readdirSync(executor), executor)
        } else if (enterPath === 'Enter path') {
            inquirer.prompt([
                {
                    name: 'path',
                    type: 'input',
                    message: 'Enter path to file or folder'
                }
            ]).then(answer => answer.path)
                .then(path => {
                    reader(fs.readdirSync(path), path)
                }).catch(e => console.log(e))
        }
    }).catch(e => console.log(e))

function reader(list, filePath) {
    inquirer.prompt([
        {
            name: 'fileName',
            type: 'list',
            message: 'Choose file to read',
            choices: list,
        }
    ]).then(answer => answer.fileName)
        .then(fileName => {
            const fullPath = path.join(filePath, fileName)

            if (fs.lstatSync(fullPath).isFile()) {

                inquirer.prompt([
                    {
                        name: 'action',
                        type: 'list',
                        message: 'What need to do?',
                        choices: ['Read all', 'Find something in file']
                    }
                ]).then(answer => answer.action)
                    .then(action => {
                        if (action === 'Read all') {
                            const data = fs.readFileSync(fullPath, 'utf-8')
                            console.log(data)
                        } else if (action === 'Find something in file') {
                            inquirer.prompt([
                                {
                                    name: 'text to find',
                                    type: 'input',
                                    message: 'Input text to find',
                                }
                            ]).then(answer => answer['text to find'])
                                .then(text => {
                                    const lineReader = require('readline').createInterface({
                                        input: fs.createReadStream(fileName)
                                    });

                                    lineReader.on('line', function (line) {
                                        let find = line.search(text)
                                        if (find > -1) {
                                            console.log(`Совпадение в строке: ${line}`)
                                        }
                                    })
                                }).catch(e => console.log(e))
                        }
                    }).catch(e => console.log(e))

            } else if (fs.lstatSync(fullPath).isDirectory()) {
                const newFullPath = path.join(filePath, fileName)
                list = fs.readdirSync(newFullPath)
                reader(list, newFullPath)
            }

        }).catch(e => console.log(e))
}