// Import team member images
import RonAldrenzGolingoImg from '../assets/team_members/Ron Aldrenz Golingo.png';
import ReinierYtonImg from '../assets/team_members/Reinier Yton.png';
import JaysonMosquedaImg from '../assets/team_members/Jayson Mosqueda.png';
import RonAldrianGolingoImg from '../assets/team_members/Ron Aldrian Golingo.png';
import OmarDelgadoImg from '../assets/team_members/Omar Delgado.png';
import EdwardLucasImg from '../assets/team_members/Edward Lucas.png';
import FrederickAtonImg from '../assets/team_members/Frederick Aton.png';
import AllanCobeloImg from '../assets/team_members/Allan Cobelo.png';
import MarkRingorImg from '../assets/team_members/Mark RIngor.png';

// Import driver certificates
import OmarDelgadoCert from '../assets/team_members/certificates/Cert - Omar Delgado.png';
import EdwardLucasCert from '../assets/team_members/certificates/Cert- Edward Lucas.png';
import FrederickAtonCert from '../assets/team_members/certificates/Cert - Frederick Aton.png';
import AllanCobeloCert from '../assets/team_members/certificates/Cert - Allan Cobelo.png';

// Team Leaders (Management)
export const TEAM_LEADERS = [
  {
    name: 'Ron Aldrenz Golingo',
    role: 'Chief Executive Officer',
    image: RonAldrenzGolingoImg,
    description: 'As the Chief Executive Officer of RonWay Cars and Travel, Inc., Ron Aldrenz Golingo brings visionary leadership and strategic direction to the company. With a passion for excellence in transportation services, he oversees the company\'s mission to deliver premium mobility solutions. Under his guidance, RonWay has established itself as a trusted partner for families, executives, and corporate teams across the Philippines, combining a curated fleet with concierge-level service to ensure every journey is exceptional.'
  }
];

// Team Members (Staff)
export const TEAM_MEMBERS = [
  {
    name: 'Jayson Mosqueda',
    role: 'Assistant Transport Officer',
    image: JaysonMosquedaImg
  },
  {
    name: 'Ron Aldrian Golingo',
    role: 'Admin Assistant',
    image: RonAldrianGolingoImg
  }
];

// Drivers
export const DRIVERS = [
  {
    name: 'Edward Lucas',
    role: 'Driver',
    image: EdwardLucasImg,
    certificate: EdwardLucasCert,
    description: 'A dedicated professional driver with extensive experience in passenger transportation. Edward prioritizes safety and punctuality, making him a trusted member of the RonWay team.'
  },
  {
    name: 'Frederick Aton',
    role: 'Driver',
    image: FrederickAtonImg,
    certificate: FrederickAtonCert,
    description: 'An experienced driver known for his excellent driving skills and customer service. Frederick brings reliability and professionalism to every trip, ensuring passengers reach their destinations safely and on time.'
  },
  {
    name: 'Allan Cobelo',
    role: 'Driver',
    image: AllanCobeloImg,
    certificate: AllanCobeloCert,
    description: 'A professional driver with a strong commitment to safety and customer satisfaction. Allan\'s attention to detail and friendly demeanor make every journey with RonWay a pleasant experience.'
  },
  {
    name: 'Mark Ringor',
    role: 'Driver',
    image: MarkRingorImg,
    description: 'A reliable and professional driver dedicated to providing exceptional transportation services. Mark\'s expertise and courteous service contribute to RonWay\'s reputation for excellence.'
  }
];

// All team members combined (for carousel)
export const ALL_TEAM_MEMBERS = [...TEAM_MEMBERS, ...DRIVERS];

