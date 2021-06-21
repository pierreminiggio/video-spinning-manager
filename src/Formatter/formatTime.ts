export default function formatTime(time: number, displayMilliseconds: boolean = true): string {
    const minutesFromSeconds = Math.floor(time / 60)
    const secondsAndMillisecondsFromValue = time % 60
    const seconds = Math.floor(secondsAndMillisecondsFromValue)
    const belowSeconds = secondsAndMillisecondsFromValue - seconds
    const hoursFromMinutes = Math.floor(minutesFromSeconds / 60)
    const minutes = minutesFromSeconds % 60

    let display = ''

    const displayHours = hoursFromMinutes > 0
    if (displayHours) {
        display += hoursFromMinutes.toString() + 'h '
    }

   const displayMinutes = minutes > 0 || displayHours
   if (displayMinutes) {
       const minutesString = minutes.toString()
       display += (displayHours ? minutesString.padStart(2, '0') : minutesString) + 'm '
   }

   const secondsString = seconds.toString()
   display += (displayMinutes ? secondsString.padStart(2, '0') : secondsString)

    if (displayMilliseconds) {
        const millisecondsString = (parseFloat(belowSeconds.toFixed(3)) * 1000).toString()
        display += '.' + millisecondsString.padStart(3, '0')
    }

   display += ' s'

   return display
}
