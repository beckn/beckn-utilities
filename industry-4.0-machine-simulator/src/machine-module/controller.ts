import { Request, Response } from "express";
import _ from "lodash";
import { createOrderService, getOrderService } from "./service";
import { initiateMachineProcess } from "./utils";

export const confirmController = async (req: Request, res: Response) => {
  try {
    const confirmOrderResponse = await createOrderService(
      req?.body?.order_id,
      req?.body?.order_specification
    );

    if (!_.isEmpty(confirmOrderResponse) && confirmOrderResponse.order_id) {
      initiateMachineProcess(confirmOrderResponse?.order_id);
      return res.status(201).json({
        order_id: confirmOrderResponse?.order_id,
        message: "Order Created",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

export const getController = async (req: Request, res: Response) => {
  try {
    const getOrderResponse = await getOrderService(req?.body?.order_id);
    return res.status(200).json(getOrderResponse);
  } catch (error) {
    console.log(error);
  }
};
