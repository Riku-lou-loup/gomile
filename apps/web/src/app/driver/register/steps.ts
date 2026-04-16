import { type RegisterDriverInput } from "@/lib/auth-client";

export type DriverRegisterFormData = Omit<
  RegisterDriverInput,
  "documentUrl"
> & {
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

export function normalizeDriverRegisterFormData(
  formData: DriverRegisterFormData,
): DriverRegisterFormData {
  return {
    ...formData,
    address: formData.address.trim(),
    avatarUrl: formData.avatarUrl.trim(),
    dateOfBirth: formData.dateOfBirth.trim(),
    documentUrl: formData.documentUrl.trim(),
    email: formData.email.trim(),
    firstName: formData.firstName.trim(),
    lastName: formData.lastName.trim(),
    phone: formData.phone.trim(),
  };
}

export function buildRegisterDriverInput(
  formData: DriverRegisterFormData,
): RegisterDriverInput {
  const normalizedFormData = normalizeDriverRegisterFormData(formData);

  return {
    ...normalizedFormData,
    documentUrl: normalizedFormData.documentUrl || undefined,
  };
}
