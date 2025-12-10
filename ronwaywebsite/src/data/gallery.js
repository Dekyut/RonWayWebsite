import { CARS } from './cars';

// Collect all car images (excluding the main image which is at index 0)
// Only include portrait and landscape images
const getAllCarImages = () => {
  const allImages = [];
  
  CARS.forEach((car) => {
    if (car.images && car.images.length > 1) {
      // Skip the first image (main image) and include the rest (portrait and landscape)
      const carImages = car.images.slice(1);
      carImages.forEach((image) => {
        allImages.push({ src: image });
      });
    }
  });
  
  return allImages;
};

// Combine all gallery images for carousel
export const ALL_GALLERY_IMAGES = getAllCarImages();

