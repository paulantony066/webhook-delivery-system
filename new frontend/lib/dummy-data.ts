export type WebhookStatus = 'active' | 'disabled'
export type HealthStatus = 'healthy' | 'degraded' | 'failing'
export type DeliveryStatus = 'success' | 'failed' | 'retrying' | 'pending'

export type Webhook = {
  id: string
  name: string
  url: string
  events: string[]
  status: WebhookStatus
  health: HealthStatus
  successRate: number
  avgLatencyMs: number
  deliveries24h: number
  lastDelivery: string
  createdAt: string
  secret: string
}

export type Delivery = {
  id: string
  webhookId: string
  event: string
  status: DeliveryStatus
  statusCode: number | null
  latencyMs: number | null
  attempts: number
  timestamp: string
}

export const availableEvents = [
  'order.created',
  'order.updated',
  'order.cancelled',
  'payment.succeeded',
  'payment.failed',
  'customer.created',
  'customer.deleted',
  'invoice.paid',
  'subscription.renewed',
  'refund.issued',
]

export const currentUser = {
  name: 'Adaa Okafor',
  email: 'ada@acme.dev',
  initials: 'AO',
  workspace: 'Acmeee Production',
}

export const webhooks: Webhook[] = [
  {
    id: 'wh_8f2k1a',
    name: 'Order fulfillment service',
    url: 'https://fulfill.acme.dev/hooks/orders',
    events: ['order.created', 'order.updated', 'order.cancelled'],
    status: 'active',
    health: 'healthy',
    successRate: 99.8,
    avgLatencyMs: 142,
    deliveries24h: 12480,
    lastDelivery: '12s ago',
    createdAt: 'Mar 14, 2026',
    secret: 'whsec_••••••••••••3f9a',
  },
  {
    id: 'wh_3n9d7c',
    name: 'Billing reconciliation',
    url: 'https://billing.acme.dev/api/webhooks',
    events: ['payment.succeeded', 'payment.failed', 'invoice.paid'],
    status: 'active',
    health: 'degraded',
    successRate: 94.2,
    avgLatencyMs: 860,
    deliveries24h: 5321,
    lastDelivery: '48s ago',
    createdAt: 'Jan 02, 2026',
    secret: 'whsec_••••••••••••a71c',
  },
  {
    id: 'wh_5q1m0x',
    name: 'CRM sync',
    url: 'https://crm-bridge.partner.io/v2/ingest',
    events: ['customer.created', 'customer.deleted'],
    status: 'active',
    health: 'failing',
    successRate: 61.4,
    avgLatencyMs: 4210,
    deliveries24h: 1904,
    lastDelivery: '3m ago',
    createdAt: 'Jun 21, 2026',
    secret: 'whsec_••••••••••••0d2e',
  },
  {
    id: 'wh_2r7t4b',
    name: 'Analytics warehouse',
    url: 'https://ingest.datalake.acme.dev/events',
    events: ['order.created', 'payment.succeeded', 'refund.issued'],
    status: 'active',
    health: 'healthy',
    successRate: 99.95,
    avgLatencyMs: 88,
    deliveries24h: 18732,
    lastDelivery: '2s ago',
    createdAt: 'Nov 30, 2025',
    secret: 'whsec_••••••••••••77b1',
  },
  {
    id: 'wh_9v6h2p',
    name: 'Slack notifications',
    url: 'https://hooks.slack.com/services/T00/B00/xxxx',
    events: ['payment.failed', 'refund.issued'],
    status: 'disabled',
    health: 'healthy',
    successRate: 100,
    avgLatencyMs: 210,
    deliveries24h: 0,
    lastDelivery: '6d ago',
    createdAt: 'Aug 09, 2026',
    secret: 'whsec_••••••••••••c4f0',
  },
  {
    id: 'wh_1z4y8e',
    name: 'Subscription lifecycle',
    url: 'https://subs.acme.dev/webhooks/lifecycle',
    events: ['subscription.renewed', 'invoice.paid'],
    status: 'active',
    health: 'healthy',
    successRate: 99.1,
    avgLatencyMs: 312,
    deliveries24h: 2210,
    lastDelivery: '1m ago',
    createdAt: 'Sep 18, 2026',
    secret: 'whsec_••••••••••••9e3d',
  },
]

