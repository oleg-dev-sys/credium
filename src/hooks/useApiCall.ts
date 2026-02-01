import { useAuth } from "@/context/AuthContext";


export const useApiCall = () => {
  const { openAuthModal } = useAuth();

  const handleApiError = (error: unknown) => {
    if (error instanceof Error && (error as any).isSessionExpired) {
      openAuthModal();
      return true; // ошибка обработана
    }
    return false; // не обработана — логируйте или покажите toast
  };

  return { handleApiError };
};