import EventEmitter from 'events'
import moment from 'moment'
import 'moment-precise-range-plugin'


const emitter = new EventEmitter()
moment.locale('ru')

class Handler {
    static endTime() {
        console.log("Time is over");
    }
    static wrongArg() {
        console.log("This date has passed");
    }
}

function timer(str) {
    const userDate = moment(str, "hh DD MM YYYY")
    const now = moment()
    let diff = Math.floor(userDate.diff(now) / 1000)
    if (diff < 0) {
        emitter.emit('wrongArg')
    }

    setTimeout(() => {
        console.clear()
        const timeLeft = moment(userDate).preciseDiff(now);
        console.log(timeLeft);

        if (diff === 0) {
            console.clear()
            emitter.emit('endTime')
        } else {
            timer(str);
        }
        diff--
    }, 1000)
}

emitter.on('endTime', Handler.endTime)
emitter.on('wrongArg', Handler.wrongArg)
timer(process.argv[2]) // 'HH-DD-MM-YYYY'