export const deliveries: Delivery[] = [
  { id: 'dlv_01HX9A', webhookId: 'wh_2r7t4b', event: 'order.created', status: 'success', statusCode: 200, latencyMs: 74, attempts: 1, timestamp: '2026-11-09 14:32:08' },
  { id: 'dlv_01HX99', webhookId: 'wh_8f2k1a', event: 'order.updated', status: 'success', statusCode: 200, latencyMs: 131, attempts: 1, timestamp: '2026-11-09 14:32:02' },
  { id: 'dlv_01HX98', webhookId: 'wh_5q1m0x', event: 'customer.created', status: 'failed', statusCode: 503, latencyMs: 5000, attempts: 5, timestamp: '2026-11-09 14:31:47' },
  { id: 'dlv_01HX97', webhookId: 'wh_3n9d7c', event: 'payment.succeeded', status: 'retrying', statusCode: 504, latencyMs: 3021, attempts: 2, timestamp: '2026-11-09 14:31:40' },
  { id: 'dlv_01HX96', webhookId: 'wh_1z4y8e', event: 'subscription.renewed', status: 'success', statusCode: 202, latencyMs: 288, attempts: 1, timestamp: '2026-11-09 14:31:22' },
  { id: 'dlv_01HX95', webhookId: 'wh_2r7t4b', event: 'payment.succeeded', status: 'success', statusCode: 200, latencyMs: 91, attempts: 1, timestamp: '2026-11-09 14:31:15' },
  { id: 'dlv_01HX94', webhookId: 'wh_8f2k1a', event: 'order.created', status: 'pending', statusCode: null, latencyMs: null, attempts: 0, timestamp: '2026-11-09 14:31:09' },
  { id: 'dlv_01HX93', webhookId: 'wh_3n9d7c', event: 'invoice.paid', status: 'success', statusCode: 200, latencyMs: 712, attempts: 1, timestamp: '2026-11-09 14:30:58' },
  { id: 'dlv_01HX92', webhookId: 'wh_5q1m0x', event: 'customer.deleted', status: 'failed', statusCode: 401, latencyMs: 182, attempts: 5, timestamp: '2026-11-09 14:30:31' },
  { id: 'dlv_01HX91', webhookId: 'wh_2r7t4b', event: 'refund.issued', status: 'success', statusCode: 200, latencyMs: 66, attempts: 1, timestamp: '2026-11-09 14:30:12' },
  { id: 'dlv_01HX90', webhookId: 'wh_8f2k1a', event: 'order.cancelled', status: 'success', statusCode: 204, latencyMs: 158, attempts: 2, timestamp: '2026-11-09 14:29:54' },
  { id: 'dlv_01HX8Z', webhookId: 'wh_3n9d7c', event: 'payment.failed', status: 'failed', statusCode: 500, latencyMs: 1290, attempts: 5, timestamp: '2026-11-09 14:29:30' },
  { id: 'dlv_01HX8Y', webhookId: 'wh_1z4y8e', event: 'invoice.paid', status: 'success', statusCode: 200, latencyMs: 301, attempts: 1, timestamp: '2026-11-09 14:29:02' },
  { id: 'dlv_01HX8X', webhookId: 'wh_5q1m0x', event: 'customer.created', status: 'retrying', statusCode: 429, latencyMs: 98, attempts: 3, timestamp: '2026-11-09 14:28:41' },
  { id: 'dlv_01HX8W', webhookId: 'wh_2r7t4b', event: 'order.created', status: 'success', statusCode: 200, latencyMs: 82, attempts: 1, timestamp: '2026-11-09 14:28:19' },
  { id: 'dlv_01HX8V', webhookId: 'wh_8f2k1a', event: 'order.updated', status: 'success', statusCode: 200, latencyMs: 127, attempts: 1, timestamp: '2026-11-09 14:27:55' },
]

export const hourlyVolume = [
  { hour: '15:00', success: 1820, failed: 42 },
  { hour: '16:00', success: 1950, failed: 38 },
  { hour: '17:00', success: 2240, failed: 51 },
  { hour: '18:00', success: 2010, failed: 47 },
  { hour: '19:00', success: 1690, failed: 33 },
  { hour: '20:00', success: 1420, failed: 29 },
  { hour: '21:00', success: 1180, failed: 24 },
  { hour: '22:00', success: 940, failed: 18 },
  { hour: '23:00', success: 760, failed: 15 },
  { hour: '00:00', success: 610, failed: 12 },
  { hour: '01:00', success: 540, failed: 9 },
  { hour: '02:00', success: 480, failed: 11 },
  { hour: '03:00', success: 520, failed: 8 },
  { hour: '04:00', success: 690, failed: 14 },
  { hour: '05:00', success: 930, failed: 21 },
  { hour: '06:00', success: 1270, failed: 26 },
  { hour: '07:00', success: 1610, failed: 64 },
  { hour: '08:00', success: 1980, failed: 132 },
  { hour: '09:00', success: 2310, failed: 118 },
  { hour: '10:00', success: 2480, failed: 71 },
  { hour: '11:00', success: 2390, failed: 55 },
  { hour: '12:00', success: 2260, failed: 49 },
  { hour: '13:00', success: 2150, failed: 44 },
  { hour: '14:00', success: 1890, failed: 39 },
]

export const overviewStats = [
  { label: 'Deliveries (24h)', value: '40,647', delta: '+8.2%', trend: 'up' as const },
  { label: 'Success rate', value: '97.6%', delta: '-0.4%', trend: 'down' as const },
  { label: 'Avg. latency', value: '214 ms', delta: '-12 ms', trend: 'up' as const },
  { label: 'Active endpoints', value: '5 / 6', delta: '1 disabled', trend: 'neutral' as const },
]

export const samplePayload = `{
  "id": "evt_01HX9A7QK2",
  "type": "order.created",
  "created": 1762698728,
  "data": {
    "order_id": "ord_5521",
    "customer_id": "cus_8812",
    "total": 129.5,
    "currency": "USD",
    "items": 3
  }
}`

export const sampleResponse = `HTTP/1.1 200 OK
content-type: application/json
x-request-id: 7f3a-91bc

{ "received": true }`

export function getWebhook(id: string) {
  return webhooks.find((w) => w.id === id)
}

export function getWebhookName(id: string) {
  return getWebhook(id)?.name ?? id
}
