import type { MonitorType } from '~/lib/model/monitor-type.enum'
import type { MonitorStatus } from '~/lib/model/monitor-status.enum'

export interface MonitorWithStatus {
    id: string
    name: string
    intervalSeconds: number
    type: MonitorType
    configuration: object
    createdAt: Date
    updatedAt: Date
    status: MonitorStatus
}
