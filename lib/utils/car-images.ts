const CAR_IMAGES_BY_ID: Record<number, string> = {
  1: "/cars/Porsche 911 Turbo S.jpg",
  2: "/cars/Ferrari SF90 Stradale.jpg",
  3: "/cars/Lamborghini Aventador SVJ.jpg",
  4: "/cars/McLaren 720S.jpg",
  5: "/cars/Bugatti Chiron Super Sport.jpg",
  6: "/cars/Rolls-Royce Phantom.jpg",
  7: "/cars/Bentley Continental GT.jpg",
  8: "/cars/Aston Martin DBS Superleggera.jpg",
  9: "/cars/Mercedes-AMG GT Black Series.jpg",
  10: "/cars/Audi R8 V10 Performance.jpg",
  11: "/cars/BMW M8 Competition.jpg",
  12: "/cars/Tesla Model S Plaid.jpg",
  13: "/cars/Nissan GT-R Nismo.jpg",
  14: "/cars/Jaguar F-Type R.jpg",
  15: "/cars/Maserati MC20.jpg",
  16: "/cars/Lexus LC 500.jpg",
  17: "/cars/Chevrolet Corvette Z06.jpg",
  18: "/cars/Ford Mustang Shelby GT500.jpg",
  19: "/cars/Porsche Taycan Turbo S.jpg",
  20: "/cars/Koenigsegg Jesko.jpg",
};

const BRAND_FALLBACKS: Record<string, string> = {
  porsche: "/cars/Porsche 911 Turbo S.jpg",
  ferrari: "/cars/Ferrari SF90 Stradale.jpg",
  lamborghini: "/cars/Lamborghini Aventador SVJ.jpg",
  mclaren: "/cars/McLaren 720S.jpg",
  bugatti: "/cars/Bugatti Chiron Super Sport.jpg",
  "rolls-royce": "/cars/Rolls-Royce Phantom.jpg",
  bentley: "/cars/Bentley Continental GT.jpg",
  "aston martin": "/cars/Aston Martin DBS Superleggera.jpg",
  "mercedes-amg": "/cars/Mercedes-AMG GT Black Series.jpg",
  mercedes: "/cars/Mercedes-AMG GT Black Series.jpg",
  audi: "/cars/Audi R8 V10 Performance.jpg",
  bmw: "/cars/BMW M8 Competition.jpg",
  tesla: "/cars/Tesla Model S Plaid.jpg",
  nissan: "/cars/Nissan GT-R Nismo.jpg",
  jaguar: "/cars/Jaguar F-Type R.jpg",
  maserati: "/cars/Maserati MC20.jpg",
  lexus: "/cars/Lexus LC 500.jpg",
  chevrolet: "/cars/Chevrolet Corvette Z06.jpg",
  ford: "/cars/Ford Mustang Shelby GT500.jpg",
  koenigsegg: "/cars/Koenigsegg Jesko.jpg",
};

const DEFAULT_SUPERCAR_IMAGE = "/cars/Bugatti Chiron Super Sport.jpg";

export function getCarFallbackImage(id: number, brand?: string): string {
  if (CAR_IMAGES_BY_ID[id]) {
    return CAR_IMAGES_BY_ID[id];
  }
  if (brand) {
    const key = brand.toLowerCase().trim();
    if (BRAND_FALLBACKS[key]) {
      return BRAND_FALLBACKS[key];
    }
  }
  return DEFAULT_SUPERCAR_IMAGE;
}
