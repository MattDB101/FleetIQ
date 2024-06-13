import { Assessment, Create, DesktopWindows, ImportContacts, Settings, Person, DirectionsBus } from "@material-ui/icons";
import SpeedIcon from '@mui/icons-material/Speed';
import FireExtinguisherIcon from '@mui/icons-material/FireExtinguisher';
import MedicalServicesOutlinedIcon from '@mui/icons-material/MedicalServicesOutlined';
import EuroIcon from '@mui/icons-material/Euro';
import { useTranslation } from "react-i18next";
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import AssuredWorkloadIcon from '@mui/icons-material/AssuredWorkload';
import Build from '@mui/icons-material/Build';
import AirportShuttleIcon from '@mui/icons-material/AirportShuttle';
import BadgeIcon from '@mui/icons-material/Badge';

function NavLinks() {
    let { t } = useTranslation();
    return {
        general: {
            heading: t("Diary"),
            icon: <ImportContacts />,
            links: {
                recordData: {
                    text: t("Diary"),
                    path: "/diary",
                    icon: <ImportContacts />
                },
            }
        },
        compliance: {
            heading: t("Compliance"),
            icon: <AssuredWorkloadIcon />,
            links: {
                cvrt: {
                    text: t("CVRT"),
                    path: "/cvrt",
                    icon: <Build />
                },
                tax: {
                    text: t("Tax"),
                    path: "/tax",
                    icon: <EuroIcon />
                },
                psv: {
                    text: t("PSV"),
                    path: "/psv",
                    icon: <AirportShuttleIcon />
                },
                rtol: {
                    text: t("RTOL"),
                    path: "/rtol",
                    icon: <BadgeIcon />
                },
                fireExtinguishers: {
                    text: t("Fire Extinguishers"),
                    path: "/fireextinguishers",
                    icon: <FireExtinguisherIcon />
                },
                firstAid: {
                    text: t("First Aid Kits"),
                    path: "/firstaid",
                    icon: <MedicalServicesOutlinedIcon />
                },
                tachoCalibration: {
                    text: t("Tachograph Calibration"),
                    path: "/tachocalibration",
                    icon: <SpeedIcon />
                }
            }
        },
        management: {
            heading: t("Asset Management"),
            icon: <ManageAccountsIcon />,
            links: {
                registerResident: {
                    text: t("Drivers"),
                    path: "/drivers",
                    icon: <Person />
                },
                registerVehicle: {
                    text: t("Vehicles"),
                    path: "/vehicles",
                    icon: <DirectionsBus />
                }
            }
        },
        configuration: {
            heading: t("Settings"),
            icon: <Assessment />,
            links: {
                settings: {
                    text: t("Settings"),
                    path: "/settings",
                    icon: <Settings />
                }
            }
        },
    }
}

export default NavLinks;
