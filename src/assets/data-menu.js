// import moment from 'moment'

const common = [
  {
    name: 'Customers',
    icon: 'group',
    path: 'customers',
    lang: 'general.customer',
    resources: [
      { page: 'index', path: '', icon: 'list', meta: { permission: 'items-read' } },
      { page: 'form', path: 'create', meta: { mode: 'create', permission: 'customers-create' } },
      { page: 'form', path: ':id/edit', meta: { mode: 'edit', permission: 'customers-update' } },
      { page: 'view', path: ':id', meta: { mode: 'view', permission: 'customers-read' } }
    ]
  },
  {
    name: 'Part Items',
    path: 'items',
    icon: 'style',
    lang: 'general.item',
    resources: [
      { page: 'index', path: '', icon: 'list', meta: { permission: 'items-read' } },
      { page: 'form', path: 'create', meta: { mode: 'create', permission: 'items-create' } },
      { page: 'form', path: ':id/edit', meta: { mode: 'edit', permission: 'items-update' } },
      { page: 'view', path: ':id', meta: { mode: 'view', permission: 'items-read' } }
    ]
  },
  {
    name: 'Employee',
    path: 'employees',
    icon: 'style',
    lang: 'general.employee',
    resources: [
      { page: 'index', path: '', icon: 'mdi-account-group', meta: { permission: 'employees-read' } },
      { page: 'form', path: 'create', meta: { mode: 'create', permission: 'employees-create' } },
      { page: 'form', path: ':id/edit', meta: { mode: 'edit', permission: 'employees-update' } },
      { page: 'view', path: ':id', meta: { mode: 'view', permission: 'employees-read' } }
    ]
  },
  {
    name: 'Vehicles',
    icon: 'mdi-car-multiple',
    path: 'vehicles',
    lang: 'general.vehicle',
    resources: [
      { page: 'index', path: '', meta: { permission: 'vehicles-read' } },
      { page: 'form', path: 'create', meta: { mode: 'create', permission: 'vehicles-create' } },
      { page: 'form', path: ':id/edit', meta: { mode: 'edit', permission: 'vehicles-update' } }
    ]
  }
]

const incomes = [
  {
    name: 'Forecasts',
    icon: 'timeline',
    path: 'forecasts',
    lang: 'general.forecast',
    resources: [
      { page: 'index', path: '', icon: 'list', meta: { permission: 'forecasts-read' } },
      { page: 'form', path: 'create', meta: { mode: 'create', permission: 'forecasts-create' } },
      { page: 'form', path: ':id/edit', meta: { mode: 'edit', permission: 'forecasts-update' } },
      { page: 'view', path: ':id', meta: { mode: 'view', permission: 'forecasts-read' } }
    ]
  },
  {
    name: 'Sale Orders',
    icon: 'shop',
    path: 'request-orders',
    lang: 'general.request_order',
    resources: [
      { page: 'index', path: '', icon: 'list', meta: { permission: 'request-orders-read;pre-deliveries-create' } },
      { page: 'form', path: 'create', meta: { mode: 'create', permission: 'request-orders-create' } },
      { page: 'form', path: ':id/edit', meta: { mode: 'edit', permission: 'request-orders-update' } },
      { page: 'view', path: ':id', meta: { mode: 'view', permission: 'request-orders-read;pre-deliveries-create' } }
    ]
  }
]

const expenses = [
  {
    hide: true,
    name: 'Purchase Orders',
    icon: 'shopping_basket',
    path: 'purchase-orders',
    resources: [
      { page: 'index', path: '', icon: 'list', meta: { permission: 'purchase-orders-read' } },
      { page: 'form', path: 'create', meta: { mode: 'create', permission: 'purchase-orders-create' } },
      { page: 'form', path: ':id/edit', meta: { mode: 'edit', permission: 'purchase-orders-update' } },
      { page: 'view', path: ':id', meta: { mode: 'view', permission: 'purchase-orders-read' } }
    ]
  },
  {
    hide: true,
    name: 'Purchase Deliveries',
    icon: 'archive',
    path: 'purchase-deliveries',
    resources: [
      { page: 'index', path: '', icon: 'list', meta: { permission: 'purchase-delivery-read' } },
      { page: 'form', path: 'create', meta: { mode: 'create', permission: 'purchase-delivery-create' } },
      { page: 'form', path: ':id/edit', meta: { mode: 'edit', permission: 'purchase-delivery-update' } },
      { page: 'view', path: ':id', meta: { mode: 'view', permission: 'purchase-delivery-read' } }
    ]
  },
  {
    hide: true,
    name: 'Purchase bills',
    icon: 'money',
    path: 'purchase-bills',
    resources: [
      { page: 'index', path: '', icon: 'list', meta: { permission: 'purchase-bills-read' } },
      { page: 'form', path: 'create', meta: { mode: 'create', permission: 'purchase-bills-create' } },
      { page: 'form', path: ':id/edit', meta: { mode: 'edit', permission: 'purchase-bills-update' } },
      { page: 'view', path: ':id', meta: { mode: 'view', permission: 'purchase-bills-read' } }
    ]
  }
]

