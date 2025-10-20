import React from "react";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { useTranslation } from "react-i18next";

interface TablePageSizeSelectorProps {
  limit: number;
  onChange: (value: number) => void;
}

export const TablePageSizeSelector: React.FC<TablePageSizeSelectorProps> = ({
  limit,
  onChange,
}) => {
  const { t } = useTranslation();

  return (
    <Select
      value={limit.toString()}
      onValueChange={(val) => onChange(Number(val))}
    >
      <SelectTrigger className="w-[120px]">
        <SelectValue placeholder={t("admin.common.show_10")} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="10">{t("admin.common.show_10")}</SelectItem>
        <SelectItem value="25">{t("admin.common.show_25")}</SelectItem>
        <SelectItem value="50">{t("admin.common.show_50")}</SelectItem>
        <SelectItem value="100">{t("admin.common.show_100")}</SelectItem>
      </SelectContent>
    </Select>
  );
};
