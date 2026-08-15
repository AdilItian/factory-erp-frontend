import { NavGroup } from '@/types';

export const navGroups: NavGroup[] = [
  {
    label: 'Overview',
    items: [
      {
        title: 'Dashboard',
        url: '/dashboard/overview',
        icon: 'dashboard',
        description: 'Overview metrics and activity',
        isActive: false,
        shortcut: ['d', 'd'],
        items: []
      },
      {
        title: 'Projects Management',
        url: '/dashboard/projects',
        icon: 'workspace',
        description: 'Create and manage projects',
        isActive: false,
        shortcut: ['p', 'p'],
        items: []
      },
      {
        title: 'My Tasks',
        url: '/dashboard/tasks',
        icon: 'kanban',
        description: 'Your assigned task board',
        isActive: false,
        shortcut: ['t', 't'],
        items: []
      },
      {
        title: 'Form Builder',
        url: '/dashboard/forms/json-form-builder',
        icon: 'forms',
        description: 'Build and preview JSON forms',
        isActive: false,
        shortcut: ['f', 'b'],
        items: []
      }
    ]
  },
  {
    label: 'Administration',
    items: [
      {
        title: 'Users Management',
        url: '/dashboard/users',
        icon: 'teams',
        description: 'Invite and manage users',
        isActive: false,
        shortcut: ['u', 'u'],
        items: []
      },
      {
        title: 'Roles Management',
        url: '/dashboard/roles',
        icon: 'shield',
        description: 'Roles and access assignments',
        isActive: false,
        shortcut: ['r', 'r'],
        items: []
      }
    ]
  },
  {
    label: 'Organization',
    items: [
      {
        title: 'Organization',
        url: '/dashboard/factory',
        icon: 'factory',
        description: 'Sites, locations, stores, and departments',
        isActive: false,
        shortcut: ['o', 'g'],
        items: [
          {
            title: 'Sites',
            url: '/dashboard/factory',
            icon: 'compass',
            description: 'Locations with store and stock totals',
            shortcut: ['y', 'd']
          },
          {
            title: 'Locations',
            url: '/dashboard/locations',
            icon: 'location',
            description: 'Factories, outlets, and warehouses',
            shortcut: ['l', 'o']
          },
          {
            title: 'Stores',
            url: '/dashboard/stores',
            icon: 'warehouse',
            description: 'Stock rooms at each site',
            shortcut: ['s', 't']
          },
          {
            title: 'Departments',
            url: '/dashboard/departments',
            icon: 'sitemap',
            description: 'Teams and site departments',
            shortcut: ['d', 'p']
          }
        ]
      }
    ]
  },
  {
    label: 'Catalog',
    items: [
      {
        title: 'Catalog',
        url: '/dashboard/items',
        icon: 'package',
        description: 'Items, categories, units, and attributes',
        isActive: false,
        shortcut: ['c', 'a'],
        items: [
          {
            title: 'Items',
            url: '/dashboard/items',
            icon: 'package',
            description: 'SKUs, templates, and variants',
            shortcut: ['i', 't']
          },
          {
            title: 'Categories',
            url: '/dashboard/item-categories',
            icon: 'category',
            description: 'Group items by type',
            shortcut: ['c', 't']
          },
          {
            title: 'Units',
            url: '/dashboard/uoms',
            icon: 'ruler',
            description: 'Measure and convert quantities',
            shortcut: ['u', 'm']
          },
          {
            title: 'Attributes',
            url: '/dashboard/attributes',
            icon: 'tags',
            description: 'Specs, groups, and sets',
            shortcut: ['a', 't']
          }
        ]
      }
    ]
  },
  {
    label: 'Inventory',
    items: [
      {
        title: 'Inventory',
        url: '/dashboard/inventory',
        icon: 'boxes',
        description: 'Stock on hand, ledger, and warehouse documents',
        isActive: false,
        shortcut: ['i', 'n'],
        items: [
          {
            title: 'On hand',
            url: '/dashboard/inventory',
            icon: 'boxes',
            description: 'Current stock by store',
            shortcut: ['s', 'h']
          },
          {
            title: 'Ledger',
            url: '/dashboard/inventory/ledger',
            icon: 'inventory',
            description: 'Every stock movement',
            shortcut: ['m', 'v']
          },
          {
            title: 'Receipt notes (MRN)',
            url: '/dashboard/inventory/mrn',
            icon: 'mrn',
            description: 'Receive materials into a store',
            shortcut: ['m', 'r']
          },
          {
            title: 'Issue notes (MIN)',
            url: '/dashboard/inventory/min',
            icon: 'min',
            description: 'Issue materials to production',
            shortcut: ['m', 'i']
          },
          {
            title: 'Transfers',
            url: '/dashboard/inventory/transfers',
            icon: 'transfer',
            description: 'Move stock between stores',
            shortcut: ['t', 'f']
          },
          {
            title: 'Supplier returns',
            url: '/dashboard/inventory/returns',
            icon: 'materialReturn',
            description: 'Return materials to suppliers',
            shortcut: ['r', 't']
          }
        ]
      }
    ]
  },
  {
    label: 'Production',
    items: [
      {
        title: 'Production',
        url: '/dashboard/production',
        icon: 'production',
        description: 'Work orders, BoMs, work centers, and gate passes',
        isActive: false,
        shortcut: ['p', 'r'],
        items: [
          {
            title: 'Work orders',
            url: '/dashboard/production',
            icon: 'production',
            description: 'Jobs to make finished goods',
            shortcut: ['w', 'o']
          },
          {
            title: 'BoM templates',
            url: '/dashboard/production/bom-templates',
            icon: 'bomTemplate',
            description: 'Reusable per-piece recipes to prefill new BoMs',
            shortcut: ['b', 't']
          },
          {
            title: 'Bills of materials',
            url: '/dashboard/production/boms',
            icon: 'bom',
            description: 'How much fabric, trim, and packaging one finished piece needs',
            shortcut: ['b', 'm']
          },
          {
            title: 'Work centers',
            url: '/dashboard/production/work-centers',
            icon: 'workCenter',
            description: 'Shop-floor stations',
            shortcut: ['w', 'c']
          },
          {
            title: 'Gate passes',
            url: '/dashboard/production/gate-passes',
            icon: 'gatePass',
            description: 'Inward and outward material at the gate',
            shortcut: ['g', 'p']
          }
        ]
      }
    ]
  },
  {
    label: 'Purchasing',
    items: [
      {
        title: 'Purchasing',
        url: '/dashboard/purchasing/orders',
        icon: 'purchaseOrder',
        description: 'Suppliers and purchase orders',
        isActive: false,
        shortcut: ['p', 'u'],
        items: [
          {
            title: 'Purchase orders',
            url: '/dashboard/purchasing/orders',
            icon: 'purchaseOrder',
            description: 'Buy fabric and trims',
            shortcut: ['p', 'o']
          },
          {
            title: 'Suppliers',
            url: '/dashboard/purchasing/suppliers',
            icon: 'supplier',
            description: 'Vendor master data',
            shortcut: ['s', 'u']
          }
        ]
      }
    ]
  },
  {
    label: 'Sales',
    items: [
      {
        title: 'Sales',
        url: '/dashboard/sales/pos',
        icon: 'salesOrder',
        description: 'POS, customers, and sales orders',
        isActive: false,
        shortcut: ['s', 'a'],
        items: [
          {
            title: 'Outlet POS',
            url: '/dashboard/sales/pos',
            icon: 'pos',
            description: 'Ring up finished goods at an outlet',
            shortcut: ['p', 's']
          },
          {
            title: 'POS sales',
            url: '/dashboard/sales/pos/history',
            icon: 'inventory',
            description: 'Register sale history',
            shortcut: ['p', 'h']
          },
          {
            title: 'Returns & refunds',
            url: '/dashboard/sales/pos/returns',
            icon: 'refund',
            description: 'Customer product returns and refunds',
            shortcut: ['r', 'f']
          },
          {
            title: 'Sales orders',
            url: '/dashboard/sales/orders',
            icon: 'salesOrder',
            description: 'Sell finished goods',
            shortcut: ['s', 'o']
          },
          {
            title: 'Customers',
            url: '/dashboard/sales/customers',
            icon: 'customer',
            description: 'Outlet and buyer master data',
            shortcut: ['c', 'u']
          }
        ]
      }
    ]
  }
];
