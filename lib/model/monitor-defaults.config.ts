import { MonitorType } from '~/lib/model/monitor-type.enum'

export const defaultConfigs: Record<MonitorType, object> = {
  [MonitorType.HTTP]: {
    url: 'https://example.com'
  },
  [MonitorType.CPU]: {
    maxUsageThreshold: 1
  },
  [MonitorType.PING]: {
    host: 'localhost'
  },
  [MonitorType.TCP]: {
    host: 'localhost',
    port: 8080
  }
}
