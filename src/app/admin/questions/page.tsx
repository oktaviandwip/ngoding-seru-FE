"use client";

import { useState, useRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import DeleteIcon from "@mui/icons-material/Delete";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import plusIcon from "@/assets/plus.svg";
import { toast } from "@/components/ui/use-toast";


// Define the validation schema
const formSchema = z.object({
  image: z
    .union([
      z
        .instanceof(File)
        .refine(
          (file) => file.size <= 5 * 1024 * 1024,
          "Each file must be less than 5MB"
        )
        .refine(
          (file) => ["image/jpeg", "image/png"].includes(file.type),
          "Only .jpg and .png files are accepted"
        ),
      z.null(),
    ])
    .optional(),
  type: z.string(),
  level: z.string(),
  question: z.string(),
  option_a: z.string(),
  option_b: z.string(),
  option_c: z.string(),
  option_d: z.string(),
  answer: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

export default function UserProfileForm() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");

  const handleToast = (type: "success" | "error", desc: string) => {
    toast({
      description: desc,
      className: `${
        type === "success"
          ? "bg-success text-white"
          : "bg-destructive text-white"
      } fixed top-0 flex items-center justify-center inset-x-0 md:w-96 md:mx-auto p-4 border-none rounded-none md:rounded-lg z-[999] font-cofo-medium`,
    });
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: "javascript",
      level: "easy",
      image: null,
      question: "",
      option_a: "",
      option_b: "",
      option_c: "",
      option_d: "",
      answer: "a",
    },
  });

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = e.target.files?.[0] || null;

    if (selectedFile) {
      const imageUrl = URL.createObjectURL(selectedFile);
      form.setValue("image", selectedFile);
      setSelectedImage(imageUrl);
      setFileName(selectedFile.name);
    } else {
      setSelectedImage(null);
      form.setValue("image", null);
      setFileName("");
    }

    e.target.value = "";
  }

  function removeImage() {
    setSelectedImage(null);
    form.setValue("image", null);
    setFileName("");
  }

  function handleImageClick() {
    fileInputRef.current?.click();
  }

  function handleCancel() {
    router.push("/");
  }

  async function onSubmit(values: FormValues) {
    console.log(values);
    try {
      const formData = new FormData();

      formData.append("type", values.type);
      formData.append("level", values.level);
      formData.append("question", values.question);
      formData.append("option_a", values.option_a);
      formData.append("option_b", values.option_b);
      formData.append("option_c", values.option_c);
      formData.append("option_d", values.option_d);
      formData.append("answer", values.answer);

      if (values.image) {
        formData.append("image", values.image);
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/questions/`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (res.ok) {
        const data = await res.json();
        handleToast("success", data.description);
        // router.push("/");
      } else {
        const data = await res.json();
        handleToast("error", data.description);
        console.error("Failed to submit the form");
      }
    } catch (error) {
      if (error instanceof Error) {
        handleToast("error", error.message);
        console.error(
          "An error occurred while submitting the form:",
          error.message
        );
      } else {
        handleToast("error", "An unknown error occurred.");
        console.error("An unknown error occurred:", error);
      }
    }
  }

  const selectFields = [
    { name: "type", label: "Type", value: ["javascript", "go"] },
    { name: "level", label: "Level", value: ["easy", "medium", "hard"] },
  ];

  const questionFields = [
    { name: "question", label: "Question" },
    { name: "option_a", label: "Option A" },
    { name: "option_b", label: "Option B" },
    { name: "option_c", label: "Option C" },
    { name: "option_d", label: "Option D" },
  ];

  function capitalizeFirstLetter(str: string) {
    if (str.length === 0) return str;
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  return (
    <div className="pt-28">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 mb-10"
        >
          <div className="flex flex-col w-full space-y-2">
            <div className="relative group cursor-pointer w-full min-h-24 flex items-center justify-center">
              <div className={`${selectedImage ? "flex" : "hidden"}`}>
                <Image
                  src={selectedImage || ""}
                  alt="Photo"
                  width={200}
                  height={200}
                  quality={100}
                />
              </div>
              <div
                className={`${
                  selectedImage ? "hidden" : "flex"
                } items-center justify-center space-x-2`}
                onClick={handleImageClick}
              >
                <Image
                  src={plusIcon}
                  alt="Photo"
                  layout="contain"
                  width={30}
                  height={30}
                  quality={100}
                />
                <div>Add photo</div>
              </div>

              <div
                className={`${
                  selectedImage ? "absolute" : "hidden"
                } absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white text-sm font-semibold opacity-0 group-hover:opacity-100`}
                onClick={handleImageClick}
              >
                Ganti Foto
              </div>
              {selectedImage && (
                <button
                  type="button"
                  onClick={removeImage}
                  className="hidden absolute top-1 right-[-6px] justify-center items-center bg-black bg-opacity-50 text-white rounded-full w-6 h-6 group-hover:flex"
                >
                  <DeleteIcon style={{ fontSize: 15 }} />
                </button>
              )}
            </div>

            <FormField
              control={form.control}
              name="image"
              render={() => (
                <FormItem className="relative">
                  <FormLabel>Photo</FormLabel>
                  <FormControl>
                    <Input readOnly placeholder={fileName || "Choose Image"} />
                  </FormControl>
                  <FormControl>
                    <Input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg, image/png"
                      onChange={handleFileChange}
                      className="opacity-0 absolute top-6"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex space-x-4">
              {selectFields.map((v) => (
                <FormField
                  key={v.name}
                  control={form.control}
                  name={v.name as keyof FormValues}
                  render={() => (
                    <FormItem className="w-1/2 md:w-32">
                      <FormLabel>{v.label}</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={(value) =>
                            form.setValue(v.name as keyof FormValues, value)
                          }
                          value={
                            (form.watch(v.name as keyof FormValues) ||
                              "") as string
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder={v.value[0]} />
                          </SelectTrigger>
                          <SelectContent>
                            {v.value.map((d) => (
                              <SelectItem key={d} value={d}>
                                {capitalizeFirstLetter(d)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
            </div>

            {questionFields.map(({ name, label }) => (
              <FormField
                key={name}
                control={form.control}
                name={name as keyof FormValues}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{label}</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={label}
                        {...field}
                        value={field.value as string}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}

            <FormField
              control={form.control}
              name="answer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Answer</FormLabel>
                  <FormControl>
                    <RadioGroup
                      className="flex space-x-4"
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      {["a", "b", "c", "d"].map((v) => (
                        <FormItem key={v} className="flex items-center">
                          <RadioGroupItem
                            value={v}
                            id={v}
                            className="mt-2 mr-1"
                          />
                          <FormLabel htmlFor={v}>
                            {capitalizeFirstLetter(v)}
                          </FormLabel>
                        </FormItem>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              className="w-1/2 sm:w-20"
            >
              Batalkan
            </Button>
            <Button type="submit" className="w-1/2 sm:w-20">
              Simpan
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
