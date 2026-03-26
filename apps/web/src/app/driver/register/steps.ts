import type { RegisterDriverInput } from "@/lib/auth-client";

export type DriverRegisterFormData = RegisterDriverInput & {
  documentUrl: string;
};

export type DriverRegisterField = keyof DriverRegisterFormData;

export type DriverRegisterErrors = Partial<
  Record<DriverRegisterField, string>
>;

export type DriverRegisterStep = {
  id: number;
  title: string;
  description: string;
};

export const driverRegisterSteps: DriverRegisterStep[] = [
  {
    id: 1,
    title: "Identite",
    description: "Renseignez vos informations de contact.",
  },
  {
    id: 2,
    title: "Profil",
    description: "Ajoutez vos informations personnelles.",
  },
  {
    id: 3,
    title: "Securite",
    description: "Finalisez votre dossier.",
  },
];

export const initialDriverRegisterFormData: DriverRegisterFormData = {
  address: "",
  avatarUrl: "",
  dateOfBirth: "",
  documentUrl: "",
  email: "",
  firstName: "",
  gender: "UNDEFINED",
  lastName: "",
  password: "",
  phone: "",
};
