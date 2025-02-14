// @ts-ignore
import { format, parseISO } from 'date-fns'

export const formatTimeDefault = (time: string) => {
    if (!time) return ''

    return formatTime(time, 'HH:mm')
}

export const formatTime = (time: string, formatType: string) => {
    if (!time) return ''

    return format(new Date(`1970-01-01T${time}`), formatType)
}

export const formatDateDefault = (date: string) => {
    if (!date) return ''
    return formatDateByType(date, 'MMMM d, yyyy')
}

export const formatDateByType = (date: string, formatType: string) => {
    if (!date) return ''
    return format(parseISO(date), formatType)
}
