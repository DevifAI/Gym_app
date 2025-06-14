

import HomeLogo from '../assets/icons/HomeLogo.png';
import AminitiesLogo from '../assets/icons/AmenitiesLogo.png';
import CafeLogo from '../assets/icons/CafeLogo.png';
import ProfileLogo from '../assets/icons/ProfileLogo.png';


import Home from '../screens/Home';
import Cafe from '../screens/Cafe';
import Amenities from '../screens/Amenities';
import Profile from '../screens/Profile';

export const TabsConfig = [
  {name: 'Home', component: Home, icon: HomeLogo},
{name: 'Aminities', component: Amenities, icon: AminitiesLogo},
  {
    name: 'Cafe',
    component: Cafe,
    icon: CafeLogo,
  },
  {name: 'Profile', component: Profile, icon: ProfileLogo},
];
