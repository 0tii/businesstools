/**
 * Formats a date object according to selection of format strings
 * @param date the datetime to format
 * @param format the format string
 * @param divider the character(s) that divide day month and year
 * @returns formatted string
 */
export function formatDate(date: Date, format: DateFormats, divider: string = '.'){
    switch(format){
        case "dd-MM-yyyy":
            return `${date.getDay}${divider}${date.getMonth}${divider}${date.getFullYear}`;
        case "MM-dd-yyyy":
            return `${date.getMonth}${divider}${date.getDay}${divider}${date.getFullYear}`;
    }
}

type DateFormats = 'MM-dd-yyyy' | 'dd-MM-yyyy'
