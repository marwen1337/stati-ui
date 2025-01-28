import type { MonitorStatus } from '~/lib/model/monitor-status.enum'
import { MonitorType } from '~/lib/model/monitor-type.enum'

export interface MonitorMetric {
    timestamp: string,
    status: MonitorStatus,
    metrics: {
        primary: number
    }
}

export const MonitorTypeMetricLabel: Record<MonitorType, string> = {
  [MonitorType.HTTP]: 'Request Latency',
  [MonitorType.CPU]: 'CPU Usage'
}
