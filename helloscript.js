import colors from 'colors';


const arr = process.argv.slice(2);
let [a, b] = arr.sort();
let colorDetection = 0;

function typeChecking(one, two) {
    if (isNaN(one) || isNaN(two) || one <= 0) {
        return console.log(colors.red('Incorrect numbers'));
    } else {
        return primeNumbersDispaly(one, two);
    }
}

function colorsNumbers(counter, start, color) {
    if (counter == 2) {
        if (color == 0) {
            console.log(colors.green(start));
            colorDetection++;
        } else if (color == 1) {
            console.log(colors.yellow(start));
            colorDetection++;
        } else if (color == 2) {
            console.log(colors.red(start));
            colorDetection = 0;
        }
    }
}

function primeNumbersDispaly(first, second) {
    let compositeCount = 0;
    if (second > 1) {
        for (; first <= second; first++) {
            let count = 0;
            for (let k = 1; k <= first; k++) {
                if (first % k == 0) {
                    count++;
                    compositeCount++;
                }
            }
            colorsNumbers(count, first, colorDetection);
        }

        if (compositeCount === 0) {
            return console.log(colors.red("No digits in diapason"));
        }

    } else { return console.log(colors.red("No digits in diapason")) };
}

typeChecking(+a, +b);

