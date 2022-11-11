const convertToMinutes = (time) =>                     //Converts seconds into an array of [minutes, seconds]
    {                     
        let minutes = Math.floor(time/60);             //Will not return seconds if seconds <= 0
        let seconds = Math.floor(time%60); 
        seconds <= 0 ? seconds = null : seconds;
        return ([minutes, seconds]);
    }

export default convertToMinutes;