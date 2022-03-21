import { ICosPage, ICosAuction } from "../dtos";

/**
 * This service describes an interface to access auction data from the CarOnSale API.
 */
export interface ICarOnSaleClient {

    getRunningAuctions(): Promise<ICosPage<ICosAuction>>

}