const warehouses = [
  {
    name: 'Opname Stoks',
    icon: 'move_to_inbox',
    path: 'opnames',
    lang: 'general.opname_stock',
    resources: [
      { page: 'index', path: '', icon: 'list', meta: { permission: 'opname-stocks-read' } },
      { page: 'form', path: 'create', icon: 'list', meta: {mode: 'create', permission: 'opname-stocks-create' } },
      { page: 'form', path: ':id/edit', icon: 'list', meta: {mode: 'edit', permission: 'opname-stocks-update' } },
      { page: 'view', path: ':id', meta: { mode: 'view', permission: 'opname-stocks-read' } }
    ]
  },
  {
    name: 'Opname Parts',
    icon: 'move_to_inbox',
    path: 'opname-stocks',
    lang: 'general.opname_part',
    resources: [
      { page: 'index', path: '', icon: 'list', meta: { permission: 'opname-stocks-read' } },
      { page: 'create', path: 'create', meta: { mode: 'create', permission: 'opname-stocks-create' } },
      // { page: 'form', path: ':id/edit', meta: { mode: 'edit', permission: 'opname-stocks-update' } },
      { page: 'view-period', path: 'period/:id', meta: { mode: 'view', permission: 'opname-stocks-read' } },
      { page: 'view', path: ':id', meta: { mode: 'view', permission: 'opname-stocks-read' } }
    ]
  },
  {
    name: 'Stock Voucers',
    icon: 'move_to_inbox',
    path: 'opname-vouchers',
    lang: 'general.opname_voucher',
    resources: [
      { page: 'index', path: '', icon: 'list', meta: { permission: 'opname-vouchers-read' } },
      { page: 'form', path: 'create', meta: { mode: 'create', permission: 'opname-vouchers-create' } },
      { page: 'form', path: ':id/edit', meta: { mode: 'edit', permission: 'opname-vouchers-update' } },
      { page: 'view', path: ':id', meta: { mode: 'view', permission: 'opname-vouchers-read' } }
    ]
  }
]

