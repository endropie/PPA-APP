import moment from 'moment'

const config = {
  general: {
    baseURL: null // 'http://ppa.virmata.com' // 'http://laravel.ppa'
  },
  options: {
    state_colors: {
      OPEN: 'blue',
      VALIDATED: 'green',
      'ON-PROCESS': 'indigo',
      PROCESSED: 'indigo',
      CONFIRMED: 'green-10',
      CLOSED: 'red',
      REJECTED: 'red-9',
      REVISED: 'red-9',
      VOID: 'red-10',
      DELETED: 'dark'
    },
    prefix_intervals: [
      { value: '', label: '-' },
      { value: '{Y}', label: `YYYY`, digit: `${moment().format('YYYY')}` },
      { value: '{y}', label: `YY`, digit: `${moment().format('YY')}` },
      { value: '{Y-m}', label: `YYYY-MM`, digit: `${moment().format('YYYY-MM')}` }
    ],
    transaction_mode: [
      { label: 'REGULER', value: 'REGULER' },
      { label: 'RETURN', value: 'RETURN' }
    ],
    worktime: [
      { label: 'REGULER', value: 'REGULER' },
      { label: 'OVERTIME', value: 'OVERTIME', color: 'secondary' }
    ],
    order_mode: [
      { label: 'None', value: 'NONE' },
      { label: 'PO', value: 'PO' },
      { label: 'PO Accumulate', value: 'ACCUMULATE' }
    ],
    invoice_mode: [
      { value: 'JOIN', label: 'JOIN', detail: 'Service & material are joined', color: 'positive' },
      { value: 'SEPARATE', label: 'SEPARATE', detail: 'Service & material are separated', color: 'orange' },
      { value: 'DETAIL', label: 'DETAIL', detail: 'Service & material Specified', color: 'blue' }
    ],
    delivery_mode: [
      { value: 'JOIN', label: 'JOIN', detail: 'Service & material are joined', color: 'positive' },
      { value: 'SEPARATE', label: 'SEPARATE', detail: 'Service & material are separated', color: 'orange' },
      { value: 'DETAIL', label: 'DETAIL', detail: 'Service & material Specified', color: 'blue' },
      { value: 'UNIT_DETAIL', label: 'UNIT_DETAIL', detail: 'Units of service & material Specified', color: 'info' }
    ]
  },
  items: {
    stockists: [
      { value: 'FM', code:'FM', label: 'FRESH' },
      { value: 'WO', code: 'WO', label: 'WORK ORDER' },
      { value: 'WIP', code:'WIP', label: 'WORK PROCESS' },
      { value: 'FG', code:'FG', label: 'FINISH GOOD' },
      { value: 'NG', code:'NC', label: 'NOT GOOD', color: 'warning' },
      { value: 'RET', code:'NCR', label: 'REPAIR', color: 'orange-8' }
    ]
  },
  incomes: {
    // code
  },
  references: {
    vehicle_type: ['DELIVERY', 'OFFICE', 'OTHERS'],
    vehicle_owner: ['PPA', 'RENTAL', 'OTHERS']
  }
}

export default config
