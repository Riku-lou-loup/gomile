"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition, type FormEvent } from "react";

import { logout, registerDriver } from "@/lib/auth-client";
import {
  buildRegisterDriverInput,
  driverRegisterSteps,
  initialDriverRegisterFormData,
  normalizeDriverRegisterFormData,
  type DriverRegisterErrors,
  type DriverRegisterField,
  type DriverRegisterFormData,
} from "./steps";

function isEmailValid(email: string) {
  return /\S+@\S+\.\S+/.test(email);
}

function buildStepErrors(
  stepId: number,
  formData: DriverRegisterFormData,
): DriverRegisterErrors {
  const normalizedFormData = normalizeDriverRegisterFormData(formData);
  const errors: DriverRegisterErrors = {};

  if (stepId === 1) {
    if (!normalizedFormData.firstName) {
      errors.firstName = "Renseignez votre prenom.";
    }
    if (!normalizedFormData.lastName) {
      errors.lastName = "Renseignez votre nom.";
    }
    if (!normalizedFormData.email) {
      errors.email = "Renseignez votre adresse e-mail.";
    } else if (!isEmailValid(normalizedFormData.email)) {
      errors.email = "Renseignez une adresse e-mail valide.";
    }
    if (!normalizedFormData.phone) {
      errors.phone = "Renseignez votre numero de telephone.";
    }
  }

  if (stepId === 2) {
    if (!normalizedFormData.dateOfBirth) {
      errors.dateOfBirth = "Renseignez votre date de naissance.";
    }
    if (normalizedFormData.gender === "UNDEFINED") {
      errors.gender = "Selectionnez votre genre.";
    }
    if (!normalizedFormData.address) {
      errors.address = "Renseignez votre adresse.";
    }
    if (!normalizedFormData.avatarUrl) {
      errors.avatarUrl = "Ajoutez l'URL de votre avatar.";
    }
  }

  if (stepId === 3) {
    if (!formData.password) {
      errors.password = "Choisissez un mot de passe.";
    } else if (formData.password.length < 8) {
      errors.password = "Le mot de passe doit contenir au moins 8 caracteres.";
    }
  }

  return errors;
}

export function useRegister() {
  const router = useRouter();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [formData, setFormData] = useState(initialDriverRegisterFormData);
  const [errors, setErrors] = useState<DriverRegisterErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, startTransition] = useTransition();

  const currentStep = driverRegisterSteps[currentStepIndex];
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === driverRegisterSteps.length - 1;

  function updateField(field: DriverRegisterField, value: string) {
    setFormData((previous) => ({
      ...previous,
      [field]: value,
    }));

    setErrors((previous) => {
      const nextErrors = { ...previous };
      delete nextErrors[field];
      return nextErrors;
    });

    setFormError(null);
  }

  function toggleShowPassword() {
    setShowPassword((value) => !value);
  }

  function goToNextStep() {
    const stepErrors = buildStepErrors(currentStep.id, formData);

    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }

    setErrors({});
    setCurrentStepIndex((value) =>
      Math.min(value + 1, driverRegisterSteps.length - 1),
    );
  }

  function goToPreviousStep() {
    setFormError(null);
    setCurrentStepIndex((value) => Math.max(value - 1, 0));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);

    if (!isLastStep) {
      goToNextStep();
      return;
    }

    const stepErrors = buildStepErrors(currentStep.id, formData);

    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }

    try {
      const session = await registerDriver(buildRegisterDriverInput(formData));

      if (session.user.role !== "DRIVER") {
        setFormError("Le compte cree n'est pas un compte livreur.");
        return;
      }

      const Swal = (await import("sweetalert2")).default;

      await Swal.fire({
        icon: "success",
        title: "Valide ton compte mail",
        text: "Consulte ta boite mail pour activer ton compte livreur.",
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
        allowOutsideClick: false,
      });

      try {
        await logout();
      } catch {
      }

      startTransition(() => {
        router.replace("/");
        router.refresh();
      });
    } catch (submissionError) {
      setFormError(
        submissionError instanceof Error
          ? submissionError.message
          : "Inscription impossible pour le moment.",
      );
    }
  }

  return {
    currentStep,
    errors,
    formData,
    formError,
    goToNextStep,
    goToPreviousStep,
    handleSubmit,
    isFirstStep,
    isLastStep,
    isPending,
    showPassword,
    steps: driverRegisterSteps,
    toggleShowPassword,
    updateField,
  };
}
