import { z } from "zod";

export const taskSchema = z.object({
  title: z
    .string({
      required_error: "El titulo es obligatorio",
      invalid_type_error: "El titulo debe ser texto",
    })
    .min(3, {
      message: "El titulo debe tener al menos 3 caracteres",
    })
    .max(100, {
      message: "El titulo no puede tener mas de 100 caracteres",
    }),

  description: z
    .string({
      required_error: "La descripcion es obligatoria",
      invalid_type_error: "La descripcion debe ser texto",
    })
    .min(5, {
      message: "La descripcion debe tener al menos 5 caracteres",
    })
    .max(500, {
      message: "La descripcion no puede tener mas de 500 caracteres",
    }),
});

export const completeTaskSchema = z.object({
  complete: z.boolean({
    required_error: "El campo complete es obligatorio",
    invalid_type_error: "complete debe ser true o false",
  }),
});

export const taskParamsSchema = z.object({
  id: z.coerce
    .number({
      required_error: "El id es obligatorio",
      invalid_type_error: "El id debe ser un número",
    })
    .int("El id debe ser un número entero")
    .positive("El id debe ser un número positivo"),
});
