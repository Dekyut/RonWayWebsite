import monteroImg from '../assets/cars/MonteroSportNew.svg';
import velozImg from '../assets/cars/Veloz2.svg';
import grandiaImg from '../assets/cars/ToyotaGrandiaNew.svg';
import custinImg from '../assets/cars/Hyundai Custin.svg';
import fortunerImg from '../assets/cars/Toyota Fortuner.svg';

// Import portrait images
import Montero1Portrait from '../assets/cars_portrait/Montero1Portrait.png';
import Custin1Portrait from '../assets/cars_portrait/Custin1Portrait.png';
import Custin2Portrait from '../assets/cars_portrait/Custin2Portrait.png';
import Custin3Portrait from '../assets/cars_portrait/Custin3Portrait.png';
import Custin4Portrait from '../assets/cars_portrait/Custin4Portrait.png';
import Fortuner1Portrait from '../assets/cars_portrait/Fortuner1Portrait.png';
import Fortuner2Portrait from '../assets/cars_portrait/Fortuner2Portrait.png';
import Fortuner3Portrait from '../assets/cars_portrait/Fortuner3Portrait.png';
import Fortuner4Portrait from '../assets/cars_portrait/Fortuner4Portrait.png';
import Grandia1Portrait from '../assets/cars_portrait/Grandia1Portrait.png';
import Grandia2Portrait from '../assets/cars_portrait/Grandia2Portrait.png';
import Grandia3Portrait from '../assets/cars_portrait/Grandia3Portrait.png';
import Grandia4Portrait from '../assets/cars_portrait/Grandia4Portrait.png';

// Import landscape images
import Montero1Landscape from '../assets/cars_landscape/Montero1Landscape.png';
import Montero2Landscape from '../assets/cars_landscape/Montero2Landscape.png';
import Montero3Landscape from '../assets/cars_landscape/Montero3Landscape.png';
import Montero4Landscape from '../assets/cars_landscape/Montero4Landscape.png';
import CustinLandscape1 from '../assets/cars_landscape/CustinLandscape1.png';
import CustinLandscape2 from '../assets/cars_landscape/CustinLandscape2.png';
import CustinLandscape3 from '../assets/cars_landscape/CustinLandscape3.png';
import Fortuner1Landscape from '../assets/cars_landscape/Fortuner1Landscape.png';
import Fortuner2Landscape from '../assets/cars_landscape/Fortuner2Landscape.png';
import Grandia2Landscape from '../assets/cars_landscape/Grandia2Landscape.png';
import Grandia3Landscape from '../assets/cars_landscape/Grandia3Landscape.png';
import Veloz1Landscape from '../assets/cars_landscape/Veloz1Landscape.png';
import Veloz2lLandscape from '../assets/cars_landscape/Veloz2lLandscape.png';
import Veloz3Landscape from '../assets/cars_landscape/Veloz3Landscape.png';
import Veloz4Landscape from '../assets/cars_landscape/Veloz4Landscape.png';

export const CARS = [
  { 
    name: 'Montero Sport 2025', 
    image: monteroImg,
    images: [
      monteroImg,
      Montero1Portrait,
      Montero1Landscape,
      Montero2Landscape,
      Montero3Landscape,
      Montero4Landscape,
    ],
    category: 'SUV', 
    seats: 7,
    displacement: '2442cc',
    transmission: 'Automatic',
    fuelType: 'Diesel',
    fuelCapacity: '70L',
    description: 'The Montero Sport 2025 is a premium SUV that combines rugged capability with modern luxury. Perfect for families and adventurers alike, it offers exceptional performance, advanced safety features, and spacious comfort for all your journeys.',
    description2: 'With its powerful engine and robust build, the Montero Sport is ideal for both city driving and off-road adventures. Experience the perfect blend of style, comfort, and reliability.'
  },
  { 
    name: 'Toyota Veloz', 
    image: velozImg,
    images: [
      velozImg,
      Veloz1Landscape,
      Veloz2lLandscape,
      Veloz3Landscape,
      Veloz4Landscape,
    ],
    category: 'MPV', 
    seats: 7,
    displacement: '1496cc',
    transmission: 'CVT',
    fuelType: 'Gasoline',
    fuelCapacity: '45L',
    description: 'The Toyota Veloz is a versatile MPV designed for modern families. It offers excellent fuel efficiency, comfortable seating for seven, and a host of advanced features that make every journey enjoyable.',
    description2: 'Perfect for daily commutes and family trips, the Veloz combines practicality with style. Its spacious interior and smooth ride make it an excellent choice for those who value comfort and reliability.'
  },
  { 
    name: 'Toyota Grandia 2025', 
    image: grandiaImg,
    images: [
      grandiaImg,
      Grandia1Portrait,
      Grandia2Portrait,
      Grandia3Portrait,
      Grandia4Portrait,
      Grandia2Landscape,
      Grandia3Landscape,
    ],
    category: 'Van', 
    seats: 15,
    displacement: '2755cc',
    transmission: 'Automatic',
    fuelType: 'Diesel',
    fuelCapacity: '75L',
    description: 'The Toyota Grandia 2025 is a spacious van designed for large groups and commercial use. With seating for up to 15 passengers, it\'s perfect for tours, events, and group transportation.',
    description2: 'Built for comfort and reliability, the Grandia offers ample space, powerful performance, and excellent fuel economy. Ideal for businesses and families who need to transport many passengers in style and comfort.'
  },
  { 
    name: 'Hyundai Custin', 
    image: custinImg,
    images: [
      custinImg,
      Custin1Portrait,
      Custin2Portrait,
      Custin3Portrait,
      Custin4Portrait,
      CustinLandscape1,
      CustinLandscape2,
      CustinLandscape3,
    ],
    category: 'MPV', 
    seats: 7,
    displacement: '1999cc',
    transmission: 'Automatic',
    fuelType: 'Gasoline',
    fuelCapacity: '60L',
    description: 'The Hyundai Custin is a premium MPV that redefines family transportation. With its sleek design, advanced technology, and luxurious interior, it offers an exceptional driving experience.',
    description2: 'Combining style with functionality, the Custin provides comfortable seating for seven, impressive fuel efficiency, and cutting-edge features. Perfect for families who want the best in comfort and technology.'
  },
  { 
    name: 'Toyota Fortuner', 
    image: fortunerImg,
    images: [
      fortunerImg,
      Fortuner1Portrait,
      Fortuner2Portrait,
      Fortuner3Portrait,
      Fortuner4Portrait,
      Fortuner1Landscape,
      Fortuner2Landscape,
    ],
    category: 'SUV', 
    seats: 7,
    displacement: '2755cc',
    transmission: 'Automatic',
    fuelType: 'Diesel',
    fuelCapacity: '80L',
    description: 'The Toyota Fortuner is a rugged and reliable SUV built for adventure. With its powerful diesel engine, advanced 4WD capabilities, and spacious interior, it\'s ready for any challenge.',
    description2: 'Whether navigating city streets or exploring off-road trails, the Fortuner delivers exceptional performance and durability. Experience the perfect combination of power, comfort, and versatility.'
  },
];

