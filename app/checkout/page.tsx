import { ShopLayout } from "@/components/ethra/ShopLayout";
import { CheckoutView } from "@/components/ethra/CheckoutView";

export const dynamic = "force-dynamic";

export default function CheckoutPage() {
  return (
    <ShopLayout>
      <CheckoutView />
    </ShopLayout>
  );
}
