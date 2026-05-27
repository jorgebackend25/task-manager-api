import { z } from "zod";

export const registerSchema = z.object({
  username: z
    .string({
      required_error: "El username es obligatorio",
    })
    .min(5, {
      message: "El username debe tener mínimo 5 caracteres",
    }),

  email: z
    .string({
      required_error: "El email es obligatorio",
    })

    .email({
      message: "El email no es válido",
    }),

  password: z
    .string({
      required_error: "La contraseña es obligatoria",
    })
    .min(6, {
      message: "La contraseña debe tener mínimo 6 caracteres",
    }),
});

export const loginSchema = z.object({
  email: z
    .string({
      required_error: "El email es obligatorio",
    })

    .email({
      message: "El email no es válido",
    }),

  password: z.string({
    required_error: "La contraseña es obligatoria",
  }),
});
