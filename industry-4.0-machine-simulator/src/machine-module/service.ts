import { MachineOrderModel, StatusChart, StatusEnum } from "./model";
import _ from "lodash";

export const createOrderService = async (
  order_id: string,
  order_specification: any
) => {
  return await MachineOrderModel.create({
    order_id,
    order_specification,
    last_update: "",
    current_update: Date(),
    status: StatusEnum.COMPONENT_INSPECTION
  });
};

export const updateOrderService = async (order_id: string) => {
  try {
    const orderDetails = await MachineOrderModel.findOne({ order_id });
    if (
      orderDetails?.status === StatusEnum.PACKAGING_AND_SHIPPING_PREPARATION
    ) {
      return {
        message: "Last_Stage"
      };
    }

    if (orderDetails) {
      await MachineOrderModel.updateOne(
        {
          order_id: orderDetails?.order_id
        },
        {
          $set: {
            current_update: Date(),
            last_update: orderDetails.current_update,
            status: orderDetails?.status + 1
          }
        }
      );
      return {
        message: "Status_Updated"
      };
    }
  } catch (error: any) {
    throw new Error(error.message);
  }
};
