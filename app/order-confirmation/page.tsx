import { OrderConfirmationClient } from "@/components/cart/OrderConfirmationClient";

export const metadata = {
  title: "Order Confirmation | GlamShot",
};

export default async function OrderConfirmationPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const orderParam = (await searchParams).order;
  const orderNumber = Array.isArray(orderParam) ? orderParam[0] : orderParam ?? "";

  return <OrderConfirmationClient orderNumber={orderNumber} />;
}
