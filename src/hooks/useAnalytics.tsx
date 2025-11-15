import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { startOfMonth, endOfMonth, eachDayOfInterval, format } from "date-fns";

export const useComplaintTrends = (startDate: Date, endDate: Date) => {
  return useQuery({
    queryKey: ["complaint-trends", startDate, endDate],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("complaints")
        .select("created_at, status, priority, category")
        .gte("created_at", startDate.toISOString())
        .lte("created_at", endDate.toISOString())
        .order("created_at", { ascending: true });

      if (error) throw error;

      // Group by date
      const dateMap = new Map<string, number>();
      const days = eachDayOfInterval({ start: startDate, end: endDate });
      
      days.forEach(day => {
        dateMap.set(format(day, "yyyy-MM-dd"), 0);
      });

      data?.forEach(complaint => {
        const date = format(new Date(complaint.created_at), "yyyy-MM-dd");
        dateMap.set(date, (dateMap.get(date) || 0) + 1);
      });

      return Array.from(dateMap.entries()).map(([date, count]) => ({
        date: format(new Date(date), "MMM dd"),
        count,
      }));
    },
  });
};

export const useStatusDistribution = () => {
  return useQuery({
    queryKey: ["status-distribution"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("complaints")
        .select("status");

      if (error) throw error;

      const statusCounts = data.reduce((acc, complaint) => {
        acc[complaint.status] = (acc[complaint.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      return Object.entries(statusCounts).map(([status, count]) => ({
        name: status.charAt(0).toUpperCase() + status.slice(1),
        value: count,
      }));
    },
  });
};

export const useCategoryDistribution = () => {
  return useQuery({
    queryKey: ["category-distribution"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("complaints")
        .select("category");

      if (error) throw error;

      const categoryCounts = data.reduce((acc, complaint) => {
        acc[complaint.category] = (acc[complaint.category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      return Object.entries(categoryCounts).map(([category, count]) => ({
        name: category,
        value: count,
      }));
    },
  });
};

export const usePriorityDistribution = () => {
  return useQuery({
    queryKey: ["priority-distribution"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("complaints")
        .select("priority");

      if (error) throw error;

      const priorityCounts = data.reduce((acc, complaint) => {
        acc[complaint.priority] = (acc[complaint.priority] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      return Object.entries(priorityCounts).map(([priority, count]) => ({
        name: priority.charAt(0).toUpperCase() + priority.slice(1),
        value: count,
      }));
    },
  });
};
