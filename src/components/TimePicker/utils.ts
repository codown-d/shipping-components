// 24 小时时间转为 12 小时
export const convert24To12hour = (time: string) => {
    const [hour, minute] = time.split(':');
    let suffix = 'am';
    let convertedHours = Number(hour); // 1 --> 01

    if (convertedHours >= 12) {
        suffix = 'pm';
    }

    if (convertedHours > 12) {
        convertedHours -= 12;
    }

    if (convertedHours === 0) {
        convertedHours = 12;
    }

    return {
        hour: String(convertedHours).padStart(2, '0'),
        minute: minute.padStart(2, '0'),
        suffix,
    };
};

// 将 12 小时制时间转换为 24 小时制时间
export const convert12To24hour = (timeString: string) => {
    const [time, suffix] = timeString.split(' ');
    let [hours] = time.split(':');
    const [, minutes] = time.split(':');

    if (hours === '12') {
        hours = '00';
    }

    if (suffix === 'pm') {
        hours = (Number(hours) + 12).toString();
    }

    return `${hours}:${minutes}`;
};
