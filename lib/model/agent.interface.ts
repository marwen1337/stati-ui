export interface Agent {
    id: string
    name: string
    hashedAccessKey: string
    createdAt: Date
    updatedAt: Date
}

export interface AgentWithConnectionStatus {
    id: string
    name: string
    hashedAccessKey: string
    createdAt: Date
    updatedAt: Date
    isConnected: boolean
}
