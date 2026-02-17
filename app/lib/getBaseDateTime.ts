const baseTimes = [2, 5, 8, 11, 14, 17, 20, 23]

export function getBaseDateTime () {
    const now = new Date();

    let hours = now.getHours();
    let minutes = now.getMinutes();

    if(minutes < 20) {
        hours -= 1;
    }

    let baseTime = baseTimes.filter(t => t <= hours).pop()
    let baseDate = now.toISOString().slice(0, 10).replace(/-/g, '')
    
    if(baseTime === undefined) {
        baseTime = 23;
        const yesterday = new Date(now.setDate(now.getDate() - 1))
        baseDate = yesterday.toISOString().slice(0, 10).replace(/-/g, '')
    }

    return {
        base_date: baseDate,
        base_time: baseTime.toString().padStart(2, '0') + '00',
    }
}