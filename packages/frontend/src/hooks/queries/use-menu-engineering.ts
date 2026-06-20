'use client';

import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';

export interface MenuEngineeringItem {
  recipeId: number;
  recipeName: string;
  category: string;
  sellingPrice: number;
  costPerServing: number;
  foodCostPercentage: number;
  profitPerServing: number;
  totalProduced: number;
  classification: 'STAR' | 'PUZZLE' | 'PLOW_HORSE' | 'DOG';
}

export interface MenuEngineeringData {
  items: MenuEngineeringItem[];
  thresholds: {
    medianPopularity: number;
    medianProfit: number;
  };
  summary: {
    starCount: number;
    puzzleCount: number;
    plowHorseCount: number;
    dogCount: number;
    totalMenus: number;
    averageFoodCost: number;
  };
}

export function useMenuEngineering(from: string, to: string) {
  return useQuery({
    queryKey: ['menu-engineering', from, to],
    queryFn: async () => {
      const res = await apiClient.get('/dashboard/menu-engineering', {
        params: { from, to },
      });
      return res.data.data as MenuEngineeringData;
    },
    enabled: !!from && !!to,
  });
}
