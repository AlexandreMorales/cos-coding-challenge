import { injectable, inject } from "inversify";
import "reflect-metadata";

import { IAuctionService } from "../interface";
import { IAuctionsStatistics } from "../dtos";
import { ILogger } from "../../../services/Logger/interface/ILogger";
import { ICarOnSaleClient } from "../../../services/CarOnSaleClient/interface";
import { ICosAuction } from "../../../services/CarOnSaleClient/dtos";
import { DependencyIdentifier } from "../../../DependencyIdentifiers";

@injectable()
export class AuctionService implements IAuctionService {
  public constructor(
    @inject(DependencyIdentifier.LOGGER) private readonly logger: ILogger,
    @inject(DependencyIdentifier.COS_CLIENT) private readonly cosClient: ICarOnSaleClient,
  ) {
  }

  public getAuctionsBidSum(auctions: ICosAuction[]): number {
    return auctions?.reduce((acc, auction) => auction?.numBids ? acc + auction.numBids : acc, 0)
  }

  public getAuctionsProgressSum(auctions: ICosAuction[]): number {
    return auctions?.reduce((acc, auction) =>
      auction?.currentHighestBidValue ?
        acc + (auction.currentHighestBidValue / (auction.minimumRequiredAsk || 1)) :
        acc
      , 0) * 100
  }

  public async getAuctionsStatistics(): Promise<IAuctionsStatistics> {
    const runningAuctions = await this.cosClient.getRunningAuctions();

    try {
      const totalAuctions = runningAuctions.total

      this.logger.log(`Calculating statistics for ${totalAuctions} auctions.`);

      const auctionsBidSum = this.getAuctionsBidSum(runningAuctions.items)
      const auctionsBidAverage = auctionsBidSum / totalAuctions
      const auctionsProgressSum = this.getAuctionsProgressSum(runningAuctions.items)
      const auctionsProgressAverage = auctionsProgressSum / totalAuctions

      return {
        totalAuctions,
        auctionsBidSum,
        auctionsBidAverage,
        auctionsProgressSum,
        auctionsProgressAverage,
      };
    } catch (e) {
      const { message } = e as Error;
      this.logger.error(`Error occured on getAuctionsStatistics with message '${message}'.`);
      throw e;
    }
  }
}