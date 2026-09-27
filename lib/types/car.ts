export interface Car {
    id: number;
    name: string;
    brand: string;
    price: number;
    description: string;
    colorOptions: string;
    showroomLocation: string;
    deliveryDays: number;
    paymentOptions: string;
    imageUrl: string | null;
    imageName: string | null;
    hasImage: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface PageResponse<T> {
    content: T[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
    first: boolean;
    last: boolean;
    empty: boolean;
}