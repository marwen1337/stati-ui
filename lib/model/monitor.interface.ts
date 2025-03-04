import type { MonitorType } from '~/lib/model/monitor-type.enum'
import type { MonitorStatus } from '~/lib/model/monitor-status.enum'

export interface Monitor {
    id: string
    name: string
    cronSchedule: string
    type: MonitorType
    configuration: object
    createdAt: Date
    updatedAt: Date
}

export interface MonitorWithStatus {
    id: string
    name: string
    cronSchedule: string
    type: MonitorType
    configuration: object
    createdAt: Date
    updatedAt: Date
    status: MonitorStatus
}
