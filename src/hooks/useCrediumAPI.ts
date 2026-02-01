import { useQuery, useMutation } from '@tanstack/react-query';
import api from '@/services/api';
import type { SearchParams } from '@/components/types';

/**
 * Hook to fetch top 10 products
 */
export function useTop10() {
  return useQuery({
    queryKey: ['top10'],
    queryFn: api.getTop10,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to search products
 */
export function useSearch() {
  return useMutation({
    mutationFn: (params: Partial<SearchParams>) => api.search(params),
  });
}

/**
 * Hook to get product details
 */
export function useProduct(id: string) {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => api.getProduct(id),
    enabled: !!id,
  });
}

/**
 * Hook to check approval chance
 */
export function useApprovalCheck() {
  return useMutation({
    mutationFn: (params: { amount: number; income: number; creditScore: number }) =>
      api.checkApproval(params),
  });
}
