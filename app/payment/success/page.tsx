import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import Link from "next/link";

export default function SuccessRoute() {
  return (
    <div className="w-full min-h-[80vh] flex items-center justify-center">
      <Card className="w-[350px]">
        <div className="p-6">
          <div className="w-full flex justify-center">
            <CheckCircle className="w-12 h-12 text-green-500 p-1 rounded-full" />
          </div>
          <div className="mt-3 text-center sm:mt-5 w-full">
            <h3 className="text-3xl font-bold">Payment Successfull</h3>
            <div className="mt-2">
              <p className="text-md text-gray-500">
                Congratulations! Your subscription has been activated. <br />
                Please check your email for the receipt.
              </p>
            </div>

            <div className="mt-5 sm:mt-6 w-full flex justify-center gap-2">
              <Button className="w-full" asChild>
                <Link href="/">Go back to Dashboard</Link>
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