const deliveries = [
  {
    name: 'Incoming Good',
    icon: 'move_to_inbox',
    path: 'incoming-goods',
    lang: 'general.incoming_good',
    param: `?status=OPEN`,
    resources: [
      { page: 'index', path: '', icon: 'list', meta: { permission: 'incoming-goods-read' } },
      { page: 'form', path: 'create', meta: { mode: 'create', permission: 'incoming-goods-create' } },
      { page: 'form', path: ':id/edit', meta: { mode: 'edit', permission: 'incoming-goods-update' } },
      { page: 'restoration', path: ':id/restoration', meta: { mode: 'edit', permission: 'incoming-goods-create' } },
      { page: 'validation', path: ':id/validation', meta: { mode: 'edit', permission: 'incoming-goods-validation' } },
      { page: 'revision', path: ':id/revision', meta: { mode: 'edit', permission: 'incoming-goods-validation' } },
      { page: 'view', path: ':id', meta: { mode: 'view', permission: 'incoming-goods-read' } }
    ]
  },
  {
    name: 'Pre-Delivery Orders',
    icon: 'assignment',
    path: 'pre-deliveries',
    lang: 'general.pre_delivery',
    resources: [
      { page: 'index', path: '', icon: 'list', meta: { permission: 'pre-deliveries-read' } },
      { page: 'form', path: 'create', meta: { mode: 'create', permission: 'pre-deliveries-create' } },
      { page: 'form', path: ':id/edit', meta: { mode: 'edit', permission: 'pre-deliveries-update' } },
      { page: 'revision', path: ':id/revision', meta: { mode: 'edit', permission: 'pre-deliveries-update' } },
      { page: 'view', path: ':id', meta: { mode: 'view', permission: 'pre-deliveries-read' } }
    ]
  },
  {
    name: 'Outgoing Verification',
    icon: 'assignment_turned_in',
    path: 'outgoing-verifications',
    lang: 'general.outgoing_verification',
    param: `?unvalidated=1`,
    resources: [
      { page: 'index', path: '', icon: 'list', meta: { permission: 'outgoing-verifications-read' } },
      { page: 'create', path: 'create', meta: { mode: 'create', permission: 'outgoing-verifications-create' } },
      { page: 'form', path: ':id/edit', meta: { mode: 'edit', permission: 'outgoing-verifications-update' } },
      { page: 'view', path: ':id', meta: { mode: 'view', permission: 'outgoing-verifications-read' } }
    ]
  },
  {
    name: 'Outgoing Good',
    icon: 'unarchive',
    path: 'outgoing-goods',
    lang: 'general.outgoing_good',
    param: ``,
    resources: [
      { page: 'index', path: '', icon: 'list', meta: { permission: 'outgoing-goods-read' } },
      { page: 'form', path: 'create', meta: { mode: 'create', permission: 'outgoing-goods-create' } },
      { page: 'form', path: ':id/edit', meta: { mode: 'edit', permission: 'outgoing-goods-update' } },
      { page: 'view', path: ':id', meta: { mode: 'view', permission: 'outgoing-goods-read' } }
    ]
  },
  {
    name: 'SJ-Delivery Orders',
    icon: 'local_offer',
    path: 'delivery-orders',
    lang: 'general.sj_delivery',
    resources: [
      { page: 'index', path: '', icon: 'list', meta: { permission: 'sj-delivery-orders-read' } },
      // {page: 'form', path: 'create', meta: {mode: 'create', permission: 'delivery-orders-create'}},
      // {page: 'form', path: ':id/edit', meta: {mode: 'edit', permission: 'delivery-orders-update'}},
      { page: 'revision', path: ':id/revision', meta: { mode: 'edit', permission: 'sj-delivery-orders-update' } },
      { page: 'view', path: ':id', meta: { mode: 'view', permission: 'sj-delivery-orders-read' } }
    ]
  },
  {
    name: 'Schedule Board',
    icon: 'work',
    path: 'schedule-boards',
    lang: 'general.schedule_board',
    resources: [
      { page: 'index', path: '', icon: 'list', meta: { permission: 'schedule-boards-read' } },
      { page: 'form', path: 'create', meta: { mode: 'create', permission: 'schedule-boards-create' } },
      { page: 'form', path: ':id/edit', meta: { mode: 'edit', permission: 'schedule-boards-update' } },
      { page: 'view', path: ':id', meta: { mode: 'view', permission: 'schedule-boards-read' } }
    ]
  }
]

const factories = [
  {
    name: 'Work Order',
    icon: 'work',
    path: 'work-orders',
    lang: 'general.work_order',
    resources: [
      { page: 'index', path: '', icon: 'list', meta: { permission: 'work-orders-read' } },
      { page: 'items', path: 'items', icon: 'list', meta: { permission: 'work-orders-read' } },
      { page: 'form', path: 'create', meta: { mode: 'create', permission: 'work-orders-create' } },
      { page: 'form', path: ':id/edit', meta: { mode: 'edit', permission: 'work-orders-update' } },
      { page: 'revision', path: ':id/revision', meta: { mode: 'edit', permission: 'work-orders-update' } },
      { page: 'view', path: ':id', meta: { mode: 'view', permission: 'work-orders-read' } },
      { page: 'view-prelines', path: ':id/prelines', meta: { mode: 'view', permission: 'work-orders-read' } }
    ]
  },
  {
    name: 'Work Order Items',
    icon: 'work',
    path: 'work-orders/items',
    page: 'items',
    lang: 'general.work_order_items',
  },
  {
    name: 'Work Production',
    icon: 'gavel',
    path: 'work-productions',
    lang: 'general.work_production',
    param: '/create',
    resources: [
      { page: 'index', path: '', icon: 'list', meta: { permission: 'work-productions-read' } },
      { page: 'form', path: 'create', meta: { mode: 'create', permission: 'work-productions-create' } },
      { page: 'form', path: ':id/edit', meta: { mode: 'edit', permission: 'work-productions-update' } },
      { page: 'view', path: ':id', meta: { mode: 'view', permission: 'work-productions-read' } }
    ]
  },
  {
    name: 'Packing Goods',
    icon: 'move_to_inbox',
    path: 'packings',
    lang: 'general.packing',
    param: '/create',
    resources: [
      { page: 'index', path: '', icon: 'list', meta: { permission: 'packings-read' } },
      { page: 'create', path: 'create', meta: { mode: 'create', permission: 'packings-create' } },
      { page: 'form', path: ':id/edit', meta: { mode: 'edit', permission: 'packings-update' } },
      { page: 'view', path: ':id', meta: { mode: 'view', permission: 'packings-read' } }
    ]
  }
]

