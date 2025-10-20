import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";

interface TablePaginationProps {
  page: number;
  limit: number;
  total: number;
  onPageChange: (page: number) => void;
}

export const TablePagination: React.FC<TablePaginationProps> = ({
  page,
  limit,
  total,
  onPageChange,
}) => {
  const { t } = useTranslation();

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="flex justify-between items-center mt-4">
      <p className="text-sm text-muted-foreground">
        {t("admin.common.showing")} {(page - 1) * limit + 1}–
        {Math.min(page * limit, total)} {t("admin.common.of")} {total}
      </p>

      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={page === 1}
          onClick={() => onPageChange(page - 1)}
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          {t("admin.common.previous")}
        </Button>

        <Button
          variant="outline"
          size="sm"
          disabled={page === totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          {t("admin.common.next")}
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  );
};
