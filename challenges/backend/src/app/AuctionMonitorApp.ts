import { inject, injectable } from "inversify";
import { ILogger } from "./services/Logger/interface/ILogger";
import { IView } from "./services/View/interface";
import { IAuctionService } from "./domain/Auctions/interface";
import { DependencyIdentifier } from "./DependencyIdentifiers";
import "reflect-metadata";

@injectable()
export class AuctionMonitorApp {

	public constructor(
		@inject(DependencyIdentifier.LOGGER) private logger: ILogger,
		@inject(DependencyIdentifier.AUCTIONS) private auctionsService: IAuctionService,
		@inject(DependencyIdentifier.VIEW) private view: IView,
	) {
	}

	public async start(): Promise<void> {
		this.logger.log(`Auction Monitor started.`);

		try {
			const auctionsStatistics = await this.auctionsService.getAuctionsStatistics()

			this.view.showAuctionsStatistics(auctionsStatistics)
		} catch (e) {
			process.exit(-1);
		}

		process.exit(0);
	}

}