const references = [
  {
    name: 'Departments',
    icon: 'mdi-flag-triangle',
    path: 'departments',
    lang: 'general.department',
    resources: [
      { page: 'index', path: '', meta: { permission: 'departments-read' } },
      { page: 'form', path: 'create', meta: { mode: 'create', permission: 'departments-create' } },
      { page: 'form', path: ':id/edit', meta: { mode: 'edit', permission: 'departments-update' } }
    ]
  },
  {
    name: 'Positions',
    icon: 'mdi-account-settings',
    path: 'positions',
    lang: 'general.position',
    resources: [
      { page: 'index', path: '', meta: { permission: 'positions-read' } },
      { page: 'form', path: 'create', meta: { mode: 'create', permission: 'positions-create' } },
      { page: 'form', path: ':id/edit', meta: { mode: 'edit', permission: 'positions-update' } }
    ]
  },
  {
    name: 'Brands',
    icon: 'format_bold',
    path: 'brands',
    lang: 'general.brand',
    resources: [
      { page: 'index', path: '', meta: { permission: 'brands-read' } },
      { page: 'form', path: 'create', meta: { mode: 'create', permission: 'brands-create' } },
      { page: 'form', path: ':id/edit', meta: { mode: 'edit', permission: 'brands-update' } }
    ]
  },
  {
    name: 'Specifications',
    icon: 'view_array',
    path: 'specifications',
    lang: 'general.specification',
    resources: [
      { page: 'index', path: '', meta: { permission: 'specifications-read' } },
      { page: 'form', path: 'create', meta: { mode: 'create', permission: 'specifications-create' } },
      { page: 'form', path: ':id/edit', meta: { mode: 'edit', permission: 'specifications-update' } }
    ]
  },
  {
    name: 'Lines',
    icon: 'insert_chart_outlined',
    path: 'lines',
    lang: 'general.line',
    resources: [
      { page: 'index', path: '', meta: { permission: 'lines-read' } },
      { page: 'form', path: 'create', meta: { mode: 'create', permission: 'lines-create' } },
      { page: 'form', path: ':id/edit', meta: { mode: 'edit', permission: 'lines-update' } }
    ]
  },
  {
    name: 'Colors',
    icon: 'color_lens',
    path: 'colors',
    lang: 'general.color',
    resources: [
      { page: 'index', path: '', meta: { permission: 'colors-read' } },
      { page: 'form', path: 'create', meta: { mode: 'create', permission: 'colors-create' } },
      { page: 'form', path: ':id/edit', meta: { mode: 'edit', permission: 'colors-update' } }
    ]
  },
  {
    name: 'Units',
    icon: 'web_asset',
    path: 'units',
    lang: 'general.unit',
    resources: [
      { page: 'index', path: '', meta: { permission: 'units-read' } },
      { page: 'form', path: 'create', meta: { mode: 'create', permission: 'units-create' } },
      { page: 'form', path: ':id/edit', meta: { mode: 'edit', permission: 'units-update' } }
    ]
  },
  {
    name: 'Sizes',
    icon: 'format_size',
    path: 'sizes',
    lang: 'general.size',
    resources: [
      { page: 'index', path: '', meta: { permission: 'sizes-read' } },
      { page: 'form', path: 'create', meta: { mode: 'create', permission: 'sizes-create' } },
      { page: 'form', path: ':id/edit', meta: { mode: 'edit', permission: 'sizes-update' } }
    ]
  },
  {
    name: 'Type of items',
    icon: 'dehaze',
    path: 'type-items',
    lang: 'general.item_type',
    resources: [
      { page: 'index', path: '', meta: { permission: 'type-items-read' } },
      { page: 'form', path: 'create', meta: { mode: 'create', permission: 'type-items-create' } },
      { page: 'form', path: ':id/edit', meta: { mode: 'edit', permission: 'type-items-update' } }
    ]
  },
  {
    name: 'Category of items',
    icon: 'table_chart',
    path: 'category-items',
    lang: 'general.item_category',
    resources: [
      { page: 'index', path: '', meta: { permission: 'category-items-read' } },
      { page: 'form', path: 'create', meta: { mode: 'create', permission: 'category-items-create' } },
      { page: 'form', path: ':id/edit', meta: { mode: 'edit', permission: 'category-items-update' } }
    ]
  },
  {
    name: 'Faults',
    icon: 'table_chart',
    path: 'faults',
    lang: 'general.fault',
    resources: [
      { page: 'index', path: '', meta: { permission: 'faults-read' } },
      { page: 'form', path: 'create', meta: { mode: 'create', permission: 'faults-create' } },
      { page: 'form', path: ':id/edit', meta: { mode: 'edit', permission: 'faults-update' } }
    ]
  }
]

