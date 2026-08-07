import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type TxType = "income" | "expense";

export type Category = {
  id: string;
  name: string;
  type: TxType;
  icon: string;
  color: string;
  sort_order: number;
};

export type Wallet = {
  id: string;
  name: string;
  icon: string;
  color: string;
  initial_balance: number;
  sort_order: number;
};

export type CategoryNote = {
  id: string;
  category_id: string;
  text: string;
};

export type Transaction = {
  id: string;
  wallet_id: string | null;
  category_id: string | null;
  type: TxType;
  amount: number;
  occurred_on: string;
  note: string | null;
};

async function uid() {
  const { data } = await supabase.auth.getUser();
  if (!data.user) throw new Error("Chưa đăng nhập");
  return data.user.id;
}

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("id,name,type,icon,color,sort_order")
        .order("sort_order");
      if (error) throw error;
      return (data ?? []) as Category[];
    },
  });
}

export function useWallets() {
  return useQuery({
    queryKey: ["wallets"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("wallets")
        .select("id,name,icon,color,initial_balance,sort_order")
        .order("sort_order");
      if (error) throw error;
      return (data ?? []).map((w) => ({ ...w, initial_balance: Number(w.initial_balance) })) as Wallet[];
    },
  });
}

export function useNotes() {
  return useQuery({
    queryKey: ["category_notes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("category_notes")
        .select("id,category_id,text")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as CategoryNote[];
    },
  });
}

/** Transactions inside an inclusive date range (yyyy-mm-dd). */
export function useTransactions(from: string, to: string) {
  return useQuery({
    queryKey: ["transactions", from, to],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("transactions")
        .select("id,wallet_id,category_id,type,amount,occurred_on,note")
        .gte("occurred_on", from)
        .lte("occurred_on", to)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []).map((t) => ({ ...t, amount: Number(t.amount) })) as Transaction[];
    },
  });
}

export function useAllTransactions() {
  return useQuery({
    queryKey: ["transactions", "all"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("transactions")
        .select("id,wallet_id,category_id,type,amount,occurred_on,note");
      if (error) throw error;
      return (data ?? []).map((t) => ({ ...t, amount: Number(t.amount) })) as Transaction[];
    },
  });
}

function useInvalidate() {
  const qc = useQueryClient();
  return (keys: string[]) => keys.forEach((k) => qc.invalidateQueries({ queryKey: [k] }));
}

export function useSaveTransaction() {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: async (input: Omit<Transaction, "id"> & { id?: string }) => {
      const user_id = await uid();
      const payload = { ...input, user_id };
      const { error } = input.id
        ? await supabase.from("transactions").update(payload).eq("id", input.id)
        : await supabase.from("transactions").insert(payload);
      if (error) throw error;
    },
    onSuccess: () => invalidate(["transactions"]),
  });
}

export function useDeleteTransaction() {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("transactions").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => invalidate(["transactions"]),
  });
}

export function useSaveCategory() {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: async (input: Omit<Category, "id" | "sort_order"> & { id?: string }) => {
      const user_id = await uid();
      const { error } = input.id
        ? await supabase.from("categories").update({ ...input, user_id }).eq("id", input.id)
        : await supabase.from("categories").insert({ ...input, user_id });
      if (error) throw error;
    },
    onSuccess: () => invalidate(["categories"]),
  });
}

export function useDeleteCategory() {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("categories").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => invalidate(["categories", "transactions", "category_notes"]),
  });
}

export function useSaveWallet() {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: async (input: Omit<Wallet, "id" | "sort_order"> & { id?: string }) => {
      const user_id = await uid();
      const { error } = input.id
        ? await supabase.from("wallets").update({ ...input, user_id }).eq("id", input.id)
        : await supabase.from("wallets").insert({ ...input, user_id });
      if (error) throw error;
    },
    onSuccess: () => invalidate(["wallets"]),
  });
}

export function useDeleteWallet() {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("wallets").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => invalidate(["wallets", "transactions"]),
  });
}

export function useSaveNote() {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: async (input: { category_id: string; text: string }) => {
      const user_id = await uid();
      const { error } = await supabase.from("category_notes").insert({ ...input, user_id });
      if (error) throw error;
    },
    onSuccess: () => invalidate(["category_notes"]),
  });
}

export function useDeleteNote() {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("category_notes").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => invalidate(["category_notes"]),
  });
}

export function useProfile() {
  return useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data: userRes } = await supabase.auth.getUser();
      const user = userRes.user;
      if (!user) throw new Error("Chưa đăng nhập");
      const { data } = await supabase
        .from("profiles")
        .select("id,display_name,username")
        .eq("id", user.id)
        .maybeSingle();
      return {
        id: user.id,
        email: user.email ?? "",
        display_name: data?.display_name ?? (user.user_metadata?.["full_name"] as string) ?? "",
        username: data?.username ?? "",
      };
    },
  });
}

export function useSaveProfile() {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: async (input: { display_name: string; username: string }) => {
      const id = await uid();
      const { error } = await supabase.from("profiles").upsert({ id, ...input });
      if (error) throw error;
    },
    onSuccess: () => invalidate(["profile"]),
  });
}
