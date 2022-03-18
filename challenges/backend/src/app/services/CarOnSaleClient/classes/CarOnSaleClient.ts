import { ICarOnSaleClient } from "../interface/ICarOnSaleClient";
import { injectable } from "inversify";
import "reflect-metadata";

@injectable()
export class CarOnSaleClient implements ICarOnSaleClient {

  public getRunningAuctions(): Promise<any> {
    return new Promise(resolve => resolve(null))
  }
}