const configuration = [
  { // Application
    name: 'Application',
    icon: 'mdi-settings-outline',
    path: 'app',
    lang: 'general.application',
    meta: { permission: 'setting' }
  },
  { // Profile
    name: 'Profile',
    icon: 'perm_identity',
    path: 'profile',
    lang: 'general.profile',
    resources: [
      { page: 'form', path: '', meta: { mode: 'edit', permission: 'profile' } }
    ]
  },
  {
    name: 'Authentication',
    icon: 'verified_user',
    menuicon: true,
    path: 'auth',
    lang: 'general.auth',
    children: [
      {
        name: 'Users',
        icon: 'supervisor_account',
        path: 'users',
        lang: 'auth.user',
        resources: [
          { page: 'index', path: '', icon: 'list', meta: { permission: 'users-read' } },
          { page: 'form', path: 'create', meta: { mode: 'create', permission: 'users-create' } },
          { page: 'form', path: ':id/edit', meta: { mode: 'edit', permission: 'users-update' } }
        ]
      },
      {
        name: 'Permissions',
        icon: 'verified_user',
        path: 'permissions',
        lang: 'auth.permission',
        resources: [
          { page: 'index', path: '', icon: 'list', meta: { permission: 'permissions-read' } },
          { page: 'form', path: 'create', meta: { mode: 'create', permission: 'permissions-create' } },
          { page: 'form', path: ':id/edit', meta: { mode: 'edit', permission: 'permissions-update' } }
        ]
      },
      {
        name: 'Roles',
        icon: 'supervised_user_circle',
        path: 'roles',
        lang: 'auth.role',
        resources: [
          { page: 'index', path: '', icon: 'list', meta: { permission: 'roles-read' } },
          { page: 'form', path: 'create', meta: { mode: 'create', permission: 'roles-create' } },
          { page: 'form', path: ':id/edit', meta: { mode: 'edit', permission: 'roles-update' } }
        ]
      }
    ]
  },
  { // Customize
    name: 'Customize',
    icon: 'perm_identity',
    path: 'customize',
    lang: 'general.layout',
    resources: [
      { page: 'form', path: '', meta: { mode: 'edit', permission: null } }
    ]
  }
]

export default [
  { // Desktop
    name: 'Desktop',
    icon: 'home',
    path: 'desktop',
    meta: {
      authenticated: true
    }
  },
  { // Dashboard
    name: 'Dashboard',
    icon: 'apps',
    path: 'dashboard'
  },
  { // common
    name: 'Common',
    icon: 'dns',
    path: 'common',
    lang: 'general.common',
    children: common
  },
  { // Incomes
    name: 'Incomes',
    icon: 'monetization_on',
    path: 'incomes',
    lang: 'general.income',
    children: incomes
  },
  { // Expenses
    hide: true,
    name: 'Expenses',
    icon: 'shopping_cart',
    path: 'expenses',
    lang: 'general.expense',
    children: expenses
  },
  { // Factory
    name: 'Factories',
    icon: 'group_work',
    path: 'factories',
    lang: 'general.factory',
    children: factories
  },
  { // Receipt & Delivery
    name: 'Receipt & Delivery',
    icon: 'local_shipping',
    path: 'deliveries',
    lang: 'general.receipt_delivery',
    children: deliveries
  },
  { // Warehouse
    name: 'Warehouse',
    icon: 'kitchen',
    path: 'warehouses',
    lang: 'general.warehouse',
    children: warehouses
  },
  { // References
    name: 'References',
    icon: 'dashboard',
    path: 'references',
    lang: 'general.preference',
    children: references
  },
  { // Configuration
    name: 'Configuration',
    icon: 'settings',
    path: 'configuration',
    lang: 'general.configuration',
    children: configuration
  }
  // {
  //   name: 'Documentation',
  //   icon: 'chrome_reader_mode',
  //   path: 'log',
  //   lang: 'general.documentation',
  //   file: 'README.md'
  //   // fileType: '.md'
  // }
]
