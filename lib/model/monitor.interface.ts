import type { MonitorType } from '~/lib/model/monitor-type.enum'
import type { MonitorStatus } from '~/lib/model/monitor-status.enum'
import type { Agent } from '~/lib/model/agent.interface'

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

export interface MonitorWithStatusAndAgent {
    id: string
    name: string
    cronSchedule: string
    type: MonitorType
    configuration: object
    createdAt: Date
    updatedAt: Date
    status: MonitorStatus
    agent: Agent
}
