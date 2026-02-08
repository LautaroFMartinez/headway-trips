import {
  Type,
  Heading,
  Calendar,
  CheckCircle,
  DollarSign,
  Image,
  Images,
  FileText,
  Hotel,
  Map,
  Bus,
  Plane,
  Utensils,
  ShieldX,
  LucideIcon,
} from 'lucide-react';
import { BlockType } from '@/types/blocks';

export const BLOCK_ICONS: Record<BlockType, LucideIcon> = {
  text: Type,
  heading: Heading,
  itinerary: Calendar,
  services: CheckCircle,
  price: DollarSign,
  image: Image,
  gallery: Images,
  file: FileText,
  accommodation: Hotel,
  activity: Map,
  transport: Bus,
  flight: Plane,
  food: Utensils,
  cancellation_policy: ShieldX,
};

export function getBlockIcon(type: BlockType): LucideIcon {
  return BLOCK_ICONS[type] || Type;
}
