import Input from "@/components/ui/design-system/input/input";
import Typography from "@/components/ui/design-system/typography";
import AddressIcon from "@/components/ui/icons/AddressIcon";
import CalendarIcon from "@/components/ui/icons/CalendarIcon";
import PersonIcon from "@/components/ui/icons/PersonIcon";
import { styles } from "./styles";
import type {
  DriverRegisterErrors,
  DriverRegisterField,
  DriverRegisterFormData,
} from "./steps";

type ProfileStepProps = {
  errors: DriverRegisterErrors;
  formData: DriverRegisterFormData;
  onFieldChange: (field: DriverRegisterField, value: string) => void;
};

export default function ProfileStep({
  errors,
  formData,
  onFieldChange,
}: ProfileStepProps) {
  return (
    <section className={styles.stepSection}>
      <Typography variant="h4" Component="h4" className={styles.stepHeading}>
        Profil livreur
      </Typography>
      <Typography variant="p" Component="p" className={styles.stepText}>
        Ajoutez vos informations personnelles et l&apos;avatar de votre profil.
      </Typography>

      <div className={styles.stepGrid}>
        <Input
          id="driver-birth-date"
          name="dateOfBirth"
          type="date"
          placeholder="Date de naissance"
          leftIcon={<CalendarIcon className={styles.fieldIcon} />}
          error={errors.dateOfBirth}
          value={formData.dateOfBirth}
          onChange={(event) => onFieldChange("dateOfBirth", event.target.value)}
          containerClassName={styles.fieldContainer}
          inputWrapperClassName={styles.fieldWrapper}
          className={styles.fieldInput}
        />

        <div className={styles.selectContainer}>
          
          <div className={styles.selectWrapper}>
            <span className={styles.selectIcon}>
              <PersonIcon className={styles.fieldIcon} />
            </span>
            <select
              id="driver-gender"
              name="gender"
              value={formData.gender}
              onChange={(event) => onFieldChange("gender", event.target.value)}
              className={styles.selectField}
            >
              <option value="UNDEFINED">Genre</option>
              <option value="MALE">Homme</option>
              <option value="FEMALE">Femme</option>
            </select>
          </div>
          {errors.gender ? (
            <p className={styles.selectError}>{errors.gender}</p>
          ) : null}
        </div>

        <Input
          id="driver-address"
          name="address"
          type="text"
          placeholder="Adresse complete"
          autoComplete="street-address"
          leftIcon={<AddressIcon className={styles.fieldIcon} />}
          error={errors.address}
          value={formData.address}
          onChange={(event) => onFieldChange("address", event.target.value)}
          containerClassName={styles.fieldContainer}
          inputWrapperClassName={styles.fieldWrapper}
          className={styles.fieldInput}
        />

        <Input
          id="driver-avatar-url"
          name="avatarUrl"
          type="url"
          placeholder="URL de l'avatar"
          autoComplete="url"
          leftIcon={<PersonIcon className={styles.fieldIcon} />}
          error={errors.avatarUrl}
          value={formData.avatarUrl}
          onChange={(event) => onFieldChange("avatarUrl", event.target.value)}
          containerClassName={styles.fieldContainer}
          inputWrapperClassName={styles.fieldWrapper}
          className={styles.fieldInput}
        />
      </div>
    </section>
  );
}
