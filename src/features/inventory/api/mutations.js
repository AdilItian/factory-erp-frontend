import { useMutation, useQueryClient } from '@tanstack/react-query';
import { inventoryKeys } from '@/lib/query-keys';
import inventoryService from './service';

export function useRecordOpeningMutation(options = {}) {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: (payload) => inventoryService.recordOpening(payload),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: inventoryKeys.all });
      options.onSuccess?.(data, variables, context);
    }
  });
}

export function useAdjustStockMutation(options = {}) {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: (payload) => inventoryService.adjustStock(payload),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: inventoryKeys.all });
      options.onSuccess?.(data, variables, context);
    }
  });
}
