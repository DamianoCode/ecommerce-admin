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

import { Color } from "@prisma/client";
import { AlertModal } from "@/components/modals/alert-modal";

interface ColorFormProps {
  initialData: Color | null;
}

type ColorFormValues = z.infer<typeof formSchema>;

const formSchema = z.object({
  name: z.string().min(1),
  value: z
    .string()
    .min(4)
    .regex(/^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6})$/, {
      message: "Kod koloru (hex #RRGGBB lub #RGB) jest niepoprawny",
    }),
});

export const ColorForm: React.FC<ColorFormProps> = ({ initialData }) => {
  const { storeId, colorId } = useParams();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? "Edytuj kolor" : "Dodaj kolor";
  const description = initialData
    ? "Zarządzaj ustawieniami koloru"
    : "Uzupełnij dane dla koloru";
  const toastMessage = initialData ? "Kolor zaktualizowany" : "Utworzono kolor";
  const action = initialData ? "Zapisz zmiany" : "Utwórz";

  const form = useForm<ColorFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
      value: "",
    },
  });

  const onSubmit = async (data: ColorFormValues) => {
    try {
      setLoading(true);
      if (initialData)
        await axios.patch(`/api/${storeId}/colors/${colorId}`, data);
      else await axios.post(`/api/${storeId}/colors`, data);
      router.push(`/${storeId}/colors`);
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
      await axios.delete(`/api/${storeId}/colors/${colorId}`);
      router.push(`/${storeId}/colors`);
      toast.success("Udało się usunąć koloru");
    } catch (error) {
      toast.error("Wystąpił błąd!");
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
            color="sm"
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
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nazwa</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Nazwa koloru"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Wartość</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-x-4">
                      <Input
                        disabled={loading}
                        placeholder="Wartość koloru (np. #000000)"
                        {...field}
                      />
                      <div
                        className="border p-4 rounded-full"
                        style={{ backgroundColor: field.value }}
                      />
                    </div>
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
