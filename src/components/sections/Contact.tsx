"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useReCaptcha } from "next-recaptcha-v3";
import { toast } from "sonner";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const { executeRecaptcha } = useReCaptcha();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    toast.promise(
      async () => {
        const token = await executeRecaptcha("contact_form");
        const response = await fetch("/api/contact", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...formData,
            recaptchaToken: token,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to send message");
        }

        setFormData({ name: "", email: "", subject: "", message: "" });
        return "Message sent successfully!";
      },
      {
        loading: "Sending your message...",
        success: "Thanks! I'll get back to you soon.",
        error: "Oops! Something went wrong. Please try again.",
      },
    );
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="col-span-2 grid w-full grid-cols-1 justify-center gap-3 rounded-lg border bg-card px-5 py-5 drop-shadow-2xl xl:col-span-4 xl:grid-cols-2">
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

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="grid gap-4 md:grid-cols-2">
          <Input
            name="name"
            placeholder="Name"
            required
            value={formData.name}
            onChange={handleChange}
          />
          <Input
            name="email"
            type="email"
            placeholder="Email"
            required
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <Input
          name="subject"
          placeholder="Subject"
          required
          value={formData.subject}
          onChange={handleChange}
        />
        <Textarea
          name="message"
          placeholder="Your message"
          className="max-h-[12px] min-h-[120px] resize-none"
          required
          value={formData.message}
          onChange={handleChange}
        />
        <Button type="submit" className="w-full md:w-auto">
          Send Message
        </Button>
      </form>
    </div>
  );
}
