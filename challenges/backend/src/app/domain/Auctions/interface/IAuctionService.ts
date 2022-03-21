import { IAuctionsStatistics } from "../dtos";

/**
 * This service describes an interface to compute auctions data.
 */
export interface IAuctionService {

  getAuctionsStatistics(): Promise<IAuctionsStatistics>

}
