export interface Category {
  id: string;
  name: string;
  icon: string | null;
  isCustom: boolean;
  userId: string | null;
}

export interface Tag {
  id: string;
  label: string;
  userId: string | null;
}