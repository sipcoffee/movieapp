import { LoaderCircleIcon } from "lucide-react";
import { Button } from "./ui/button";

export const FormActions = ({ children, isPending, onCancel }) => {
  return (
    <div className="flex justify-end mt-2 gap-2">
      <Button variant="ghost" type="button" onClick={onCancel}>
        Cancel
      </Button>
      <Button type="submit" disabled={isPending}>
        {isPending && (
          <LoaderCircleIcon
            className="-ms-1 animate-spin"
            size={16}
            aria-hidden="true"
          />
        )}
        {children}
      </Button>
    </div>
  );
};
