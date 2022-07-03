/**
 * Formats a date object according to selection of format strings. 
 * 
 * `sortable` format returns a string in sortable format (`yyyyMMddHHmmss`) that can also be parsed to a `number` using `parseInt()`.
 * @param date the datetime to format
 * @param format the format string
 * @param divider the character(s) that divide day month and year
 * @returns formatted string
 */
export function formatDate(date: Date, format: DateFormats, divider: string = '.'): string {
    //dont forget date.getMonth() is 0-indexed
    switch (format) {
        case "dd-MM-yyyy":
            return `${date.getDate() < 10 ? '0' + date.getDate() : date.getDate()}${divider}${date.getMonth() < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1}${divider}${date.getFullYear()}`;
        case "MM-dd-yyyy":
            return `${date.getMonth() < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1}${divider}${date.getDate() < 10 ? '0' + date.getDate() : date.getDate()}${divider}${date.getFullYear()}`;
        case 'yyyy-MM-dd':
            return `${date.getFullYear()}${divider}${date.getMonth() < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1}${divider}${date.getDate() < 10 ? '0' + date.getDate() : date.getDate()}`;
        case 'sortable':
            return `${date.getFullYear()}${date.getMonth() + 1}${date.getDate()}${date.getHours()}${date.getMinutes()}${date.getSeconds()}`;
    }
}

type DateFormats = 'MM-dd-yyyy' | 'dd-MM-yyyy' | 'yyyy-MM-dd' | 'sortable'
