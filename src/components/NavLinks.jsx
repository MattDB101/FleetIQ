import {
  Assessment,
  Create,
  DesktopWindows,
  ImportContacts,
  Settings,
  Person,
  DirectionsBus,
} from '@material-ui/icons';
import SpeedIcon from '@mui/icons-material/Speed';
import FireExtinguisherIcon from '@mui/icons-material/FireExtinguisher';
import MedicalServicesOutlinedIcon from '@mui/icons-material/MedicalServicesOutlined';
import EuroIcon from '@mui/icons-material/Euro';
import { useTranslation } from 'react-i18next';
import EditCalendarIcon from '@mui/icons-material/EditCalendar';
import Build from '@mui/icons-material/Build';
import AirportShuttleIcon from '@mui/icons-material/AirportShuttle';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import SearchIcon from '@mui/icons-material/Search';
import AssignmentLateIcon from '@mui/icons-material/AssignmentLate';
import EngineeringIcon from '@mui/icons-material/Engineering';

function NavLinks() {
  let { t } = useTranslation();
  return {
    audit: {
      heading: t('Audit Compliance'),
      icon: <ImportContacts />,
      links: {
        quickAudit: {
          text: t('Audit Compliance'),
          path: '/quick-audit',
          icon: <SearchIcon />,
        },
      },
    },
    inspections: {
      heading: t('Inspections'),
      icon: <ImportContacts />,
      links: {
        inspections: {
          text: t('Inspections'),
          path: '/inspections',
          icon: <AssignmentTurnedInIcon />,
        },
      },
    },
    faults: {
      heading: t('Faults'),
      icon: <ImportContacts />,
      links: {
        faults: {
          text: t('Faults'),
          path: '/faults',
          icon: <AssignmentLateIcon />,
        },
      },
    },
    maintenance: {
      heading: t('Maintenance'),
      icon: <ImportContacts />,
      links: {
        faults: {
          text: t('Maintenance'),
          path: '/maintenance',
          icon: <EngineeringIcon />,
        },
      },
    },
    Expirables: {
      heading: t('Expirables'),
      icon: <EditCalendarIcon />,
      links: {
        cvrt: {
          text: t('CVRT'),
          path: '/cvrt',
          icon: <Build />,
        },

        tax: {
          text: t('Tax'),
          path: '/tax',
          icon: <EuroIcon />,
        },
        psv: {
          text: t('PSV'),
          path: '/psv',
          icon: <AirportShuttleIcon />,
        },
        fireExtinguishers: {
          text: t('Fire Extinguishers'),
          path: '/fireextinguishers',
          icon: <FireExtinguisherIcon />,
        },
        firstAid: {
          text: t('First Aid Kits'),
          path: '/firstaid',
          icon: <MedicalServicesOutlinedIcon />,
        },
        tachoCalibration: {
          text: t('Tachograph Calibration'),
          path: '/tachocalibration',
          icon: <SpeedIcon />,
        },
      },
    },
    registerVehicles: {
      heading: t('Vehicles'),
      icon: <ImportContacts />,
      links: {
        registerVehicle: {
          text: t('Vehicles'),
          path: '/vehicles',
          icon: <DirectionsBus />,
        },
      },
    },
    registerDriver: {
      heading: t('Drivers'),
      icon: <ImportContacts />,
      links: {
        registerDriver: {
          text: t('Drivers'),
          path: '/drivers',
          icon: <Person />,
        },
      },
    },
    diary: {
      heading: t('Diary'),
      icon: <ImportContacts />,
      links: {
        recordData: {
          text: t('Diary'),
          path: '/diary',
          icon: <ImportContacts />,
        },
      },
    },

    configuration: {
      heading: t('Settings'),
      icon: <Assessment />,
      links: {
        settings: {
          text: t('Settings'),
          path: '/settings',
          icon: <Settings />,
        },
      },
    },
  };
}

export default NavLinks;
