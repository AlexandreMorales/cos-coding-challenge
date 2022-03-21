import { inject, injectable } from "inversify";
import "reflect-metadata";

import { IView } from "../interface";
import { IAuctionsStatistics } from "../../../domain/Auctions/dtos";
import { DependencyIdentifier } from "../../../DependencyIdentifiers";
import { ILogger } from "../../Logger/interface/ILogger";

@injectable()
export class View implements IView {
  public constructor(
    @inject(DependencyIdentifier.LOGGER) private readonly logger: ILogger,
  ) {
  }

  // tslint:disable:no-console
  public showAuctionsStatistics(auctionsStatistics: IAuctionsStatistics): void {
    try {
      console.log(``);
      console.log(`Number of auctions: ${auctionsStatistics.totalAuctions};`);
      console.log(`Average number of bids on an auction: ${auctionsStatistics.auctionsBidAverage.toFixed(2)};`);
      console.log(`Average percentage auction progress: ${auctionsStatistics.auctionsProgressAverage.toFixed(2)}%;`);
      console.log(``);
    } catch (e) {
      const { message } = e as Error;
      this.logger.error(`Error occured on showAuctionsStatistics with message '${message}'.`);
      throw e;
    }
  }
}