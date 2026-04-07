"use client";

import { type UseFormReturn, type FieldValues } from "react-hook-form";

interface FormProps<T extends FieldValues> {
  methods: UseFormReturn<T>;
  onSubmit: (values: T) => void | Promise<void>;
  children: React.ReactNode;
  className?: string;
}

export function Form<T extends FieldValues>({ methods, onSubmit, children, className }: FormProps<T>) {
  return (
      <form onSubmit={methods.handleSubmit(onSubmit)} className={className}>
        {children}
      </form>
  );
}
