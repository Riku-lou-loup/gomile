import type { ReactNode } from "react";

import Typography from "@/components/ui/design-system/typography";

export type DynamicTableColumn<T> = {
  key: string;
  header: ReactNode;
  render: (row: T) => ReactNode;
  headerClassName?: string;
  cellClassName?: string;
};

type DynamicTableProps<T> = {
  columns: DynamicTableColumn<T>[];
  rows: T[];
  gridTemplateColumns: string;
  headerRowClassName: string;
  bodyClassName: string;
  rowClassName: string;
};

export default function DynamicTable<T>({
  columns,
  rows,
  gridTemplateColumns,
  headerRowClassName,
  bodyClassName,
  rowClassName,
}: DynamicTableProps<T>) {
  return (
    <>
      <div
        className={headerRowClassName}
        style={{ gridTemplateColumns }}
      >
        {columns.map((column) => (
          <div key={column.key} className={column.headerClassName}>
            {typeof column.header === "string" ? (
              <Typography
                variant="span"
                Component="span"
                weight="semibold"
                className="!text-inherit"
              >
                {column.header}
              </Typography>
            ) : (
              column.header
            )}
          </div>
        ))}
      </div>

      <div className={bodyClassName}>
        {rows.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className={rowClassName}
            style={{ gridTemplateColumns }}
          >
            {columns.map((column) => (
              <div key={column.key} className={column.cellClassName}>
                {column.render(row)}
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
}