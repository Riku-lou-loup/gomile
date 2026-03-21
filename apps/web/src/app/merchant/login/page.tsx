"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { login, logout } from "@/lib/auth-client";
import { backgroundImageStyle, styles } from "./styles";
import Container from "@/components/ui/elements/container";
import Typography from "@/components/ui/design-system/typography";
import Input from "@/components/ui/design-system/input/input";
import Form from "@/components/ui/design-system/forms/form";
import MailIcon from "@/components/ui/icons/MailIcon";
import PasswordKeyIcon from "@/components/ui/icons/passwordKeyIcon";
import ButtonIcon from "@/components/ui/icons/ButtonIcon";
import DeadEyeIcon from "@/components/ui/icons/DeadEyeIcon";
import Button from "@/components/ui/design-system/button/button";
import SuccessMessage from "@/components/ui/design-system/messages/successMessage";
import ErrorMessage from "@/components/ui/design-system/messages/errorMessage";
import GmailIcon from "@/components/ui/icons/GmailIcon";
import FacebookIcon from "@/components/ui/icons/FacebookIcon";
import { Logo } from "@/components/Logo/Logo";


export default function ClientLoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function buildUsername(email: string) {
    const base = email.split("@")[0]?.trim() ?? "";

    const formatted = base
      .replace(/[._-]+/g, " ")
      .split(" ")
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");

    return formatted || email;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    if (!email || !password) {
      setError("Renseignez votre adresse e-mail et votre mot de passe.");
      return;
    }

    try {
      const session = await login({ email, password });

      if (session.user.role !== "MERCHANT" && session.user.role !== "ADMIN") {
        await logout();
        setError("Ce compte n'est pas un compte client.");
        return;
      }

      window.localStorage.setItem("username", buildUsername(email));

      setSuccess("Connexion reussie. Redirection vers votre dashboard...");

      startTransition(() => {
        router.replace("/client/dashboard");
        router.refresh();
      });
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "Connexion impossible pour le moment.",
      );
    }
  }

  return (
    <main className={styles.page} style={backgroundImageStyle}>
      <div className={styles.overlay} />

      <Container fullwidth className={styles.container}>
        <Link href="/" className={styles.backLink}>
          <Typography
            variant="span"
            Component="span"
            weight="medium"
            className={styles.backLinkText}
          >
            Retour a l'accueil
          </Typography>
        </Link>

        <div className={styles.card}>
          <div className={styles.splitCard}>
            <div className={styles.brandPanel}>
              <div className={styles.brandContent}>
                <div className={styles.brandLogoWrapper}>
                  <Logo size="lg" />
                </div>

                <Typography
                  variant="h2"
                  Component="h2"
                  theme="white"
                  className={styles.brandTitle}
                >
                  Connectez-vous

                  <Typography
                    variant="h6"
                    Component="h6"
                    theme="white"
                    className={styles.brandTitle}
                  >
                    à GoMile

                  </Typography>
                </Typography>

                <Typography
                  variant="p"
                  Component="h6"
                  theme="white"
                  className={styles.brandDescription}
                >
                  GoMile est une application web qui connecte les marchands et
                  les livreurs pour gerer les commandes, suivre les livraisons
                  et centraliser les operations.
                </Typography>
              </div>
            </div>

            <div className={styles.formPanel}>
              <div className={styles.header}>
                <Typography
                  variant="h1"
                  Component="h1"
                  className={styles.title}
                >
                  Connexion
                </Typography>

                <Typography
                  variant="p"
                  Component="p"
                  theme="body"
                  className={styles.loginDescription}
                >
                  Accedez a votre espace marchand ou client.
                </Typography>
              </div>

              <Form onSubmit={handleSubmit} className={styles.form}>
                <Input
                  id="client-email"
                  name="email"
                  type="email"
                  placeholder="Adresse e-mail"
                  autoComplete="email"
                  aria-label="Adresse e-mail"
                  leftIcon={<MailIcon className={styles.fieldIcon} />}
                  containerClassName={styles.fieldContainer}
                  inputWrapperClassName={styles.fieldWrapper}
                  className={styles.fieldInput}
                />

                <Input
                  id="client-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Mot de passe"
                  autoComplete="current-password"
                  aria-label="Mot de passe"
                  leftIcon={<PasswordKeyIcon className={styles.fieldIcon} />}
                  rightElement={
                    <ButtonIcon
                      type="button"
                      onClick={() => setShowPassword((value) => !value)}
                      className={styles.toggleButton}
                      aria-label={
                        showPassword
                          ? "Masquer le mot de passe"
                          : "Afficher le mot de passe"
                      }
                      icon={<DeadEyeIcon className={styles.fieldIcon} />}
                    />
                  }
                  containerClassName={styles.fieldContainer}
                  inputWrapperClassName={styles.fieldWrapper}
                  className={styles.fieldInput}
                />

                <div className={styles.forgotRow}>
                  <Link
                    href="/merchant/forgot-password"
                    className={styles.forgotLink}
                  >
                    <Typography
                      variant="span"
                      Component="span"
                      weight="medium"
                      className={styles.forgotLinkText}
                    >
                      Mot de passe oublie?
                    </Typography>
                  </Link>
                </div>

                {error ? (
                  <ErrorMessage className={styles.message}>{error}</ErrorMessage>
                ) : null}

                {success ? (
                  <SuccessMessage className={styles.message}>
                    {success}
                  </SuccessMessage>
                ) : null}

                <Button
                  type="submit"
                  disabled={isPending}
                  fullWidth
                  className={styles.submitButton}
                >
                  {isPending ? "Connexion..." : "Se connecter"}
                </Button>
              </Form>

              <div className={styles.divider}>
                <span className={styles.dividerLine} />
                <Typography
                  variant="span"
                  Component="span"
                  className={styles.dividerText}
                >
                  Ou connectez-vous avec
                </Typography>
                <span className={styles.dividerLine} />
              </div>

              <div className={styles.socialGrid}>
                <ButtonIcon
                  aria-label="Continuer avec Google"
                  className={styles.socialButton}
                  icon={<GmailIcon className={styles.socialIcon} />}
                />

                <ButtonIcon
                  aria-label="Continuer avec Facebook"
                  className={styles.socialButton}
                  icon={<FacebookIcon className={styles.socialIcon} />}
                />
              </div>

              <div className={styles.footer}>
                <Typography
                  variant="p"
                  Component="p"
                  className={styles.footerText}
                >
                  Pas encore de compte?{" "}
                  <a href="#" className={styles.registerLink}>
                    S'inscrire
                  </a>
                </Typography>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </main>
  );
}