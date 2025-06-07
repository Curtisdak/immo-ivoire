export type HouseWithRelations = {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  propertyType:
    | "HOUSE"
    | "LAND"
    | "APPARTMENT"
    | "BUILDING"
    | "FARMING"
    | "SHOP";
  rooms: number;
  bedrooms: number;
  isSwimmingPool: boolean;
  isPrivateParking: boolean;
  propertySize?: number;
  landSize?: number;
  imageUrls: string[];
  for: "SELL" | "RENT";
  status: "AVAILABLE" | "SOLD" | "RENTED" | "PENDING";
  createdAt: string;
  updatedAt: string;
  postedBy: {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
    avatar: string | null;
  };
  isBookmarked: boolean;
  bookmarkCount: number;
  isInterested:boolean;
  bookmarkCount:number;
  interests: { id: string; userId: string; houseId: string; isInterested:boolean };
  bookmarks: { id: string; userId: string; houseId: string; isBookmarked:boolean };
};
