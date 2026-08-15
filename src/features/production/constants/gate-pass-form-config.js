import { z } from 'zod';

export const GATE_PASS_TYPE_OPTIONS = [
  { label: 'Outward', value: 'OUTWARD' },
  { label: 'Inward', value: 'INWARD' }
];

export const GATE_PASS_REASON_OPTIONS = [
  { label: 'Dispatch', value: 'DISPATCH' },
  { label: 'Transfer', value: 'TRANSFER' },
  { label: 'Return', value: 'RETURN' },
  { label: 'Sample', value: 'SAMPLE' },
  { label: 'Scrap', value: 'SCRAP' }
];

export const gatePassSchema = z.object({
  type: z.enum(['OUTWARD', 'INWARD']),
  reason: z.enum(['DISPATCH', 'TRANSFER', 'RETURN', 'SAMPLE', 'SCRAP']),
  locationId: z.string().min(1, 'Select the gate location'),
  destinationId: z.string().optional(),
  vehicleNo: z.string().optional(),
  driverName: z.string().optional(),
  notes: z.string().optional()
});

export const GATE_PASS_DEFAULTS = {
  type: 'OUTWARD',
  reason: 'DISPATCH',
  locationId: '',
  destinationId: '__none__',
  vehicleNo: '',
  driverName: '',
  notes: ''
};

export const gatePassLineSchema = z.object({
  itemId: z.string().min(1, 'Select an item'),
  quantity: z.string().trim().min(1, 'Quantity is required'),
  remarks: z.string().optional()
});

export function getGatePassFormSections(locationOptions = []) {
  return [
    {
      id: 'identity',
      title: 'Gate pass',
      description: 'What is leaving or entering the site.',
      icon: 'gatePass',
      columns: 2,
      fields: [
        {
          name: 'type',
          label: 'Direction',
          type: 'select',
          options: GATE_PASS_TYPE_OPTIONS
        },
        {
          name: 'reason',
          label: 'Reason',
          type: 'select',
          options: GATE_PASS_REASON_OPTIONS
        },
        {
          name: 'locationId',
          label: 'Gate location',
          type: 'select',
          placeholder: 'Select location',
          options: locationOptions
        },
        {
          name: 'destinationId',
          label: 'Destination',
          type: 'select',
          placeholder: 'None',
          options: [{ label: 'None', value: '__none__' }, ...locationOptions]
        }
      ]
    },
    {
      id: 'vehicle',
      title: 'Vehicle',
      description: 'Optional, but needed before issue on outward passes.',
      icon: 'gatePass',
      columns: 2,
      fields: [
        {
          name: 'vehicleNo',
          label: 'Vehicle no.',
          type: 'text',
          placeholder: 'LEA-2194'
        },
        {
          name: 'driverName',
          label: 'Driver',
          type: 'text',
          placeholder: 'Imran Malik'
        },
        {
          name: 'notes',
          label: 'Notes',
          type: 'textarea',
          placeholder: 'Finished goods to Islamabad outlet'
        }
      ]
    }
  ];
}

export function getGatePassLineFields(itemOptions = []) {
  return [
    {
      name: 'itemId',
      label: 'Item',
      type: 'select',
      placeholder: 'Select item',
      options: itemOptions
    },
    {
      name: 'quantity',
      label: 'Quantity',
      type: 'text',
      placeholder: '120'
    },
    {
      name: 'remarks',
      label: 'Remarks',
      type: 'text',
      placeholder: 'Carton 1–4',
      wrapperClassName: 'sm:col-span-2'
    }
  ];
}

export function getGatePassLineFormSections(itemOptions = []) {
  return [
    {
      id: 'line',
      title: 'New line',
      description: 'What is moving through the gate, and how much.',
      icon: 'package',
      columns: 2,
      fields: getGatePassLineFields(itemOptions)
    }
  ];
}

export function nextGatePassStatus(status) {
  if (status === 'DRAFT') return { label: 'Issue', status: 'ISSUED' };
  if (status === 'ISSUED') return { label: 'Close', status: 'CLOSED' };
  return null;
}
