export type Game = {
  id: number;
  title: string;
  thumbnail?: string | null;
  description?: string | null;
  isFavorite?: boolean;
  price?: string | null;
};