// All 20 luxury cars mapped directly to user's saved photos in /cars/
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

const BRAND_IMAGES: Record<string, string> = {
  porsche: "/cars/Porsche 911 Turbo S.jpg",
  ferrari: "/cars/Ferrari SF90 Stradale.jpg",
  lamborghini: "/cars/Lamborghini Aventador SVJ.jpg",
  mclaren: "/cars/McLaren 720S.jpg",
  bugatti: "/cars/Bugatti Chiron Super Sport.jpg",
  "rolls-royce": "/cars/Rolls-Royce Phantom.jpg",
  "rolls royce": "/cars/Rolls-Royce Phantom.jpg",
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

export function getCarFallbackImage(id: number, brand?: string, name?: string): string {
  if (name) {
    const n = name.toLowerCase();
    if (n.includes("chiron") || n.includes("bugatti")) return "/cars/Bugatti Chiron Super Sport.jpg";
    if (n.includes("taycan")) return "/cars/Porsche Taycan Turbo S.jpg";
    if (n.includes("911") || n.includes("gt3")) return "/cars/Porsche 911 Turbo S.jpg";
    if (n.includes("sf90") || n.includes("stradale")) return "/cars/Ferrari SF90 Stradale.jpg";
    if (n.includes("aventador") || n.includes("svj") || n.includes("revuelto")) return "/cars/Lamborghini Aventador SVJ.jpg";
    if (n.includes("720s") || n.includes("mclaren")) return "/cars/McLaren 720S.jpg";
    if (n.includes("phantom")) return "/cars/Rolls-Royce Phantom.jpg";
    if (n.includes("continental")) return "/cars/Bentley Continental GT.jpg";
    if (n.includes("dbs") || n.includes("superleggera")) return "/cars/Aston Martin DBS Superleggera.jpg";
    if (n.includes("amg gt") || n.includes("black series")) return "/cars/Mercedes-AMG GT Black Series.jpg";
    if (n.includes("r8")) return "/cars/Audi R8 V10 Performance.jpg";
    if (n.includes("m8")) return "/cars/BMW M8 Competition.jpg";
    if (n.includes("model s") || n.includes("plaid")) return "/cars/Tesla Model S Plaid.jpg";
    if (n.includes("gt-r") || n.includes("gtr") || n.includes("nismo")) return "/cars/Nissan GT-R Nismo.jpg";
    if (n.includes("f-type")) return "/cars/Jaguar F-Type R.jpg";
    if (n.includes("mc20")) return "/cars/Maserati MC20.jpg";
    if (n.includes("lc 500") || n.includes("lc500")) return "/cars/Lexus LC 500.jpg";
    if (n.includes("corvette") || n.includes("z06")) return "/cars/Chevrolet Corvette Z06.jpg";
    if (n.includes("mustang") || n.includes("shelby")) return "/cars/Ford Mustang Shelby GT500.jpg";
    if (n.includes("jesko")) return "/cars/Koenigsegg Jesko.jpg";
  }

  if (CAR_IMAGES_BY_ID[id]) {
    return CAR_IMAGES_BY_ID[id];
  }

  if (brand) {
    const key = brand.toLowerCase().trim();
    if (BRAND_IMAGES[key]) {
      return BRAND_IMAGES[key];
    }
  }

  return DEFAULT_SUPERCAR_IMAGE;
}
