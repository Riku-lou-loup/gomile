import Input from "@/components/ui/design-system/input/input";
import Typography from "@/components/ui/design-system/typography";
import ButtonIcon from "@/components/ui/icons/ButtonIcon";
import DeadEyeIcon from "@/components/ui/icons/DeadEyeIcon";
import DocumentIcon from "@/components/ui/icons/DocumentIcon";
import PasswordKeyIcon from "@/components/ui/icons/passwordKeyIcon";
import { styles } from "./styles";
import type {
  DriverRegisterErrors,
  DriverRegisterField,
  DriverRegisterFormData,
} from "./steps";

type SecurityStepProps = {
  errors: DriverRegisterErrors;
  formData: DriverRegisterFormData;
  onFieldChange: (field: DriverRegisterField, value: string) => void;
  onToggleShowPassword: () => void;
  showPassword: boolean;
};

export default function SecurityStep({
  errors,
  formData,
  onFieldChange,
  onToggleShowPassword,
  showPassword,
}: SecurityStepProps) {
  return (
    <section className={styles.stepSection}>
      <Typography variant="h4" Component="h4" className={styles.stepHeading}>
        Finalisation du dossier
      </Typography>
      <Typography variant="p" Component="p" className={styles.stepText}>
        Ajoutez votre document KYC si vous l&apos;avez deja et choisissez un mot
        de passe securise.
      </Typography>

      <div className={styles.stepGridSingle}>
        <Input
          id="driver-document-url"
          name="documentUrl"
          type="url"
          placeholder="URL du document KYC (optionnel)"
          autoComplete="url"
          leftIcon={<DocumentIcon className={styles.fieldIcon} />}
          value={formData.documentUrl}
          onChange={(event) => onFieldChange("documentUrl", event.target.value)}
          helperText="Vous pourrez aussi ajouter ce document plus tard."
          containerClassName={styles.fieldContainer}
          inputWrapperClassName={styles.fieldWrapper}
          className={styles.fieldInput}
        />

        <Input
          id="driver-password"
          name="password"
          type={showPassword ? "text" : "password"}
          placeholder="Mot de passe"
          autoComplete="new-password"
          leftIcon={<PasswordKeyIcon className={styles.fieldIcon} />}
          error={errors.password}
          value={formData.password}
          onChange={(event) => onFieldChange("password", event.target.value)}
          rightElement={
            <ButtonIcon
              type="button"
              onClick={onToggleShowPassword}
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
      </div>
    </section>
  );
}
