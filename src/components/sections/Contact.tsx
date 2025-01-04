"use client";
import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useReCaptcha } from "next-recaptcha-v3";
import { toast } from "sonner";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(3, "Subject must be at least 3 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type FormValues = z.infer<typeof formSchema>;

export default function Contact() {
  const { executeRecaptcha } = useReCaptcha();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    toast.promise(
      async () => {
        const token = await executeRecaptcha("contact_form");
        const response = await fetch("/api/contact", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...values,
            recaptchaToken: token,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to send message");
        }

        form.reset();
        return "Message sent successfully!";
      },
      {
        loading: "Sending your message...",
        success: "Thanks! I'll get back to you soon.",
        error: "Oops! Something went wrong. Please try again.",
      },
    );
  };

  return (
    <div
      id="contact"
      className="col-span-2 grid w-full grid-cols-1 justify-center gap-3 rounded-lg border bg-card px-5 py-5 drop-shadow-2xl xl:col-span-4 xl:grid-cols-2"
    >
      <div className="flex flex-col gap-2">
        <div className="flex flex-row items-center gap-2">
          <Image
            src="/assets/images/memoji-4.png"
            width={40}
            height={40}
            draggable={false}
            quality={100}
            alt="contact"
            className="aspect-square size-8 xl:size-10"
          />
          <span className="text-xl font-medium xl:text-3xl">
            Want to work together?
          </span>
        </div>
        <p className="text-base text-muted xl:text-lg">
          I&apos;m always open to discussing new projects, creative ideas, or
          opportunities to be part of your vision. Let&apos;s connect and
          explore how we can collaborate to create something amazing.
        </p>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input type="email" placeholder="Email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="subject"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Subject" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    placeholder="Your message"
                    className="max-h-[12px] min-h-[120px] resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full md:w-auto">
            Send Message
          </Button>
        </form>
      </Form>
    </div>
  );
}
