import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  activarUsuario,
  desactivarUsuario,
  listarUsuarios,
} from "../api/usuarios";

export const USUARIOS_QUERY_KEY = ["usuarios"] as const;

export function useUsuarios() {
  return useQuery({
    queryKey: USUARIOS_QUERY_KEY,
    queryFn: listarUsuarios,
  });
}

export function useActivarUsuario() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => activarUsuario(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: USUARIOS_QUERY_KEY });
    },
  });
}

export function useDesactivarUsuario() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => desactivarUsuario(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: USUARIOS_QUERY_KEY });
    },
  });
}