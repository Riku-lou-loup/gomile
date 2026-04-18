import { cn, styles } from "@/app/merchant/dashboard/style";
import Typography from "@/components/ui/design-system/typography";
import { IncidentItem, IncidentState } from "@/dummiesData/incidentAlert";
import DynamicTable, { DynamicTableColumn } from "../ui/design-system/table/dynamic-table";

type IncidentBadgeProps = {
  state: IncidentState;
};

function IncidentBadge({ state }: IncidentBadgeProps) {
  return (
    <span
      className={cn(
        styles.incidentBadge,
        state === "ANNULE"
          ? styles.incidentBadgeCancelled
          : styles.incidentBadgeInProgress,
      )}
    >
      <Typography
        variant="span"
        Component="span"
        weight="bold"
        className="!text-inherit"
      >
        {state}
      </Typography>
    </span>
  );
}

type IncidentsAlertsProps = {
  incidents: IncidentItem[];
  isDarkMode: boolean;
};

export default function IncidentsAlerts({
  incidents,
  isDarkMode,
}: IncidentsAlertsProps) {
  const columns: DynamicTableColumn<IncidentItem>[] = [
    {
      key: "id",
      header: "ID Course",
      render: (incident) => (
        <Typography
          variant="span"
          Component="span"
          weight="bold"
          theme={isDarkMode ? "white" : "heading"}
          className={styles.incidentId}
        >
          {incident.id}
        </Typography>
      ),
    },
    {
      key: "type",
      header: "Type d'Alerte",
      render: (incident) => (
        <Typography
          variant="span"
          Component="span"
          weight="semibold"
          className={
            isDarkMode
              ? styles.incidentTypeDark
              : styles.incidentTypeLight
          }
        >
          {incident.type}
        </Typography>
      ),
    },
    {
      key: "description",
      header: "Description",
      render: (incident) => (
        <Typography
          variant="span"
          Component="span"
          weight="medium"
          className={
            isDarkMode
              ? styles.incidentDescriptionDark
              : styles.incidentDescriptionLight
          }
        >
          {incident.description}
        </Typography>
      ),
    },
    {
      key: "state",
      header: (
        <Typography
          variant="span"
          Component="span"
          weight="semibold"
          className="text-right !text-inherit"
        >
          Statut
        </Typography>
      ),
      headerClassName: "text-right",
      cellClassName: styles.incidentBadgeWrap,
      render: (incident) => <IncidentBadge state={incident.state} />,
    },
  ];

  return (
    <>
      <div
        className={
          isDarkMode
            ? styles.incidentsHeaderDark
            : styles.incidentsHeaderLight
        }
      >
        <Typography
          variant="h2"
          Component="h2"
          theme={isDarkMode ? "white" : "heading"}
          className={styles.sectionTitle}
        >
          Incidents et Alertes de Course (Client)
        </Typography>
      </div>

      <div
        className={
          isDarkMode
            ? styles.incidentsTableWrapperDark
            : styles.incidentsTableWrapperLight
        }
      >
        <div className={styles.incidentsTableMin}>
          <DynamicTable
            columns={columns}
            rows={incidents}
            gridTemplateColumns="8rem 10rem minmax(0,1fr) 10rem"
            headerRowClassName={cn(
              styles.incidentsTableHead,
              isDarkMode
                ? styles.incidentsTableHeadDark
                : styles.incidentsTableHeadLight,
            )}
            bodyClassName={
              isDarkMode
                ? styles.incidentsTableBodyDark
                : styles.incidentsTableBodyLight
            }
            rowClassName={styles.incidentRow}
          />
        </div>
      </div>
    </>
  );
}