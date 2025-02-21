"use client";

import { useState } from "react";

import axios from "axios";
import toast from "react-hot-toast";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";

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

import { Category } from "@prisma/client";
import { AlertModal } from "@/components/modals/alert-modal";
import ImageUpload from "@/components/ui/image-upload";

interface CategoryFormProps {
  initialData: Category | null;
}

type CategoryFormValues = z.infer<typeof formSchema>;

const formSchema = z.object({
  name: z.string().min(1),
});

export const CategoryForm: React.FC<CategoryFormProps> = ({ initialData }) => {
  const { storeId, categoryId } = useParams();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? "Edytuj kategorię" : "Dodaj kategorię";
  const description = initialData
    ? "Zarządzaj ustawieniami kategorii"
    : "Uzupełnij dane dla kategorii";
  const toastMessage = initialData
    ? "Kategoria zaktualizowana"
    : "Utworzono kategorię";
  const action = initialData ? "Zapisz zmiany" : "Utwórz";

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
    },
  });

  const onSubmit = async (data: CategoryFormValues) => {
    try {
      setLoading(true);
      if (initialData)
        await axios.patch(`/api/${storeId}/categories/${categoryId}`, data);
      else await axios.post(`/api/${storeId}/categories`, data);
      router.push(`/${storeId}/categories`);
      toast.success(toastMessage);
      router.refresh();
    } catch (error) {
      toast.error("Wystąpił błąd!");
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/${storeId}/categories/${categoryId}`);
      router.push(`/${storeId}/categories`);
      toast.success("Udało się usunąć kategorię");
    } catch (error) {
      toast.error(
        "Wystąpił błąd! Usuń wszystkie produkty należące do tej katagorii!"
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
          <div className="grid grid-cols-8 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nazwa</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Nazwa kategorii"
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
    </>
  );
};
