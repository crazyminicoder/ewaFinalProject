// src/components/LoadingSpinner.tsx
import { Spinner } from "@nextui-org/react";

const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center h-full w-full">
      <Spinner size="lg" color="primary" />
    </div>
  );
};

export default LoadingSpinner;
