export const defaultDialogState = {
  shown: false,
  title: '',
  flavour: 'success',
  dialogType: null,
  collection: '',
};

export const defaultComplianceState = {
  registration: '',
  expiryDate: new Date(),
  comment: '',
};

export const defaultInspectionState = {};

export const defaultVehicleState = {
  registration: '',
  make: '',
  model: '',
  capacity: '',
  vin: '',
  comment: '',
};

export const defaultDialogMapping = {
  fireextinguishers: {
    title: 'Fire Extinguisher Inspection',
    dialogType: 'generic',
    collection: 'fireextinguishers',
  },
  firstaidkits: {
    title: 'First Aid Expiration',
    dialogType: 'generic',
    collection: 'firstaidkits',
  },
  tachocalibrations: {
    title: 'Tachograph Calibration',
    dialogType: 'generic',
    collection: 'tachocalibrations',
  },
  taxes: {
    title: 'Vehicle Tax Expiration',
    dialogType: 'generic',
    collection: 'taxes',
  },
  psvs: {
    title: 'Vehicle PSV Inspection Expiration',
    dialogType: 'generic',
    collection: 'psvs',
  },
  cvrts: {
    title: 'CVRT Expiration',
    dialogType: 'generic',
    collection: 'cvrts',
  },
  maintenance: {
    title: 'Maintenance',
    dialogType: 'maintenance',
    collection: 'maintenance',
  },
  vehicles: {
    title: 'Vehicle',
    dialogType: 'vehicle',
    collection: 'vehicles',
  },
};
