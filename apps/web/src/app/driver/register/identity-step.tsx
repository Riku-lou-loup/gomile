import Input from "@/components/ui/design-system/input/input";
import Typography from "@/components/ui/design-system/typography";
import MailIcon from "@/components/ui/icons/MailIcon";
import PhoneIcon from "@/components/ui/icons/PhoneIcon";
import UserIcon from "@/components/ui/icons/UserIcon";
import { styles } from "./styles";
import type {
  DriverRegisterErrors,
  DriverRegisterField,
  DriverRegisterFormData,
} from "./steps";

type IdentityStepProps = {
  errors: DriverRegisterErrors;
  formData: DriverRegisterFormData;
  onFieldChange: (field: DriverRegisterField, value: string) => void;
};

export default function IdentityStep({
  errors,
  formData,
  onFieldChange,
}: IdentityStepProps) {
  return (
    <section className={styles.stepSection}>
      <Typography variant="h4" Component="h4" className={styles.stepHeading}>
        Identite et contact
      </Typography>
      <Typography variant="p" Component="p" className={styles.stepText}>
        Commencez par vos informations personnelles et votre numero de contact.
      </Typography>

      <div className={styles.stepGrid}>
        <Input
          id="driver-first-name"
          name="firstName"
          type="text"
          placeholder="Prenom"
          autoComplete="given-name"
          leftIcon={<UserIcon className={styles.fieldIcon} />}
          error={errors.firstName}
          value={formData.firstName}
          onChange={(event) => onFieldChange("firstName", event.target.value)}
          containerClassName={styles.fieldContainer}
          inputWrapperClassName={styles.fieldWrapper}
          className={styles.fieldInput}
        />

        <Input
          id="driver-last-name"
          name="lastName"
          type="text"
          placeholder="Nom"
          autoComplete="family-name"
          leftIcon={<UserIcon className={styles.fieldIcon} />}
          error={errors.lastName}
          value={formData.lastName}
          onChange={(event) => onFieldChange("lastName", event.target.value)}
          containerClassName={styles.fieldContainer}
          inputWrapperClassName={styles.fieldWrapper}
          className={styles.fieldInput}
        />

        <Input
          id="driver-email"
          name="email"
          type="email"
          placeholder="Adresse e-mail"
          autoComplete="email"
          leftIcon={<MailIcon className={styles.fieldIcon} />}
          error={errors.email}
          value={formData.email}
          onChange={(event) => onFieldChange("email", event.target.value)}
          containerClassName={styles.fieldContainer}
          inputWrapperClassName={styles.fieldWrapper}
          className={styles.fieldInput}
        />

        <Input
          id="driver-phone"
          name="phone"
          type="tel"
          placeholder="Numero de telephone"
          autoComplete="tel"
          leftIcon={<PhoneIcon className={styles.fieldIcon} />}
          error={errors.phone}
          value={formData.phone}
          onChange={(event) => onFieldChange("phone", event.target.value)}
          containerClassName={styles.fieldContainer}
          inputWrapperClassName={styles.fieldWrapper}
          className={styles.fieldInput}
        />
      </div>
    </section>
  );
}
