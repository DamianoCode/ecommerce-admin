"use client";

import { useState } from "react";

import axios from "axios";
import toast from "react-hot-toast";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import { useOrigin } from "@/hooks/use-origin";

import { Save, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { Billboard, Store } from "@prisma/client";
import { AlertModal } from "@/components/modals/alert-modal";
import { ApiAlert } from "@/components/ui/api-alert";
import ImageUpload from "@/components/ui/image-upload";

interface BillboardFormProps {
  initialData: Billboard | null;
}

type BillboardFormValues = z.infer<typeof formSchema>;

const formSchema = z.object({
  label: z.string().min(1),
  imageUrl: z.string().min(1),
});

export const BillboardForm: React.FC<BillboardFormProps> = ({
  initialData,
}) => {
  const { storeId, billboardId } = useParams();
  const router = useRouter();
  const origin = useOrigin();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? "Edytuj baner" : "Dodaj baner";
  const description = initialData
    ? "Zarządzaj ustawieniami banera"
    : "Uzupełnij dane dla banera";
  const toastMessage = initialData ? "Baner zaktualizowany" : "Utworzono baner";
  const action = initialData ? "Zapisz zmiany" : "Utwórz";

  const form = useForm<BillboardFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      label: "",
      imageUrl: "",
    },
  });

  const onSubmit = async (data: BillboardFormValues) => {
    try {
      setLoading(true);
      if (initialData)
        await axios.patch(`/api/${storeId}/billboards/${billboardId}`, data);
      else await axios.post(`/api/${storeId}/billboards`, data);
      router.refresh();
      router.push(`/${storeId}/billboards`);
      toast.success(toastMessage);
    } catch (error) {
      toast.error("Wystąpił błąd!");
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/${storeId}/billboards/${billboardId}`);
      router.push(`/${storeId}/billboards`);
      toast.success("Udało się usunąć baner");
    } catch (error) {
      toast.error(
        "Wystąpił błąd! Usuń wszystkie kategorię korzystającego z tego banera!"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            disabled={loading}
            variant="destructive"
            size="sm"
            onClick={() => setOpen(true)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tło banera</FormLabel>
                <FormControl>
                  <ImageUpload
                    value={field.value ? [field.value] : []}
                    disabled={loading}
                    onChange={(url) => field.onChange(url)}
                    onRemove={() => field.onChange("")}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-8 gap-8">
            <FormField
              control={form.control}
              name="label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Treść</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Treść banera"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button type="submit" disabled={loading}>
            <Save className="h-4 w-4 mr-2" />
            {action}
          </Button>
        </form>
      </Form>
      <Separator />
    </>
  );
};
