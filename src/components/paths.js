import { Assessment, Create, DesktopWindows, ImportContacts, Settings, Person, DirectionsBus, LocalHospital} from "@material-ui/icons";
import FireExtinguisherIcon from '@mui/icons-material/FireExtinguisher';
import MedicalServicesOutlinedIcon from '@mui/icons-material/MedicalServicesOutlined';
import { useTranslation } from "react-i18next";

function NavLinks() {
    let { t } = useTranslation();
    return {
        recordData: {
            text: t("Diary"),
            path: "/diary",
            icon: <ImportContacts />

        },
        registerResident: {
            text: t("Drivers"),
            path: "/drivers",
            icon: <Person />
        },
        registerVehicle: {
            text: t("Vehicles"),
            path: "/vehicles",
            icon: <DirectionsBus />
        },
        fireExtinguishers: {
            text: t("Fire Extinguishers"),
            path: "/fireextinguishers",
            icon: <FireExtinguisherIcon />
        },
        firstAid: {
            text: t("First Aid"),
            path: "/firstaid",
            icon: <MedicalServicesOutlinedIcon />
        },
        settings: {
            text: t("Settings"),
            path: "/settings",
            icon: <Settings />
        }  
    }
}

export default NavLinks;