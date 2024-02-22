import { config } from "dotenv";
import { updateOrderService } from "./service";

config();

export const initiateMachineProcess = async (order_id: string) => {
  const timer = setInterval(async () => {
    const updateOrderResponse = await updateOrderService(order_id);
    if (updateOrderResponse?.message === "Last_Stage") {
      console.log(`Finishing ${order_id}`);
      clearInterval(timer);
    }
  }, parseInt(process.env.SLEEP_TIME_SEC as string) * 1000);
};
